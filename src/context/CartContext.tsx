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
  clearCart: () => void;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  const isLoggedIn = Boolean(getToken());

  // Lắng nghe event logout để clear giỏ hàng ngay lập tức
  useEffect(() => {
    const onLogout = () => {
      setItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    };
    window.addEventListener('techhome:logout', onLogout);
    return () => window.removeEventListener('techhome:logout', onLogout);
  }, []);

  useEffect(() => {
    setItems(loadCartFromStorage());
    setInitialized(true);

    if (isApiConfigured() && isLoggedIn) {
      backend
        .getCart()
        .then((cart) => {
          const list = Array.isArray(cart) ? cart : [];
          setItems(list);
          saveCartToStorage(list);
        })
        .catch(() => {/* keep localStorage cart on API error */});
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
        .then((res) => { if (Array.isArray(res)) setItems(res); })
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
        .then((res) => { if (Array.isArray(res)) setItems(res); else setItems((prev) => prev.filter((i) => i.id !== cartItemId)); })
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
        .then((res) => { if (Array.isArray(res)) setItems(res); })
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

  const clearCart = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // ignore
    }
    // Không gọi backend ở đây để tránh phụ thuộc endpoint; chỉ xóa UI/local trước.
  }, []);

  const safeItems = Array.isArray(items) ? items : [];
  const totalCount = safeItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items: safeItems, addItem, removeItem, updateQuantity, clearCart, totalCount }}
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
