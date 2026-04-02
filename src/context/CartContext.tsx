import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { getToken } from '@/services/api';
import { isApiConfigured } from '@/services/api';
import { ApiError } from '@/services/api';
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
  stockWarningsByItemId: Record<string, string>;
  clearStockWarningForItem: (cartItemId: string) => void;
  isItemUpdating: (cartItemId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [stockWarningsByItemId, setStockWarningsByItemId] = useState<Record<string, string>>({});
  const [updatingItemIds, setUpdatingItemIds] = useState<string[]>([]);

  const isLoggedIn = Boolean(getToken());
  const clearStockWarningForItem = useCallback((cartItemId: string) => {
    setStockWarningsByItemId((prev) => {
      if (!prev[cartItemId]) return prev;
      const next = { ...prev };
      delete next[cartItemId];
      return next;
    });
  }, []);
  const isItemUpdating = useCallback(
    (cartItemId: string) => updatingItemIds.includes(cartItemId),
    [updatingItemIds]
  );

  const isStockConflictError = useCallback((err: unknown) => {
    if (!(err instanceof ApiError) || err.status !== 400) return false;
    const message = String(err.message || '').toLowerCase();
    return message.includes('ton kho') || message.includes('stock') || message.includes('khong du');
  }, []);

  const syncCartFromServer = useCallback(() => {
    return backend
      .getCart()
      .then((cart) => {
        setItems(cart);
        saveCartToStorage(cart);
      })
      .catch(() => {
        // Keep existing in-memory state if refresh fails.
      });
  }, []);

  const startUpdating = useCallback((cartItemId: string) => {
    setUpdatingItemIds((prev) => (prev.includes(cartItemId) ? prev : [...prev, cartItemId]));
  }, []);

  const stopUpdating = useCallback((cartItemId: string) => {
    setUpdatingItemIds((prev) => prev.filter((id) => id !== cartItemId));
  }, []);

  const setStockWarningForItem = useCallback((cartItemId: string, message: string) => {
    setStockWarningsByItemId((prev) => ({
      ...prev,
      [cartItemId]: message,
    }));
  }, []);

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
        .catch((err: unknown) => {
          if (isStockConflictError(err)) {
            const existing = items.find(
              (i) => i.productId === productId && (i.variant ?? '') === (variant ?? '')
            );
            if (existing) {
              setStockWarningForItem(
                existing.id,
                err instanceof Error ? err.message : 'So luong vuot qua ton kho hien tai.'
              );
            }
          }
          void syncCartFromServer();
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
  }, [isStockConflictError, items, setStockWarningForItem, syncCartFromServer]);

  const removeItem = useCallback((cartItemId: string) => {
    clearStockWarningForItem(cartItemId);
    if (isApiConfigured() && getToken()) {
      backend
        .removeCartItem(cartItemId)
        .then(setItems)
        .catch(() => setItems((prev) => prev.filter((i) => i.id !== cartItemId)));
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  }, [clearStockWarningForItem]);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(cartItemId);
      return;
    }
    if (isApiConfigured() && getToken()) {
      clearStockWarningForItem(cartItemId);
      startUpdating(cartItemId);
      backend
        .updateCartItemQuantity(cartItemId, quantity)
        .then(setItems)
        .catch((err: unknown) => {
          if (isStockConflictError(err)) {
            setStockWarningForItem(
              cartItemId,
              err instanceof Error ? err.message : 'So luong vuot qua ton kho hien tai.'
            );
          }
          void syncCartFromServer();
        })
        .finally(() => stopUpdating(cartItemId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity } : i))
    );
  }, [
    clearStockWarningForItem,
    isStockConflictError,
    removeItem,
    setStockWarningForItem,
    startUpdating,
    stopUpdating,
    syncCartFromServer,
  ]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        totalCount,
        stockWarningsByItemId,
        clearStockWarningForItem,
        isItemUpdating,
      }}
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
