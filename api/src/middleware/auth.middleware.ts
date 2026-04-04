import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models';
import { AppError } from '../utils/AppError';
import { asyncHandler } from './errorHandler';

// Extend Express Request to include user
declare module 'express-serve-static-core' {
    interface Request {
      user?: IUser;
    }
}

interface JWTPayload {
  id: string;
  iat: number;
  exp: number;
}

/**
 * Middleware to protect routes - verifies JWT token
 */
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Get token from header
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  // 2) Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id).select('+password');
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 4) Check if user is active
  if (!currentUser.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 401));
  }

  // 5) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

/**
 * Middleware to restrict access to specific roles
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('You must be logged in to perform this action.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    next();
  };
};

/**
 * Middleware to optionally authenticate user (for routes that work both ways)
 */
export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      const currentUser = await User.findById(decoded.id);
      
      if (currentUser && currentUser.isActive) {
        req.user = currentUser;
      }
    } catch {
      // Token invalid or expired - continue without user
    }
  }

  next();
});

/**
 * Middleware to check if email is verified
 */
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isEmailVerified) {
    return next(new AppError('Please verify your email address to access this resource.', 403));
  }
  next();
};
