# F Jewelry E-Commerce Platform

A full-stack e-commerce platform for jewelry built with React, TypeScript, Express, and MongoDB.

## Project Structure

```
f-jewelry/
├── backend/           # Deploy to Render
│   ├── src/
│   │   ├── config/      # Database & auth config
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utilities
│   │   ├── validators/   # Input validation
│   │   ├── app.ts        # Express app
│   │   └── server.ts     # Server entry
│   ├── index.ts          # Serverless handler
│   ├── render.yaml       # Render deployment
│   └── package.json
│
├── frontend/         # Deploy to Vercel
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # React context
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utilities
│   ├── public/           # Static assets
│   ├── vercel.json       # Vercel deployment
│   └── package.json
│
└── README.md
```

## Quick Deployment

### 1. Deploy Backend to Render

1. Go to [render.com](https://render.com) and create an account
2. Click **New +** → **Blueprint**
3. Connect your GitHub repository
4. Select the `backend/render.yaml` file
5. Add environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure random string (min 32 characters)
   - `REFRESH_TOKEN_SECRET` - Another secure random string
   - `FRONTEND_URL` - Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
6. Click **Apply**

After deployment, note your backend URL (e.g., `https://your-backend.onrender.com`)

### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and create an account
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Set **Root Directory** to `frontend`
5. Add environment variables:
   - `VITE_API_URL` - Your Render backend URL + `/api/v1`
   - `VITE_BACKEND_URL` - Your Render backend URL
   - `VITE_RAZORPAY_KEY_ID` - Your Razorpay key
6. Click **Deploy**

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (backend/.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/f-jewelry
JWT_SECRET=your-jwt-secret-min-32-chars
REFRESH_TOKEN_SECRET=your-refresh-secret-min-32-chars
FRONTEND_URL=http://localhost:5173
```

### Frontend (frontend/.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_BACKEND_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your-razorpay-key
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/login` | User login |
| GET | `/api/v1/products` | List products |
| GET | `/api/v1/categories` | List categories |
| POST | `/api/v1/cart` | Cart operations |
| POST | `/api/v1/orders` | Create order |
| GET | `/api/v1/wishlist` | User wishlist |

## Features

- User authentication (JWT + Refresh tokens)
- Product catalog with categories
- Shopping cart
- Order management
- Wishlist
- Reviews and ratings
- Admin dashboard
- Responsive design
