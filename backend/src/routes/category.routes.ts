import { Router } from 'express';
import {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
  getCategoriesByType,
  getFeaturedCategories,
} from '../controllers/category.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/featured', getFeaturedCategories);
router.get('/type/:type', getCategoriesByType);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategory);

// Admin only routes
router.use(protect);
router.use(restrictTo('admin', 'manager'));
router.post('/', createCategory);
router.route('/:id').patch(updateCategory).delete(deleteCategory);

export default router;
