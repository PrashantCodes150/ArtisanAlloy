# Render Deployment Guide

## Prerequisites
1. GitHub account with this repository pushed
2. [Render](https://render.com) account (free tier available)

## Deploy Backend to Render

### Option 1: Deploy from GitHub (Recommended)

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select this repository
4. Configure the service:
   - **Name**: `f-jewelry-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free tier is sufficient for testing

5. Add Environment Variables (under "Environment" section):
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = generate a secure random string (min 32 chars)
   - `REFRESH_TOKEN_SECRET` = generate another secure random string
   - `FRONTEND_URL` = your Vercel frontend URL (e.g., `https://f-jewelry.vercel.app`)
   - Add other required variables from `api/.env.example`

6. Click **"Create Web Service"**

### Option 2: Manual Deploy

```bash
# Navigate to api folder
cd api

# Install dependencies
npm install

# Build TypeScript
npm run build

# Set environment variables
export NODE_ENV=production
export PORT=10000
export MONGODB_URI="your-mongodb-uri"
export JWT_SECRET="your-jwt-secret"
# ... other vars

# Start server
npm run start
```

## After Deployment

1. Copy your Render backend URL (e.g., `https://f-jewelry-backend.onrender.com`)
2. Update your frontend's `.env` file:
   ```
   VITE_API_URL=https://f-jewelry-backend.onrender.com/api/v1
   VITE_BACKEND_URL=https://f-jewelry-backend.onrender.com
   ```
3. Redeploy your Vercel frontend to apply the new environment variables

## Render Free Tier Notes

- Service sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- 750 hours/month free
- Requires credit card for free tier (for abuse prevention)

## Alternative: Using render.yaml (Blueprint)

Instead of manual configuration, you can use the `render.yaml` file in the `api/` folder:

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository
3. Render will auto-detect `render.yaml` and configure the service
4. Set the required environment variables in the Render dashboard

For multiple environments, add `ALLOWED_ORIGINS` environment variable with comma-separated Vercel preview URLs.
