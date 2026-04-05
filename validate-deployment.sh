#!/bin/bash

# F Jewelry - Deployment Validation Script
# Run this after deploying to Vercel to verify everything works

echo "================================"
echo "F Jewelry Deployment Validator"
echo "================================"
echo ""

# Get the domain from user
read -p "Enter your Vercel domain (e.g., my-project.vercel.app): " domain

if [ -z "$domain" ]; then
  echo "❌ Domain is required"
  exit 1
fi

# Add https if not present
if [[ ! "$domain" == https://* ]]; then
  domain="https://$domain"
fi

echo ""
echo "🔍 Testing: $domain"
echo ""

# Test 1: Root endpoint
echo "Test 1: Root Endpoint (/)"
echo "Command: curl $domain/"
response=$(curl -s -w "\n%{http_code}" "$domain/")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
  echo "✅ Status: 200 OK"
  echo "Response: $body"
else
  echo "❌ Status: $http_code"
  echo "Response: $body"
fi
echo ""

# Test 2: Health check endpoint
echo "Test 2: Health Check (/api/v1/health)"
echo "Command: curl $domain/api/v1/health"
response=$(curl -s -w "\n%{http_code}" "$domain/api/v1/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
  echo "✅ Status: 200 OK"
  echo "Response:"
  echo "$body" | jq '.' 2>/dev/null || echo "$body"
  
  # Check if database is connected
  if echo "$body" | grep -q '"databaseConnected":true'; then
    echo "✅ Database is connected!"
  else
    echo "⚠️  Database is not connected (this is OK if MONGODB_URI not set yet)"
  fi
else
  echo "❌ Status: $http_code"
  echo "Response: $body"
fi
echo ""

# Test 3: Frontend files
echo "Test 3: Frontend Files"
echo "Command: curl -I $domain/index.html"
response=$(curl -s -I "$domain/index.html")
http_code=$(echo "$response" | head -n1 | cut -d' ' -f2)

if [ "$http_code" = "200" ]; then
  echo "✅ Frontend is accessible (HTTP $http_code)"
else
  echo "❌ Frontend not accessible (HTTP $http_code)"
  echo "Response headers:"
  echo "$response"
fi
echo ""

# Test 4: Try auth endpoint
echo "Test 4: API Endpoints (POST /api/v1/auth/register)"
echo "Command: curl -X POST $domain/api/v1/auth/register"
response=$(curl -s -w "\n%{http_code}" \
  -X POST "$domain/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234","name":"Test"}')
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "201" ] || [ "$http_code" = "400" ] || [ "$http_code" = "409" ]; then
  echo "✅ API is responding (HTTP $http_code)"
  echo "Response (first 100 chars):"
  echo "$body" | jq '.' 2>/dev/null | head -c 100 || echo "$body" | head -c 100
  echo ""
elif [ "$http_code" = "503" ]; then
  echo "❌ API returning 503 Service Unavailable"
  echo "This likely means MongoDB connection is failing"
  echo "Check your MONGODB_URI environment variable in Vercel"
  echo "See TROUBLESHOOTING_503.md for more details"
else
  echo "⚠️  API returned HTTP $http_code"
  echo "Response: $body"
fi
echo ""

# Summary
echo "================================"
echo "Validation Summary"
echo "================================"
echo ""

if [ "$http_code" != "503" ]; then
  echo "✅ Deployment appears to be working!"
  echo ""
  echo "Next steps:"
  echo "1. Test login/register on the frontend"
  echo "2. Make an API call from the frontend"
  echo "3. Check Vercel dashboard for any error logs"
  echo "4. Monitor the /api/v1/health endpoint for DB status"
else
  echo "❌ There are issues with the deployment"
  echo ""
  echo "Troubleshooting:"
  echo "1. Check your MONGODB_URI is set in Vercel env vars"
  echo "2. Verify MongoDB IP whitelist includes 0.0.0.0/0"
  echo "3. Check Vercel function logs for errors"
  echo "4. See TROUBLESHOOTING_503.md for detailed fixes"
fi

echo ""
echo "📚 For detailed information, see:"
echo "   - DEPLOYMENT_GUIDE.md (complete setup guide)"
echo "   - TROUBLESHOOTING_503.md (debugging guide)"
echo "   - FIX_503_ERROR.md (what was fixed)"
echo ""
