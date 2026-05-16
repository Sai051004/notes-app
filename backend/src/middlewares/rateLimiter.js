import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';
import { HTTP_STATUS } from '../constants/index.js';

const skipInTest = (_req, _res, next) => next();

export const apiLimiter = config.isTest
  ? skipInTest
  : rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    });

export const authLimiter = config.isTest
  ? skipInTest
  : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    });
