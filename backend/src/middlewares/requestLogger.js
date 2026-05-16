import morgan from 'morgan';
import logger from '../utils/logger.js';
import { config } from '../config/env.js';

const stream = {
  write: (message) => logger.http(message.trim()),
};

export const requestLogger =
  config.nodeEnv === 'production'
    ? morgan('combined', { stream })
    : morgan('dev', { stream });
