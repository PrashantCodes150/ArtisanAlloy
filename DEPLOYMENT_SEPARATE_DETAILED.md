# Complete Separate Deployment Guide
## Vercel Frontend + Render Backend

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Deploy Backend to Render](#step-1-deploy-backend-to-render)
4. [Step 2: Configure Backend Environment Variables](#step-2-configure-backend-environment-variables)
5. [Step 3: Deploy Frontend to Vercel](#step-3-deploy-frontend-to-vercel)
6. [Step 4: Configure Frontend Environment Variables](#step-4-configure-frontend-environment-variables)
7. [Step 5: Verify the Deployment](#step-5-verify-the-deployment)
8. [Step 6: Test Login Flow](#step-6-test-login-flow)
9. [Troubleshooting](#troubleshooting)
10. [Dummy Values Reference](#dummy-values-reference)

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│          User's Browser                 │
│         yourapp.vercel.app              │
└──────────────┬──────────────────────────┘
               │
               │ 1. Loads React App
               │
               ▼
┌─────────────────────────────────────────┐
│        Vercel (Frontend Only)           │
│  - React SPA (Static Files)             │
│  - No Backend Code Runs Here            │
│  - Makes API calls to Render            │
└──────────────┬──────────────────────────┘
               │
               │ 2. API Calls (POST /api/v1/auth/login)
               │
               ▼
┌─────────────────────────────────────────┐
│        Render (Backend API)             │
│  - Express.js Server                    │
│  - Authentication & Business Logic      │
│  - Connects to MongoDB                  │
└──────────────┬──────────────────────────┘
               │
               │ 3. Database Queries
               │
               ▼
┌─────────────────────────────────────────┐
│        MongoDB Atlas (Database)         │
│  - User Accounts                        │
│  - Products, Orders, etc.               │
└─────────────────────────────────────────┘
```

**Key Point**: Your frontend and backend are on **DIFFERENT DOMAINS**:
- Frontend: `your-jewelry-app.vercel.app`
- Backend: `f-jewelry-backend.onrender.com`

The frontend must know the backend URL to make API calls.

---

## Prerequisites

### What You Need Before Starting:
- ✅ GitHub account with your code repository
- ✅ Vercel account (free tier is fine)
- ✅ Render account (free tier is fine)
- ✅ MongoDB Atlas account (free tier is fine)
- ✅ Your code pushed to GitHub

### What This Guide Covers:
- ✅ Complete backend deployment on Render
- ✅ Complete frontend deployment on Vercel
- ✅ Environment variable configuration
- ✅ MongoDB Atlas setup
- ✅ Dummy values for services you don't have
- ✅ Testing and troubleshooting

---

## Step 1: Deploy Backend to Render

### 1.1: Prepare Your Backend Code

Your backend is in the `api` folder. Make sure these files exist:
```
api/
├── index.ts              ← Entry point for serverless
├── package.json          ← Dependencies
├── .env.example          ← Reference (don't upload this)
└── src/                  ← All backend code
```

### 1.2: Create a Render Web Service

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. Configure the service:
   - **Name**: `f-jewelry-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: `api` ← **IMPORTANT: This must be "api"**
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build` (or just `npm install` if no build step)
   - **Start Command**: `npx ts-node src/server.ts` or `node dist/server.js` (if compiled)
   - **Instance Type**: **Free**

5. Click **"Create Web Service"**

### 1.3: Alternative - Use `api/src/server.ts` Directly

If your Render build fails, try this simpler setup:

**Build Command**:
```bash
npm install
```

**Start Command**:
```bash
npx ts-node src/server.ts
```

Or if you need to compile TypeScript first:

**Build Command**:
```bash
npm install && npx tsc
```

**Start Command**:
```bash
node dist/src/server.js
```

### 1.4: Wait for Deployment

Render will:
1. Clone your repository
2. Install dependencies
3. Build the project
4. Start the server

This takes 2-5 minutes. You'll see logs in the Render dashboard.

---

## Step 2: Configure Backend Environment Variables

### 2.1: Go to Environment Variables

1. In Render dashboard, click on your web service
2. Click the **"Environment"** tab
3. Scroll down to **"Environment Variables"**

### 2.2: Add These Variables (Copy-Paste Friendly)

Click **"Add Environment Variable"** for each:

#### Required Variables (MUST SET):

```
Key: NODE_ENV
Value: production
```

```
Key: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/f-jewelry?retryWrites=true&w=majority
```
⚠️ Replace with your actual MongoDB Atlas connection string (see MongoDB setup below)

```
Key: JWT_SECRET
Value: super-secret-jwt-key-for-f-jewelry-production-min-32-chars
```
⚠️ Change this to your own random string (minimum 32 characters)

```
Key: JWT_EXPIRES_IN
Value: 7d
```

```
Key: JWT_COOKIE_EXPIRES_IN
Value: 7
```

```
Key: REFRESH_TOKEN_SECRET
Value: super-secret-refresh-token-key-f-jewelry-min-32-characters
```
⚠️ Change this to a DIFFERENT random string (minimum 32 characters)

```
Key: REFRESH_TOKEN_EXPIRES_IN
Value: 30d
```

```
Key: FRONTEND_URL
Value: https://your-app-name.vercel.app
```
⚠️ Replace with your actual Vercel deployment URL

```
Key: RATE_LIMIT_WINDOW_MS
Value: 900000
```

```
Key: RATE_LIMIT_MAX_REQUESTS
Value: 100
```

#### Optional Variables (Dummy Values OK):

```
Key: RAZORPAY_KEY_ID
Value: rzp_test_xxxxxxxxxxxx
```

```
Key: RAZORPAY_KEY_SECRET
Value: dummy-razorpay-secret-for-development
```

```
Key: RAZORPAY_WEBHOOK_SECRET
Value: dummy-webhook-secret
```

```
Key: GOOGLE_CLIENT_ID
Value: dummy-google-client-id.apps.googleusercontent.com
```

```
Key: GOOGLE_CLIENT_SECRET
Value: dummy-google-client-secret
```

```
Key: GOOGLE_CALLBACK_URL
Value: https://your-backend-url.onrender.com/api/v1/auth/google/callback
```
⚠️ Replace `your-backend-url.onrender.com` with your actual Render URL

```
Key: EMAIL_HOST
Value: smtp.gmail.com
```

```
Key: EMAIL_PORT
Value: 587
```

```
Key: EMAIL_USER
Value: noreply@example.com
```

```
Key: EMAIL_PASS
Value: dummy-email-password
```

```
Key: EMAIL_FROM
Value: F Jewelry <noreply@example.com>
```

```
Key: CLOUDINARY_CLOUD_NAME
Value: dummy-cloud-name
```

```
Key: CLOUDINARY_API_KEY
Value: 000000000000000
```

```
Key: CLOUDINARY_API_SECRET
Value: dummy-cloudinary-secret
```

### 2.3: Save and Redeploy

After adding all variables:
1. Click **"Save Changes"**
2. Render will **automatically redeploy**
3. Wait 2-3 minutes for the new deployment

---

## MongoDB Atlas Setup (If You Don't Have It)

### Step A: Create Cluster

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a **FREE M0 cluster** (takes 2-3 minutes)

### Step B: Create Database User

1. In MongoDB Atlas dashboard:
2. Click **"Database Access"** (left sidebar)
3. Click **"Add New Database User"**
4. Choose **"Password"** authentication
5. Set username and password (save these!)
6. Set permissions to **"Read and write to any database"**
7. Click **"Add User"**

### Step C: Whitelist IP Address

1. Click **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### Step D: Get Connection String

1. Click **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end: `/f-jewelry`
7. Final format:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/f-jewelry?retryWrites=true&w=majority
   ```

---

## Step 3: Deploy Frontend to Vercel

### 3.1: Go to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**

### 3.2: Import Your Repository

1. Select your GitHub repository
2. Click **"Import"**

### 3.3: Configure Project

**Project Name**: `f-jewelry-frontend` (or your choice)

**Framework Preset**: `Vite`

**Root Directory**: `./` (root of the project, NOT the api folder)

**Build Command**:
```bash
npm run build
```

**Output Directory**:
```bash
dist
```

**Install Command**:
```bash
npm install
```

### 3.4: DO NOT DEPLOY YET!

Click **"Cancel"** or **"Environment Variables"** first - we need to set those up.

---

## Step 4: Configure Frontend Environment Variables

### 4.1: Add Environment Variables

In the Vercel project setup (or go to Settings → Environment Variables):

Click **"Add"** for each variable:

#### Critical Variables (MUST SET):

```
Key: VITE_API_URL
Value: https://your-backend-url.onrender.com/api/v1
Environment: Production ✅
```
⚠️ Replace `your-backend-url.onrender.com` with your ACTUAL Render backend URL

```
Key: VITE_BACKEND_URL
Value: https://your-backend-url.onrender.com
Environment: Production ✅
```
⚠️ Replace with your ACTUAL Render backend URL (no /api/v1 at the end)

```
Key: VITE_APP_NAME
Value: F Jewelry
Environment: Production ✅
```

```
Key: VITE_USE_MOCK_AUTH
Value: false
Environment: Production ✅
```

```
Key: VITE_RAZORPAY_KEY_ID
Value: rzp_test_xxxxxxxxxxxx
Environment: Production ✅
```

### 4.2: Important Notes About Vercel Env Vars

1. **Environment**: Set all to **"Production"** (you can also add to Preview/Development if needed)
2. **VITE_ Prefix**: Variables MUST start with `VITE_` to be exposed to the browser
3. **Full URLs**: Unlike monolith deployment, use FULL URLs here (not relative paths)

### 4.3: Deploy the Frontend

After adding all environment variables:
1. Click **"Deploy"**
2. Wait 2-3 minutes for the build
3. Vercel will give you a URL like: `https://f-jewelry-frontend.vercel.app`

---

## Step 5: Verify the Deployment

### 5.1: Check Backend Health

Open your browser and visit:
```
https://your-backend-url.onrender.com/api/v1/health
```

**Expected Response**:
```json
{
  "status": "success",
  "message": "F Jewelry API is running!",
  "timestamp": "2026-04-05T12:00:00.000Z",
  "environment": "production",
  "databaseConnected": true
}
```

✅ If you see this, your backend is working!

❌ If you see an error:
- Check Render logs for errors
- Verify `MONGODB_URI` is correct
- Verify `JWT_SECRET` and `REFRESH_TOKEN_SECRET` are set

### 5.2: Check Frontend Loads

Visit your Vercel URL:
```
https://your-frontend-url.vercel.app
```

✅ The website should load normally

❌ If you see a white screen:
- Open browser console (F12)
- Check for errors
- Verify `VITE_API_URL` and `VITE_BACKEND_URL` are correct

### 5.3: Check API Connection from Frontend

1. Open your Vercel site
2. Open browser console (F12 → Console tab)
3. Type this and press Enter:
   ```javascript
   fetch('https://your-backend-url.onrender.com/api/v1/health')
     .then(r => r.json())
     .then(console.log)
   ```

✅ Should return the health check JSON

❌ If it fails with CORS error, check that your backend has:
```
FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

## Step 6: Test Login Flow

### 6.1: Create a Test User

Since email might not work with dummy values, you can:

**Option A**: Use the registration form on the website
- Go to your Vercel site
- Click "Sign Up"
- Fill in the form
- Submit (user will be created even if email fails)

**Option B**: Create user directly in MongoDB
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Find `f-jewelry` database → `users` collection
4. Check if your registered user exists

### 6.2: Test Login

1. Go to your Vercel site
2. Click "Login"
3. Enter email and password
4. Click "Login"

### 6.3: What Should Happen

✅ **Success**:
- Login button shows loading spinner
- Request goes to `https://your-backend.onrender.com/api/v1/auth/login`
- Response returns with user data and tokens
- You're redirected to dashboard/home
- Tokens stored in localStorage

❌ **Common Errors**:

**Error 500 (Internal Server Error)**:
- Check Render logs
- Usually means missing environment variables
- Check that MongoDB is connected

**Timeout Error**:
- Check `VITE_API_URL` is correct (full URL, not relative path)
- Check Render service is running (not sleeping on free tier)

**CORS Error**:
- Check `FRONTEND_URL` on backend matches your Vercel URL
- Check protocol (https:// not http://)

**401 Unauthorized**:
- Wrong email/password
- Check user exists in MongoDB

---

## Troubleshooting

### Problem 1: Error 500 on Login

**Symptoms**: Console shows `POST https://.../api/v1/auth/login 500`

**How to Fix**:

1. **Check Render Logs**:
   - Go to Render dashboard
   - Click your backend service
   - Click **"Logs"** tab
   - Look for errors

2. **Common Causes**:
   
   ❌ Missing `JWT_SECRET`:
   ```
   Error: JWT_SECRET environment variable is not configured
   ```
   **Fix**: Add `JWT_SECRET` env var (min 32 chars)

   ❌ Missing `REFRESH_TOKEN_SECRET`:
   ```
   Error: REFRESH_TOKEN_SECRET environment variable is not configured
   ```
   **Fix**: Add `REFRESH_TOKEN_SECRET` env var (min 32 chars)

   ❌ MongoDB not connected:
   ```
   MongoDB connection error: ...
   ```
   **Fix**: Check `MONGODB_URI` is correct

   ❌ Invalid MongoDB credentials:
   ```
   MongoServerError: Authentication failed
   ```
   **Fix**: Check username/password in connection string

3. **Test Backend Directly**:
   Use this curl command (or Postman):
   ```bash
   curl -X POST https://your-backend.onrender.com/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123"}'
   ```
   
   Should return user data, not 500 error.

---

### Problem 2: Timeout Error

**Symptoms**: Request takes 30+ seconds, then fails with timeout

**How to Fix**:

1. **Check if Render service is sleeping**:
   - Free tier Render services sleep after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds to wake up
   - **This is normal for free tier**

2. **Solution Options**:
   
   **Option A**: Just wait for the first request (30-60 seconds)
   
   **Option B**: Upgrade Render to paid tier ($7/month)
   
   **Option C**: Use a service like UptimeRobot to ping your backend every 10 minutes to keep it awake

3. **Check `VITE_API_URL` is correct**:
   
   ❌ **WRONG** (causes timeout):
   ```
   VITE_API_URL=/api/v1
   ```
   
   ✅ **CORRECT**:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api/v1
   VITE_BACKEND_URL=https://your-backend.onrender.com
   ```

---

### Problem 3: CORS Error

**Symptoms**: Browser console shows:
```
Access to XMLHttpRequest at 'https://your-backend.onrender.com/api/v1/auth/login' 
from origin 'https://your-frontend.vercel.app' has been blocked by CORS policy
```

**How to Fix**:

1. **Set correct FRONTEND_URL on backend**:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
   (No trailing slash!)

2. **Check the backend CORS configuration** in `api/index.ts`:
   ```typescript
   app.use(cors({
     origin: process.env.FRONTEND_URL || '*',
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
   }));
   ```

3. **For testing, you can use wildcard**:
   ```
   FRONTEND_URL=*
   ```
   (Not recommended for production)

---

### Problem 4: "user timeout.1000()" Error

**Symptoms**: Notification shows "user timeout.1000()" or similar

**What This Means**:
- This is a custom error message from your frontend
- The `1000()` suggests a timeout configuration issue
- The request is timing out before getting a response

**How to Fix**:

1. **Check backend is actually running**:
   ```
   https://your-backend.onrender.com/api/v1/health
   ```
   If this doesn't respond, backend is down.

2. **Check frontend timeout setting** in `src/services/api.ts`:
   ```typescript
   const api = axios.create({
     baseURL: getBaseURL(),
     timeout: 30000, // 30 seconds
     ...
   });
   ```
   Already set to 30 seconds, which should be enough.

3. **Check network tab** (F12 → Network):
   - Filter by "login"
   - Check the request URL
   - If it's wrong (e.g., pointing to Vercel instead of Render), fix env vars

---

### Problem 5: Can't Register Users

**Symptoms**: Registration form submits but user isn't created

**How to Fix**:

1. **Check Render logs** for registration errors

2. **Email service might fail** (with dummy values):
   - Registration still works even if email fails
   - Check MongoDB for the user

3. **Test with curl**:
   ```bash
   curl -X POST https://your-backend.onrender.com/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName":"Test",
       "lastName":"User",
       "email":"test@example.com",
       "password":"password123",
       "passwordConfirm":"password123"
     }'
   ```

---

### Problem 6: Build Fails on Render

**Symptoms**: Render deployment fails during build

**Common Causes**:

1. **Wrong Root Directory**:
   - Must be set to `api` in Render settings
   - NOT the root of your repository

2. **Missing Dependencies**:
   - Check `api/package.json` has all dependencies
   - Check `api/package-lock.json` is committed

3. **TypeScript Compilation Errors**:
   - Check build logs for specific errors
   - Run `npm run build` locally to test

**Solutions**:

**Option A**: Use ts-node directly (no build step)

**Build Command**:
```bash
npm install
```

**Start Command**:
```bash
npx ts-node src/server.ts
```

**Option B**: Compile TypeScript first

**Build Command**:
```bash
npm install && npx tsc
```

**Start Command**:
```bash
node dist/src/server.js
```

---

### Problem 7: Build Fails on Vercel

**Symptoms**: Vercel deployment fails during build

**Common Causes**:

1. **Wrong Root Directory**:
   - Must be `./` (root of repository)
   - NOT the `api` folder

2. **Missing Environment Variables**:
   - Vite needs `VITE_` prefixed vars at build time
   - Check all are set in Vercel dashboard

3. **TypeScript Errors**:
   - Check build logs
   - Run `npm run build` locally first

**Solution**:

Test locally before deploying:
```bash
npm install
npm run build
```

If it builds locally, it should build on Vercel.

---

## Dummy Values Reference

### What Are Dummy Values?

Dummy values are placeholder credentials for services you haven't set up yet. They prevent your app from crashing, but the specific feature won't work.

### Which Services Can Use Dummy Values?

| Service | Impact of Dummy Values | Feature That Won't Work |
|---------|----------------------|------------------------|
| Razorpay | ✅ Safe | Payment processing |
| Google OAuth | ✅ Safe | Google login button |
| Email (SMTP) | ✅ Safe | Password reset emails, verification emails |
| Cloudinary | ✅ Safe | Image uploads |

### Recommended Dummy Values

#### Razorpay:
```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=dummy-secret-key-for-development
RAZORPAY_WEBHOOK_SECRET=dummy-webhook-secret
```

#### Google OAuth:
```
GOOGLE_CLIENT_ID=000000000000-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz12
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/v1/auth/google/callback
```
⚠️ Replace `your-backend.onrender.com` with your actual Render URL

#### Email (SMTP):
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@example.com
EMAIL_PASS=dummy-password-not-real
EMAIL_FROM=F Jewelry <noreply@example.com>
```

#### Cloudinary:
```
CLOUDINARY_CLOUD_NAME=dummy-cloud-name
CLOUDINARY_API_KEY=000000000000000
CLOUDINARY_API_SECRET=dummy-api-secret-here
```

### How to Get Real Values Later

#### Razorpay (for real payments):
1. Sign up: https://dashboard.razorpay.com/
2. Go to Settings → API Keys
3. Copy Key ID and Key Secret
4. Update environment variables

#### Google OAuth (for Google login):
1. Go to: https://console.developers.google.com/
2. Create a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URI: `https://your-backend.onrender.com/api/v1/auth/google/callback`
6. Copy Client ID and Client Secret

#### Email (for password resets):
1. Use Gmail with App Password:
   - Enable 2FA on your Google account
   - Go to: https://myaccount.google.com/apppasswords
   - Create an app password
   - Use that as `EMAIL_PASS`
2. Or use SendGrid, Mailgun, etc.

#### Cloudinary (for image uploads):
1. Sign up: https://cloudinary.com/users/register/free
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

---

## Complete Environment Variable Checklist

### Backend (Render) - Required ✅

- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI=mongodb+srv://...`
- [ ] `JWT_SECRET=<32+ characters>`
- [ ] `JWT_EXPIRES_IN=7d`
- [ ] `JWT_COOKIE_EXPIRES_IN=7`
- [ ] `REFRESH_TOKEN_SECRET=<32+ characters>`
- [ ] `REFRESH_TOKEN_EXPIRES_IN=30d`
- [ ] `FRONTEND_URL=https://your-frontend.vercel.app`
- [ ] `RATE_LIMIT_WINDOW_MS=900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS=100`

### Backend (Render) - Optional (Dummy OK)

- [ ] `RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx`
- [ ] `RAZORPAY_KEY_SECRET=dummy-secret`
- [ ] `GOOGLE_CLIENT_ID=dummy-client-id`
- [ ] `GOOGLE_CLIENT_SECRET=dummy-client-secret`
- [ ] `GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/v1/auth/google/callback`
- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_USER=noreply@example.com`
- [ ] `EMAIL_PASS=dummy-password`
- [ ] `CLOUDINARY_CLOUD_NAME=dummy-cloud`
- [ ] `CLOUDINARY_API_KEY=000000000000000`
- [ ] `CLOUDINARY_API_SECRET=dummy-secret`

### Frontend (Vercel) - Required ✅

- [ ] `VITE_API_URL=https://your-backend.onrender.com/api/v1`
- [ ] `VITE_BACKEND_URL=https://your-backend.onrender.com`
- [ ] `VITE_APP_NAME=F Jewelry`
- [ ] `VITE_USE_MOCK_AUTH=false`
- [ ] `VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx`

---

## Testing Checklist

After deployment, verify each step:

- [ ] Backend health check works: `https://your-backend.onrender.com/api/v1/health`
- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] Can see products on homepage
- [ ] Can navigate to different pages
- [ ] Can open login modal
- [ ] Can submit login form
- [ ] Login request goes to Render backend (check Network tab)
- [ ] Login succeeds and user is redirected
- [ ] User info appears in header (name, avatar)
- [ ] Can logout successfully
- [ ] Can register a new user
- [ ] Tokens are stored in localStorage (check DevTools → Application → Local Storage)

---

## Quick Reference: Your URLs

Fill these in once deployed:

```
Frontend URL: https://____________________.vercel.app
Backend URL:  https://____________________.onrender.com
MongoDB:      mongodb+srv://_____:_____@cluster_____.mongodb.net/f-jewelry
```

---

## Still Having Issues?

### How to Debug:

1. **Check Browser Console** (F12 → Console)
   - Look for red errors
   - Check the full error message
   - Check the network request URL

2. **Check Network Tab** (F12 → Network)
   - Filter by "login"
   - Check request URL (should be your Render URL)
   - Check response status and body
   - Check response headers for CORS

3. **Check Render Logs**
   - Go to Render dashboard
   - Click your backend
   - Click "Logs"
   - Look for errors during login attempt

4. **Check Vercel Deployment**
   - Go to Vercel dashboard
   - Click your project
   - Check deployments tab
   - Ensure latest deployment succeeded

5. **Test Backend Directly**
   - Use Postman or curl
   - Test `/api/v1/health` endpoint
   - Test `/api/v1/auth/login` endpoint

---

## Common Mistakes to Avoid

❌ **Mistake 1**: Using relative path for `VITE_API_URL`
```
VITE_API_URL=/api/v1  ← WRONG for separate deployments
```
✅ **Fix**:
```
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

❌ **Mistake 2**: Forgetting `VITE_BACKEND_URL`
```
VITE_API_URL=https://your-backend.onrender.com/api/v1
VITE_BACKEND_URL=  ← Missing!
```
✅ **Fix**:
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

❌ **Mistake 3**: Missing JWT secrets
```
JWT_SECRET=  ← Empty or missing!
```
✅ **Fix**:
```
JWT_SECRET=any-random-string-at-least-32-characters-long
```

❌ **Mistake 4**: Wrong MongoDB URI
```
MONGODB_URI=mongodb://localhost:27017  ← Localhost won't work on Render!
```
✅ **Fix**:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/f-jewelry
```

❌ **Mistake 5**: FRONTEND_URL mismatch
```
Backend: FRONTEND_URL=http://localhost:5173  ← Wrong for production!
```
✅ **Fix**:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Final Notes

### Free Tier Limitations:

**Render Free Tier**:
- Service sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free (enough for one always-on service)
- 100 GB bandwidth/month

**Vercel Free Tier**:
- No sleeping, always available
- 100 GB bandwidth/month
- Automatic HTTPS
- Serverless functions have 10-second timeout (free tier)

**MongoDB Atlas Free Tier**:
- 512 MB storage
- Shared RAM
- Good for development/testing

### Performance Tips:

1. **Keep Render service awake**: Use UptimeRobot to ping every 10 minutes
2. **Optimize images**: Compress before uploading
3. **Use CDN**: Vercel serves static files via CDN automatically
4. **Enable caching**: Already configured in your frontend

### Security Reminders:

1. **Never commit `.env` files** to Git
2. **Rotate secrets** periodically
3. **Use HTTPS everywhere** (already handled by Vercel/Render)
4. **Enable CORS** only for your frontend domain
5. **Rate limiting** is already configured

---

## Summary

1. ✅ Deploy backend to Render with `api` as root directory
2. ✅ Set all backend environment variables on Render
3. ✅ Deploy frontend to Vercel with `./` as root directory
4. ✅ Set `VITE_API_URL` and `VITE_BACKEND_URL` to full Render URLs
5. ✅ Test health endpoint, then test login
6. ✅ Check logs if anything fails

**You now have a fully deployed application! 🎉**
