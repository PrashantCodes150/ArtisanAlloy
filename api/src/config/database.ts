import mongoose from 'mongoose';

// Connection state tracking for serverless
let isConnected = false;
let connectionPromise: Promise<void> | null = null;

/**
 * Connect to MongoDB
 * Optimized for MongoDB Atlas and Vercel serverless
 */
export const connectDB = async (): Promise<void> => {
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  // Get MongoDB URI from environment
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    const error = new Error('MONGODB_URI environment variable is not set. Please configure it in your Vercel environment variables.');
    console.error('[DB]', error.message);
    throw error;
  }

  // Create connection promise
  connectionPromise = (async () => {
    try {
      console.log('[DB] Connecting to MongoDB Atlas...');
      console.log('[DB] Connection string:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

      await mongoose.connect(mongoURI, {
        // Connection pool settings for serverless
        maxPoolSize: 10,
        minPoolSize: 1,
        
        // Timeout settings
        serverSelectionTimeoutMS: 30000, // 30s to find server
        socketTimeoutMS: 45000,         // 45s socket timeout
        connectTimeoutMS: 30000,        // 30s connect timeout
        
        // Retry settings
        retryWrites: true,
        retryReads: true,
      });

      isConnected = true;
      connectionPromise = null;

      console.log('[DB] ✅ MongoDB Atlas connected');
      console.log('[DB] Database:', mongoose.connection.name);
      console.log('[DB] Host:', mongoose.connection.host);
    } catch (error: any) {
      connectionPromise = null;
      isConnected = false;

      console.error('[DB] ❌ MongoDB connection failed');
      console.error('[DB] Error:', error.message);
      
      // Helpful error messages
      if (error.message.includes('ENOTFOUND')) {
        console.error('[DB] 💡 Hint: Could not find MongoDB server. Check your connection string.');
      } else if (error.message.includes('authentication failed')) {
        console.error('[DB] 💡 Hint: Wrong username or password. Check your MongoDB Atlas credentials.');
      } else if (error.message.includes('ETIMEDOUT')) {
        console.error('[DB] 💡 Hint: Connection timed out. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0).');
      } else if (error.message.includes('MONGODB_URI')) {
        console.error('[DB] 💡 Hint: Add MONGODB_URI to your Vercel environment variables.');
      }
      
      throw error;
    }
  })();

  await connectionPromise;
};

/**
 * Get MongoDB connection state
 */
export const getDBState = (): { connected: boolean; readyState: number } => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState, // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
});

/**
 * Disconnect from MongoDB (for cleanup)
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    isConnected = false;
    connectionPromise = null;
    console.log('[DB] MongoDB disconnected');
  } catch (error) {
    console.error('[DB] Error disconnecting:', error);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('[DB] ✅ Mongoose connected');
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('[DB] ⚠️  Mongoose disconnected');
});

mongoose.connection.on('error', (error) => {
  isConnected = false;
  console.error('[DB] ❌ Mongoose connection error:', error.message);
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('[DB] ✅ Mongoose reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});
