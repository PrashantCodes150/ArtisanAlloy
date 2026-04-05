import mongoose, { Document, Schema, Model } from 'mongoose';
import slugify from 'slugify';

// Interface for Stock History Entry
export interface IStockHistoryEntry {
  _id?: mongoose.Types.ObjectId;
  quantity: number;
  type: 'in' | 'out' | 'adjustment';
  reason: string;
  batchId?: string;
  userId?: mongoose.Types.ObjectId;
  timestamp: Date;
  notes?: string;
}

// Interface for Product document
export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: IProductImage[];
  category: mongoose.Types.ObjectId;
  
  // Strategic categories (matching frontend)
  occasion: string[];
  personality: string[];
  material: string[];
  outfit: string[];
  viral: string[];
  gifting: string[];
  
  // Product details
  sku: string;
  stock: number;
  lowStockThreshold: number;
  reorderPoint: number;
  maxStock: number;
  batchNumber?: string;
  expiryDate?: Date;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  
  // Inventory tracking
  inventoryTracked: boolean;
  lastStockUpdate?: Date;
  stockHistory: IStockHistoryEntry[];
  supplier?: mongoose.Types.ObjectId;
  
  // Variants (e.g., sizes, colors)
  variants: IProductVariant[];
  
  // Metadata
  tags: string[];
  keywords: string[];
  
  // Ratings & Reviews
  rating: number;
  ratingsCount: number;
  reviewsCount: number;
  
  // Flags
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Virtuals
  isInStock: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
  discountPercentage: number;
  totalVariantStock: number;
  
  // Methods
  updateStock(newStock: number, reason?: string, batchId?: string): Promise<void>;
  checkLowStock(): boolean;
  getStockLevel(): 'in-stock' | 'low-stock' | 'out-of-stock';
}

// Interface for Product Image
export interface IProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

// Interface for Product Variant
export interface IProductVariant {
  _id?: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  price?: number;
  stock: number;
  lowStockThreshold: number;
  reorderPoint: number;
  batchNumber?: string;
  expiryDate?: Date;
  attributes: {
    size?: string;
    color?: string;
    material?: string;
  };
  isActive: boolean;
  stockHistory: IStockHistoryEntry[];
}

// Interface for Stock History Entry
export interface IStockHistoryEntry {
  _id?: mongoose.Types.ObjectId;
  quantity: number;
  type: 'in' | 'out' | 'adjustment';
  reason: string;
  batchId?: string;
  userId?: mongoose.Types.ObjectId;
  timestamp: Date;
  notes?: string;
}

// Image Schema
const productImageSchema = new Schema<IProductImage>({
  url: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  alt: {
    type: String,
    default: '',
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
});

// Stock History Entry Schema
const stockHistoryEntrySchema = new Schema<IStockHistoryEntry>({
  quantity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['in', 'out', 'adjustment'],
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  batchId: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  notes: String,
});

// Variant Schema
const productVariantSchema = new Schema<IProductVariant>({
  name: {
    type: String,
    required: [true, 'Variant name is required'],
  },
  sku: {
    type: String,
    required: [true, 'Variant SKU is required'],
  },
  price: Number,
  stock: {
    type: Number,
    required: [true, 'Variant stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
  },
  reorderPoint: {
    type: Number,
    default: 10,
  },
  batchNumber: String,
  expiryDate: Date,
  attributes: {
    size: String,
    color: String,
    material: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  stockHistory: [stockHistoryEntrySchema],
});

// Product Schema
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },
    images: [productImageSchema],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },
    
    // Strategic categories (matching your frontend data)
    occasion: [{
      type: String,
      enum: ['occ-wedding', 'occ-haldi', 'occ-cocktail', 'occ-office', 'occ-festival', 'occ-daily', 'occ-college'],
    }],
    personality: [{
      type: String,
      enum: ['pers-boss', 'pers-soft', 'pers-royal', 'pers-boho', 'pers-minimal', 'pers-street'],
    }],
    material: [{
      type: String,
      enum: ['mat-rosegold', 'mat-silver', 'mat-ad', 'mat-kundan', 'mat-temple', 'mat-oxidized', 'mat-pearl'],
    }],
    outfit: [{
      type: String,
      enum: ['outfit-saree', 'outfit-lehenga', 'outfit-western', 'outfit-indowestern'],
    }],
    viral: [{
      type: String,
      enum: ['viral-korean', 'viral-evil-eye', 'viral-butterfly', 'viral-bollywood'],
    }],
    gifting: [{
      type: String,
      enum: ['gift-boxes', 'gift-couple', 'gift-anniversary'],
    }],
    
    // Product details
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    reorderPoint: {
      type: Number,
      default: 20,
    },
    maxStock: {
      type: Number,
      default: 1000,
    },
    batchNumber: String,
    expiryDate: Date,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    
    // Inventory tracking
    inventoryTracked: {
      type: Boolean,
      default: true,
    },
    lastStockUpdate: {
      type: Date,
      default: Date.now,
    },
    stockHistory: [stockHistoryEntrySchema],
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    
    variants: [productVariantSchema],
    
    tags: [{ type: String, trim: true }],
    keywords: [{ type: String, trim: true }],
    
    // Ratings & Reviews (will be calculated from reviews)
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot be above 5'],
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    
    // Flags
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    
    // SEO
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance (slug index already created by unique constraint)
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ occasion: 1 });
productSchema.index({ material: 1 });
productSchema.index({ personality: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text', keywords: 'text' });

// Virtuals
productSchema.virtual('isInStock').get(function(this: IProduct): boolean {
  return this.stock > 0;
});

productSchema.virtual('isLowStock').get(function(this: IProduct): boolean {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
});

productSchema.virtual('isOutOfStock').get(function(this: IProduct): boolean {
  return this.stock === 0;
});

productSchema.virtual('totalVariantStock').get(function(this: IProduct): number {
  return this.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
});

productSchema.virtual('discountPercentage').get(function(this: IProduct): number {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return this.discount || 0;
});

// Virtual populate reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// Pre-save middleware to generate slug
productSchema.pre<IProduct>('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Pre-save middleware to calculate discount
productSchema.pre<IProduct>('save', function(next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

// Instance method to update stock
productSchema.methods.updateStock = async function(newStock: number, reason: string = 'Manual update', batchId?: string, userId?: mongoose.Types.ObjectId) {
  const oldStock = this.stock;
  const difference = newStock - oldStock;
  
  this.stock = newStock;
  this.lastStockUpdate = new Date();
  
  // Add to stock history
  const stockEntry: IStockHistoryEntry = {
    quantity: Math.abs(difference),
    type: difference > 0 ? 'in' : 'out',
    reason,
    batchId,
    userId,
    timestamp: new Date(),
    notes: `Stock updated from ${oldStock} to ${newStock}`,
  };
  
  this.stockHistory.push(stockEntry);
  
  await this.save({ validateBeforeSave: false });
};

// Instance method to check low stock
productSchema.methods.checkLowStock = function(): boolean {
  return this.stock > 0 && this.stock <= this.lowStockThreshold;
};

// Instance method to get stock level
productSchema.methods.getStockLevel = function(): 'in-stock' | 'low-stock' | 'out-of-stock' {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock <= 10) return 'low-stock'; // Using default threshold
  return 'in-stock';
};

// Static method to get low stock products
productSchema.statics.getLowStockProducts = function() {
  return this.find({
    stock: { $gt: 0, $lte: 10 }, // Using default low stock threshold
    isActive: true,
    inventoryTracked: true,
  }).populate('category');
};

// Static method to get out of stock products
productSchema.statics.getOutOfStockProducts = function() {
  return this.find({
    stock: 0,
    isActive: true,
    inventoryTracked: true,
  }).populate('category');
};

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product;
