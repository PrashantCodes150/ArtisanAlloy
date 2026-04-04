import jwt from 'jsonwebtoken';
import { IUser } from '../models';

interface TokenPayload {
  id: string;
}

/**
 * Generate JWT access token
 */
export const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id.toString() },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' } as jwt.SignOptions
  );
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as TokenPayload;
};

/**
 * Create and send tokens in response with HttpOnly cookies
 */
export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: any,
  message?: string
) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Remove password from output
  const userResponse = user.toObject();
  delete (userResponse as any).password;
  delete (userResponse as any).refreshTokens;
  delete (userResponse as any).passwordResetToken;
  delete (userResponse as any).passwordResetExpires;
  delete (userResponse as any).emailVerificationToken;
  delete (userResponse as any).emailVerificationExpires;

  // Set HttpOnly cookies for security
  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7') * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res.cookie('jwt', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    expires: new Date(
      Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
    ),
  });

  res.status(statusCode).json({
    status: 'success',
    message,
    data: {
      user: userResponse,
      accessToken, // Also send in response body for flexibility
      refreshToken, // Also send in response body for flexibility
    },
  });
};
