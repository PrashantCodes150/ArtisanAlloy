import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService, { localCartService } from '../services/cart.service';
import type { Cart, CartItem } from '../services/cart.service';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  localCart: CartItem[];
  isLoading: boolean;
  error: string | null;
  effectiveItems: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (productId: string, quantity?: number, price?: number, variantId?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  refreshCart: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [localCart, setLocalCart] = useState<CartItem[]>(() => localCartService.getCart()); // Initialize from storage
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setLocalCart(localCartService.getCart());
      return;
    }

    setIsLoading(true);
    try {
      const response = await cartService.getCart();
      if (response.data?.cart) {
        setCart(response.data.cart);
      }
    } catch (err: any) {
      // Backend might not be running or token invalid - use local cart
      console.log('Cart fetch failed - falling back to local storage');
      setLocalCart(localCartService.getCart());
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Ensure local cart is updated when auth state changes but don't clear it
  useEffect(() => {
    if (!isAuthenticated) {
      setLocalCart(localCartService.getCart());
    }
  }, [isAuthenticated]);

  // Calculate totals with reliable fallbacks
  const effectiveItems = (isAuthenticated && cart && cart.items.length > 0)
    ? cart.items
    : localCart;

  const itemCount = (isAuthenticated && cart && cart.items.length > 0)
    ? cart.totalItems
    : localCart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = (isAuthenticated && cart && cart.items.length > 0)
    ? cart.subtotal
    : localCart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Fetch cart when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setLocalCart(localCartService.getCart());
      setCart(null);
    }
  }, [isAuthenticated, refreshCart]);

  const addToCart = useCallback(async (
    productId: string,
    quantity: number = 1,
    price: number = 0,
    variantId?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated) {
        const response = await cartService.addToCart(productId, quantity, variantId);
        if (response.data?.cart) {
          setCart(response.data.cart);
        }
      } else {
        const updatedCart = localCartService.addToCart(productId, quantity, price, variantId);
        setLocalCart([...updatedCart]);
      }
    } catch (err: any) {
      // If API fails, fallback to local cart for a seamless experience
      console.log('API add to cart failed, falling back to local');
      const updatedCart = localCartService.addToCart(productId, quantity, price, variantId);
      setLocalCart([...updatedCart]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated) {
        const response = await cartService.updateCartItem(itemId, quantity);
        if (response.data?.cart) {
          setCart(response.data.cart);
        }
      } else {
        const updatedCart = localCartService.updateQuantity(itemId, quantity);
        setLocalCart([...updatedCart]);
      }
    } catch (err: any) {
      console.log('API update quantity failed, falling back to local');
      const updatedCart = localCartService.updateQuantity(itemId, quantity);
      setLocalCart([...updatedCart]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const removeItem = useCallback(async (itemId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated) {
        const response = await cartService.removeFromCart(itemId);
        if (response.data?.cart) {
          setCart(response.data.cart);
        }
      } else {
        const updatedCart = localCartService.removeItem(itemId);
        setLocalCart([...updatedCart]);
      }
    } catch (err: any) {
      console.log('API remove item failed, falling back to local');
      const updatedCart = localCartService.removeItem(itemId);
      setLocalCart([...updatedCart]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated) {
        const response = await cartService.clearCart();
        if (response.data?.cart) {
          setCart(response.data.cart);
        }
      } else {
        localCartService.clearCart();
        setLocalCart([]);
      }
    } catch (err: any) {
      localCartService.clearCart();
      setLocalCart([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const applyCoupon = useCallback(async (code: string) => {
    if (!isAuthenticated) {
      setError('Please login to apply coupon');
      throw new Error('Please login to apply coupon');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await cartService.applyCoupon(code);
      if (response.data?.cart) {
        setCart(response.data.cart);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to apply coupon';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const removeCoupon = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await cartService.removeCoupon();
      if (response.data?.cart) {
        setCart(response.data.cart);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to remove coupon';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: CartContextType = {
    cart,
    localCart,
    effectiveItems,
    isLoading,
    error,
    itemCount,
    subtotal,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    refreshCart,
    clearError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
