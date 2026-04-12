import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables before other imports
dotenv.config({ path: path.join(__dirname, '../.env') });

// Use public DNS servers for MongoDB SRV resolution when needed
dns.setServers(['8.8.8.8', '8.8.4.4']);

import http from 'http';
import https from 'https';
import fs from 'fs';
import { logger } from './utils/logger';
// import { notificationService } from './utils/notificationService';

const PORT = process.env.PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack || '');
  process.exit(1);
});

/**
 * Load SSL certificates for HTTPS
 */
const loadSSLCertificates = (): { key: Buffer; cert: Buffer } | null => {
  const keyPath = process.env.SSL_KEY_PATH;
  const certPath = process.env.SSL_CERT_PATH;

  if (!keyPath || !certPath) {
    logger.warn('SSL certificate paths not configured. HTTPS will not be enabled.');
    return null;
  }

  try {
    // Check if files exist
    if (!fs.existsSync(keyPath)) {
      logger.error(`SSL key file not found: ${keyPath}`);
      return null;
    }
    if (!fs.existsSync(certPath)) {
      logger.error(`SSL cert file not found: ${certPath}`);
      return null;
    }

    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  } catch (error) {
    logger.error('Failed to load SSL certificates:', error);
    return null;
  }
};

/**
 * Create HTTP server (for development or as redirect in production)
 */
const createHTTPServer = (app: any) => {
  return http.createServer(app);
};

/**
 * Create HTTPS server (for production)
 */
const createHTTPSServer = (sslOptions: { key: Buffer; cert: Buffer }, app: any) => {
  return https.createServer(sslOptions, app);
};

/**
 * Create HTTP to HTTPS redirect server
 */
const createRedirectServer = () => {
  return http.createServer((req, res) => {
    const host = req.headers.host?.replace(/:\d+$/, '') || 'localhost';
    const httpsUrl = `https://${host}${HTTPS_PORT !== 443 ? ':' + HTTPS_PORT : ''}${req.url}`;
    
    res.writeHead(301, { Location: httpsUrl });
    res.end();
  });
};

// Connect to database and start server
const startServer = async () => {
  try {
    const [{ default: app }, { connectDB }] = await Promise.all([
      import('./app'),
      import('./config/database'),
    ]);

    // Connect to MongoDB
    await connectDB();

    // Create HTTP server
    const server = createHTTPServer(app);

    // Initialize notification service
    // notificationService.initialize(server);

    let httpServer: http.Server;
    let httpsServer: https.Server | null = null;

    if (NODE_ENV === 'production') {
      // Production mode - try to enable HTTPS
      const sslOptions = loadSSLCertificates();

      if (sslOptions) {
        // HTTPS enabled - create HTTPS server and HTTP redirect
        httpsServer = createHTTPSServer(sslOptions, app);

        // Initialize notification service with HTTPS server too
        // notificationService.initialize(httpsServer);

        httpServer = createRedirectServer();

        // Start HTTPS server
        httpsServer.listen(HTTPS_PORT, () => {
          logger.info(`🔒 HTTPS Server running on port ${HTTPS_PORT}`);
          logger.info(`📍 API Base URL: https://localhost:${HTTPS_PORT}/api/v1`);
        });

        // Start HTTP redirect server
        httpServer.listen(PORT, () => {
          logger.info(`🔄 HTTP Redirect server running on port ${PORT} -> HTTPS`);
        });

        // Handle HTTPS server errors
        httpsServer.on('error', (error: NodeJS.ErrnoException) => {
          if (error.code === 'EACCES') {
            logger.error(`Port ${HTTPS_PORT} requires elevated privileges`);
          } else if (error.code === 'EADDRINUSE') {
            logger.error(`Port ${HTTPS_PORT} is already in use`);
          } else {
            logger.error('HTTPS Server error:', error);
          }
          process.exit(1);
        });
      } else {
        // No SSL certificates - run HTTP only with warning
        logger.warn('⚠️  Running in production without HTTPS! This is not recommended.');
        logger.warn('⚠️  Configure SSL_KEY_PATH and SSL_CERT_PATH for secure connections.');

        httpServer = server;
        httpServer.listen(PORT, () => {
          logger.info(`🚀 HTTP Server running in ${NODE_ENV} mode on port ${PORT}`);
          logger.info(`📍 API Base URL: http://localhost:${PORT}/api/v1`);
          logger.info(`❤️  Health Check: http://localhost:${PORT}/api/v1/health`);
        });
      }
    } else {
      // Development mode - HTTP only
      httpServer = server;
      httpServer.listen(PORT, () => {
        logger.info(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
        logger.info(`📍 API Base URL: http://localhost:${PORT}/api/v1`);
        logger.info(`❤️  Health Check: http://localhost:${PORT}/api/v1/health`);
      });
    }

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
      logger.error(`${err.name}: ${err.message}`);
      
      const closeServers = () => {
        if (httpsServer) {
          httpsServer.close(() => {
            httpServer.close(() => process.exit(1));
          });
        } else {
          httpServer.close(() => process.exit(1));
        }
      };
      
      closeServers();
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`👋 ${signal} RECEIVED. Shutting down gracefully`);
      
      const closeServers = () => {
        if (httpsServer) {
          httpsServer.close(() => {
            httpServer.close(() => {
              logger.info('💤 Process terminated!');
              process.exit(0);
            });
          });
        } else {
          httpServer.close(() => {
            logger.info('💤 Process terminated!');
            process.exit(0);
          });
        }
      };
      
      closeServers();
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
