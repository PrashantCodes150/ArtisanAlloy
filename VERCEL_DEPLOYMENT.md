# Vercel Deployment Guide

## Prerequisites
1. GitHub account with this repository pushed
2. [Vercel](https://vercel.com) account (login with GitHub)

## Deploy Frontend to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (root, not api)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables (under "Environment Variables"):
   - `VITE_API_URL` = your Render backend URL (e.g., `https://Artisan-Alloy-backend.onrender.com/api/v1`)
   - `VITE_BACKEND_URL` = your Render backend URL (e.g., `https://Artisan-Alloy-backend.onrender.com`)
   - `VITE_APP_NAME` = `ArtisanAlloy`
   - `VITE_USE_MOCK_AUTH` = `false`
   - `VITE_RAZORPAY_KEY_ID` = your Razorpay key ID

6. Click **"Deploy"**

### Option 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Set production environment variables
vercel env add VITE_API_URL
vercel env add VITE_BACKEND_URL
# ... other vars

# Deploy to production
vercel --prod
```

## After Deployment

1. Copy your Vercel frontend URL (e.g., `https://Artisan-Alloy.vercel.app`)
2. Update your Render backend environment variable:
   - `FRONTEND_URL` = `https://Artisan-Alloy.vercel.app`
3. Restart your Render backend service

## Important Notes

### CORS Configuration
Make sure your backend allows requests from your Vercel frontend domain. The backend should already have CORS configured to accept requests from any origin in development, but for production:

1. Update your backend's CORS configuration to include your Vercel domain
2. Or use environment variables to set allowed origins

### Environment Variables
- Any new environment variables added to Vercel require a **redeploy** to take effect
- Use Vercel dashboard or `vercel env pull` to manage environment variables locally

## Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Click **"Domains"**
3. Add your custom domain (e.g., `Artisan-Alloy.com`)
4. Update DNS records as instructed by Vercel
5. Update `VITE_API_URL` to use your custom domain
