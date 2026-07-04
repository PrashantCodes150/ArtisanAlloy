# ArtisanAlloy - Quick Deployment Guide

**TL;DR**: Deploy to Vercel in 5 minutes

## The 503 Error Has Been Fixed! ✅

All code changes are complete. You just need to:
1. Configure environment variables
2. Redeploy

## 5-Minute Quick Start

### 1. Generate Secret Keys (2 minutes)

```bash
# Open terminal and run:
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

Save these outputs - you'll need them soon.

### 2. Add Environment Variables to Vercel (2 minutes)

1. Go to: **vercel.com** → Your Project → **Settings** → **Environment Variables**

2. Add these variables (most critical first):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Artisan-Alloy?retryWrites=true&w=majority
JWT_SECRET=(paste the first generated key)
REFRESH_TOKEN_SECRET=(paste the second generated key)
FRONTEND_URL=https://your-vercel-domain.vercel.app
NODE_ENV=production
VITE_API_URL=/api/v1
```

3. Optional (for features):
```
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

### 3. Deploy (1 minute)

**Option A: If using GitHub**
```bash
git add .
git commit -m "fix: Deploy 503 error fix"
git push
```
Vercel automatically deploys.

**Option B: Manual redeploy**
1. Go to Vercel dashboard
2. Click your project
3. Click "Deployments" tab
4. Click latest deployment
5. Click "Redeploy"

### 4. Test (Optional but recommended)

```bash
# Check if API is running:
curl https://your-domain.vercel.app/api/v1/health

# Or use the validation script:
chmod +x validate-deployment.sh
./validate-deployment.sh
```

Expected response:
```json
{
  "status": "success",
  "message": "ArtisanAlloy API is running! 💎",
  "databaseConnected": true,
  "environment": "production"
}
```

## What If It Still Returns 503?

Follow the **Troubleshooting** section in this order:

1. **Check MongoDB**
   - Go to MongoDB Atlas → Network Access
   - Is IP `0.0.0.0/0` whitelisted?
   - If no, add it

2. **Check Environment Variables**
   - Is `MONGODB_URI` set in Vercel?
   - Are `JWT_SECRET` and `REFRESH_TOKEN_SECRET` set?
   - If you added/changed any, you must redeploy

3. **Redeploy**
   - Go to Vercel → Deployments → Redeploy latest

4. **Check Logs**
   - Vercel Dashboard → Deployments → click latest → Function Logs
   - Look for error messages

## Common Issues

| Issue | Solution |
|-------|----------|
| 503 after deploy | Add MONGODB_URI env var and redeploy |
| Variables not loading | Must redeploy after adding env vars |
| DB "disconnected" | Whitelist IP in MongoDB Atlas |
| CORS errors | Check FRONTEND_URL matches your domain |
| Auth fails | Generate new JWT_SECRET, add to Vercel |

## Documentation Files

For more details, see:

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE.md` | Complete setup instructions |
| `TROUBLESHOOTING_503.md` | Detailed debugging guide |
| `FIX_503_ERROR.md` | What was fixed and why |
| `VERCEL_SETUP.sh` | Automated setup script |
| `validate-deployment.sh` | Test your deployment |

## MongoDB Setup (If Needed)

If you don't have MongoDB Atlas set up:

1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster
4. Create database user with password
5. Get connection string (in Connect button)
6. Allow IP 0.0.0.0/0 in Network Access

Connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/Artisan-Alloy?retryWrites=true&w=majority
```

## Environment Variables Reference

```
# REQUIRED (must set these)
MONGODB_URI=          # MongoDB connection string
JWT_SECRET=           # Random 32-char key
REFRESH_TOKEN_SECRET= # Another random 32-char key

# IMPORTANT (set to your domain)
FRONTEND_URL=         # Your Vercel domain

# OPTIONAL (for features)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_CLOUD_NAME=
```

## One-Line Summary

**Just set MONGODB_URI, JWT_SECRET, and REFRESH_TOKEN_SECRET in Vercel env vars, redeploy, and you're done! 🚀**

## Still Stuck?

1. Read `TROUBLESHOOTING_503.md`
2. Check Vercel function logs
3. Verify MongoDB connection string
4. Ensure MongoDB IP whitelist includes 0.0.0.0/0
5. Try validating: `./validate-deployment.sh`

---

**You've got this! 💎**
