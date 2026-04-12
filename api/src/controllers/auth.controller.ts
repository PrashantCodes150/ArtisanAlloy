import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import passport from 'passport';
import { User } from '../models';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { createSendToken, generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtUtils';
import { logger } from '../utils/logger';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService';

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password, passwordConfirm, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered. Please use another email or login.', 400));
  }

  // Create new user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    phone,
  });

  // Generate email verification token
  const verificationToken = newUser.createEmailVerificationToken();
  await newUser.save({ validateBeforeSave: false });

  // Send verification email
  try {
    await sendVerificationEmail(email, firstName, verificationToken);
    logger.info(`Verification email sent to ${email}`);
  } catch (emailError) {
    logger.error(`Failed to send verification email to ${email}:`, emailError);
    // Don't fail registration if email fails
  }

  createSendToken(newUser, 201, res, 'Registration successful! Please check your email to verify your account.');
});

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  try {
    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

    // Check if 2FA is enabled
    const userWith2FA = await User.findById(user._id).select('+twoFactorEnabled');

    if (userWith2FA && userWith2FA.twoFactorEnabled) {
      // Generate temporary token for 2FA verification
      const tempToken = userWith2FA.createTemporaryTwoFactorToken();
      await userWith2FA.save({ validateBeforeSave: false });

      return res.status(200).json({
        status: 'success',
        message: 'Password verified. Please enter your two-factor authentication code.',
        requiresTwoFactor: true,
        temporaryToken: tempToken,
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Include email verification status in response
    const message = user.isEmailVerified
      ? 'Login successful!'
      : 'Login successful! Please verify your email for full access.';

    createSendToken(user, 200, res, message);
  } catch (error) {
    logger.error('Login error:', error);
    return next(new AppError('An error occurred during login. Please try again.', 500));
  }
});

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Clear HttpOnly cookies
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.cookie('refreshToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  // If user is authenticated, also clear refresh tokens from database
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { refreshTokens: { $exists: true } }
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

/**
 * Forgot password - send reset token
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide an email address', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists or not for security
    return res.status(200).json({
      status: 'success',
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  }

  // Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send email with reset token
  try {
    await sendPasswordResetEmail(user.email, user.firstName, resetToken);
    logger.info(`Password reset email sent to ${email}`);
  } catch (emailError) {
    // Reset the token if email fails
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    logger.error(`Failed to send password reset email to ${email}:`, emailError);
    return next(new AppError('Failed to send password reset email. Please try again later.', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'If an account exists with this email, you will receive a password reset link.',
  });
});

/**
 * Reset password with token
 * PATCH /api/v1/auth/reset-password/:token
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    return next(new AppError('Please provide password and password confirmation', 400));
  }

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  // Hash the token from params
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find user with valid token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired. Please request a new password reset.', 400));
  }

  // Set new password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  logger.info(`Password reset successful for ${user.email}`);

  createSendToken(user, 200, res, 'Password reset successful!');
});

/**
 * Verify email with token
 * GET /api/v1/auth/verify-email/:token
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Verification link is invalid or has expired. Please request a new one.', 400));
  }

  // Check if already verified
  if (user.isEmailVerified) {
    return res.status(200).json({
      status: 'success',
      message: 'Email is already verified.',
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  logger.info(`Email verified successfully for ${user.email}`);

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully! You now have full access to your account.',
  });
});

/**
 * Resend verification email
 * POST /api/v1/auth/resend-verification
 */
export const resendVerificationEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide an email address', 400));
  }

  const user = await User.findOne({ email });

  // Don't reveal if email exists for security
  if (!user) {
    return res.status(200).json({
      status: 'success',
      message: 'If your email is registered and not yet verified, you will receive a verification link.',
    });
  }

  if (user.isEmailVerified) {
    return res.status(200).json({
      status: 'success',
      message: 'Your email is already verified.',
    });
  }

  // Check if we recently sent an email (rate limiting - 1 minute)
  if (user.emailVerificationExpires &&
    user.emailVerificationExpires.getTime() > Date.now() + 23 * 60 * 60 * 1000) {
    return next(new AppError('Please wait a minute before requesting another verification email.', 429));
  }

  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationEmail(user.email, user.firstName, verificationToken);
    logger.info(`Verification email resent to ${email}`);
  } catch (emailError) {
    logger.error(`Failed to resend verification email to ${email}:`, emailError);
    return next(new AppError('Failed to send verification email. Please try again later.', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'If your email is registered and not yet verified, you will receive a verification link.',
  });
});

/**
 * Refresh access token
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return next(new AppError('Refresh token is required.', 400));
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return next(new AppError('User not found or inactive.', 401));
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({
      status: 'success',
      data: { accessToken },
    });
  } catch {
    return next(new AppError('Invalid or expired refresh token.', 401));
  }
});

/**
 * Get current logged-in user
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

/**
 * Update password for logged-in user
 * PATCH /api/v1/auth/update-password
 */
export const updatePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    return next(new AppError('Please provide current password and new password', 400));
  }

  if (newPassword !== newPasswordConfirm) {
    return next(new AppError('New passwords do not match', 400));
  }

  // Get user with password
  const user = await User.findById(req.user!._id).select('+password');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  // Update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  logger.info(`Password updated for ${user.email}`);

  createSendToken(user, 200, res, 'Password updated successfully!');
});

/**
 * Check email verification status
 * GET /api/v1/auth/verification-status
 */
export const getVerificationStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      isEmailVerified: user.isEmailVerified,
      email: user.email,
      twoFactorEnabled: user.twoFactorEnabled,
    },
  });
});

/**
 * Enable Two-Factor Authentication
 * POST /api/v1/auth/enable-2fa
 */
export const enableTwoFactor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id).select('+twoFactorEnabled +twoFactorSecret');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (user.twoFactorEnabled) {
    return next(new AppError('Two-factor authentication is already enabled.', 400));
  }

  // Generate 2FA secret and QR code
  const otpauthUrl = user.createTwoFactorSecret();
  const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);

  await user.save({ validateBeforeSave: false });

  // Send backup codes via email
  try {
    // TODO: Create email template for backup codes
    logger.info(`2FA backup codes generated for ${user.email}`);
  } catch (error) {
    logger.error(`Failed to send 2FA backup codes to ${user.email}:`, error);
  }

  res.status(200).json({
    status: 'success',
    message: 'Two-factor authentication setup initiated. Please scan the QR code and verify.',
    data: {
      qrCode: qrCodeDataURL,
      secret: user.twoFactorSecret,
      backupCodes: user.twoFactorBackupCodes,
    },
  });
});

/**
 * Verify Two-Factor Authentication setup
 * POST /api/v1/auth/verify-2fa-setup
 */
export const verifyTwoFactorSetup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError('Verification token is required.', 400));
  }

  const user = await User.findById(req.user!._id).select('+twoFactorSecret +twoFactorEnabled');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (user.twoFactorEnabled) {
    return next(new AppError('Two-factor authentication is already enabled.', 400));
  }

  if (!user.twoFactorSecret) {
    return next(new AppError('Two-factor secret not found. Please enable 2FA first.', 400));
  }

  // Verify the token
  const isValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: token,
    window: 2,
  });

  if (!isValid) {
    return next(new AppError('Invalid verification token. Please try again.', 400));
  }

  // Enable 2FA for the user
  user.twoFactorEnabled = true;
  await user.save({ validateBeforeSave: false });

  logger.info(`Two-factor authentication enabled for ${user.email}`);

  res.status(200).json({
    status: 'success',
    message: 'Two-factor authentication enabled successfully!',
    data: {
      twoFactorEnabled: true,
    },
  });
});

/**
 * Disable Two-Factor Authentication
 * POST /api/v1/auth/disable-2fa
 */
export const disableTwoFactor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Password is required to disable two-factor authentication.', 400));
  }

  const user = await User.findById(req.user!._id).select('+password +twoFactorEnabled +twoFactorSecret');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  // Verify password
  if (!(await user.comparePassword(password))) {
    return next(new AppError('Password is incorrect.', 401));
  }

  if (!user.twoFactorEnabled) {
    return next(new AppError('Two-factor authentication is not enabled.', 400));
  }

  // Disable 2FA
  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  user.twoFactorBackupCodes = [];
  await user.save({ validateBeforeSave: false });

  logger.info(`Two-factor authentication disabled for ${user.email}`);

  res.status(200).json({
    status: 'success',
    message: 'Two-factor authentication disabled successfully.',
    data: {
      twoFactorEnabled: false,
    },
  });
});

/**
 * Verify Two-Factor Authentication token during login
 * POST /api/v1/auth/verify-2fa-login
 */
export const verifyTwoFactorLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { tempToken, twoFactorToken, backupCode } = req.body;

  if (!tempToken || (!twoFactorToken && !backupCode)) {
    return next(new AppError('Temporary token and 2FA token or backup code are required.', 400));
  }

  // Hash the temporary token to find the user
  const hashedTempToken = crypto
    .createHash('sha256')
    .update(tempToken)
    .digest('hex');

  const user = await User.findOne({
    twoFactorTemporaryToken: hashedTempToken,
    twoFactorTemporaryTokenExpires: { $gt: Date.now() },
  }).select('+twoFactorSecret +twoFactorEnabled +twoFactorBackupCodes +twoFactorTemporaryToken +twoFactorTemporaryTokenExpires');

  if (!user) {
    return next(new AppError('Invalid or expired session. Please login again.', 401));
  }

  let isVerified = false;

  // Check 2FA token
  if (twoFactorToken && user.verifyTwoFactorToken(twoFactorToken)) {
    isVerified = true;
  }

  // Check backup code
  if (!isVerified && backupCode && user.twoFactorBackupCodes) {
    const backupCodeIndex = user.twoFactorBackupCodes.indexOf(backupCode.toUpperCase());
    if (backupCodeIndex !== -1) {
      // Remove the used backup code
      user.twoFactorBackupCodes.splice(backupCodeIndex, 1);
      isVerified = true;
      await user.save({ validateBeforeSave: false });
    }
  }

  if (!isVerified) {
    return next(new AppError('Invalid two-factor authentication code.', 401));
  }

  // Clear temporary 2FA token
  user.twoFactorTemporaryToken = undefined;
  user.twoFactorTemporaryTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // Generate access token
  createSendToken(user, 200, res, 'Login successful!');
});

/**
 * Generate new backup codes
 * POST /api/v1/auth/generate-backup-codes
 */
export const generateBackupCodes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Password is required to generate new backup codes.', 400));
  }

  const user = await User.findById(req.user!._id).select('+password +twoFactorEnabled');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (!user.twoFactorEnabled) {
    return next(new AppError('Two-factor authentication is not enabled.', 400));
  }

  // Verify password
  if (!(await user.comparePassword(password))) {
    return next(new AppError('Password is incorrect.', 401));
  }

  // Generate new backup codes
  const newBackupCodes = user.generateBackupCodes();
  user.twoFactorBackupCodes = newBackupCodes;
  await user.save({ validateBeforeSave: false });

  logger.info(`New backup codes generated for ${user.email}`);

  res.status(200).json({
    status: 'success',
    message: 'New backup codes generated successfully.',
    data: {
      backupCodes: newBackupCodes,
    },
  });
});

/**
 * Google OAuth login
 * GET /api/v1/auth/google
 */
export const googleAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
    return next(new AppError('Google OAuth is not configured on this server.', 503));
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

/**
 * Google OAuth callback
 * GET /api/v1/auth/google/callback
 */
export const googleAuthCallback = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
    return next(new AppError('Google OAuth is not configured on this server.', 503));
  }
  passport.authenticate('google', { session: false }, (err: any, user: any, info: any) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update last login
    user.lastLogin = new Date();
    user.save({ validateBeforeSave: false });

    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${accessToken}&refresh=${refreshToken}`;
    res.redirect(redirectUrl);
  })(req, res, next);
});

