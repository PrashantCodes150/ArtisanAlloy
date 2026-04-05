#!/bin/bash

set -e

echo "🚀 Starting GitHub push process..."

cd /vercel/share/v0-project

echo "📝 Checking git status..."
git status

echo "➕ Adding all changes to git..."
git add -A

echo "💬 Creating commit message..."
git commit -m "fix: resolve 503 service unavailable error

- Rewrite database connection middleware to be non-blocking
- Fix API request handling to prevent hanging on DB connection
- Update Vercel deployment configuration for proper routing
- Add graceful fallback for MongoDB session store
- Enhance error handler with specific MongoDB error detection
- Add comprehensive deployment and troubleshooting documentation
- Configure proper environment variables for production
- Optimize frontend and backend build settings

Changes made:
- api/index.ts: Non-blocking DB connection with background initialization
- api/src/app.ts: Safe session store initialization with fallbacks
- vercel.json: Updated build and route configuration
- api/src/middleware/errorHandler.ts: MongoDB error handling
- vite.config.ts: Frontend build optimization
- .env.production: Environment configuration template
- New docs: DEPLOYMENT_QUICK_START.md, TROUBLESHOOTING_503.md, etc.

This fixes the 503 errors on production deployment." || echo "No changes to commit"

echo "🔄 Pushing to GitHub (master branch)..."
git push origin master

echo "✅ Successfully pushed to GitHub!"
echo "📊 Commit details:"
git log -1 --oneline

echo "🎉 Push complete!"
