import type { ProductReview } from '@/types';

const KEY = 'techhome_product_reviews_v1';

export type StoredProductReview = ProductReview & {
  id: string;
  productId: string;
  userId: string;
};

function safeRead(): StoredProductReview[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredProductReview[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function safeWrite(list: StoredProductReview[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function getStoredReviewsForProduct(productId: string): StoredProductReview[] {
  if (typeof window === 'undefined') return [];
  return safeRead().filter((r) => r.productId === productId);
}

export function addStoredReview(input: {
  productId: string;
  userId: string;
  authorName: string;
  rating: number;
  text: string;
  photos: string[];
}): StoredProductReview[] {
  if (typeof window === 'undefined') return [];
  const list = safeRead();
  const initials = input.authorName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';
  const row: StoredProductReview = {
    id: `rv_${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`,
    productId: input.productId,
    userId: input.userId,
    author: input.authorName,
    initials,
    rating: input.rating,
    date: new Date().toISOString().slice(0, 10),
    text: input.text.trim(),
    verified: true,
    photos: input.photos,
  };
  const next = [row, ...list];
  safeWrite(next);
  return next.filter((r) => r.productId === input.productId);
}
