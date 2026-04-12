import { Request, Response, NextFunction } from 'express';
import { Category } from '../models';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { APIFeatures } from '../utils/apiFeatures';

/**
 * Get all categories
 * GET /api/v1/categories
 */
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const features = new APIFeatures(Category.find({ isActive: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const categories = await features.query.populate('subcategories');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
});

/**
 * Get single category by ID
 * GET /api/v1/categories/:id
 */
export const getCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findById(req.params.id)
    .populate('subcategories')
    .populate('products');

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

/**
 * Get category by slug
 * GET /api/v1/categories/slug/:slug
 */
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    .populate('subcategories');

  if (!category) {
    return next(new AppError('No category found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

/**
 * Get categories by type
 * GET /api/v1/categories/type/:type
 */
export const getCategoriesByType = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find({ 
    type: req.params.type, 
    isActive: true 
  }).sort('order');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
});

/**
 * Get featured categories
 * GET /api/v1/categories/featured
 */
export const getFeaturedCategories = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 8;

  const categories = await Category.find({ 
    isActive: true, 
    isFeatured: true 
  })
    .limit(limit)
    .sort('order');

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: { categories },
  });
});

/**
 * Create new category (Admin only)
 * POST /api/v1/categories
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { category },
  });
});

/**
 * Update category (Admin only)
 * PATCH /api/v1/categories/:id
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { category },
  });
});

/**
 * Delete category (Admin only)
 * DELETE /api/v1/categories/:id
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('No category found with that ID', 404));
  }

  // Check if category has products
  if (category.productsCount > 0) {
    return next(new AppError('Cannot delete category with products. Remove products first.', 400));
  }

  // Check if category has subcategories
  const subcategories = await Category.countDocuments({ parent: req.params.id });
  if (subcategories > 0) {
    return next(new AppError('Cannot delete category with subcategories. Remove subcategories first.', 400));
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
