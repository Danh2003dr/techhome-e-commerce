import { getProductDetailExtras } from '@/data';
import type { ProductDetailExtras } from '@/types';

/**
 * Central fallback adapter layer for features not covered by backend contract yet.
 */

export function getFallbackProductDetailExtras(id: string | undefined): ProductDetailExtras | null {
  if (!id) return null;
  return getProductDetailExtras(id);
}
