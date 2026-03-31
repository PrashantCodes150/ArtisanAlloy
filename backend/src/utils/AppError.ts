/**
 * Custom Application Error class
 * Extends the built-in Error class with additional properties for API error handling
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string, 
    statusCode: number, 
    code?: string
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Operational errors are expected errors
    this.code = code;

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error factory functions
export const BadRequestError = (message: string = 'Bad Request') => 
  new AppError(message, 400, 'BAD_REQUEST');

export const UnauthorizedError = (message: string = 'Unauthorized') => 
  new AppError(message, 401, 'UNAUTHORIZED');

export const ForbiddenError = (message: string = 'Forbidden') => 
  new AppError(message, 403, 'FORBIDDEN');

export const NotFoundError = (message: string = 'Resource not found') => 
  new AppError(message, 404, 'NOT_FOUND');

export const ConflictError = (message: string = 'Conflict') => 
  new AppError(message, 409, 'CONFLICT');

export const ValidationError = (message: string = 'Validation failed') => 
  new AppError(message, 422, 'VALIDATION_ERROR');

export const InternalServerError = (message: string = 'Internal server error') => 
  new AppError(message, 500, 'INTERNAL_ERROR');
