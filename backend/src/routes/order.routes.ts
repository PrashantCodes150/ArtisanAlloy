import { Router } from 'express';
import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  verifyPayment,
  createRazorpayOrderHandler,
  razorpayWebhook,
  getRazorpayKey,
  getOrderStats,
} from '../controllers/order.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Razorpay webhook - must be before body parser middleware
// This route needs raw body for signature verification
router.post(
  '/webhook/razorpay',
  express.raw({ type: 'application/json' }),
  razorpayWebhook
);

// Public route to get Razorpay key
router.get('/razorpay-key', getRazorpayKey);

// All other order routes require authentication
router.use(protect);

// Customer routes
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrder);

// Payment routes
router.post('/create-razorpay-order', createRazorpayOrderHandler);
router.post('/verify-payment', verifyPayment);

// Admin only routes
router.use(restrictTo('admin', 'manager'));
router.get('/', getAllOrders);
router.patch('/:id/status', updateOrderStatus);
router.get('/stats/overview', getOrderStats);

export default router;
