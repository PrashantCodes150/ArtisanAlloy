import { Router } from 'express';
import {
  getInventoryOverview,
  getLowStockProducts,
  getOutOfStockProducts,
  updateProductStock,
  bulkUpdateStock,
  getStockHistory,
  getInventoryAnalytics,
  setStockThreshold,
} from '../controllers/inventory.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// All inventory routes are protected and admin-only
router.use(protect);
router.use(restrictTo('admin', 'manager'));

// Overview and analytics
router.get('/overview', getInventoryOverview);
router.get('/analytics', getInventoryAnalytics);

// Stock status
router.get('/low-stock', getLowStockProducts);
router.get('/out-of-stock', getOutOfStockProducts);

// Stock management
router.patch('/update-stock/:productId', updateProductStock);
router.post('/bulk-update', bulkUpdateStock);
router.patch('/set-threshold/:productId', setStockThreshold);

// Stock history
router.get('/stock-history/:productId', getStockHistory);

export default router;