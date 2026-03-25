import {
  categories as mockCategories,
  trendingProducts as mockTrendingProducts,
  listingProducts as mockListingProducts,
  orderHistoryCards,
  orderConfirmationSample,
  getOrderDetails,
  getProductDetailExtras,
} from '@/data';
import type {
  Category,
  TrendingProduct,
  ListingProduct,
  Product,
  ProductDetailExtras,
  OrderHistoryCardItem,
  OrderDetailsData,
  OrderConfirmationData,
} from '@/types';
import { resolveProductById } from '@/services/productCatalogBridge';
import { getAdminProducts } from '@/services/adminMockStore';
import { mapAdminProductToTrending } from '@/services/productCatalogBridge';

/**
 * Central fallback adapter layer:
 * - Keep all temporary mock sources in one place.
 * - UI pages should consume these helpers instead of importing mock data directly.
 */

export function getFallbackCategories(): Category[] {
  return mockCategories;
}

export function getFallbackTrendingProducts(): TrendingProduct[] {
  const fromAdmin = getAdminProducts()
    .filter((p) => p.featured)
    .map(mapAdminProductToTrending);
  return [...fromAdmin, ...mockTrendingProducts].slice(0, 12);
}

export function getFallbackListingProducts(): ListingProduct[] {
  return mockListingProducts;
}

export function getFallbackProductById(id: string | undefined): Product | undefined {
  if (!id) return undefined;
  return resolveProductById(id);
}

export function getFallbackProductDetailExtras(id: string | undefined): ProductDetailExtras | null {
  if (!id) return null;
  return getProductDetailExtras(id);
}

export function getFallbackOrderHistoryCards(): OrderHistoryCardItem[] {
  return orderHistoryCards;
}

export function getFallbackOrderDetails(orderId: string | undefined): OrderDetailsData | null {
  if (!orderId) return null;
  return getOrderDetails(orderId) ?? null;
}

export function getFallbackOrderConfirmation(): OrderConfirmationData {
  return orderConfirmationSample;
}
