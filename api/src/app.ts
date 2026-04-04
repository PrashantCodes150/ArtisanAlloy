import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import path from 'path';
import passport from 'passport';
import session from 'express-session';

// Import passport configuration
import './config/googleAuth';

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
  // couponRoutes,
} from './routes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/AppError';

// Swagger documentation
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

const app: Application = express();

// ===========================================
// GLOBAL MIDDLEWARE
// ===========================================

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parser - reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'price',
    'rating',
    'category',
    'material',
    'occasion',
    'sort',
  ],
}));

// Compression
app.use(compression());

// Session middleware for passport
app.use(session({
  secret: process.env.JWT_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===========================================
// API ROUTES
// ===========================================

const API_VERSION = '/v1';

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'F Jewelry API is live! 💎',
  });
});

import mongoose from 'mongoose';

// Health check endpoint
app.get(`${API_VERSION}/health`, (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'F Jewelry API is running! 💎',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'connecting/disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
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
// app.use(`${API_VERSION}/coupons`, couponRoutes);

// ===========================================
// ERROR HANDLING
// ===========================================

// Handle undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;
