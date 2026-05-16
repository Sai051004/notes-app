import mongoose from 'mongoose';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

export const connectDatabase = async () => {
  const uri = config.isTest
    ? process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/notes_app_test'
    : config.mongodbUri;

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  logger.info('MongoDB connected successfully');

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};
