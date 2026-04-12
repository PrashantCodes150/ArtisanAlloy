import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for Coupon document
export interface ICoupon extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  name?: string;
  description?: string;
  type: 'percentage' | 'fixed' | 'free-shipping' | 'buy-x-get-y' | 'gift-card';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageLimitPerUser?: number;
  usedCount: number;
  usagePerUser?: number;
  usedBy: {
    user: mongoose.Types.ObjectId;
    usedAt: Date;
    orderId: mongoose.Types.ObjectId;
    discountAmount: number;
  }[];
  applicableProducts?: mongoose.Types.ObjectId[];
  applicableCategories?: mongoose.Types.ObjectId[];
  excludedProducts?: mongoose.Types.ObjectId[];
  excludedCategories?: mongoose.Types.ObjectId[];
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  
  // Advanced targeting
  userTypes?: ('customer' | 'vip' | 'new' | 'premium')[];
  minimumOrderCount?: number;
  minimumOrderValue?: number;
  firstTimeUserOnly?: boolean;
  
  // Seasonal and promotional
  isSeasonal?: boolean;
  season?: ('spring' | 'summer' | 'fall' | 'winter' | 'festive')[];
  isFlashSale?: boolean;
  flashSaleDuration?: number; // in hours
  
  // BOGO and bundle offers
  buyQuantity?: number;
  getQuantity?: number;
  buyProducts?: mongoose.Types.ObjectId[];
  getProducts?: mongoose.Types.ObjectId[];
  
  // Metadata
  createdBy: mongoose.Types.ObjectId;
  tags?: string[];
  priority?: number;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Virtuals
  isValid: boolean;
  isExpired: boolean;
  remainingUses: number;
  isFlashSaleActive?: boolean;
  timesUsedByUser: (userId: mongoose.Types.ObjectId) => number;
}

// Coupon Schema
const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, 'Coupon code must be at least 3 characters'],
      maxlength: [20, 'Coupon code cannot exceed 20 characters'],
    },
    name: {
      type: String,
      maxlength: [100, 'Coupon name cannot exceed 100 characters'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'free-shipping', 'buy-x-get-y', 'gift-card'],
      required: [true, 'Coupon type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Coupon value is required'],
      min: [0, 'Coupon value cannot be negative'],
      validate: {
        validator: function(this: ICoupon, value: number) {
          if (this.type === 'percentage') {
            return value > 0 && value <= 100;
          }
          return value >= 0;
        },
        message: 'Percentage discount must be between 0 and 100'
      }
    },
    minOrderAmount: {
      type: Number,
      min: [0, 'Minimum order amount cannot be negative'],
      validate: {
        validator: function(this: ICoupon, value: number) {
          return this.type !== 'free-shipping' || value === undefined;
        },
        message: 'Free shipping coupons cannot have minimum order amount'
      }
    },
    maxDiscount: {
      type: Number,
      min: [0, 'Maximum discount cannot be negative'],
    },
    usageLimit: {
      type: Number,
      min: [0, 'Usage limit cannot be negative'],
    },
    usageLimitPerUser: {
      type: Number,
      min: [0, 'Per-user usage limit cannot be negative'],
      default: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, 'Used count cannot be negative'],
    },
    usedBy: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      usedAt: { type: Date, default: Date.now },
      orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
      discountAmount: { type: Number, required: true }
    }],
    
    // Applicability
    applicableProducts: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }],
    applicableCategories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    excludedProducts: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }],
    excludedCategories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    
    // Validity
    validFrom: {
      type: Date,
      required: [true, 'Valid from date is required'],
      validate: {
        validator: function(this: ICoupon, value: Date) {
          return !this.validUntil || value <= this.validUntil;
        },
        message: 'Start date must be before or equal to end date'
      }
    },
    validUntil: {
      type: Date,
      required: [true, 'Valid until date is required'],
      validate: {
        validator: function(this: ICoupon, value: Date) {
          return !this.validFrom || this.validFrom <= value;
        },
        message: 'End date must be after or equal to start date'
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Advanced targeting
    userTypes: [{
      type: String,
      enum: ['customer', 'vip', 'new', 'premium'],
    }],
    minimumOrderCount: {
      type: Number,
      min: [0, 'Minimum order count cannot be negative'],
    },
    minimumOrderValue: {
      type: Number,
      min: [0, 'Minimum order value cannot be negative'],
    },
    firstTimeUserOnly: {
      type: Boolean,
      default: false,
    },
    
    // Seasonal and promotional
    isSeasonal: {
      type: Boolean,
      default: false,
    },
    season: [{
      type: String,
      enum: ['spring', 'summer', 'fall', 'winter', 'festive'],
    }],
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    flashSaleDuration: {
      type: Number, // in hours
      min: [1, 'Flash sale duration must be at least 1 hour'],
      max: [168, 'Flash sale duration cannot exceed 1 week'],
    },
    
    // BOGO and bundle offers
    buyQuantity: {
      type: Number,
      min: [1, 'Buy quantity must be at least 1'],
    },
    getQuantity: {
      type: Number,
      min: [1, 'Get quantity must be at least 1'],
    },
    buyProducts: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }],
    getProducts: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }],
    
    // Metadata
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [String],
    priority: {
      type: Number,
      default: 0,
      min: [0, 'Priority cannot be negative'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance (code index already created by unique constraint)
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
couponSchema.index({ createdBy: 1 });
couponSchema.index({ type: 1 });
couponSchema.index({ isFlashSale: 1, validFrom: 1 });

// Virtuals
couponSchema.virtual('isValid').get(function(this: ICoupon): boolean {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (this.usageLimit === undefined || this.usedCount < this.usageLimit)
  );
});

couponSchema.virtual('isExpired').get(function(this: ICoupon): boolean {
  return this.validUntil < new Date();
});

couponSchema.virtual('remainingUses').get(function(this: ICoupon): number {
  if (this.usageLimit === undefined) return Infinity;
  return Math.max(0, this.usageLimit - this.usedCount);
});

couponSchema.virtual('isFlashSaleActive').get(function(this: ICoupon): boolean {
  if (!this.isFlashSale || !this.flashSaleDuration) return false;
  
  const now = new Date();
  const flashSaleStart = this.validFrom;
  const flashSaleEnd = new Date(flashSaleStart.getTime() + this.flashSaleDuration * 60 * 60 * 1000);
  
  return now >= flashSaleStart && now <= flashSaleEnd;
});

// Instance method to check if user can use coupon
couponSchema.methods.canUserUse = function(userId: mongoose.Types.ObjectId, userOrderCount?: number): { canUse: boolean; reason?: string } {
  // Check if coupon is valid
  if (!this.isValid) {
    return { canUse: false, reason: this.isExpired ? 'Coupon has expired' : 'Coupon is inactive' };
  }
  
  // Check usage limit
  if (this.usageLimit !== undefined && this.usedCount >= this.usageLimit) {
    return { canUse: false, reason: 'Coupon usage limit reached' };
  }
  
  // Check per-user limit
  const userUsage = this.timesUsedByUser(userId);
  if (this.usageLimitPerUser !== undefined && userUsage >= this.usageLimitPerUser) {
    return { canUse: false, reason: 'You have reached the usage limit for this coupon' };
  }
  
  // Check first-time user restriction
  if (this.firstTimeUserOnly && userOrderCount && userOrderCount > 0) {
    return { canUse: false, reason: 'This coupon is only for first-time users' };
  }
  
  // Check minimum order count
  if (this.minimumOrderCount !== undefined && userOrderCount && userOrderCount < this.minimumOrderCount) {
    return { canUse: false, reason: `This coupon requires at least ${this.minimumOrderCount} previous orders` };
  }
  
  return { canUse: true };
};

// Instance method to get times used by specific user
couponSchema.methods.timesUsedByUser = function(userId: mongoose.Types.ObjectId): number {
  return this.usedBy.filter((usage: any) => usage.user.toString() === userId.toString()).length;
};

// Instance method to increment usage
couponSchema.methods.incrementUsage = function(userId: mongoose.Types.ObjectId, orderId: mongoose.Types.ObjectId, discountAmount: number): void {
  this.usedCount += 1;
  this.usedBy.push({
    user: userId,
    usedAt: new Date(),
    orderId: orderId,
    discountAmount
  });
};

// Static method to find valid coupon
couponSchema.statics.findValidCoupon = function(code: string) {
  return this.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() }
  }).populate('applicableProducts applicableCategories excludedProducts excludedCategories buyProducts getProducts');
};

// Static method to get active coupons
couponSchema.statics.getActiveCoupons = function() {
  return this.find({
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() }
  }).populate('createdBy', 'firstName lastName')
  .sort({ priority: -1, createdAt: -1 });
};

// Static method to get flash sale coupons
couponSchema.statics.getFlashSaleCoupons = function() {
  return this.find({
    isActive: true,
    isFlashSale: true,
    validFrom: { $lte: new Date() }
  }).populate('createdBy', 'firstName lastName')
  .sort({ priority: -1, validFrom: -1 });
};

const Coupon: Model<ICoupon> = mongoose.model<ICoupon>('Coupon', couponSchema);

export default Coupon;
