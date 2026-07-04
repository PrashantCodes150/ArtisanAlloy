# ArtisanAlloy E-commerce - Complete Authentication System Setup Guide

This guide will help you set up and run the complete authentication system for ArtisanAlloy E-commerce website.

## 🚀 Features Implemented

### Backend Features
- ✅ Complete Node.js + Express.js server
- ✅ MongoDB with Mongoose ODM
- ✅ JWT Access & Refresh tokens with HttpOnly cookies
- ✅ Password hashing with bcrypt
- ✅ Google OAuth2 authentication
- ✅ Email verification
- ✅ Password reset functionality
- ✅ Two-Factor Authentication (2FA)
- ✅ Rate limiting and security middleware
- ✅ Comprehensive error handling
- ✅ User management APIs

### Frontend Features
- ✅ Complete React authentication system
- ✅ User Dashboard with statistics
- ✅ Profile management
- ✅ Wishlist functionality
- ✅ Order history and tracking
- ✅ Address management
- ✅ Feedback system
- ✅ Google OAuth integration
- ✅ Authentication persistence
- ✅ Responsive UI with Tailwind CSS
- ✅ Premium jewelry theme

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Google OAuth credentials (optional but recommended)

## 🗂️ Project Structure

```
Artisan-Alloy-react/
├── backend/                    # Node.js/Express server
│   ├── src/
│   │   ├── controllers/        # API controllers
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Utility functions
│   │   ├── config/           # Configuration files
│   │   └── server.ts        # Server entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
├── src/
│   ├── components/          # React components
│   ├── pages/              # React pages
│   ├── context/            # React contexts
│   ├── services/           # API services
│   └── ...
└── README.md
```

## 🛠️ Setup Instructions

### 1. Backend Setup

#### Step 1: Install Dependencies
```bash
cd backend
npm install
```

#### Step 2: Environment Variables
Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Update the following variables in `.env`:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/Artisan-Alloy

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-super-secure-refresh-token-secret-key-change-this-in-production
REFRESH_TOKEN_EXPIRES_IN=30d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=ArtisanAlloy <noreply@ArtisanAlloy.com>
```

#### Step 3: Google OAuth Setup (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Select "Web application"
6. Add authorized redirect URI: `http://localhost:5000/api/v1/auth/google/callback`
7. Copy Client ID and Client Secret to your `.env` file

#### Step 4: Start Backend Server
```bash
# Development
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

### 2. Frontend Setup

#### Step 1: Install Dependencies
```bash
cd ..  # Go back to root directory
npm install
```

#### Step 2: Environment Variables
Update the frontend `.env` file or create one:

```env
# API URL - Backend server URL
VITE_API_URL=http://localhost:5000/api/v1
```

#### Step 3: Start Frontend
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Database Setup

#### MongoDB Local (Option 1)
```bash
# Start MongoDB service
sudo service mongod start  # Linux/macOS
# or
net start MongoDB  # Windows
```

#### MongoDB Atlas (Option 2 - Recommended for Production)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in `.env`

## 🧪 Testing the Authentication System

### 1. User Registration
1. Navigate to `http://localhost:5173/register`
2. Fill in the registration form
3. Check email for verification link
4. Verify email account

### 2. Email Login
1. Navigate to `http://localhost:5173/login`
2. Enter email and password
3. Should redirect to dashboard on success

### 3. Google OAuth Login
1. Click "Sign in with Google" on login page
2. Complete Google authentication
3. Should redirect back to your app and create/log you in

### 4. Dashboard Features
1. View user statistics
2. Navigate through different sections:
   - Profile Management
   - Order History
   - Wishlist
   - Address Management
   - Feedback System

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/google` - Google OAuth initiate
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Forgot password
- `PATCH /api/v1/auth/reset-password/:token` - Reset password
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `POST /api/v1/auth/resend-verification` - Resend verification

### User Management
- `GET /api/v1/users/addresses` - Get user addresses
- `POST /api/v1/users/addresses` - Add address
- `PATCH /api/v1/users/addresses/:id` - Update address
- `DELETE /api/v1/users/addresses/:id` - Delete address

### Orders
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order details

### Wishlist
- `GET /api/v1/wishlist` - Get wishlist
- `POST /api/v1/wishlist` - Add to wishlist
- `DELETE /api/v1/wishlist/:id` - Remove from wishlist

## 🔐 Security Features

1. **JWT Tokens**: Secure access and refresh tokens
2. **HttpOnly Cookies**: Prevent XSS attacks
3. **Password Hashing**: bcrypt with salt rounds
4. **Rate Limiting**: Prevent brute force attacks
5. **Input Validation**: Sanitize all inputs
6. **CORS**: Proper cross-origin configuration
7. **Email Verification**: Prevent fake accounts
8. **Password Reset**: Secure reset flow
9. **2FA Support**: Optional two-factor authentication

## 🎨 UI Features

- Responsive design for all devices
- Premium jewelry theme with gold accents
- Smooth animations and transitions
- Loading states and error handling
- Professional dropdown menus
- Interactive dashboard
- Real-time updates

## 🚀 Deployment

### Backend Deployment

#### Option 1: Vercel
```bash
npm install -g vercel
cd backend
vercel --prod
```

#### Option 2: Heroku
```bash
# Install Heroku CLI
heroku create Artisan-Alloy-backend
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Option 3: DigitalOcean/AWS
1. Create a droplet/EC2 instance
2. Install Node.js and MongoDB
3. Clone repository and deploy using PM2

### Frontend Deployment

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## 📝 Environment Variables for Production

### Backend Production Environment
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=production-secret-key
MONGODB_URI=production-mongodb-connection-string
GOOGLE_CLIENT_ID=production-google-client-id
GOOGLE_CLIENT_SECRET=production-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-url.com/api/v1/auth/google/callback
```

### Frontend Production Environment
```env
VITE_API_URL=https://your-backend-url.com/api/v1
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check firewall settings

2. **Google OAuth Error**
   - Verify redirect URI matches exactly
   - Check if API is enabled in Google Console
   - Ensure Client ID and Secret are correct

3. **CORS Issues**
   - Check `FRONTEND_URL` in backend `.env`
   - Ensure frontend and backend URLs match

4. **Email Not Sending**
   - Verify email configuration
   - Check if using app password for Gmail
   - Verify SMTP settings

5. **Token Expired**
   - Refresh token should handle this automatically
   - Check token expiration times in `.env`

### Logs and Debugging

- Backend logs: Check console output for errors
- Frontend logs: Check browser console
- Network tab: Check API requests and responses

## 📞 Support

For any issues or questions:
1. Check the troubleshooting section
2. Review console logs
3. Verify environment variables
4. Check API endpoint availability

## 🎉 You're All Set!

Your ArtisanAlloy E-commerce website now has a complete, production-ready authentication system similar to Amazon, Myntra, and Flipkart!

### Key Features Working:
- ✅ Secure user registration and login
- ✅ Google OAuth integration
- ✅ Password reset and email verification
- ✅ Comprehensive user dashboard
- ✅ Order management and tracking
- ✅ Wishlist and address management
- ✅ Feedback system
- ✅ Professional UI/UX
- ✅ Security best practices
- ✅ Authentication persistence

The system is ready for production use and can handle real customer traffic securely and efficiently.