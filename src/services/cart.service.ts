import api from './api';
import type { ApiResponse } from './api';
import type { Product } from './product.service';

export interface CartItem {
  _id: string;
  product: Product | string;
  variant?: string;
  quantity: number;
  price: number;
  totalPrice: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  user?: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
}

const cartService = {
  // Get user's cart
  async getCart(): Promise<ApiResponse<{ cart: Cart }>> {
    const response = await api.get('/cart');
    return response.data;
  },

// Add item to cart
  async addToCart(productId: string, quantity: number = 1, variantId?: string): Promise<ApiResponse<{ cart: Cart }>> {
    try {
      const response = await api.post('/cart/add', {
        productId,
        quantity,
        variantId,
      });
      return response.data;
    } catch (error: any) {
      console.error('Add to cart failed:', error);
      // Re-throw with more context
      if (error.response?.status === 401) {
        throw new Error('Please login to add items to cart');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Please verify your email.');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  },

  // Update cart item quantity
  async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<{ cart: Cart }>> {
    const response = await api.patch(`/cart/item/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<ApiResponse<{ cart: Cart }>> {
    const response = await api.delete(`/cart/item/${itemId}`);
    return response.data;
  },

  // Clear cart
  async clearCart(): Promise<ApiResponse<{ cart: Cart }>> {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  // Apply coupon
  async applyCoupon(code: string): Promise<ApiResponse<{ cart: Cart }>> {
    const response = await api.post('/cart/apply-coupon', { code });
    return response.data;
  },

  // Remove coupon
  async removeCoupon(): Promise<ApiResponse<{ cart: Cart }>> {
    const response = await api.delete('/cart/remove-coupon');
    return response.data;
  },

  // Sync guest cart after login
  async syncCart(items: { productId: string; quantity: number; variantId?: string }[]): Promise<ApiResponse<{ cart: Cart }>> {
    const response = await api.post('/cart/sync', { items });
    return response.data;
  },
};

export default cartService;

// Local cart for guest users
export const localCartService = {
  getCart(): CartItem[] {
    const saved = localStorage.getItem('guestCart');
    return saved ? JSON.parse(saved) : [];
  },

  saveCart(items: CartItem[]): void {
    localStorage.setItem('guestCart', JSON.stringify(items));
  },

  addToCart(productId: string, quantity: number, price: number, variantId?: string): CartItem[] {
    const items = this.getCart();
    const existingIndex = items.findIndex(item =>
      item.product === productId && item.variant === variantId
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
      items[existingIndex].totalPrice = items[existingIndex].quantity * items[existingIndex].price;
    } else {
      const newItem: CartItem = {
        _id: `local-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        product: productId,
        variant: variantId,
        quantity,
        price,
        totalPrice: quantity * price,
        addedAt: new Date().toISOString()
      };
      items.push(newItem);
    }

    this.saveCart(items);
    return items;
  },

  updateQuantity(itemId: string, quantity: number): CartItem[] {
    const items = this.getCart();
    const index = items.findIndex(item => item._id === itemId);

    if (index > -1) {
      if (quantity <= 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = quantity;
        items[index].totalPrice = items[index].quantity * items[index].price;
      }
      this.saveCart(items);
    }

    return items;
  },

  removeItem(itemId: string): CartItem[] {
    const items = this.getCart().filter(item => item._id !== itemId);
    this.saveCart(items);
    return items;
  },

  clearCart(): void {
    // Clear any existing guest cart data
    localStorage.removeItem('guestCart');
  },

  getCartTotal(): { subtotal: number; itemCount: number } {
    const items = this.getCart();
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, itemCount };
  },
};
