# Fix: Vercel Deployment - MongoDB Connection & Auth Route Errors

## Issues Fixed

### 1. **404 Error**: `/api/v1/auth/register` not found
**Cause**: Database connection was happening AFTER route registration, causing routes to fail initialization.

**Fix**: Changed database connection to initialize immediately when the module loads, before routes are processed.

### 2. **500 Error**: `Operation 'users.findOne()' buffering timed out after 10000ms`
**Cause**: 
- MongoDB wasn't connected on Vercel (missing `MONGODB_URI` environment variable)
- Default connection was trying to use `mongodb://localhost:27017` which doesn't exist on Vercel

**Fix**: 
- Database now connects on module initialization
- Added proper error handling for missing `MONGODB_URI`
- Optimized connection settings for serverless (Vercel)

---

## What You Need to Do: Set MongoDB on Vercel

Your Vercel deployment **does not have the `MONGODB_URI` environment variable configured**. Follow these steps:

### Option 1: Use MongoDB Atlas (Recommended - Free)

1. **Create a MongoDB Atlas Account**:
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create a Free Cluster**:
   - Click "Build a Database"
   - Choose "Shared" (free tier - M0)
   - Select a region close to you
   - Click "Create"

3. **Set Up Database Access**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Set permissions to "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Your Connection String**:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your actual credentials
   - Add your database name at the end:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/f-jewelry?retryWrites=true&w=majority
     ```

6. **Add to Vercel Environment Variables**:
   - Go to your Vercel dashboard: https://vercel.com/dashboard
   - Select your project: `f-jewelry-react`
   - Go to **Settings** → **Environment Variables**
   - Add a new variable:
     - **Key**: `MONGODB_URI`
     - **Value**: Your MongoDB connection string from step 5
     - **Environment**: Check all three (Production, Preview, Development)
   - Click "Save"

### Option 2: Use Another MongoDB Provider

If you have MongoDB hosted elsewhere, just add the connection string to Vercel as described in step 6 above.

---

## Redeploy to Vercel

After adding the `MONGODB_URI` environment variable:

1. **Trigger a new deployment**:
   - Push your changes to git:
     ```bash
     git add .
     git commit -m "fix: resolve auth route 404 and MongoDB connection timeout on Vercel"
     git push
     ```
   
2. **OR manually redeploy**:
   - Go to Vercel dashboard
   - Click your project
   - Go to "Deployments"
   - Click the "..." menu on the latest deployment
   - Click "Redeploy"

---

## Verify the Fix

After redeployment:

1. **Test the health endpoint**:
   ```
   https://your-vercel-url.vercel.app/api/v1/health
   ```
   You should see:
   ```json
   {
     "status": "success",
     "message": "F Jewelry API is running! 💎",
     "dbStatus": "connected",
     "timestamp": "...",
     "environment": "production"
   }
   ```

2. **Try registering again**:
   - The `/api/v1/auth/register` endpoint should now work

3. **Check Vercel logs**:
   - Go to your Vercel deployment
   - Click "Logs"
   - Look for: `✅ MongoDB Connected: ...`
   - There should be no more buffering timeout errors

---

## Technical Changes Made

### `api/index.ts`
- ✅ Database connection now happens immediately on module load (not lazy)
- ✅ Removed redundant connection middleware that was causing timing issues
- ✅ Added connection state tracking to prevent multiple connections

### `api/src/config/database.ts`
- ✅ Added connection pooling optimization for serverless
- ✅ Added `serverSelectionTimeoutMS: 5000` (faster failure for debugging)
- ✅ Added `maxPoolSize: 10` (prevent connection exhaustion)
- ✅ Added early return if already connected (prevent reconnection attempts)
- ✅ Now throws error if `MONGODB_URI` is missing (easier debugging)

---

## Common Issues

### "MONGODB_URI environment variable is not set"
- You forgot to add the environment variable to Vercel
- Go to Vercel → Settings → Environment Variables → Add `MONGODB_URI`

### "MongoDB connection failed" 
- Check your MongoDB connection string is correct
- Ensure your IP is allowed in MongoDB Atlas Network Access
- Verify your MongoDB Atlas user credentials are correct

### Still getting 500 errors after redeploy?
- Vercel might take a minute to apply environment variables
- Try a hard redeploy (delete old deployment and push new commit)
- Check Vercel function logs for detailed error messages

---

## Need Help?

If you're still having issues after following these steps:
1. Check your Vercel deployment logs
2. Verify your MongoDB Atlas cluster is running
3. Test your connection string locally:
   ```bash
   cd api
   npm run dev
   ```
   Then visit: `http://localhost:5000/api/v1/health`
