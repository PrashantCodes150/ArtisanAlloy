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

// Import Passport configuration (Google OAuth)
import './src/config/googleAuth';

// Import database connection
import { connectDB } from './src/config/database';

// Import routes
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

// Import middleware
import { errorHandler } from './src/middleware/errorHandler';
import { AppError } from './src/utils/AppError';

// ============================================
// INITIALIZE EXPRESS APP
// ============================================
const app = express();

// ============================================
// DATABASE CONNECTION (Connect BEFORE routes)
// ============================================
let dbConnected = false;
let dbError: string | null = null;

console.log('[API] Connecting to MongoDB...');
connectDB()
  .then(() => {
    dbConnected = true;
    dbError = null;
    console.log('[API] ✅ MongoDB connected successfully');
  })
  .catch((err) => {
    dbConnected = false;
    dbError = err.message;
    console.error('[API] ❌ MongoDB connection failed:', err.message);
  });

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Set security HTTP headers
app.use(helmet());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['price', 'rating', 'category', 'material', 'occasion', 'sort'],
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// ============================================
// RATE LIMITING
// ============================================
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ============================================
// CORS
// ============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ============================================
// BODY PARSING
// ============================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ============================================
// COMPRESSION
// ============================================
app.use(compression());

// ============================================
// SESSION & PASSPORT
// ============================================
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-key-for-development-only',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

// ============================================
// STATIC FILES
// ============================================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================
// API VERSION PREFIX
// ============================================
const API_VERSION = '/api/v1';

// ============================================
// BASIC ROUTES
// ============================================

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'F Jewelry API is live! 💎',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get(`${API_VERSION}/health`, (req: Request, res: Response) => {
  const mongoose = require('mongoose');
  
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'success' : 'error',
    message: dbConnected ? 'F Jewelry API is running! 💎' : 'API is starting, please wait...',
    db: {
      connected: dbConnected,
      readyState: mongoose.connection.readyState, // 0=disconnected, 1=connected, 2=connecting
      error: dbError,
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// DB READINESS CHECK MIDDLEWARE
// ============================================
app.use(`${API_VERSION}`, (req: Request, res: Response, next: NextFunction) => {
  if (dbConnected) {
    return next();
  }

  // DB not connected yet - wait up to 10 seconds
  const checkDB = async () => {
    const startTime = Date.now();
    while (!dbConnected && Date.now() - startTime < 10000) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!dbConnected) {
      return res.status(503).json({
        status: 'error',
        message: 'Database is connecting. Please try again in a moment.',
        error: dbError,
      });
    }

    next();
  };

  checkDB();
});

// ============================================
// API ROUTES (Mounted AFTER DB connection starts)
// ============================================
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/products`, productRoutes);
app.use(`${API_VERSION}/categories`, categoryRoutes);
app.use(`${API_VERSION}/cart`, cartRoutes);
app.use(`${API_VERSION}/orders`, orderRoutes);
app.use(`${API_VERSION}/reviews`, reviewRoutes);
app.use(`${API_VERSION}/wishlist`, wishlistRoutes);
app.use(`${API_VERSION}/inventory`, inventoryRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

// ============================================
// EXPORT APP
// ============================================
export default app;
