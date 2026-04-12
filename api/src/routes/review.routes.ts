import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getAllReviews,
  approveReview,
  respondToReview,
} from '../controllers/review.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.use(protect);
router.post('/product/:productId', createReview);
router.route('/:id').patch(updateReview).delete(deleteReview);
router.patch('/:id/helpful', markReviewHelpful);

// Admin only routes
router.use(restrictTo('admin', 'manager'));
router.get('/', getAllReviews);
router.patch('/:id/approve', approveReview);
router.patch('/:id/respond', respondToReview);

export default router;
