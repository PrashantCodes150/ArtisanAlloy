import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Wishlist, Product, IWishlistItem } from '../models';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Get user's wishlist
 * GET /api/v1/wishlist
 */
export const getWishlist = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const wishlist = await Wishlist.findOne({ user: req.user!._id }).populate({
    path: 'items.product',
    select: 'name slug price originalPrice images rating stock isActive',
  });

  if (!wishlist) {
    // Return empty wishlist if none exists
    return res.status(200).json({
      status: 'success',
      results: 0,
      data: { wishlist: { items: [] } },
    });
  }

  // Filter out inactive products
  const activeItems = wishlist.items.filter((item: IWishlistItem) => (item.product as any)?.isActive);

  res.status(200).json({
    status: 'success',
    results: activeItems.length,
    data: { 
      wishlist: {
        ...wishlist.toObject(),
        items: activeItems,
      }
    },
  });
});

/**
 * Add product to wishlist
 * POST /api/v1/wishlist/add/:productId
 */
export const addToWishlist = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  // Verify product exists
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  let wishlist = await Wishlist.findOne({ user: req.user!._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user!._id, items: [] });
  }

  // Check if product already in wishlist
  const exists = wishlist.items.some(
    (item) => item.product.toString() === productId
  );

  if (exists) {
    return next(new AppError('Product already in wishlist', 400));
  }

  wishlist.items.push({
    product: new mongoose.Types.ObjectId(productId),
    addedAt: new Date(),
    notifyOnSale: false,
    notifyOnStock: false,
  });

  await wishlist.save();

  await wishlist.populate({
    path: 'items.product',
    select: 'name slug price originalPrice images rating stock isActive',
  });

  res.status(200).json({
    status: 'success',
    message: 'Product added to wishlist',
    data: { wishlist },
  });
});

/**
 * Remove product from wishlist
 * DELETE /api/v1/wishlist/remove/:productId
 */
export const removeFromWishlist = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user!._id });

  if (!wishlist) {
    return next(new AppError('Wishlist not found', 404));
  }

  const itemIndex = wishlist.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new AppError('Product not in wishlist', 404));
  }

  wishlist.items.splice(itemIndex, 1);
  await wishlist.save();

  await wishlist.populate({
    path: 'items.product',
    select: 'name slug price originalPrice images rating stock isActive',
  });

  res.status(200).json({
    status: 'success',
    message: 'Product removed from wishlist',
    data: { wishlist },
  });
});

/**
 * Clear wishlist
 * DELETE /api/v1/wishlist/clear
 */
export const clearWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await Wishlist.findOne({ user: req.user!._id });

  if (wishlist) {
    wishlist.items = [];
    await wishlist.save();
  }

  res.status(200).json({
    status: 'success',
    message: 'Wishlist cleared',
    data: { wishlist },
  });
});

/**
 * Toggle notifications for a wishlist item
 * PATCH /api/v1/wishlist/notifications/:productId
 */
export const toggleWishlistNotifications = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { notifyOnSale, notifyOnStock } = req.body;

  const wishlist = await Wishlist.findOne({ user: req.user!._id });

  if (!wishlist) {
    return next(new AppError('Wishlist not found', 404));
  }

  const itemIndex = wishlist.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new AppError('Product not in wishlist', 404));
  }

  if (notifyOnSale !== undefined) {
    wishlist.items[itemIndex].notifyOnSale = notifyOnSale;
  }
  if (notifyOnStock !== undefined) {
    wishlist.items[itemIndex].notifyOnStock = notifyOnStock;
  }

  await wishlist.save();

  res.status(200).json({
    status: 'success',
    message: 'Notification preferences updated',
    data: { item: wishlist.items[itemIndex] },
  });
});

/**
 * Check if product is in wishlist
 * GET /api/v1/wishlist/check/:productId
 */
export const checkInWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user!._id });

  const isInWishlist = wishlist?.items.some(
    (item) => item.product.toString() === productId
  ) || false;

  res.status(200).json({
    status: 'success',
    data: { isInWishlist },
  });
});