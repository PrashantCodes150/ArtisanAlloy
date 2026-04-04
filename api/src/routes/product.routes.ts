import { Router } from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getBestsellers,
  getProductsByCategory,
  searchProducts,
} from '../controllers/product.controller';
import { protect, restrictTo, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', optionalAuth, getAllProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/bestsellers', getBestsellers);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', optionalAuth, getProduct);

// Admin only routes
router.use(protect);
router.use(restrictTo('admin', 'manager'));
router.post('/', createProduct);
router.route('/:id').patch(updateProduct).delete(deleteProduct);

export default router;
