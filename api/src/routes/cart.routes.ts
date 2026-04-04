import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  syncCart,
} from '../controllers/cart.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.patch('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/apply-coupon', applyCoupon);
router.delete('/remove-coupon', removeCoupon);
router.post('/sync', syncCart); // Sync guest cart after login

export default router;
