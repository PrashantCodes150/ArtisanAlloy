import { Request, Response, NextFunction } from 'express';
import { Cart, Product, Coupon } from '../models';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Get user's cart
 * GET /api/v1/cart
 */
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  let cart = await Cart.findOne({ user: req.user!._id })
    .populate({
      path: 'items.product',
      select: 'name slug price originalPrice images stock isActive',
    });

  if (!cart) {
    cart = await Cart.create({ user: req.user!._id, items: [] });
  }

  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

/**
 * Add item to cart
 * POST /api/v1/cart/add
 */
export const addToCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity = 1, variantId } = req.body;

  // Verify product exists and is active
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    return next(new AppError('Product not found or unavailable', 404));
  }

  // Check stock
  if (product.stock < quantity) {
    return next(new AppError(`Only ${product.stock} items available in stock`, 400));
  }

  // Find or create cart
  let cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user!._id, items: [] });
  }

  // Use the cart's addItem method
  await cart.addItem(productId, quantity, product.price, variantId);
  await cart.save();

  // Populate and return
  await cart.populate({
    path: 'items.product',
    select: 'name slug price originalPrice images stock isActive',
  });

  res.status(200).json({
    status: 'success',
    message: 'Item added to cart',
    data: { cart },
  });
});

/**
 * Update cart item quantity
 * PATCH /api/v1/cart/item/:itemId
 */
export const updateCartItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { quantity } = req.body;

  if (quantity < 1) {
    return next(new AppError('Quantity must be at least 1', 400));
  }

  const cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id?.toString() === req.params.itemId
  );

  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart', 404));
  }

  // Check stock
  const product = await Product.findById(cart.items[itemIndex].product);
  if (!product || product.stock < quantity) {
    return next(new AppError(`Only ${product?.stock || 0} items available in stock`, 400));
  }

  cart.updateItemQuantity(cart.items[itemIndex]._id!, quantity);
  await cart.save();

  await cart.populate({
    path: 'items.product',
    select: 'name slug price originalPrice images stock isActive',
  });

  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

/**
 * Remove item from cart
 * DELETE /api/v1/cart/item/:itemId
 */
export const removeFromCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id?.toString() === req.params.itemId
  );

  if (itemIndex === -1) {
    return next(new AppError('Item not found in cart', 404));
  }

  cart.removeItem(cart.items[itemIndex]._id!);
  await cart.save();

  await cart.populate({
    path: 'items.product',
    select: 'name slug price originalPrice images stock isActive',
  });

  res.status(200).json({
    status: 'success',
    message: 'Item removed from cart',
    data: { cart },
  });
});

/**
 * Clear cart
 * DELETE /api/v1/cart/clear
 */
export const clearCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ user: req.user!._id });
  if (cart) {
    cart.clearCart();
    await cart.save();
  }

  res.status(200).json({
    status: 'success',
    message: 'Cart cleared',
    data: { cart },
  });
});

/**
 * Apply coupon to cart
 * POST /api/v1/cart/apply-coupon
 */
export const applyCoupon = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.body;

  if (!code) {
    return next(new AppError('Coupon code is required', 400));
  }

  const cart = await Cart.findOne({ user: req.user!._id });
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Your cart is empty', 400));
  }

  // Find valid coupon
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() },
  });

  if (!coupon) {
    return next(new AppError('Invalid or expired coupon code', 400));
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return next(new AppError('Coupon usage limit reached', 400));
  }

  // Check minimum purchase
  if (coupon.minOrderAmount && cart.subtotal < coupon.minOrderAmount) {
    return next(new AppError(`Minimum purchase of ₹${coupon.minOrderAmount} required for this coupon`, 400));
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = (cart.subtotal * coupon.value) / 100;
    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else {
    discountAmount = coupon.value;
  }

  // Apply discount to cart
  cart.discountCode = coupon.code;
  cart.discount = discountAmount;
  await cart.save();

  await cart.populate({
    path: 'items.product',
    select: 'name slug price originalPrice images stock',
  });

  res.status(200).json({
    status: 'success',
    message: `Coupon applied! You saved ₹${discountAmount}`,
    data: { cart },
  });
});

/**
 * Remove coupon from cart
 * DELETE /api/v1/cart/remove-coupon
 */
export const removeCoupon = asyncHandler(async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ user: req.user!._id });
  if (cart) {
    cart.discountCode = undefined;
    cart.discount = 0;
    await cart.save();
  }

  await cart?.populate({
    path: 'items.product',
    select: 'name slug price originalPrice images stock',
  });

  res.status(200).json({
    status: 'success',
    message: 'Coupon removed',
    data: { cart },
  });
});

/**
 * Sync guest cart with user cart after login
 * POST /api/v1/cart/sync
 */
export const syncCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { items } = req.body; // Array of { productId, quantity, variantId }

  if (!items || !Array.isArray(items)) {
    return next(new AppError('Invalid cart items', 400));
  }

  let cart = await Cart.findOne({ user: req.user!._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user!._id, items: [] });
  }

  for (const item of items) {
    const product = await Product.findOne({ _id: item.productId, isActive: true });
    if (!product) continue;

    await cart.addItem(item.productId, item.quantity, product.price, item.variantId);
  }

  await cart.save();

  await cart.populate({
    path: 'items.product',
    select: 'name slug price originalPrice images stock isActive',
  });

  res.status(200).json({
    status: 'success',
    message: 'Cart synced successfully',
    data: { cart },
  });
});
