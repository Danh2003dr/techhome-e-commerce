import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { WishlistItem } from '@/types';

const WISHLIST_STORAGE_KEY = 'techhome_wishlist';

function loadWishlistFromStorage(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWishlistToStorage(items: WishlistItem[]) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

export interface AddToWishlistPayload {
  productId: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (payload: AddToWishlistPayload) => void;
  removeItem: (productId: string) => void;
  toggleItem: (payload: AddToWishlistPayload) => void;
  isInWishlist: (productId: string) => boolean;
  totalCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => loadWishlistFromStorage());

  useEffect(() => {
    saveWishlistToStorage(items);
  }, [items]);

  const addItem = useCallback((payload: AddToWishlistPayload) => {
    const { productId, name, image, price, oldPrice, rating = 0, reviews = 0 } = payload;
    setItems((prev) => {
      if (prev.some((i) => (i.productId ?? i.id) === productId)) return prev;
      return [
        ...prev,
        {
          id: `wl-${productId}`,
          productId,
          name,
          image,
          price,
          oldPrice,
          rating,
          reviews,
          onSale: oldPrice != null && oldPrice > price,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => (i.productId ?? i.id) !== productId && i.id !== `wl-${productId}`));
  }, []);

  const toggleItem = useCallback((payload: AddToWishlistPayload) => {
    setItems((prev) => {
      const exists = prev.some((i) => (i.productId ?? i.id) === payload.productId || i.id === `wl-${payload.productId}`);
      if (exists) {
        return prev.filter((i) => (i.productId ?? i.id) !== payload.productId && i.id !== `wl-${payload.productId}`);
      }
      const { productId, name, image, price, oldPrice, rating = 0, reviews = 0 } = payload;
      return [
        ...prev,
        {
          id: `wl-${productId}`,
          productId,
          name,
          image,
          price,
          oldPrice,
          rating,
          reviews,
          onSale: oldPrice != null && oldPrice > price,
        },
      ];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => (i.productId ?? i.id) === productId || i.id === `wl-${productId}`),
    [items]
  );

  const totalCount = items.length;

  const value: WishlistContextType = {
    items,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
    totalCount,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (ctx === undefined) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
