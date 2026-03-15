import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { getToken } from '@/services/api';
import { isApiConfigured } from '@/services/api';
import * as backend from '@/services/backend';
import type { CartItem } from '@/types';

const CART_STORAGE_KEY = 'techhome_cart';

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export interface AddToCartPayload {
  productId: string;
  name: string;
  price: number;
  image: string;
  variant?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  const isLoggedIn = Boolean(getToken());

  useEffect(() => {
    if (!isApiConfigured()) {
      setItems(loadCartFromStorage());
      setInitialized(true);
      return;
    }
    if (isLoggedIn) {
      backend
        .getCart()
        .then((cart) => {
          setItems(cart);
          saveCartToStorage(cart);
        })
        .catch(() => setItems(loadCartFromStorage()))
        .finally(() => setInitialized(true));
    } else {
      setItems(loadCartFromStorage());
      setInitialized(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!initialized) return;
    saveCartToStorage(items);
  }, [items, initialized]);

  const addItem = useCallback((payload: AddToCartPayload) => {
    const { productId, name, price, image, variant } = payload;
    if (isApiConfigured() && getToken()) {
      backend
        .addCartItem({ productId, name, price, image: image || '', variant })
        .then(setItems)
        .catch(() => {
          setItems((prev) => {
            const existing = prev.find((i) => i.productId === productId && (i.variant ?? '') === (variant ?? ''));
            if (existing) {
              return prev.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i));
            }
            return [
              ...prev,
              {
                id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                productId,
                name,
                variant,
                price,
                quantity: 1,
                image: image || '',
              },
            ];
          });
        });
      return;
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId && (i.variant ?? '') === (variant ?? ''));
      if (existing) {
        return prev.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          productId,
          name,
          variant,
          price,
          quantity: 1,
          image: image || '',
        },
      ];
    });
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    if (isApiConfigured() && getToken()) {
      backend
        .removeCartItem(cartItemId)
        .then(setItems)
        .catch(() => setItems((prev) => prev.filter((i) => i.id !== cartItemId)));
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(cartItemId);
      return;
    }
    if (isApiConfigured() && getToken()) {
      backend
        .updateCartItemQuantity(cartItemId, quantity)
        .then(setItems)
        .catch(() => {
          setItems((prev) =>
            prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i))
          );
        });
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i))
    );
  }, [removeItem]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (ctx === undefined) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
