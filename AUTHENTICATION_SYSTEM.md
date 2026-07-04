# 🔐 Complete Authentication System for ArtisanAlloy

This authentication system provides a production-ready, secure authentication solution with jewelry-themed UI components for the ArtisanAlloy e-commerce platform.

## ✨ Features

### Backend Features
- **JWT Authentication** with Access & Refresh tokens
- **Two-Factor Authentication (2FA)** with TOTP and backup codes
- **Email Verification** for account activation
- **Password Reset** with secure token-based flow
- **Role-Based Access Control** (customer, admin, manager)
- **Token Rotation** for enhanced security
- **Rate Limiting** and security headers
- **MongoDB Integration** with Mongoose

### Frontend Features
- **Beautiful Jewelry-Themed UI** with gradient designs
- **Complete Auth Pages**: Login, Register, Forgot Password, Reset Password
- **2FA Support**: Setup and verification pages
- **Email Verification** flow
- **Auto Token Refresh** with interceptors
- **Protected Routes** with context management
- **Responsive Design** with Tailwind CSS

## 🗂️ Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── auth.controller.ts      # Auth controllers
│   ├── middleware/
│   │   └── auth.middleware.ts     # Auth middleware
│   ├── models/
│   │   └── User.model.ts          # User schema & methods
│   ├── routes/
│   │   └── auth.routes.ts         # Auth routes
│   ├── utils/
│   │   └── jwtUtils.ts            # JWT utilities
│   └── server.ts                 # Express server
├── .env.example                  # Environment template
└── package.json
```

### Frontend Structure
```
src/
├── context/
│   └── AuthContext.tsx           # Auth state management
├── pages/
│   ├── Login.tsx                  # Login page
│   ├── Register.tsx              # Registration page
│   ├── ForgotPassword.tsx         # Forgot password
│   ├── ResetPassword.tsx          # Reset password
│   ├── TwoFactorVerify.tsx        # 2FA verification
│   └── TwoFactorSetup.tsx        # 2FA setup
├── services/
│   ├── auth.service.ts           # Auth API service
│   └── api.ts                   # Axios configuration
└── App.tsx                      # Route configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB (if running locally)
mongod

# Start backend server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to root directory
cd ..

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```

### 3. Environment Configuration

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/Artisan-Alloy

# JWT Secrets (change in production!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-chars

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=ArtisanAlloy <noreply@Artisan-Alloy.com>

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=ArtisanAlloy
```

## 🔧 API Endpoints

### Authentication Routes
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh-token` - Refresh access token
- `GET /auth/me` - Get current user

### Password Management
- `POST /auth/forgot-password` - Request password reset
- `PATCH /auth/reset-password/:token` - Reset password
- `PATCH /auth/update-password` - Update password (authenticated)

### Email Verification
- `GET /auth/verify-email/:token` - Verify email
- `POST /auth/resend-verification` - Resend verification email
- `GET /auth/verification-status` - Get verification status

### Two-Factor Authentication
- `POST /auth/enable-2fa` - Enable 2FA
- `POST /auth/verify-2fa-setup` - Verify 2FA setup
- `POST /auth/disable-2fa` - Disable 2FA
- `POST /auth/verify-2fa-login` - Verify 2FA during login
- `POST /auth/generate-backup-codes` - Generate backup codes

## 🎨 UI Components

### Authentication Pages

#### Login Page (`/login`)
- Email and password fields
- Remember me option
- Forgot password link
- 2FA integration
- Jewelry-themed gradient design

#### Register Page (`/register`)
- First name, last name, email, phone
- Password with strength requirements
- Terms of service agreement
- Member benefits section
- Beautiful gradient styling

#### Two-Factor Authentication (`/two-factor-verify`)
- 6-digit TOTP code input
- Backup code option
- Clear instructions
- Auto-focus support

#### Password Management
- **Forgot Password**: Email-based reset request
- **Reset Password**: Secure token-based reset
- Success states with proper messaging

## 🔒 Security Features

### Backend Security
- **JWT with RS256** algorithm
- **Access/Refresh token** pattern
- **Password hashing** with bcrypt (cost 12)
- **Rate limiting** on authentication endpoints
- **Input validation** and sanitization
- **CORS configuration**
- **Security headers** with Helmet
- **XSS protection**

### Frontend Security
- **Automatic token refresh** on 401 errors
- **Secure token storage** in localStorage
- **Request/response interceptors**
- **Input validation** on forms
- **Protected routes** with context

## 📱 Responsive Design

All authentication pages feature:
- **Mobile-first** responsive design
- **Touch-friendly** form elements
- **Accessible** ARIA labels
- **Loading states** and error handling
- **Jewelry-themed** color schemes

## 🔄 Auth Flow

### Registration Flow
1. User fills registration form
2. Frontend validates input
3. API creates user (hashed password)
4. Email verification token generated
5. Verification email sent
6. User redirected to login
7. User receives and clicks verification link
8. Email verified, full access granted

### Login Flow
1. User enters credentials
2. Frontend validates and sends to API
3. API validates credentials
4. If 2FA enabled → temporary token
5. User enters 2FA code or backup code
6. Access and refresh tokens generated
7. Tokens stored and user logged in

### Token Management
- **Access Token**: Short-lived (7 days)
- **Refresh Token**: Long-lived (30 days)
- **Auto-refresh**: On token expiration
- **Rotation**: Refresh tokens updated on use

## 🛠️ Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Frontend
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📊 Database Schema

### User Model
```typescript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: 'customer' | 'admin' | 'manager',
  isActive: Boolean,
  isEmailVerified: Boolean,
  addresses: [AddressSchema],
  refreshTokens: [String],
  
  // 2FA fields
  twoFactorEnabled: Boolean,
  twoFactorSecret: String,
  twoFactorBackupCodes: [String],
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

## 🎯 Production Deployment

### Environment Setup
1. **Update all secrets** in production
2. **Configure HTTPS** with SSL certificates
3. **Set up MongoDB Atlas** for production database
4. **Configure email service** (SendGrid, AWS SES)
5. **Set up monitoring** and logging

### Security Checklist
- [ ] Change all default secrets
- [ ] Enable HTTPS everywhere
- [ ] Configure proper CORS
- [ ] Set up rate limiting
- [ ] Enable monitoring and alerts
- [ ] Configure backup strategy
- [ ] Set up log aggregation

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure security best practices

## 📞 Support

For issues related to authentication:
1. Check the browser console for errors
2. Verify backend server is running
3. Check MongoDB connection
4. Review environment configuration

---

**Built with ❤️ for ArtisanAlloy - Your Premium Jewelry Destination**