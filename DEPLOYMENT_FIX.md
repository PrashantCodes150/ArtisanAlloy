# Deployment Fix Guide - Error 500 & Timeout Issues

## Problem Diagnosis

You're experiencing **Error 500** and **timeout** during login because of misconfigured environment variables between frontend and backend deployments.

---

## Solution: Choose ONE Deployment Strategy

### OPTION 1: Separate Deployments (Vercel Frontend + Render Backend)

**When to use**: Frontend on Vercel, Backend on Render (different domains)

#### Backend (Render) - Environment Variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/f-jewelry
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-chars-long
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
REFRESH_TOKEN_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend.vercel.app
RAZORPAY_KEY_ID=rzp_test_dummy123456
RAZORPAY_KEY_SECRET=rzp_test_dummy_secret_123456
GOOGLE_CLIENT_ID=dummy-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=dummy-client-secret
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/v1/auth/google/callback
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important for services you haven't set up:**
- **Razorpay**: Use `rzp_test_xxxxxxxxxxxx` for key ID and any dummy string for secret
- **Google OAuth**: Use dummy values, Google login won't work but won't crash the app
- **Email**: Use dummy values, email features won't work but won't crash
- **Cloudinary**: Use dummy values, image uploads will fail gracefully

#### Frontend (Vercel) - Environment Variables:
```
VITE_API_URL=https://your-backend.onrender.com/api/v1
VITE_BACKEND_URL=https://your-backend.onrender.com
VITE_APP_NAME=F Jewelry
VITE_USE_MOCK_AUTH=false
VITE_RAZORPAY_KEY_ID=rzp_test_dummy123456
```

**⚠️ CRITICAL**: `VITE_API_URL` and `VITE_BACKEND_URL` must be the **full URL** to your Render backend.

---

### OPTION 2: Monolith Deployment (Everything on Vercel)

**When to use**: Both frontend and backend deployed together on Vercel

#### How it works:
- The `api/index.ts` file acts as your backend
- Vercel serverless functions handle API requests
- Frontend calls `/api/v1/...` which routes to the backend

#### Vercel - Environment Variables (ALL in ONE):
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/f-jewelry
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-chars-long
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
REFRESH_TOKEN_EXPIRES_IN=30d
FRONTEND_URL=https://your-app.vercel.app
VITE_API_URL=/api/v1
VITE_BACKEND_URL=
VITE_APP_NAME=F Jewelry
VITE_USE_MOCK_AUTH=false
VITE_RAZORPAY_KEY_ID=rzp_test_dummy123456
RAZORPAY_KEY_ID=rzp_test_dummy123456
RAZORPAY_KEY_SECRET=dummy_secret_123456
GOOGLE_CLIENT_ID=dummy-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=dummy-client-secret
GOOGLE_CALLBACK_URL=https://your-app.vercel.app/api/v1/auth/google/callback
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=dummy-password
CLOUDINARY_CLOUD_NAME=dummy-cloud
CLOUDINARY_API_KEY=dummy-key
CLOUDINARY_API_SECRET=dummy-secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ CRITICAL**: 
- `VITE_API_URL=/api/v1` (relative path, NO domain)
- `VITE_BACKEND_URL=` (empty or omit entirely)

---

## Common Mistakes That Cause Error 500

### ❌ WRONG:
```
VITE_API_URL=/api/v1
```
...when frontend is on Vercel and backend is on Render. This makes the frontend call `your-site.vercel.app/api/v1/auth/login` which doesn't exist.

### ✅ CORRECT (for separate deployments):
```
VITE_API_URL=https://your-backend.onrender.com/api/v1
VITE_BACKEND_URL=https://your-backend.onrender.com
```

---

## Missing Environment Variables = Error 500

The most common cause of your Error 500 is **missing JWT secrets** on the backend:

```
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-chars-long
```

If these are missing, the login endpoint crashes with a 500 error when trying to generate tokens.

---

## Dummy Values Guide

For services you haven't created accounts for, use these dummy values to prevent crashes:

```bash
# Razorpay (Payment processing won't work, but app won't crash)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=dummy_secret_for_development

# Google OAuth (Google login won't work, but app won't crash)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Password reset emails won't work, but app won't crash)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@example.com
EMAIL_PASS=dummy-password

# Cloudinary (Image uploads won't work, but app won't crash)
CLOUDINARY_CLOUD_NAME=dummy-cloud-name
CLOUDINARY_API_KEY=000000000000000
CLOUDINARY_API_SECRET=dummy-api-secret
```

---

## How to Configure Environment Variables

### On Vercel:
1. Go to your project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable from the lists above
4. Click **Save**
5. **Redeploy** your app (environment variables only apply at build time)

### On Render:
1. Go to your service on Render
2. Navigate to **Environment** tab
3. Add each variable from the backend list above
4. Click **Save Changes**
5. Render will automatically redeploy

---

## Testing Your Fix

### 1. Check Backend Health
```
https://your-backend.onrender.com/api/v1/health
```
Should return: `{"status":"success","message":"F Jewelry API is running!"}`

### 2. Check Frontend API Connection
Open browser console (F12) and check network tab when logging in. Look for:
- ✅ Request URL should be your Render backend URL (for separate deployments)
- ❌ If it's your Vercel URL, the configuration is wrong

### 3. Check for Token Errors
The "user timeout.1000()" error you mentioned suggests the frontend is timing out waiting for a response. This happens when:
- Backend is not running
- API URL is misconfigured
- Backend crashes due to missing env vars

---

## Quick Fix Steps

1. **Decide**: Separate deployments (Vercel + Render) OR monolith (Vercel only)?
2. **Set environment variables** according to the chosen option above
3. **Redeploy** both frontend and backend
4. **Test** the health endpoint first, then try logging in
5. **Check browser console** (F12) for any remaining errors

---

## Still Having Issues?

Check these in order:
1. MongoDB connection string is correct and database is accessible
2. `JWT_SECRET` and `REFRESH_TOKEN_SECRET` are set (min 32 characters each)
3. `VITE_API_URL` points to your actual backend URL (not relative path for separate deployments)
4. Backend logs on Render show no startup errors
5. Frontend build on Vercel completed successfully with env vars
