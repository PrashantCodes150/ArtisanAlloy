# Deployment Guide - F Jewelry

This guide will help you deploy the F Jewelry application with proper configuration.

## Architecture
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)
- **Database**: MongoDB Atlas

---

## Prerequisites

Before deploying, ensure you have:
1. MongoDB Atlas account with a cluster created
2. Render account for backend hosting
3. Vercel account for frontend hosting
4. Your MongoDB connection string ready

---

## Step 1: Backend Deployment on Render

### 1.1 Push to GitHub
Push your backend code to a GitHub repository.

### 1.2 Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `f-jewelry-backend`
   - **Region**: Oregon (or your preferred region)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for no sleep)

### 1.3 Set Environment Variables (CRITICAL)
Go to the **Environment** tab and add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | |
| `MONGODB_URI` | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/f-jewelry` | Your actual MongoDB connection string |
| `JWT_SECRET` | `generate-a-long-random-string-here` | Use: `openssl rand -hex 32` |
| `JWT_EXPIRES_IN` | `7d` | |
| `JWT_COOKIE_EXPIRES_IN` | `7` | |
| `REFRESH_TOKEN_SECRET` | `generate-another-long-random-string` | Different from JWT_SECRET |
| `REFRESH_TOKEN_EXPIRES_IN` | `30d` | |
| `FRONTEND_URL` | `https://f-jewelry-frontend.vercel.app` | Your Vercel frontend URL |
| `ALLOWED_ORIGINS` | `https://f-jewelry-frontend.vercel.app` | |
| `RAZORPAY_KEY_ID` | `your-razorpay-key` | Optional for now |
| `RAZORPAY_KEY_SECRET` | `your-razorpay-secret` | Optional for now |

### 1.4 Deploy
Click **"Create Web Service"** to deploy. Wait for the build to complete.

### 1.5 Verify Backend
Visit `https://f-jewelry-backend.onrender.com/api/v1/health` to verify:
```json
{
  "status": "success",
  "dbStatus": "connected"
}
```

---

## Step 2: Frontend Deployment on Vercel

### 2.1 Push to GitHub
Push your frontend code to a GitHub repository.

### 2.2 Import to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Set Environment Variables
Add these in Vercel's environment variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://f-jewelry-backend.onrender.com/api/v1` |
| `VITE_BACKEND_URL` | `https://f-jewelry-backend.onrender.com` |
| `VITE_APP_NAME` | `F Jewelry` |
| `VITE_USE_MOCK_DATA` | `false` |

### 2.4 Deploy
Click **"Deploy"** to deploy your frontend.

---

## Step 3: Update Render CORS Settings

After deploying frontend, update Render environment variables:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://f-jewelry-frontend.vercel.app` |
| `ALLOWED_ORIGINS` | `https://f-jewelry-frontend.vercel.app,https://*.vercel.app` |

Click **"Save Changes"** - Render will automatically redeploy.

---

## Troubleshooting Common Errors

### 505 Error (Internal Server Error)
**Cause**: MongoDB not connected
**Fix**: 
1. Check if `MONGODB_URI` is set in Render
2. Verify your MongoDB Atlas IP whitelist allows Render's IPs
3. Check MongoDB Atlas cluster status

### 503 Error (Service Unavailable)
**Cause**: Render free tier spins down after 15 minutes
**Fix**:
1. Upgrade to Render paid plan (~$7/month) for no sleep
2. Or use a uptime monitoring service to ping your backend

### 404 Error
**Cause**: Backend not responding or wrong URL
**Fix**:
1. Verify backend URL in frontend `.env`
2. Check if backend is deployed and running
3. Verify health check endpoint works

### 403 Error (CORS)
**Cause**: Origin not allowed
**Fix**:
1. Update `ALLOWED_ORIGINS` in Render
2. Add your Vercel preview URLs to allowed origins
3. Ensure `FRONTEND_URL` is set correctly

### Login Failing
**Cause**: Database connection or JWT configuration
**Fix**:
1. Verify MongoDB is connected (`/api/v1/health`)
2. Check browser console for specific errors
3. Verify JWT secrets match

---

## MongoDB Atlas IP Whitelist

If you're getting MongoDB connection errors:

1. Go to MongoDB Atlas → Network Access
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0) for development
4. For production, add Render's IP ranges

---

## Useful Commands

### Generate JWT Secret
```bash
openssl rand -hex 32
```

### Test Backend Health
```bash
curl https://f-jewelry-backend.onrender.com/api/v1/health
```

### Check Backend Logs
1. Go to Render Dashboard
2. Select your web service
3. Click **"Logs"** tab

---

## Free Tier Limitations (Render)

- Instance spins down after 15 minutes of inactivity
- Cold start takes ~30 seconds
- 750 hours per month free
- No HTTPS by default (Render provides free SSL)

For production, consider upgrading to a paid plan.
