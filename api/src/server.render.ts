import dotenv from 'dotenv';
import path from 'path';

// Load environment variables (Render injects them, but support .env for local)
const envPath = path.join(__dirname, '../.env');
try {
  if (require('fs').existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.log('⚠️  No .env file found (normal for production - using environment variables)');
  }
} catch (error) {
  console.log('⚠️  Skipping .env file loading');
}

import http from 'http';
import app from './app';
import { connectDB } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  // Don't exit on Render, let it recover
  if (NODE_ENV === 'production') {
    console.error('Fatal error:', err);
  } else {
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION!');
  logger.error(`${err.name}: ${err.message}`);
  // Don't exit on Render
  if (NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} RECEIVED. Shutting down gracefully`);
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP server (no SSL on Render, they handle it)
    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
      logger.info(`📍 API Base URL: http://localhost:${PORT}/api/v1`);
      logger.info(`❤️  Health Check: http://localhost:${PORT}/api/v1/health`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EACCES') {
        logger.error(`Port ${PORT} requires elevated privileges`);
        process.exit(1);
      } else if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        logger.error('Server error:', error);
      }
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    // Don't exit on Render, let it retry
    if (NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

startServer();

// Export for testing
export { app };
