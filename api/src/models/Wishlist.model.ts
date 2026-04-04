import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for Wishlist Item
export interface IWishlistItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
  notifyOnSale: boolean;
  notifyOnStock: boolean;
}

// Interface for Wishlist document
export interface IWishlist extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Wishlist Item Schema
const wishlistItemSchema = new Schema<IWishlistItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  notifyOnSale: {
    type: Boolean,
    default: false,
  },
  notifyOnStock: {
    type: Boolean,
    default: false,
  },
});

// Wishlist Schema
const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes
wishlistSchema.index({ user: 1 });

const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>('Wishlist', wishlistSchema);

export default Wishlist;
