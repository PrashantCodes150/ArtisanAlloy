import api from './api';
import type { ApiResponse } from './api';
import type { Product } from './product.service';

export interface WishlistItem {
  product: Product | string;
  addedAt: string;
  notifyOnSale: boolean;
  notifyOnStock: boolean;
}

export interface Wishlist {
  _id: string;
  user: string;
  items: WishlistItem[];
}

const wishlistService = {
  async getWishlist(): Promise<ApiResponse<{ wishlist: Wishlist }>> {
    const response = await api.get('/wishlist');
    return response.data;
  },

async addToWishlist(productId: string): Promise<ApiResponse<{ wishlist: Wishlist }>> {
    try {
      const response = await api.post(`/wishlist/add/${productId}`);
      return response.data;
    } catch (error: any) {
      console.error('Add to wishlist failed:', error);
      // Re-throw with more context
      if (error.response?.status === 401) {
        throw new Error('Please login to add items to wishlist');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Please verify your email.');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  },

  async removeFromWishlist(productId: string): Promise<ApiResponse<{ wishlist: Wishlist }>> {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  },

  async clearWishlist(): Promise<ApiResponse<{ wishlist: Wishlist }>> {
    const response = await api.delete('/wishlist/clear');
    return response.data;
  },

  async toggleNotifications(productId: string, notifyOnSale?: boolean, notifyOnStock?: boolean): Promise<ApiResponse<{ item: WishlistItem }>> {
    const response = await api.patch(`/wishlist/notifications/${productId}`, { notifyOnSale, notifyOnStock });
    return response.data;
  },

  async checkInWishlist(productId: string): Promise<ApiResponse<{ isInWishlist: boolean }>> {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  },

  async syncWishlist(productIds: string[]): Promise<ApiResponse<{ wishlist: Wishlist }>> {
    const response = await api.post('/wishlist/sync', { productIds });
    return response.data;
  },
};

export default wishlistService;

export const localWishlistService = {
  getWishlist(): string[] {
    const saved = localStorage.getItem('guestWishlist');
    return saved ? JSON.parse(saved) : [];
  },

  saveWishlist(items: string[]): void {
    localStorage.setItem('guestWishlist', JSON.stringify(items));
  },

  addToWishlist(productId: string): string[] {
    const items = this.getWishlist();
    if (!items.includes(productId)) {
      items.push(productId);
      this.saveWishlist(items);
    }
    return items;
  },

  removeFromWishlist(productId: string): string[] {
    const items = this.getWishlist().filter(id => id !== productId);
    this.saveWishlist(items);
    return items;
  },

  isInWishlist(productId: string): boolean {
    return this.getWishlist().includes(productId);
  },

  clearWishlist(): void {
    localStorage.removeItem('guestWishlist');
  },
};
