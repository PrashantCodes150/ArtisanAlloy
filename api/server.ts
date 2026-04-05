import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables (Render injects them, but support .env for local)
const envPath = path.join(__dirname, '.env');
try {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.log('⚠️  No .env file found (normal for production)');
  }
} catch (error) {
  console.log('⚠️  Skipping .env file loading');
}

import http from 'http';
import app from './src/app';
import { connectDB } from './src/config/database';
import { logger } from './src/utils/logger';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Handle uncaught exceptions - don't crash on Render
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
  if (NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION:', err.message);
  if (NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  if (serverInstance) {
    serverInstance.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT RECEIVED. Shutting down gracefully');
  if (serverInstance) {
    serverInstance.close(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

let serverInstance: http.Server;

// Connect to database and start server
const startServer = async () => {
  try {
    console.log('🔄 Starting server...');
    console.log(`📍 PORT: ${PORT}`);
    console.log(`📍 NODE_ENV: ${NODE_ENV}`);
    console.log(`📍 MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
    console.log(`📍 JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);

    // Connect to MongoDB
    await connectDB();

    // Create HTTP server (no SSL on Render, they handle it)
    serverInstance = http.createServer(app);

    serverInstance.listen(PORT, () => {
      console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`❤️  Health Check: http://localhost:${PORT}/api/v1/health`);
    });

    serverInstance.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EACCES') {
        console.error(`Port ${PORT} requires elevated privileges`);
        process.exit(1);
      } else if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    // Don't exit on Render, let it retry
    if (NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

startServer();
