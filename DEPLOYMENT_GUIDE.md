# ArtisanAlloy - Deployment Guide (Vercel)

This guide explains how to deploy the ArtisanAlloy e-commerce application to Vercel with proper configuration to avoid 503 errors.

## Prerequisites

- Vercel account (https://vercel.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- GitHub repository (recommended)
- Google OAuth credentials
- Razorpay account (for payments)

## Quick Start - Deploy to Vercel

### Step 1: Prepare Your Environment

1. Copy `.env.production` to your actual environment variables
2. Generate secure JWT keys:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Make sure all required variables are prepared

### Step 2: Connect to Vercel

**Option A: Using GitHub (Recommended)**

1. Push your code to GitHub
2. Visit https://vercel.com/new
3. Select your GitHub repository
4. Vercel auto-detects the configuration from `vercel.json`

**Option B: Using Vercel CLI**

```bash
npm install -g vercel
vercel
```

### Step 3: Configure Environment Variables in Vercel Dashboard

Go to Vercel Dashboard → Settings → Environment Variables

Add these critical variables:

```
# Database (REQUIRED - without this, you'll get 503 errors)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Artisan-Alloy?retryWrites=true&w=majority

# Security Keys (generate new ones)
JWT_SECRET=<your-32-char-random-string>
REFRESH_TOKEN_SECRET=<your-32-char-random-string>

# Frontend
FRONTEND_URL=https://<your-vercel-domain>.vercel.app
VITE_API_URL=/api/v1
VITE_BACKEND_URL=

# Google OAuth
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-secret>
GOOGLE_CALLBACK_URL=https://<your-vercel-domain>.vercel.app/api/v1/auth/google/callback

# Razorpay
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>

# Optional Email Setup
EMAIL_USER=<your-email@gmail.com>
EMAIL_PASS=<your-app-password>
```

### Step 4: Configure MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user with a strong password
4. Whitelist Vercel IP (0.0.0.0/0 for simplicity, or add Vercel IPs)
5. Get the connection string (MONGODB_URI)

### Step 5: Deploy

1. Push changes to your GitHub repository (if using GitHub integration)
2. Vercel automatically deploys on push
3. Or use `vercel deploy` CLI command

## Troubleshooting 503 Errors

### Common Causes & Solutions

#### 1. **Missing MONGODB_URI**
- **Error**: Database connection fails, all API requests return 503
- **Solution**: Add `MONGODB_URI` to Vercel environment variables
- **Verify**: Check health endpoint: `https://your-domain.vercel.app/api/v1/health`

#### 2. **MongoDB Connection Timeout**
- **Cause**: IP whitelist doesn't include Vercel servers
- **Solution**: 
  - In MongoDB Atlas → Network Access
  - Add IP `0.0.0.0/0` for development
  - Or whitelist your Vercel project's IPs

#### 3. **Missing JWT_SECRET or REFRESH_TOKEN_SECRET**
- **Error**: Server starts but auth endpoints fail
- **Solution**: Generate and add both keys to Vercel env vars

#### 4. **Wrong FRONTEND_URL**
- **Cause**: CORS errors, API calls blocked
- **Solution**: Set to your Vercel domain (e.g., `https://Artisan-Alloy.vercel.app`)

#### 5. **Node.js Build Issues**
- **Check**: Vercel build logs in Dashboard
- **Solution**: 
  - Ensure `package.json` build script is correct
  - Check for TypeScript errors: `npm run build`

## Architecture

This is a **monolith deployment** on Vercel:

```
Vercel Serverless Functions
├── Frontend (Static HTML/JS)
│   ├── React App (Vite built)
│   └── Served from /
│
└── API (Node.js serverless)
    ├── Express.js server
    ├── All routes under /api/v1/*
    └── Connects to MongoDB Atlas
```

## Verification Checklist

After deployment, verify these endpoints work:

```bash
# Health check (no DB required)
curl https://your-domain.vercel.app/api/v1/health

# Root endpoint
curl https://your-domain.vercel.app/

# API root (requires DB)
curl https://your-domain.vercel.app/api/v1/auth/register
```

## Performance Optimization

- Frontend: Static assets are cached (3600s)
- API: No cache (must-revalidate)
- Database: Connection pooling via MongoDB URI
- Rate limiting: 100 requests per 15 minutes per IP

## Monitoring

1. **Vercel Dashboard**: View real-time logs and errors
2. **Health Endpoint**: `GET /api/v1/health` returns:
   ```json
   {
     "status": "success",
     "message": "ArtisanAlloy API is running! 💎",
     "databaseConnected": true,
     "environment": "production"
   }
   ```

## Rollback

To rollback a deployment:
1. Go to Vercel Dashboard → Deployments
2. Click on a previous deployment
3. Click "Promote to Production"

## Security Best Practices

1. ✅ All sensitive keys in environment variables
2. ✅ CORS configured for your domain
3. ✅ Rate limiting enabled
4. ✅ JWT tokens for auth
5. ✅ MongoDB connection string with strong password
6. ✅ HTTPS enforced

## Support

If you still see 503 errors:

1. Check Vercel build logs
2. Check MongoDB Atlas connection
3. Verify all env variables are set
4. Check API health: `https://your-domain.vercel.app/api/v1/health`
5. Review Vercel function logs in Dashboard

---

**Last Updated**: April 2026
**Framework**: React 19.2 + Express.js + MongoDB
**Node Version**: 18.0.0+
