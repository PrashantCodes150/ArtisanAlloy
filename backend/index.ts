import app from './src/app';
import { connectDB } from './src/config/database';
import { logger } from './src/utils/logger';

connectDB().catch(err => {
    logger.error('Failed to connect to database in Vercel Serverless function:', err);
});

export default app;
