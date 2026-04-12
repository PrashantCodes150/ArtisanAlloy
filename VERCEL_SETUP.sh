#!/bin/bash

# F Jewelry - Vercel Deployment Setup Script
# This script helps configure environment variables for Vercel deployment

echo "================================"
echo "F Jewelry - Vercel Setup"
echo "================================"
echo ""

# Generate secure random strings
generate_key() {
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

# Check if node is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js first."
  exit 1
fi

echo "📝 Creating .env.local for development..."
echo ""

# Prompt for critical values
read -p "Enter your MongoDB Atlas connection string (MONGODB_URI): " mongodb_uri
read -p "Enter your Frontend URL (e.g., https://f-jewelry.vercel.app): " frontend_url
read -p "Enter your Google Client ID: " google_client_id
read -p "Enter your Google Client Secret: " google_client_secret
read -p "Enter your Razorpay Key ID: " razorpay_key_id
read -p "Enter your Razorpay Key Secret: " razorpay_key_secret

# Generate secure keys
echo ""
echo "🔐 Generating secure keys..."
jwt_secret=$(generate_key)
refresh_token_secret=$(generate_key)

# Create .env.local file
cat > .env.local << EOF
# F Jewelry - Development Environment Variables

# ===== FRONTEND CONFIGURATION =====
VITE_API_URL=/api/v1
VITE_BACKEND_URL=
VITE_APP_NAME=F Jewelry
VITE_USE_MOCK_AUTH=false
VITE_RAZORPAY_KEY_ID=$razorpay_key_id

# ===== BACKEND CONFIGURATION =====
NODE_ENV=development
PORT=5000

# ===== DATABASE =====
MONGODB_URI=$mongodb_uri

# ===== SECURITY KEYS =====
JWT_SECRET=$jwt_secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
REFRESH_TOKEN_SECRET=$refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d

# ===== FRONTEND URL =====
FRONTEND_URL=$frontend_url

# ===== GOOGLE OAUTH =====
GOOGLE_CLIENT_ID=$google_client_id
GOOGLE_CLIENT_SECRET=$google_client_secret
GOOGLE_CALLBACK_URL=$frontend_url/api/v1/auth/google/callback

# ===== RAZORPAY =====
RAZORPAY_KEY_ID=$razorpay_key_id
RAZORPAY_KEY_SECRET=$razorpay_key_secret

# ===== RATE LIMITING =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

echo "✅ Created .env.local"
echo ""
echo "📋 Environment Variables to Add to Vercel Dashboard:"
echo "=================================================="
echo ""
echo "1. MONGODB_URI=$mongodb_uri"
echo "2. JWT_SECRET=$jwt_secret"
echo "3. REFRESH_TOKEN_SECRET=$refresh_token_secret"
echo "4. FRONTEND_URL=$frontend_url"
echo "5. GOOGLE_CLIENT_ID=$google_client_id"
echo "6. GOOGLE_CLIENT_SECRET=$google_client_secret"
echo "7. GOOGLE_CALLBACK_URL=$frontend_url/api/v1/auth/google/callback"
echo "8. RAZORPAY_KEY_ID=$razorpay_key_id"
echo "9. RAZORPAY_KEY_SECRET=$razorpay_key_secret"
echo ""
echo "=================================================="
echo ""
echo "✨ Setup Complete!"
echo ""
echo "Next Steps:"
echo "1. Copy the environment variables above"
echo "2. Go to Vercel Dashboard → Settings → Environment Variables"
echo "3. Add all the variables listed above"
echo "4. Deploy: git push (if using GitHub integration)"
echo ""
echo "To verify deployment:"
echo "curl https://<your-vercel-domain>.vercel.app/api/v1/health"
echo ""
