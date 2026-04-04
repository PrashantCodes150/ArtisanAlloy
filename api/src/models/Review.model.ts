import mongoose, { Document, Schema, Model } from 'mongoose';
import Product from './Product.model';

// Interface for Review document
export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  helpfulBy: mongoose.Types.ObjectId[];
  adminResponse?: {
    message: string;
    respondedAt: Date;
    respondedBy: mongoose.Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Review Schema
const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    images: [String],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true, // Auto-approve, or set to false for moderation
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    adminResponse: {
      message: String,
      respondedAt: Date,
      respondedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ product: 1, rating: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ isApproved: 1 });

// Static method to calculate average rating for a product
reviewSchema.statics.calcAverageRatings = async function(productId: mongoose.Types.ObjectId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsCount: stats[0].nRatings,
      reviewsCount: stats[0].nRatings,
      rating: Math.round(stats[0].avgRating * 10) / 10,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsCount: 0,
      reviewsCount: 0,
      rating: 0,
    });
  }
};

// Post-save hook to update product ratings
reviewSchema.post('save', async function() {
  // @ts-ignore
  await this.constructor.calcAverageRatings(this.product);
});

// Post-remove hook to update product ratings
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    // @ts-ignore
    await doc.constructor.calcAverageRatings(doc.product);
  }
});

const Review: Model<IReview> = mongoose.model<IReview>('Review', reviewSchema);

export default Review;
