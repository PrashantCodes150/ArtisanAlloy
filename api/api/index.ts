import app from '../src/app';
import { connectDB } from '../src/config/database';
import { logger } from '../src/utils/logger';

// Vercel Serverless Function entry point
// Connect to the DB on cold starts
connectDB().catch(err => {
  logger.error('Failed to connect to database in Vercel Serverless function:', err);
});

export default app;
