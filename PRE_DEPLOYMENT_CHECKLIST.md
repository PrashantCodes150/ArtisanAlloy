# ArtisanAlloy - Pre-Deployment Checklist

Complete this checklist before deploying to Vercel to ensure everything works correctly.

## Code Changes ✅ (Already Complete)

- [x] `/api/index.ts` - Fixed database connection middleware (non-blocking)
- [x] `/api/src/app.ts` - Fixed session/passport configuration
- [x] `/api/src/middleware/errorHandler.ts` - Added MongoDB error handling
- [x] `/vercel.json` - Fixed deployment configuration
- [x] `/vite.config.ts` - Added build optimization

## Pre-Deployment Checks

### 1. Local Testing (15 minutes)

```bash
# Clean install
rm -rf node_modules api/node_modules
npm install
cd api && npm install && cd ..

# Build test
npm run build
# Verify: dist/ folder is created with no errors

# Check for TypeScript errors
npm run build 2>&1 | grep -i error
# Should show no errors
```

- [ ] Local build succeeds (no errors)
- [ ] dist/ folder exists and has files
- [ ] No TypeScript or ESLint errors

### 2. MongoDB Preparation (10 minutes)

If using MongoDB Atlas:

- [ ] MongoDB cluster is created and running
- [ ] Database user exists with strong password
- [ ] IP whitelist includes `0.0.0.0/0` (or your Vercel IPs)
- [ ] Connection string is copied and tested locally
- [ ] Connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true`

Test connection locally:

```bash
# If you have mongosh installed:
mongosh "your-connection-string"
# Should show: Hello Mongo!
```

- [ ] MongoDB connection works

### 3. Generate Secrets (5 minutes)

```bash
# Generate two 32-character random strings
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] JWT_SECRET saved (32+ chars)
- [ ] REFRESH_TOKEN_SECRET saved (32+ chars)

### 4. Vercel Project Setup (5 minutes)

- [ ] Vercel account exists
- [ ] Project created or connected to GitHub
- [ ] Project settings are accessible

### 5. Environment Variables in Vercel (10 minutes)

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add ALL of these (minimum required):

```
MONGODB_URI                  = mongodb+srv://...
JWT_SECRET                   = (your generated key)
REFRESH_TOKEN_SECRET         = (your generated key)
FRONTEND_URL                 = https://your-domain.vercel.app
NODE_ENV                     = production
VITE_API_URL                 = /api/v1
VITE_BACKEND_URL             = (leave empty)
```

Check each one:

- [ ] MONGODB_URI is set and valid
- [ ] JWT_SECRET is set and 32+ characters
- [ ] REFRESH_TOKEN_SECRET is set and 32+ characters
- [ ] FRONTEND_URL is set to your Vercel domain (or custom domain)
- [ ] NODE_ENV = "production"
- [ ] VITE_API_URL = "/api/v1"
- [ ] No environment variables are empty/undefined

### 6. Verify Code in Repository (5 minutes)

```bash
# Check key files are updated
git log --oneline -5
# Should show recent commits with fix messages

# Verify files exist
ls -la api/index.ts
ls -la vercel.json
ls -la api/src/app.ts

# Should all show file size > 0
```

- [ ] All fix files are committed
- [ ] No merge conflicts
- [ ] Ready to push

## Deployment Steps

### Step 1: Commit Code
```bash
git add -A
git commit -m "fix: Resolve 503 errors - non-blocking DB and proper Vercel config"
git push
```

- [ ] Code pushed to GitHub (or ready to deploy manually)

### Step 2: Vercel Deployment

**If using GitHub:**
- [ ] Vercel auto-deployment triggered
- [ ] Wait for deployment to complete (5-10 mins)

**If manual:**
- [ ] Clicked "Redeploy" in Vercel dashboard
- [ ] Waited for deployment to complete

### Step 3: Check Deployment Status

In Vercel Dashboard:

- [ ] Deployment shows "Ready"
- [ ] Build Logs show no errors
- [ ] Function Logs (if available) show no errors

### Step 4: Test Endpoints

Run these curl commands (replace domain):

```bash
# Test 1: Root endpoint
curl https://your-domain.vercel.app/
# Should return: {"status":"success","message":"ArtisanAlloy API is live! 💎"}

# Test 2: Health check
curl https://your-domain.vercel.app/api/v1/health
# Should return: {"status":"success","message":"ArtisanAlloy API is running! 💎",...}

# Test 3: Test API endpoint
curl -X POST https://your-domain.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass@123","name":"Test"}'
# Should NOT return 503
```

- [ ] Root endpoint returns 200
- [ ] Health endpoint returns 200
- [ ] Health check shows `"status": "success"`
- [ ] API endpoints are reachable (may return 400 but not 503)

### Step 5: Test Frontend

- [ ] Can visit https://your-domain.vercel.app
- [ ] Frontend loads without errors
- [ ] Browser console has no critical errors
- [ ] Can navigate pages

### Step 6: Functional Testing

- [ ] Can attempt to register/login
- [ ] API calls work (check Network tab in DevTools)
- [ ] No CORS errors in browser console
- [ ] No 503 errors

## Troubleshooting Checklist

If anything fails, check:

- [ ] All environment variables are set (not empty)
- [ ] MONGODB_URI is correct (copy-paste from MongoDB Atlas)
- [ ] MongoDB IP whitelist includes 0.0.0.0/0
- [ ] JWT_SECRET is 32+ characters
- [ ] Code has been pushed and deployed (not just locally)
- [ ] You've waited for deployment to complete (status says "Ready")
- [ ] Vercel function logs show no errors

## If You Get 503 Errors

1. Check MongoDB:
   - [ ] MONGODB_URI is set in Vercel env vars
   - [ ] IP 0.0.0.0/0 is whitelisted in MongoDB Atlas
   - [ ] Connection string is correct format

2. Check Vercel:
   - [ ] All env vars are set and visible in dashboard
   - [ ] Deployment status is "Ready" (not building)
   - [ ] Function logs show "Database connection established"

3. Redeploy:
   ```bash
   # If you made changes to env vars, must redeploy
   # Option 1: git push
   git commit --allow-empty -m "chore: trigger redeploy"
   git push
   
   # Option 2: Manual redeploy in Vercel dashboard
   ```

   - [ ] Redeployed after changing env vars

## Post-Deployment

Once working:

- [ ] Monitor the `/api/v1/health` endpoint
- [ ] Check Vercel Analytics for any errors
- [ ] Review Vercel function logs regularly
- [ ] Set up monitoring/alerts if needed
- [ ] Keep database credentials secure (don't commit to git)
- [ ] Update FRONTEND_URL if adding custom domain

## Security Checklist

- [ ] No secrets are in git commits (all in env vars)
- [ ] MONGODB_URI only in Vercel (not in code)
- [ ] JWT_SECRET only in Vercel (not in code)
- [ ] .env files are not committed
- [ ] HTTPS is enforced (Vercel does this by default)
- [ ] Rate limiting is enabled

## Final Verification

Run this command after deployment:

```bash
chmod +x validate-deployment.sh
./validate-deployment.sh
```

Should show:
- ✅ Status: 200 OK for root endpoint
- ✅ Status: 200 OK for health endpoint  
- ✅ Database is connected (if MONGODB_URI is set)
- ✅ Frontend is accessible
- ✅ API endpoints are responding

---

**You're ready to deploy! 🚀**

If anything isn't checked, see:
- `DEPLOYMENT_GUIDE.md` - Complete guide
- `TROUBLESHOOTING_503.md` - Detailed troubleshooting
- `DEPLOYMENT_QUICK_START.md` - Quick reference
