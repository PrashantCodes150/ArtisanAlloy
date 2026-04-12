import dns from 'dns';
import { logger } from '../utils/logger';

let mongooseInstance: typeof import('mongoose').default | null = null;

const getMongoose = async () => {
  if (!mongooseInstance) {
    const mongooseModule = await import('mongoose');
    mongooseInstance = mongooseModule.default;
  }
  return mongooseInstance;
};

export const connectDB = async (): Promise<void> => {
  try {
    const mongoose = await getMongoose();
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/f-jewelry';

    if (mongoURI.startsWith('mongodb+srv://')) {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
      logger.info('Using public DNS servers for MongoDB SRV resolution');
    }

    const conn = await mongoose.connect(mongoURI, {
      // Modern mongoose doesn't need these options, but keeping for compatibility
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📦 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    // In serverless, we don't want to exit the process as it crashes the function.
    // Instead, we let the app stay alive and log the failure.
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    const mongoose = await getMongoose();
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
};
