/**
 * SSL/HTTPS Configuration Guide for F Jewelry Backend
 * 
 * This file provides utilities and documentation for setting up SSL/HTTPS
 * in production environments.
 */

import { logger } from './logger';

/**
 * SSL Configuration Options
 */
export interface SSLConfig {
  keyPath: string;
  certPath: string;
  caPath?: string; // Optional CA bundle for chain certificates
}

/**
 * Supported SSL Certificate Providers
 */
export const SSL_PROVIDERS = {
  LETS_ENCRYPT: 'letsencrypt',
  CLOUDFLARE: 'cloudflare',
  AWS_ACM: 'aws-acm',
  CUSTOM: 'custom',
} as const;

/**
 * Instructions for obtaining SSL certificates
 */
export const SSL_SETUP_GUIDE = `
================================================================================
                    SSL/HTTPS SETUP GUIDE FOR F JEWELRY
================================================================================

1. USING LET'S ENCRYPT (FREE - RECOMMENDED)
-------------------------------------------
   # Install Certbot
   sudo apt update
   sudo apt install certbot

   # Obtain certificate (standalone mode)
   sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

   # Certificate files will be at:
   # Key:  /etc/letsencrypt/live/yourdomain.com/privkey.pem
   # Cert: /etc/letsencrypt/live/yourdomain.com/fullchain.pem

   # Add to .env:
   SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
   SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem

   # Auto-renewal (add to crontab):
   0 0 1 * * certbot renew --quiet


2. USING CLOUDFLARE (FREE SSL + CDN)
------------------------------------
   - Add your domain to Cloudflare
   - Enable "Full (Strict)" SSL mode
   - Cloudflare handles SSL termination
   - Your backend can run on HTTP behind Cloudflare
   - Set FRONTEND_URL to your Cloudflare domain


3. USING AWS (ACM + Load Balancer)
----------------------------------
   - Request certificate in AWS Certificate Manager
   - Attach to Application Load Balancer
   - ALB handles SSL termination
   - Backend runs HTTP on private subnet


4. USING NGINX REVERSE PROXY (RECOMMENDED FOR PRODUCTION)
---------------------------------------------------------
   # Install Nginx
   sudo apt install nginx

   # Nginx config (/etc/nginx/sites-available/f-jewelry):
   
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name yourdomain.com www.yourdomain.com;

       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

       # SSL Security Settings
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_prefer_server_ciphers on;
       ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
       ssl_session_cache shared:SSL:10m;
       ssl_session_timeout 10m;

       # Security Headers
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
       add_header X-Frame-Options DENY;
       add_header X-Content-Type-Options nosniff;
       add_header X-XSS-Protection "1; mode=block";

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }

   # Enable site
   sudo ln -s /etc/nginx/sites-available/f-jewelry /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx


5. SECURITY BEST PRACTICES
--------------------------
   ✅ Always use HTTPS in production
   ✅ Enable HSTS (HTTP Strict Transport Security)
   ✅ Use TLS 1.2 or higher
   ✅ Regularly renew certificates
   ✅ Keep private keys secure (chmod 600)
   ✅ Use strong cipher suites
   ✅ Enable OCSP stapling for performance
   ✅ Set secure cookie flags (Secure, HttpOnly, SameSite)


6. ENVIRONMENT VARIABLES
------------------------
   # Production .env
   NODE_ENV=production
   PORT=5000
   HTTPS_PORT=443
   
   # Direct SSL (if not using reverse proxy)
   SSL_KEY_PATH=/path/to/privkey.pem
   SSL_CERT_PATH=/path/to/fullchain.pem
   
   # Frontend URL (must be HTTPS in production)
   FRONTEND_URL=https://yourdomain.com

================================================================================
`;

/**
 * Log SSL setup guide
 */
export const printSSLSetupGuide = (): void => {
  console.log(SSL_SETUP_GUIDE);
};

/**
 * Validate SSL configuration
 */
export const validateSSLConfig = (config: SSLConfig): boolean => {
  if (!config.keyPath || !config.certPath) {
    logger.error('SSL key path and cert path are required');
    return false;
  }
  return true;
};

/**
 * Security headers for HTTPS
 */
export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default {
  SSL_PROVIDERS,
  SSL_SETUP_GUIDE,
  printSSLSetupGuide,
  validateSSLConfig,
  SECURITY_HEADERS,
};
