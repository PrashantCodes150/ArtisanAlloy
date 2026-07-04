# ArtisanAlloy - 503 Error Troubleshooting Guide

Getting a 503 Service Unavailable error after deploying to Vercel? Follow this guide to fix it.

## Quick Diagnosis

### Step 1: Check the Health Endpoint

```bash
curl https://your-domain.vercel.app/api/v1/health
```

Expected response:
```json
{
  "status": "success",
  "message": "ArtisanAlloy API is running! 💎",
  "dbStatus": "connected",
  "timestamp": "2026-04-05T...",
  "environment": "production"
}
```

- **If you get 502/503**: Scroll to "Server Won't Start" section
- **If dbStatus is "disconnected"**: Scroll to "Database Connection Failed" section

## Common Issues & Solutions

### 1. Database Connection Failed (503 with `dbStatus: "disconnected"`)

**Symptoms:**
- `/api/v1/health` returns 503
- API requests return 503
- Health check shows `"databaseConnected": false`

**Causes & Solutions:**

#### A. Missing MONGODB_URI Environment Variable

1. Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Check if `MONGODB_URI` is set
3. If missing, add it:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Artisan-Alloy?retryWrites=true&w=majority
   ```
4. Redeploy:
   ```bash
   git push  # or click redeploy in Vercel dashboard
   ```

#### B. MongoDB IP Whitelist Issue

Your MongoDB cluster doesn't allow Vercel's IP addresses.

1. Go to **MongoDB Atlas → Network Access**
2. Look for IP Whitelist (Access List)
3. Options:
   - ✅ **For development**: Add IP `0.0.0.0/0` (allows all IPs)
   - ✅ **For production**: Add Vercel's IP ranges (if available)
   - ❌ **Don't do**: Leave it restricted if not whitelisted

**How to add IP:**
1. Click "Add IP Address"
2. Enter `0.0.0.0/0`
3. Confirm
4. Redeploy your Vercel project

#### C. Wrong Connection String

The connection string is wrong or expired.

1. Go to **MongoDB Atlas → Databases → Connect**
2. Click "Drivers"
3. Copy the entire connection string
4. Verify in Vercel env var that it has:
   - Correct username & password
   - Correct cluster name
   - `retryWrites=true&w=majority` parameters
5. Paste updated URI in Vercel env vars
6. Redeploy

### 2. Server Won't Start (502 Error)

**Symptoms:**
- Build succeeds but requests return 502
- Function doesn't start
- No API response at all

**Solutions:**

#### A. Missing Required Environment Variables

```bash
# These MUST be set for the server to start:
JWT_SECRET              # JWT signing key (min 32 chars)
REFRESH_TOKEN_SECRET    # Refresh token key (min 32 chars)
MONGODB_URI            # MongoDB connection string
```

1. Generate keys:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Add to Vercel environment variables:
   - `JWT_SECRET=<generated-key>`
   - `REFRESH_TOKEN_SECRET=<generated-key>`
3. Redeploy

#### B. Build Command Issues

1. Go to **Vercel Dashboard → Settings → Build & Development**
2. Verify:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Check logs:
   - Click **Deployments** → click failed deployment → **View Details**
   - Look for build errors
4. Common fixes:
   ```bash
   # Locally, run:
   npm run build
   # Fix any TypeScript errors shown
   ```

#### C. Node.js Version Mismatch

Your Node.js version might be too old.

1. Go to **Vercel Settings → Environment Variables**
2. Add: `NODE_VERSION=18.17.0`
3. Redeploy

### 3. CORS Errors (Frontend Can't Reach API)

**Symptoms:**
- Frontend loads, but API calls fail
- Browser console shows: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**

1. Verify in Vercel env vars:
   ```
   FRONTEND_URL=https://your-actual-vercel-domain.vercel.app
   ```
2. Make sure `vercel.json` has correct CORS headers (it should already)
3. If custom domain:
   - Update `FRONTEND_URL` to your custom domain
   - Update `GOOGLE_CALLBACK_URL` if using OAuth
4. Redeploy

### 4. Environmental Variables Not Loading

**Symptoms:**
- App works locally but fails in production
- Environment variables seem to be undefined

**Solution:**

1. Variables take effect on next deployment
   - Just adding vars in Vercel dashboard is NOT enough
   - Must **redeploy** for changes to take effect

2. How to redeploy:
   - **Option A**: Git push to trigger auto-deploy
   ```bash
   git add .
   git commit -m "Fix: Update env variables"
   git push
   ```
   - **Option B**: Manual redeploy
     - Vercel Dashboard → Deployments → click latest → Redeploy

### 5. Function Timeout (503 with timeout error)

**Symptoms:**
- Response takes very long, then returns 503
- Error mentions "timeout" or "exceeded duration"

**Solutions:**

1. MongoDB slow to connect:
   - Check MongoDB Atlas is healthy
   - Verify connection string is correct
   - Check rate limiting isn't blocking

2. Increase function timeout in `vercel.json`:
   ```json
   "maxDuration": 60,  // can increase to max 300 for Pro
   ```

### 6. Authentication Failures (401/403)

**Symptoms:**
- Login endpoint returns 500
- Auth middleware throws errors

**Solutions:**

1. Check JWT_SECRET is set
2. Verify JWT_SECRET is same in both:
   - Frontend environment (if any)
   - Backend environment
3. Make sure secrets are at least 32 characters
4. Don't use special shell characters without quoting

## Verification Checklist

After applying fixes:

```bash
# 1. Health check (no DB access needed)
curl https://your-domain.vercel.app/

# 2. API health (requires DB)
curl https://your-domain.vercel.app/api/v1/health

# 3. Auth endpoint test
curl -X POST https://your-domain.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234"}'

# Should return proper response, not 500/502/503
```

## Emergency Rollback

If deployment is broken:

1. **Vercel Dashboard → Deployments**
2. Find a previous working deployment
3. Click **...** → **Promote to Production**
4. Your site is now using the previous version

While you fix the code:
```bash
git log --oneline  # see previous commits
git revert HEAD    # undo recent changes
git push           # auto-deploy to Vercel
```

## View Detailed Logs

1. **Vercel Dashboard → Your Project**
2. Click **Deployments** tab
3. Click on a deployment
4. Click **Function Logs** tab
5. Scroll through to find errors

```
[ERROR] Database connection failed: MongoNetworkError...
```

Use the error message to identify the problem.

## Database Debugging

To verify MongoDB connection string works locally:

```bash
# Install mongo client:
npm install -g mongosh

# Test connection:
mongosh "your-connection-string-here"

# If it connects, the string is valid
```

## Performance Optimization

If site is slow:

1. **API Response Time**
   - Check MongoDB is in the same region as Vercel
   - Vercel: default = us-east-1
   - MongoDB: set to same region

2. **Frontend Loading**
   - Verify static assets are cached
   - Check in Vercel dashboard under Analytics

## Get More Help

1. **Check Vercel Status**: https://www.vercelstatus.com
2. **MongoDB Status**: https://status.mongodb.com
3. **Vercel Docs**: https://vercel.com/docs
4. **Open Support Ticket**: https://vercel.com/help

---

**Still not working?** Save this info and create a GitHub issue with:
- Deployment URL (if not sensitive)
- Health check response (or 503 error)
- Environment variables you've set (without secrets)
- Error message from Vercel function logs
