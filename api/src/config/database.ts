import mongoose from 'mongoose';
import { logger } from '../utils/logger';

// Connection cache for serverless
let cachedConnection: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Connect to MongoDB
 * Optimized for Vercel serverless environment
 */
export const connectDB = async (): Promise<void> => {
  // Return cached connection if available
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return;
  }

  // If already connecting, wait for that promise
  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    // Create connection promise
    connectionPromise = mongoose.connect(mongoURI, {
      // Serverless optimizations
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 15000,
      retryWrites: true,
      retryReads: true,
    });

    const conn = await connectionPromise;
    cachedConnection = conn;
    connectionPromise = null;

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📦 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB error:', err);
      cachedConnection = null;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      cachedConnection = null;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      cachedConnection = conn;
    });

  } catch (error) {
    connectionPromise = null;
    logger.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    cachedConnection = null;
    connectionPromise = null;
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
};
