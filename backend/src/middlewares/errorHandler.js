import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/index.js';
import logger from '../utils/logger.js';
import { config } from '../config/env.js';

const handleCastError = () => new AppError('Invalid resource ID', HTTP_STATUS.BAD_REQUEST);

const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  return new AppError(`${field} already exists`, HTTP_STATUS.CONFLICT);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors || {}).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return new AppError('Validation failed', HTTP_STATUS.BAD_REQUEST, errors);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', HTTP_STATUS.UNAUTHORIZED);

const handleJWTExpired = () =>
  new AppError('Token expired. Please log in again.', HTTP_STATUS.UNAUTHORIZED);

export const errorHandler = (err, _req, res, _next) => {
  let error = { ...err, message: err.message, statusCode: err.statusCode };

  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKey(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpired();

  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal server error';

  if (!error.isOperational) {
    logger.error('Unexpected error:', err);
  }

  const response = { message };

  if (error.errors) response.errors = error.errors;

  if (!config.isProduction && err.stack && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, HTTP_STATUS.NOT_FOUND));
};
