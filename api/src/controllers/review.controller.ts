import { Request, Response, NextFunction } from 'express';
import { Review, Product, Order } from '../models';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { APIFeatures } from '../utils/apiFeatures';

/**
 * Get reviews for a product
 * GET /api/v1/reviews/product/:productId
 */
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const features = new APIFeatures(
    Review.find({ product: req.params.productId, isApproved: true }),
    req.query
  )
    .sort()
    .paginate();

  const reviews = await features.query.populate('user', 'firstName lastName avatar');
  const total = await Review.countDocuments({ product: req.params.productId, isApproved: true });

  // Get rating distribution
  const ratingStats = await Review.aggregate([
    { $match: { product: req.params.productId, isApproved: true } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    total,
    ratingDistribution: ratingStats,
    data: { reviews },
  });
});

/**
 * Create review for a product
 * POST /api/v1/reviews/product/:productId
 */
export const createReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { rating, title, comment, images } = req.body;
  const productId = req.params.productId;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({
    product: productId,
    user: req.user!._id,
  });

  if (existingReview) {
    return next(new AppError('You have already reviewed this product', 400));
  }

  // Check if user purchased this product
  const hasPurchased = await Order.findOne({
    user: req.user!._id,
    'items.product': productId,
    status: 'delivered',
  });

  const review = await Review.create({
    product: productId,
    user: req.user!._id,
    rating,
    title,
    comment,
    images,
    isVerifiedPurchase: !!hasPurchased,
  });

  await review.populate('user', 'firstName lastName avatar');

  res.status(201).json({
    status: 'success',
    message: 'Review submitted successfully',
    data: { review },
  });
});

/**
 * Update review
 * PATCH /api/v1/reviews/:id
 */
export const updateReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { rating, title, comment, images } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check ownership
  if (review.user.toString() !== req.user!._id.toString()) {
    return next(new AppError('You can only edit your own reviews', 403));
  }

  review.rating = rating || review.rating;
  review.title = title || review.title;
  review.comment = comment || review.comment;
  review.images = images || review.images;

  await review.save();

  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

/**
 * Delete review
 * DELETE /api/v1/reviews/:id
 */
export const deleteReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  // Check ownership or admin
  if (review.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
    return next(new AppError('You can only delete your own reviews', 403));
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * Mark review as helpful
 * PATCH /api/v1/reviews/:id/helpful
 */
export const markReviewHelpful = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  const userId = req.user!._id;
  const alreadyMarked = review.helpfulBy.some((id) => id.toString() === userId.toString());

  if (alreadyMarked) {
    // Remove from helpful
    review.helpfulBy = review.helpfulBy.filter((id) => id.toString() !== userId.toString());
    review.helpfulCount = Math.max(0, review.helpfulCount - 1);
  } else {
    // Add to helpful
    review.helpfulBy.push(userId);
    review.helpfulCount += 1;
  }

  await review.save();

  res.status(200).json({
    status: 'success',
    message: alreadyMarked ? 'Removed from helpful' : 'Marked as helpful',
    data: { helpfulCount: review.helpfulCount },
  });
});

/**
 * Get all reviews (Admin only)
 * GET /api/v1/reviews
 */
export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const reviews = await features.query
    .populate('user', 'firstName lastName email')
    .populate('product', 'name slug');

  const total = await Review.countDocuments();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    total,
    data: { reviews },
  });
});

/**
 * Approve/reject review (Admin only)
 * PATCH /api/v1/reviews/:id/approve
 */
export const approveReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { isApproved } = req.body;

  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved },
    { new: true }
  );

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: isApproved ? 'Review approved' : 'Review rejected',
    data: { review },
  });
});

/**
 * Admin respond to review
 * PATCH /api/v1/reviews/:id/respond
 */
export const respondToReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { message } = req.body;

  if (!message) {
    return next(new AppError('Response message is required', 400));
  }

  const review = await Review.findByIdAndUpdate(
    req.params.id,
    {
      adminResponse: {
        message,
        respondedAt: new Date(),
        respondedBy: req.user!._id,
      },
    },
    { new: true }
  );

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Response added',
    data: { review },
  });
});
