import 'dotenv/config';
import app from './src/app.js';
import { connectDatabase } from './src/database/connection.js';
import { validateEnv } from './src/config/env.js';
import logger from './src/utils/logger.js';

const startServer = async () => {
  try {
    validateEnv();
    await connectDatabase();

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
