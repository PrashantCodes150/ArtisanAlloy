# 🔴 URGENT: Vercel Environment Variables Required

Your API is returning 500 errors because **required environment variables are missing on Vercel**.

## The Problem

Your code needs these environment variables to work:
- `MONGODB_URI` - Database connection (REQUIRED)
- `JWT_SECRET` - Token generation (REQUIRED)
- `REFRESH_TOKEN_SECRET` - Refresh tokens (REQUIRED)
- `FRONTEND_URL` - CORS and email links (REQUIRED)

**Without these, the server crashes with 500 errors.**

---

## ✅ Fix: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click on your project: **f-jewelry-react**
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add These Variables

Click **Add New** and add each variable below:

| Key | Value | Environment |
|-----|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/f-jewelry` | ✅ Production, ✅ Preview, ✅ Development |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-in-production-min-32-chars` | ✅ Production, ✅ Preview, ✅ Development |
| `REFRESH_TOKEN_SECRET` | `your-refresh-token-secret-change-in-production-min-32-chars` | ✅ Production, ✅ Preview, ✅ Development |
| `FRONTEND_URL` | `https://f-jewelry-react-gh79-xxxxx.vercel.app` (your actual Vercel URL) | ✅ Production, ✅ Preview, ✅ Development |
| `NODE_ENV` | `production` | ✅ Production only |

**IMPORTANT**: Replace the MongoDB URI with your actual MongoDB Atlas connection string.

### Step 3: Redeploy

After adding variables:
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

---

## Don't Have MongoDB Atlas Yet?

### Quick Setup (5 minutes, FREE):

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster**: Choose "Shared" (M0) tier
3. **Create Database User**:
   - Database Access → Add New User
   - Set username & password
   - Grant "Read and write" permissions
4. **Allow All IPs**:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
5. **Get Connection String**:
   - Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Should look like:
     ```
     mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/f-jewelry?retryWrites=true&w=majority
     ```

---

## How to Verify It Works

After redeployment, test these endpoints:

### 1. Health Check
```
https://your-vercel-url.vercel.app/api/v1/health
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "F Jewelry API is running! 💎",
  "dbStatus": "connected",
  "timestamp": "2026-04-04T...",
  "environment": "production"
}
```

### 2. Try Register Again
Use your frontend to register a new user. It should work now!

---

## Still Getting 500 Errors?

### Check Vercel Logs:
1. Go to your Vercel deployment
2. Click **Logs** tab
3. Look for error messages

**Common errors:**
- `MONGODB_URI environment variable is not set` → You forgot to add it
- `MongoDB connection failed` → Wrong connection string or network access not configured
- `jwt.sign` errors → Missing `JWT_SECRET`
- `cors` errors → Wrong `FRONTEND_URL`

---

## Quick Local Test

If you want to test locally first:

1. Copy `api/.env.example` to `api/.env`
2. Fill in all required values
3. Run:
   ```bash
   cd api
   npm install
   npm run dev
   ```
4. Test: `http://localhost:5000/api/v1/health`

If it works locally but not on Vercel, you definitely missed environment variables on Vercel.

---

## TL;DR Checklist

- [ ] Create MongoDB Atlas account (or use existing MongoDB URI)
- [ ] Add `MONGODB_URI` to Vercel environment variables
- [ ] Add `JWT_SECRET` to Vercel environment variables  
- [ ] Add `REFRESH_TOKEN_SECRET` to Vercel environment variables
- [ ] Add `FRONTEND_URL` to Vercel environment variables
- [ ] Redeploy your project on Vercel
- [ ] Test `/api/v1/health` endpoint
- [ ] Try registering again

---

**Need help?** Share the exact error message from Vercel logs and I'll help you fix it.
