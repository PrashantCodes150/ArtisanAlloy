// Export all services from a single entry point
export { default as api } from './api';
export { default as authService } from './auth.service';
export { default as productService } from './product.service';
export { default as categoryService } from './category.service';
export { default as cartService, localCartService } from './cart.service';
export { default as orderService } from './order.service';
export { default as wishlistService, localWishlistService } from './wishlist.service';

// Re-export types
export type { ApiResponse } from './api';
export type { User, Address, LoginCredentials, RegisterData, AuthResponse } from './auth.service';
export type { Product, ProductImage, ProductVariant, ProductFilters } from './product.service';
export type { Category } from './category.service';
export type { Cart, CartItem } from './cart.service';
export type { Order, OrderItem, PaymentInfo, CreateOrderData } from './order.service';
export type { Wishlist, WishlistItem } from './wishlist.service';
