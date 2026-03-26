import {
  orderConfirmationSample,
  getProductDetailExtras,
} from '@/data';
import type {
  ProductDetailExtras,
  OrderConfirmationData,
} from '@/types';

/**
 * Central fallback adapter layer:
 * - Keep all temporary mock sources in one place.
 * - UI pages should consume these helpers instead of importing mock data directly.
 *
 * Only keep fallbacks for features not covered by backend contract yet.
 */

export function getFallbackProductDetailExtras(id: string | undefined): ProductDetailExtras | null {
  if (!id) return null;
  return getProductDetailExtras(id);
}

export function getFallbackOrderConfirmation(): OrderConfirmationData {
  return orderConfirmationSample;
}
