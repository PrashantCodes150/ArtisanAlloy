# F-Jewelry Deployment Guide

## Project Structure

```
f-jewelry-react/
├── api/                    # Backend (Deploy to Render)
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── render.yaml        # Render Blueprint (optional)
│   └── .env.example
├── src/                   # Frontend (Deploy to Vercel)
├── package.json
├── vercel.json
└── .env.example
```

## Step 1: Deploy Backend to Render

### Option A: Using render.yaml Blueprint (Recommended)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → "New +" → "Blueprint"
3. Connect your GitHub repo
4. Render auto-detects `api/render.yaml`
5. Add environment variables in Render dashboard:
   - `MONGODB_URI` (MongoDB Atlas connection string)
   - `JWT_SECRET` (min 32 char random string)
   - `REFRESH_TOKEN_SECRET` (min 32 char random string)
   - `FRONTEND_URL` (add later after Vercel deployment)
   - Other vars from `api/.env.example`

### Option B: Manual Web Service

1. Go to [render.com](https://render.com) → "New +" → "Web Service"
2. Connect GitHub, select repo
3. Configure:
   - **Root Directory**: `api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Add environment variables
5. Deploy

### Backend Environment Variables Required

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `REFRESH_TOKEN_SECRET` | Refresh token secret |
| `FRONTEND_URL` | Vercel frontend URL (e.g., `https://f-jewelry.vercel.app`) |
| `ALLOWED_ORIGINS` | Comma-separated additional domains (optional) |

## Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework**: `Vite`
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api/v1` |
| `VITE_BACKEND_URL` | `https://your-backend.onrender.com` |
| `VITE_APP_NAME` | `F Jewelry` |
| `VITE_USE_MOCK_AUTH` | `false` |
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay key |

5. Deploy

## Step 3: Connect Frontend & Backend

After both deployments:

1. Copy your **Vercel frontend URL** (e.g., `https://f-jewelry.vercel.app`)
2. In Render dashboard, update backend env var:
   - `FRONTEND_URL` = your Vercel URL
3. Restart the Render service

## CORS Notes

The backend CORS allows:
- `FRONTEND_URL` environment variable
- `VERCEL_URL` (auto-detected on Vercel)
- `ALLOWED_ORIGINS` (comma-separated list)
- `localhost:5173` and `localhost:3000` (dev only)

## Local Development

```bash
# Backend
cd api
npm install
cp .env.example .env  # Edit with your values
npm run dev

# Frontend
npm install
cp .env.example .env  # Set VITE_API_URL=http://localhost:5000/api/v1
npm run dev
```

## Troubleshooting

### Cold Start (Render Free Tier)
- First request after 15min idle takes ~30s - normal for free tier

### CORS Errors
- Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check for trailing slashes mismatch

### Build Fails
- Ensure Node.js version >= 18 in Render settings
- Check build logs for missing dependencies
