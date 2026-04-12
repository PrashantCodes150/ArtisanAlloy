import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

import './src/config/googleAuth';

import {
  authRoutes,
  userRoutes,
  productRoutes,
  categoryRoutes,
  cartRoutes,
  orderRoutes,
  reviewRoutes,
  wishlistRoutes,
  inventoryRoutes,
} from './src/routes';

import { errorHandler } from './src/middleware/errorHandler';
import { AppError } from './src/utils/AppError';
import { connectDB } from './src/config/database';

const app = express();

// Initialize database connection immediately (once per serverless function)
let dbConnecting = false;
let dbConnected = false;

const initializeDatabase = async () => {
  if (dbConnecting || dbConnected) return;
  
  dbConnecting = true;
  
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI environment variable is not set. Database-dependent features will not work.');
    } else {
      await connectDB();
      dbConnected = true;
      console.log('✅ Database connection established');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    dbConnected = false;
  } finally {
    dbConnecting = false;
  }
};

// Start database connection in background (don't block request)
initializeDatabase().catch(err => console.error('DB init error:', err));

app.use(helmet());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  // Production Vercel URL
  'https://f-jewelry-react.vercel.app',
  // Allow ALL Vercel preview deploy URLs
  'https://*.vercel.app',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (!allowedOrigin) return false;
      if (allowedOrigin.includes('*')) {
        const escaped = allowedOrigin.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
        const regex = new RegExp('^' + escaped + '$');
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    });
    if (isAllowed || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control', 'Pragma'],
}));

// Handle preflight OPTIONS requests
app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(mongoSanitize());

app.use(hpp({
  whitelist: ['price', 'rating', 'category', 'material', 'occasion', 'sort'],
}));

app.use(compression());

// Session middleware - only initialize if MongoDB is available
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || process.env.MONGO_URI,
    ttl: 24 * 60 * 60, // 24 hours
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const API_VERSION = '/api/v1';

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'F Jewelry API is live! 💎',
  });
});

// Health check endpoint - fast and doesn't require database
app.get(`${API_VERSION}/health`, (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'F Jewelry API is running! 💎',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    databaseConnected: dbConnected,
    mongooseState: mongoose.connection.readyState,
  });
});

// Database check middleware - non-blocking for most routes
const checkDatabaseConnection = async (req: Request, res: Response, next: NextFunction) => {
  // Skip for health check
  if (req.path === '/health' || req.path === '/') {
    return next();
  }

  // Check if database is connected
  if (!dbConnected && process.env.MONGODB_URI) {
    // Try to reconnect if not already connecting
    if (!dbConnecting) {
      initializeDatabase().catch(err => console.error('Reconnection error:', err));
    }
    
    // If still not connected, return error for API routes
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'error',
        message: 'Database service temporarily unavailable. Please try again later.',
        code: 'DB_UNAVAILABLE',
      });
    }
  }
  
  next();
};

app.use(checkDatabaseConnection);

// API Routes (after middleware setup)
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/products`, productRoutes);
app.use(`${API_VERSION}/categories`, categoryRoutes);
app.use(`${API_VERSION}/cart`, cartRoutes);
app.use(`${API_VERSION}/orders`, orderRoutes);
app.use(`${API_VERSION}/reviews`, reviewRoutes);
app.use(`${API_VERSION}/wishlist`, wishlistRoutes);
app.use(`${API_VERSION}/inventory`, inventoryRoutes);

// 404 handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
