import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Error handling middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // Set default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorType = err.type || 'SERVER_ERROR';

  // Sanitize error for production
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Handle MongoDB/Mongoose connection errors
    if (err.name === 'MongoNetworkError' || err.name === 'MongoServerError' || 
        err.name === 'MongoAuthenticationError' || err.message?.includes('ECONNREFUSED')) {
      const message = 'Database service temporarily unavailable. Please try again later.';
      error = { message, statusCode: 503, type: 'DB_UNAVAILABLE' };
    }

    // Handle Mongoose CastError
    if (err.name === 'CastError') {
      const message = `Resource not found with id: ${err.value}`;
      error = { message, statusCode: 404, type: 'RESOURCE_NOT_FOUND' };
    }

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
      error = { message, statusCode: 400, type: 'VALIDATION_ERROR' };
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
      const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)[0];
      const message = `Duplicate field value: ${value}. Please use another value.`;
      error = { message, statusCode: 400, type: 'DUPLICATE_FIELD' };
    }

    // Handle wrong JWT error
    if (err.name === 'JsonWebTokenError') {
      const message = 'Invalid token. Please log in again.';
      error = { message, statusCode: 401, type: 'INVALID_TOKEN' };
    }

    // Handle expired JWT error
    if (err.name === 'TokenExpiredError') {
      const message = 'Your token has expired. Please log in again.';
      error = { message, statusCode: 401, type: 'TOKEN_EXPIRED' };
    }

    // Update status code and message
    statusCode = error.statusCode || statusCode;
    message = error.message || message;
    errorType = error.type || errorType;
  }

  // Send response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    stack: err.stack, // Temporarily show stack in production for 500 error debugging
    type: errorType,
  });
};

/**
 * Catch async errors
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// Alias for catchAsync to maintain compatibility
export const asyncHandler = catchAsync;

/**
 * Handle unhandled routes
 */
export const handleUnmatchedRoutes = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server!`) as any;
  error.statusCode = 404;
  error.type = 'ROUTE_NOT_FOUND';
  next(error);
};

/**
 * Global error handler for unhandled promise rejections
 */
export const handleUnhandledPromiseRejection = () => {
  process.on('unhandledRejection', (reason: any, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    logger.error('Unhandled Rejection:', reason);
  });
};

/**
 * Global error handler for uncaught exceptions
 */
export const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    logger.error('Uncaught Exception:', err);
  });
};

export default errorHandler;
