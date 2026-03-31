import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlistNotifications,
  checkInWishlist,
} from '../controllers/wishlist.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/add/:productId', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.delete('/clear', clearWishlist);
router.patch('/notifications/:productId', toggleWishlistNotifications);
router.get('/check/:productId', checkInWishlist);

export default router;
