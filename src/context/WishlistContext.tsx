import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import wishlistService, { localWishlistService } from '../services/wishlist.service';
import type { Wishlist } from '../services/wishlist.service';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Wishlist | null;
  localWishlist: string[];
  isLoading: boolean;
  effectiveWishlist: string[];
  itemCount: number;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [localWishlist, setLocalWishlist] = useState<string[]>(() => localWishlistService.getWishlist()); // Initialize from storage
  const [isLoading, setIsLoading] = useState(false);

  // Ensure local wishlist is updated when auth state changes but don't clear it
  useEffect(() => {
    if (!isAuthenticated) {
      setLocalWishlist(localWishlistService.getWishlist());
    }
  }, [isAuthenticated]);

  // Effective state with fallbacks
  const effectiveWishlist = (isAuthenticated && wishlist)
    ? wishlist.items.map(item => typeof item.product === 'string' ? item.product : (item.product as any)._id || (item.product as any).id)
    : localWishlist;

  const itemCount = (isAuthenticated && wishlist && wishlist.items.length > 0)
    ? wishlist.items.length
    : localWishlist.length;

  // Fetch wishlist when auth changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist();
    } else {
      setLocalWishlist(localWishlistService.getWishlist());
      setWishlist(null);
    }
  }, [isAuthenticated]);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setLocalWishlist(localWishlistService.getWishlist());
      return;
    }

    setIsLoading(true);
    try {
      const response = await wishlistService.getWishlist();
      if (response.data?.wishlist) {
        setWishlist(response.data.wishlist);
      }
    } catch (err) {
      console.log('Wishlist fetch failed - falling back to local storage');
      setLocalWishlist(localWishlistService.getWishlist());
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addToWishlist = useCallback(async (productId: string) => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        const response = await wishlistService.addToWishlist(productId);
        if (response.data?.wishlist) {
          setWishlist(response.data.wishlist);
        }
      } else {
        const updated = localWishlistService.addToWishlist(productId);
        setLocalWishlist([...updated]);
      }
    } catch (err) {
      // Fallback to local
      console.log('API add to wishlist failed, falling back to local');
      const updated = localWishlistService.addToWishlist(productId);
      setLocalWishlist([...updated]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const isInWishlist = useCallback((productId: string): boolean => {
    if (!productId) return false;

    // Check backend wishlist if authenticated
    if (isAuthenticated && wishlist && wishlist.items.length > 0) {
      const foundInBackend = wishlist.items.some((item) => {
        const product = item.product;
        if (typeof product === 'string') {
          return product === productId;
        }
        return (product as any)._id === productId || (product as any).id === productId;
      });
      if (foundInBackend) return true;
    }

    // Fallback to local wishlist
    return localWishlist.includes(productId);
  }, [isAuthenticated, wishlist, localWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        const response = await wishlistService.removeFromWishlist(productId);
        if (response.data?.wishlist) {
          setWishlist(response.data.wishlist);
        }
      } else {
        const updated = localWishlistService.removeFromWishlist(productId);
        setLocalWishlist([...updated]);
      }
    } catch (err) {
      console.log('API remove from wishlist failed, falling back to local');
      const updated = localWishlistService.removeFromWishlist(productId);
      setLocalWishlist([...updated]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        const response = await wishlistService.clearWishlist();
        if (response.data?.wishlist) {
          setWishlist(response.data.wishlist);
        }
      } else {
        localWishlistService.clearWishlist();
        setLocalWishlist([]);
      }
    } catch (err) {
      console.log('API clear wishlist failed, falling back to local storage');
      localWishlistService.clearWishlist();
      setLocalWishlist([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const value: WishlistContextType = {
    wishlist,
    localWishlist,
    effectiveWishlist,
    isLoading,
    itemCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    refreshWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext;
