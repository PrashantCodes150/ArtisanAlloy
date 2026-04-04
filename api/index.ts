import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import path from 'path';
import passport from 'passport';
import session from 'express-session';

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

app.use(helmet());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
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

app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const API_VERSION = '/api/v1';

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'F Jewelry API is live!',
  });
});

app.get(`${API_VERSION}/health`, (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'F Jewelry API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
app.use(`${API_VERSION}/products`, productRoutes);
app.use(`${API_VERSION}/categories`, categoryRoutes);
app.use(`${API_VERSION}/cart`, cartRoutes);
app.use(`${API_VERSION}/orders`, orderRoutes);
app.use(`${API_VERSION}/reviews`, reviewRoutes);
app.use(`${API_VERSION}/wishlist`, wishlistRoutes);
app.use(`${API_VERSION}/inventory`, inventoryRoutes);

app.all('*', (req: Request, res: Response, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

let isConnected = false;

const ensureConnection = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
};

app.use(async (req: Request, res: Response, next) => {
  await ensureConnection();
  next();
});

export default app;
