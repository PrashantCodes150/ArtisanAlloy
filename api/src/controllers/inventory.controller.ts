import { Request, Response, NextFunction } from 'express';
import { Product } from '../models';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * Get inventory overview
 * GET /api/v1/inventory/overview
 */
export const getInventoryOverview = asyncHandler(async (req: Request, res: Response) => {
  const [
    totalProducts,
    inStockProducts,
    lowStockProducts,
    outOfStockProducts,
    totalStockValue
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true, stock: { $gt: 0 } }),
    Product.countDocuments({ 
      isActive: true, 
      stock: { $gt: 0, $lte: '$lowStockThreshold' } 
    }),
    Product.countDocuments({ isActive: true, stock: 0 }),
    Product.aggregate([
      { $match: { isActive: true, stock: { $gt: 0 } } },
      { $group: { _id: null, totalValue: { $sum: { $multiply: ['$stock', '$price'] } } } }
    ])
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalProducts,
      inStockProducts,
      lowStockProducts,
      outOfStockProducts,
      totalStockValue: totalStockValue[0]?.totalValue || 0,
      stockStatus: {
        inStockPercentage: totalProducts > 0 ? Math.round((inStockProducts / totalProducts) * 100) : 0,
        lowStockPercentage: totalProducts > 0 ? Math.round((lowStockProducts / totalProducts) * 100) : 0,
        outOfStockPercentage: totalProducts > 0 ? Math.round((outOfStockProducts / totalProducts) * 100) : 0,
      }
    }
  });
});

/**
 * Get low stock products
 * GET /api/v1/inventory/low-stock
 */
export const getLowStockProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const lowStockProducts = await Product.find({
    isActive: true,
    inventoryTracked: true,
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    stock: { $gt: 0 }
  })
  .populate('category', 'name')
  .sort({ stock: 1 })
  .skip(skip)
  .limit(limit);

  const total = await Product.countDocuments({
    isActive: true,
    inventoryTracked: true,
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    stock: { $gt: 0 }
  });

  res.status(200).json({
    status: 'success',
    results: lowStockProducts.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: {
      products: lowStockProducts
    }
  });
});

/**
 * Get out of stock products
 * GET /api/v1/inventory/out-of-stock
 */
export const getOutOfStockProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const outOfStockProducts = await Product.find({
    isActive: true,
    inventoryTracked: true,
    stock: 0
  })
  .populate('category', 'name')
  .sort({ updatedAt: -1 })
  .skip(skip)
  .limit(limit);

  const total = await Product.countDocuments({
    isActive: true,
    inventoryTracked: true,
    stock: 0
  });

  res.status(200).json({
    status: 'success',
    results: outOfStockProducts.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: {
      products: outOfStockProducts
    }
  });
});

/**
 * Update product stock
 * PATCH /api/v1/inventory/update-stock/:productId
 */
export const updateProductStock = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { newStock, reason, batchId } = req.body;

  if (newStock === undefined || newStock < 0) {
    return next(new AppError('Valid stock quantity is required', 400));
  }

  const product = await Product.findById(productId);
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const oldStock = product.stock;
  await product.updateStock(newStock, reason || 'Manual stock update', batchId);

  logger.info(`Stock updated for product ${product.name}: ${oldStock} -> ${newStock}`);

  res.status(200).json({
    status: 'success',
    message: 'Stock updated successfully',
    data: {
      productId: product._id,
      productName: product.name,
      oldStock,
      newStock,
      stockLevel: product.getStockLevel()
    }
  });
});

/**
 * Bulk update stock
 * POST /api/v1/inventory/bulk-update
 */
export const bulkUpdateStock = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { updates } = req.body;

  if (!updates || !Array.isArray(updates) || updates.length === 0) {
    return next(new AppError('Valid updates array is required', 400));
  }

  const results = [];
  const errors = [];

  for (const update of updates) {
    try {
      const product = await Product.findById(update.productId);
      
      if (!product) {
        errors.push({
          productId: update.productId,
          error: 'Product not found'
        });
        continue;
      }

      const oldStock = product.stock;
      await product.updateStock(
        update.newStock, 
        update.reason || 'Bulk update', 
        update.batchId
      );

      results.push({
        productId: product._id,
        productName: product.name,
        oldStock,
        newStock: update.newStock,
        success: true
      });

    } catch (error) {
      errors.push({
        productId: update.productId,
        error: error instanceof Error ? error.message : 'Update failed'
      });
    }
  }

  logger.info(`Bulk stock update completed: ${results.length} successful, ${errors.length} failed`);

  res.status(200).json({
    status: 'success',
    message: `Updated ${results.length} products successfully`,
    data: {
      successful: results,
      failed: errors,
      summary: {
        total: updates.length,
        successful: results.length,
        failed: errors.length
      }
    }
  });
});

/**
 * Get stock history for a product
 * GET /api/v1/inventory/stock-history/:productId
 */
export const getStockHistory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  const product = await Product.findById(productId)
    .select('name sku stockHistory')
    .populate('stockHistory.userId', 'firstName lastName');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const total = product.stockHistory.length;
  const history = product.stockHistory
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(skip, skip + limit);

  res.status(200).json({
    status: 'success',
    results: history.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: {
      product: {
        id: product._id,
        name: product.name,
        sku: product.sku,
        currentStock: product.stock
      },
      history
    }
  });
});

/**
 * Get inventory analytics
 * GET /api/v1/inventory/analytics
 */
export const getInventoryAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { period = '30' } = req.query;
  const days = parseInt(period as string);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [
    topSellingProducts,
    slowMovingProducts,
    categoryPerformance,
    stockTrends
  ] = await Promise.all([
    // Top selling products (mock - would need order data in real implementation)
    Product.find({ isActive: true, inventoryTracked: true })
      .populate('category', 'name')
      .sort({ stock: -1 })
      .limit(10)
      .select('name sku stock price category'),
    
    // Slow moving products
    Product.find({ 
      isActive: true, 
      inventoryTracked: true,
      updatedAt: { $lt: startDate }
    })
    .populate('category', 'name')
    .sort({ updatedAt: 1 })
    .limit(10)
    .select('name sku stock price category updatedAt'),
    
    // Category performance
    Product.aggregate([
      { $match: { isActive: true } },
      { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          totalValue: { $sum: { $multiply: ['$stock', '$price'] } },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { totalValue: -1 } }
    ]),
    
    // Stock trends (mock data - would need historical data)
    {
      totalProducts: await Product.countDocuments({ isActive: true }),
      totalStock: await Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$stock' } } }
      ]),
      lowStockCount: await Product.countDocuments({
        isActive: true,
        inventoryTracked: true,
        stock: { $gt: 0, $lte: 20 }
      }),
      outOfStockCount: await Product.countDocuments({
        isActive: true,
        inventoryTracked: true,
        stock: 0
      })
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      topSellingProducts,
      slowMovingProducts,
      categoryPerformance,
      stockTrends,
      period: `${days} days`
    }
  });
});

/**
 * Set low stock alert threshold
 * PATCH /api/v1/inventory/set-threshold/:productId
 */
export const setStockThreshold = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { lowStockThreshold, reorderPoint } = req.body;

  const product = await Product.findById(productId);
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (lowStockThreshold !== undefined) {
    product.lowStockThreshold = lowStockThreshold;
  }
  
  if (reorderPoint !== undefined) {
    product.reorderPoint = reorderPoint;
  }

  await product.save({ validateBeforeSave: false });

  logger.info(`Stock thresholds updated for product ${product.name}: lowStock=${lowStockThreshold}, reorder=${reorderPoint}`);

  res.status(200).json({
    status: 'success',
    message: 'Stock thresholds updated successfully',
    data: {
      productId: product._id,
      lowStockThreshold: product.lowStockThreshold,
      reorderPoint: product.reorderPoint
    }
  });
});