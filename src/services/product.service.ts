import api from './api';
import type { ApiResponse } from './api';

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  _id: string;
  name: string;
  sku: string;
  price?: number;
  stock: number;
  attributes: {
    size?: string;
    color?: string;
    material?: string;
  };
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: ProductImage[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  occasion: string[];
  personality: string[];
  material: string[];
  outfit: string[];
  viral: string[];
  gifting: string[];
  sku: string;
  stock: number;
  variants: ProductVariant[];
  tags: string[];
  keywords: string[];
  rating: number;
  ratingsCount: number;
  reviewsCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  occasion?: string;
  personality?: string;
  material?: string;
  outfit?: string;
  viral?: string;
  gifting?: string;
  'price[gte]'?: number;
  'price[lte]'?: number;
  search?: string;
}

export interface ProductsResponse {
  products: Product[];
}

const productService = {
  async getProducts(filters?: ProductFilters): Promise<ApiResponse<ProductsResponse> & { results: number; total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  async getProduct(id: string): Promise<ApiResponse<{ product: Product }>> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<{ product: Product }>> {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  async getFeaturedProducts(limit: number = 8): Promise<ApiResponse<ProductsResponse>> {
    const response = await api.get(`/products/featured?limit=${limit}`);
    return response.data;
  },

  async getNewArrivals(limit: number = 8): Promise<ApiResponse<ProductsResponse>> {
    const response = await api.get(`/products/new-arrivals?limit=${limit}`);
    return response.data;
  },

  async getBestsellers(limit: number = 8): Promise<ApiResponse<ProductsResponse>> {
    const response = await api.get(`/products/bestsellers?limit=${limit}`);
    return response.data;
  },

  async getProductsByCategory(categoryId: string, filters?: ProductFilters): Promise<ApiResponse<ProductsResponse> & { total: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/products/category/${categoryId}?${params.toString()}`);
    return response.data;
  },

  async searchProducts(query: string, limit: number = 20): Promise<ApiResponse<ProductsResponse> & { total: number }> {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },
};

export default productService;
