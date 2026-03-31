import mongoose, { Document, Schema, Model } from 'mongoose';
import slugify from 'slugify';

// Interface for Category document
export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  type: 'occasion' | 'personality' | 'material' | 'outfit' | 'budget' | 'viral' | 'gifting' | 'jewelry-type';
  parent?: mongoose.Types.ObjectId;
  ancestors: mongoose.Types.ObjectId[];
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  productsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Category Schema
const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: [true, 'Category type is required'],
      enum: ['occasion', 'personality', 'material', 'outfit', 'budget', 'viral', 'gifting', 'jewelry-type'],
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    ancestors: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    metaTitle: String,
    metaDescription: String,
    productsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ type: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1, isFeatured: 1 });
categorySchema.index({ order: 1 });

// Virtual populate for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  foreignField: 'parent',
  localField: '_id',
});

// Virtual populate for products
categorySchema.virtual('products', {
  ref: 'Product',
  foreignField: 'category',
  localField: '_id',
});

// Pre-save middleware to generate slug
categorySchema.pre<ICategory>('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Pre-save middleware to build ancestors array
categorySchema.pre<ICategory>('save', async function(next) {
  if (this.isModified('parent') && this.parent) {
    const parentCategory = await Category.findById(this.parent);
    if (parentCategory) {
      this.ancestors = [...parentCategory.ancestors, parentCategory._id];
    }
  } else if (!this.parent) {
    this.ancestors = [];
  }
  next();
});

const Category: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
