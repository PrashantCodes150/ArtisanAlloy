import { Request, Response, NextFunction } from 'express';
import { Product, Category } from '../models';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { APIFeatures } from '../utils/apiFeatures';

/**
 * Get all products with filtering, sorting, pagination
 * GET /api/v1/products
 */
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  // Build query with API features
  const features = new APIFeatures(Product.find({ isActive: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query.populate('category', 'name slug');
  
  // Get total count for pagination
  const totalQuery = new APIFeatures(Product.find({ isActive: true }), req.query).filter();
  const total = await Product.countDocuments(totalQuery.query.getFilter());

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 12,
    data: { products },
  });
});

/**
 * Get single product by ID
 * GET /api/v1/products/:id
 */
export const getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug type')
    .populate({
      path: 'reviews',
      select: 'rating title comment user createdAt',
      populate: { path: 'user', select: 'firstName lastName avatar' },
      options: { limit: 10, sort: { createdAt: -1 } },
    });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

/**
 * Get product by slug
 * GET /api/v1/products/slug/:slug
 */
export const getProductBySlug = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug type')
    .populate({
      path: 'reviews',
      select: 'rating title comment user createdAt isVerifiedPurchase',
      populate: { path: 'user', select: 'firstName lastName avatar' },
      options: { limit: 10, sort: { createdAt: -1 } },
    });

  if (!product) {
    return next(new AppError('No product found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

/**
 * Create new product (Admin only)
 * POST /api/v1/products
 */
export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Verify category exists
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }
  }

  const product = await Product.create(req.body);

  // Update category product count
  if (product.category) {
    await Category.findByIdAndUpdate(product.category, {
      $inc: { productsCount: 1 },
    });
  }

  res.status(201).json({
    status: 'success',
    data: { product },
  });
});

/**
 * Update product (Admin only)
 * PATCH /api/v1/products/:id
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

/**
 * Delete product (Admin only)
 * DELETE /api/v1/products/:id
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  // Update category product count
  if (product.category) {
    await Category.findByIdAndUpdate(product.category, {
      $inc: { productsCount: -1 },
    });
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * Get featured products
 * GET /api/v1/products/featured
 */
export const getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 8;
  
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug')
    .limit(limit)
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
});

/**
 * Get new arrivals
 * GET /api/v1/products/new-arrivals
 */
export const getNewArrivals = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 8;
  
  const products = await Product.find({ isActive: true, isNewArrival: true })
    .populate('category', 'name slug')
    .limit(limit)
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
});

/**
 * Get bestsellers
 * GET /api/v1/products/bestsellers
 */
export const getBestsellers = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 8;
  
  const products = await Product.find({ isActive: true, isBestseller: true })
    .populate('category', 'name slug')
    .limit(limit)
    .sort('-rating -reviewsCount');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: { products },
  });
});

/**
 * Get products by category
 * GET /api/v1/products/category/:categoryId
 */
export const getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const features = new APIFeatures(
    Product.find({ category: req.params.categoryId, isActive: true }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query.populate('category', 'name slug');
  const total = await Product.countDocuments({ category: req.params.categoryId, isActive: true });

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    data: { products },
  });
});

/**
 * Search products
 * GET /api/v1/products/search
 */
export const searchProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { q, limit = 20, page = 1 } = req.query;

  if (!q) {
    return next(new AppError('Search query is required', 400));
  }

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const products = await Product.find({
    isActive: true,
    $text: { $search: q as string },
  })
    .select({ score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(parseInt(limit as string))
    .populate('category', 'name slug');

  const total = await Product.countDocuments({
    isActive: true,
    $text: { $search: q as string },
  });

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    data: { products },
  });
});
