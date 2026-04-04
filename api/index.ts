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

// ============================================
// DATABASE CONNECTION (Initialize immediately)
// ============================================
let dbConnected = false;
let dbConnectionError: string | null = null;

// Start connection immediately
connectDB()
  .then(() => {
    dbConnected = true;
    dbConnectionError = null;
    console.log('[API] ✅ Database connected successfully');
  })
  .catch((err) => {
    dbConnected = false;
    dbConnectionError = err.message;
    console.error('[API] ❌ Database connection failed:', err.message);
  });

// ============================================
// GLOBAL MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security middleware
app.use(mongoSanitize());
app.use(hpp({
  whitelist: ['price', 'rating', 'category', 'material', 'occasion', 'sort'],
}));

// Compression
app.use(compression());

// Session for Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-for-dev',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================
// API ROUTES
// ============================================
const API_VERSION = '/api/v1';

// Root
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'F Jewelry API is live! 💎',
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get(`${API_VERSION}/health`, async (req: Request, res: Response) => {
  const status = dbConnected && mongoose.connection.readyState === 1 ? 'success' : 'degraded';

  let dbDetails = {};
  if (dbConnected) {
    try {
      const User = await import('./src/models/User.model');
      const userCount = await User.default.countDocuments();
      dbDetails = {
        status: 'connected',
        database: mongoose.connection.name,
        collections: mongoose.connection.collections ? Object.keys(mongoose.connection.collections).length : 0,
        userCount,
      };
    } catch {
      dbDetails = { status: 'connected (query failed)', database: mongoose.connection.name };
    }
  } else {
    dbDetails = {
      status: 'not_connected',
      error: dbConnectionError,
      MONGODB_URI: process.env.MONGODB_URI ? '✅ Set' : '❌ Missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
      FRONTEND_URL: process.env.FRONTEND_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
    };
  }

  res.status(status === 'success' ? 200 : 503).json({
    status,
    message: 'F Jewelry API',
    db: dbDetails,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// DB readiness middleware for API routes
app.use(`${API_VERSION}`, (req: Request, res: Response, next: NextFunction) => {
  if (dbConnected) return next();

  // If not connected, send 503
  res.status(503).json({
    status: 'error',
    message: 'Service is initializing. Please try again in a moment.',
    db: {
      status: 'connecting',
      error: dbConnectionError,
    }
  });
});

// Mount routes
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

// Error handler
app.use(errorHandler);

export default app;
