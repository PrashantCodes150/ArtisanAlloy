import api from './api';
import type { ApiResponse } from './api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  type: 'occasion' | 'personality' | 'material' | 'outfit' | 'budget' | 'viral' | 'gifting' | 'jewelry-type';
  parent?: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  productsCount: number;
  subcategories?: Category[];
}

const categoryService = {
  async getCategories(): Promise<ApiResponse<{ categories: Category[] }>> {
    const response = await api.get('/categories');
    return response.data;
  },

  async getCategory(id: string): Promise<ApiResponse<{ category: Category }>> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async getCategoryBySlug(slug: string): Promise<ApiResponse<{ category: Category }>> {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },

  async getCategoriesByType(type: Category['type']): Promise<ApiResponse<{ categories: Category[] }>> {
    const response = await api.get(`/categories/type/${type}`);
    return response.data;
  },

  async getFeaturedCategories(limit: number = 8): Promise<ApiResponse<{ categories: Category[] }>> {
    const response = await api.get(`/categories/featured?limit=${limit}`);
    return response.data;
  },
};

export default categoryService;
