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

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !passwordConfirm) {
    return next(new AppError('Please provide all required fields: firstName, lastName, email, password, passwordConfirm', 400));
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  // Validate password length
  if (password.length < 8) {
    return next(new AppError('Password must be at least 8 characters long', 400));
  }

  // Validate password match
  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered. Please login instead.', 400));
    }

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      passwordConfirm,
      phone,
      role: 'customer',
      isActive: true,
      isEmailVerified: false,
    });

    // Generate email verification token
    const verificationToken = newUser.createEmailVerificationToken();
    await newUser.save({ validateBeforeSave: false });

    // Send verification email (non-blocking)
    sendVerificationEmail(newUser.email, newUser.firstName, verificationToken)
      .then(() => logger.info(`Verification email sent to ${newUser.email}`))
      .catch((err) => logger.error(`Failed to send verification email: ${err.message}`));

    // Send response with tokens
    createSendToken(newUser, 201, res, 'Registration successful! Welcome to F Jewelry.');
  } catch (error: any) {
    logger.error('Registration error:', error);

    // Handle MongoDB connection errors gracefully
    if (error.message?.includes('connect') || error.message?.includes('buffering') || error.name === 'MongooseServerSelectionError') {
      return next(new AppError('Database connection error. Please try again in a moment.', 503));
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message).join(', ');
      return next(new AppError(messages, 400));
    }

    throw error;
  }
});

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  try {
    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Please contact support.', 401));
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Create and send token
    const message = user.isEmailVerified
      ? 'Login successful!'
      : 'Login successful! Please verify your email for full access.';

    createSendToken(user, 200, res, message);
  } catch (error: any) {
    logger.error('Login error:', error);

    if (error.message?.includes('connect') || error.message?.includes('buffering') || error.name === 'MongooseServerSelectionError') {
      return next(new AppError('Database connection error. Please try again in a moment.', 503));
    }

    throw error;
  }
});

/**
 * Logout user
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Clear cookies
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

  // Clear refresh tokens from database if user is authenticated
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { refreshTokens: { $exists: true } }
    }).catch(() => {}); // Don't fail logout if this fails
  }

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

/**
 * Forgot password
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide an email address', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always return success (don't reveal if email exists)
  if (!user) {
    return res.status(200).json({
      status: 'success',
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  }

  // Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send email
  sendPasswordResetEmail(user.email, user.firstName, resetToken)
    .then(() => logger.info(`Password reset email sent to ${user.email}`))
    .catch(async (err) => {
      logger.error(`Failed to send reset email: ${err.message}`);
      // Clear token if email fails
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    });

  res.status(200).json({
    status: 'success',
    message: 'If an account exists with this email, you will receive a password reset link.',
  });
});

/**
 * Reset password
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

  if (password.length < 8) {
    return next(new AppError('Password must be at least 8 characters long', 400));
  }

  // Hash token and find user
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // Update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res, 'Password reset successful!');
});

/**
 * Verify email
 * GET /api/v1/auth/verify-email/:token
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Verification link is invalid or has expired', 400));
  }

  if (user.isEmailVerified) {
    return res.status(200).json({
      status: 'success',
      message: 'Email is already verified',
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  logger.info(`Email verified: ${user.email}`);

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully! You now have full access.',
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

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(200).json({
      status: 'success',
      message: 'If your email is registered, you will receive a verification link.',
    });
  }

  if (user.isEmailVerified) {
    return res.status(200).json({
      status: 'success',
      message: 'Your email is already verified.',
    });
  }

  // Generate new token
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  sendVerificationEmail(user.email, user.firstName, verificationToken)
    .then(() => logger.info(`Verification email resent to ${user.email}`))
    .catch((err) => logger.error(`Failed to resend verification email: ${err.message}`));

  res.status(200).json({
    status: 'success',
    message: 'If your email is registered, you will receive a verification link.',
  });
});

/**
 * Refresh access token
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return next(new AppError('Refresh token is required', 400));
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return next(new AppError('User not found or inactive', 401));
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({
      status: 'success',
      data: { accessToken },
    });
  } catch {
    return next(new AppError('Invalid or expired refresh token', 401));
  }
});

/**
 * Get current user
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
 * Update password (logged in user)
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

  if (newPassword.length < 8) {
    return next(new AppError('Password must be at least 8 characters long', 400));
  }

  const user = await User.findById(req.user!._id).select('+password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  createSendToken(user, 200, res, 'Password updated successfully!');
});

/**
 * Get verification status
 * GET /api/v1/auth/verification-status
 */
export const getVerificationStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);

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
 * Enable 2FA
 * POST /api/v1/auth/enable-2fa
 */
export const enableTwoFactor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id).select('+twoFactorEnabled +twoFactorSecret');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.twoFactorEnabled) {
    return next(new AppError('Two-factor authentication is already enabled', 400));
  }

  const otpauthUrl = user.createTwoFactorSecret();
  const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Scan the QR code with your authenticator app',
    data: {
      qrCode: qrCodeDataURL,
      secret: user.twoFactorSecret,
      backupCodes: user.twoFactorBackupCodes,
    },
  });
});

/**
 * Verify 2FA setup
 * POST /api/v1/auth/verify-2fa-setup
 */
export const verifyTwoFactorSetup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  if (!token) {
    return next(new AppError('Verification token is required', 400));
  }

  const user = await User.findById(req.user!._id).select('+twoFactorSecret +twoFactorEnabled');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.twoFactorEnabled) {
    return next(new AppError('Two-factor authentication is already enabled', 400));
  }

  if (!user.twoFactorSecret) {
    return next(new AppError('Two-factor secret not found. Please enable 2FA first.', 400));
  }

  const isValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 2,
  });

  if (!isValid) {
    return next(new AppError('Invalid verification token', 400));
  }

  user.twoFactorEnabled = true;
  await user.save({ validateBeforeSave: false });

  logger.info(`2FA enabled for ${user.email}`);

  res.status(200).json({
    status: 'success',
    message: 'Two-factor authentication enabled!',
    data: { twoFactorEnabled: true },
  });
});

/**
 * Disable 2FA
 * POST /api/v1/auth/disable-2fa
 */
export const disableTwoFactor = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Password is required', 400));
  }

  const user = await User.findById(req.user!._id).select('+password +twoFactorEnabled');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!(await user.comparePassword(password))) {
    return next(new AppError('Password is incorrect', 401));
  }

  if (!user.twoFactorEnabled) {
    return next(new AppError('Two-factor authentication is not enabled', 400));
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  user.twoFactorBackupCodes = [];
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Two-factor authentication disabled',
    data: { twoFactorEnabled: false },
  });
});

/**
 * Verify 2FA login
 * POST /api/v1/auth/verify-2fa-login
 */
export const verifyTwoFactorLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { tempToken, twoFactorToken, backupCode } = req.body;

  if (!tempToken || (!twoFactorToken && !backupCode)) {
    return next(new AppError('Temporary token and 2FA token or backup code are required', 400));
  }

  const hashedTempToken = crypto.createHash('sha256').update(tempToken).digest('hex');

  const user = await User.findOne({
    twoFactorTemporaryToken: hashedTempToken,
    twoFactorTemporaryTokenExpires: { $gt: Date.now() },
  }).select('+twoFactorSecret +twoFactorBackupCodes');

  if (!user) {
    return next(new AppError('Invalid or expired session. Please login again.', 401));
  }

  let isVerified = false;

  if (twoFactorToken && user.verifyTwoFactorToken(twoFactorToken)) {
    isVerified = true;
  }

  if (!isVerified && backupCode && user.twoFactorBackupCodes) {
    const index = user.twoFactorBackupCodes.indexOf(backupCode.toUpperCase());
    if (index !== -1) {
      user.twoFactorBackupCodes.splice(index, 1);
      isVerified = true;
      await user.save({ validateBeforeSave: false });
    }
  }

  if (!isVerified) {
    return next(new AppError('Invalid two-factor authentication code', 401));
  }

  user.twoFactorTemporaryToken = undefined;
  user.twoFactorTemporaryTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res, 'Login successful!');
});

/**
 * Generate backup codes
 * POST /api/v1/auth/generate-backup-codes
 */
export const generateBackupCodes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Password is required', 400));
  }

  const user = await User.findById(req.user!._id).select('+password +twoFactorEnabled');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Password is incorrect', 401));
  }

  if (!user.twoFactorEnabled) {
    return next(new AppError('Two-factor authentication is not enabled', 400));
  }

  const newBackupCodes = user.generateBackupCodes();
  user.twoFactorBackupCodes = newBackupCodes;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'New backup codes generated',
    data: { backupCodes: newBackupCodes },
  });
});

/**
 * Google OAuth
 * GET /api/v1/auth/google
 */
export const googleAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

/**
 * Google OAuth callback
 * GET /api/v1/auth/google/callback
 */
export const googleAuthCallback = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { session: false }, (err: any, user: any) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.lastLogin = new Date();
    user.save({ validateBeforeSave: false });

    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${accessToken}&refresh=${refreshToken}`);
  })(req, res, next);
});
