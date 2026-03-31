import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for Cart Item
export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  variant?: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  totalPrice: number;
  addedAt: Date;
}

// Interface for Cart document
export interface ICart extends Document {
  _id: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  sessionId?: string; // For guest users
  items: ICartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  notes?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  calculateTotals(): void;
  addItem(productId: mongoose.Types.ObjectId, quantity: number, price: number, variantId?: mongoose.Types.ObjectId): Promise<void>;
  removeItem(itemId: mongoose.Types.ObjectId): void;
  updateItemQuantity(itemId: mongoose.Types.ObjectId, quantity: number): void;
  clearCart(): void;
}

// Cart Item Schema
const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
  },
  variant: {
    type: Schema.Types.ObjectId,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save to calculate item total
cartItemSchema.pre('save', function(next) {
  this.totalPrice = this.price * this.quantity;
  next();
});

// Cart Schema
const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    sessionId: {
      type: String,
      default: null,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountCode: {
      type: String,
      default: null,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    notes: String,
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for guest carts

// Method to calculate totals
cartSchema.methods.calculateTotals = function(): void {
  this.totalItems = this.items.reduce((sum: number, item: ICartItem) => sum + item.quantity, 0);
  this.subtotal = this.items.reduce((sum: number, item: ICartItem) => sum + (item.price * item.quantity), 0);
  
  // Calculate tax (e.g., 18% GST for India)
  const taxRate = 0.18;
  this.tax = Math.round(this.subtotal * taxRate * 100) / 100;
  
  // Free shipping over ₹999
  this.shippingCost = this.subtotal >= 999 ? 0 : 99;
  
  // Calculate final total
  this.total = this.subtotal + this.tax + this.shippingCost - this.discount;
};

// Method to add item to cart
cartSchema.methods.addItem = async function(
  productId: mongoose.Types.ObjectId, 
  quantity: number, 
  price: number, 
  variantId?: mongoose.Types.ObjectId
): Promise<void> {
  const existingItemIndex = this.items.findIndex(
    (item: ICartItem) => 
      item.product.toString() === productId.toString() &&
      (!variantId || item.variant?.toString() === variantId.toString())
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].totalPrice = this.items[existingItemIndex].price * this.items[existingItemIndex].quantity;
  } else {
    // Add new item
    this.items.push({
      product: productId,
      variant: variantId,
      quantity,
      price,
      totalPrice: price * quantity,
      addedAt: new Date(),
    });
  }

  this.calculateTotals();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(itemId: mongoose.Types.ObjectId): void {
  this.items = this.items.filter(
    (item: ICartItem) => item._id?.toString() !== itemId.toString()
  );
  this.calculateTotals();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(itemId: mongoose.Types.ObjectId, quantity: number): void {
  const item = this.items.find(
    (item: ICartItem) => item._id?.toString() === itemId.toString()
  );
  
  if (item) {
    item.quantity = quantity;
    item.totalPrice = item.price * quantity;
    this.calculateTotals();
  }
};

// Method to clear cart
cartSchema.methods.clearCart = function(): void {
  this.items = [];
  this.totalItems = 0;
  this.subtotal = 0;
  this.discount = 0;
  this.discountCode = null;
  this.tax = 0;
  this.total = 0;
};

// Pre-save middleware to recalculate totals
cartSchema.pre('save', function(next) {
  this.calculateTotals();
  next();
});

const Cart: Model<ICart> = mongoose.model<ICart>('Cart', cartSchema);

export default Cart;
