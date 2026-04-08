import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import path from 'path';
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

let dbConnecting = false;
let dbConnected = false;

const initializeDatabase = async () => {
  if (dbConnecting || dbConnected) return;
  if (mongoose.connection.readyState === 1) {
    dbConnected = true;
    return;
  }
  
  dbConnecting = true;
  
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI environment variable is not set.');
      dbConnecting = false;
      return;
    }
    await connectDB();
    dbConnected = true;
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    dbConnected = false;
  } finally {
    dbConnecting = false;
  }
};

initializeDatabase();

app.use(helmet());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://f-jewelry-frontend.vercel.app',
].filter(Boolean) as string[];

if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

if (process.env.ALLOWED_ORIGINS) {
  const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  allowedOrigins.push(...additionalOrigins);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(mongoSanitize());

app.use(hpp({
  whitelist: ['price', 'rating', 'category', 'material', 'occasion', 'sort'],
}));

app.use(compression());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const API_VERSION = '/api/v1';

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'F Jewelry API is live! 💎',
  });
});

app.get(`${API_VERSION}/health`, async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  if (mongoose.connection.readyState === 1) {
    dbStatus = 'connected';
  } else if (mongoose.connection.readyState === 2) {
    dbStatus = 'connecting';
  }

  res.status(200).json({
    status: 'success',
    message: 'F Jewelry API is running! 💎',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    databaseConnected: dbStatus,
  });
});

const checkDatabaseConnection = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/health' || req.path === '/') {
    return next();
  }

  if (!dbConnected && mongoose.connection.readyState !== 1) {
    if (!dbConnecting) {
      initializeDatabase().catch(err => console.error('Reconnection error:', err));
    }
    
    return res.status(503).json({
      status: 'error',
      message: 'Database service temporarily unavailable. Please try again.',
      code: 'DB_UNAVAILABLE',
    });
  }
  
  next();
};

app.use(checkDatabaseConnection);

app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/products`, productRoutes);
app.use(`${API_VERSION}/categories`, categoryRoutes);
app.use(`${API_VERSION}/cart`, cartRoutes);
app.use(`${API_VERSION}/orders`, orderRoutes);
app.use(`${API_VERSION}/reviews`, reviewRoutes);
app.use(`${API_VERSION}/wishlist`, wishlistRoutes);
app.use(`${API_VERSION}/inventory`, inventoryRoutes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
