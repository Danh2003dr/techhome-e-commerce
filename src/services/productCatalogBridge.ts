/**
 * Merge mock/API catalog with admin localStorage products for storefront resolution.
 */

import type { Product, TrendingProduct, ListingProduct } from '@/types';
import { getProductById as getMockProductById } from '@/data';
import { getAdminProducts, type AdminProduct } from '@/services/adminMockStore';
import { discountPercentFromPrices, effectiveUnitPrice } from '@/utils/pricing';

function specsToJsonString(specs: { key: string; value: string }[]): string | null {
  if (!specs.length) return null;
  const flat: Record<string, string> = {};
  specs.forEach((s) => {
    if (s.key.trim()) flat[s.key.trim()] = s.value;
  });
  return Object.keys(flat).length ? JSON.stringify(flat) : null;
}

export function mapAdminProductToProduct(p: AdminProduct): Product {
  const images = p.images?.filter(Boolean).length ? p.images : [''];
  const listPrice = Number(p.price) || 0;
  const sale = p.salePrice != null && p.salePrice > 0 ? Number(p.salePrice) : null;
  const effective = effectiveUnitPrice(listPrice, sale);
  const totalStock = p.variants?.length
    ? p.variants.reduce((s, v) => s + (Number(v.stock) || 0), 0)
    : Number(p.stock) || 0;
  const firstSku = p.variants?.[0]?.sku;

  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: effective,
    oldPrice: sale != null && sale < listPrice ? listPrice : undefined,
    salePrice: sale != null && sale < listPrice ? sale : undefined,
    rating: 4.5,
    reviews: 0,
    image: images[0] || '',
    images,
    description: p.description,
    sku: firstSku,
    inStock: totalStock > 0,
    specifications: specsToJsonString(p.specs),
    isBestSeller: p.featured,
    variants: p.variants?.map((v) => ({
      sku: v.sku,
      color: v.color,
      storage: v.storage,
      size: v.size,
      stock: v.stock,
      price: v.price,
    })),
  };
}

export function mapAdminProductToTrending(p: AdminProduct): TrendingProduct {
  const prod = mapAdminProductToProduct(p);
  const listPrice = Number(p.price) || 0;
  const sale = p.salePrice != null && p.salePrice > 0 ? Number(p.salePrice) : null;
  const pct = sale != null && sale < listPrice ? discountPercentFromPrices(listPrice, sale) : undefined;
  return {
    id: prod.id,
    name: prod.name,
    category: prod.category,
    image: prod.image,
    price: prod.price,
    oldPrice: prod.oldPrice,
    discountPercent: pct,
    rating: prod.rating,
    reviews: prod.reviews,
    isBestSeller: p.featured,
    productDetailId: prod.id,
  };
}

export function mapAdminProductToListing(p: AdminProduct): ListingProduct {
  const t = mapAdminProductToTrending(p);
  return {
    id: t.id,
    name: t.name,
    price: t.price,
    oldPrice: t.oldPrice,
    discountPercent: t.discountPercent,
    rating: t.rating,
    reviews: t.reviews,
    image: t.image,
    productDetailId: t.productDetailId,
  };
}

/** Resolve product for PDP: mock/API id first, then admin catalog. */
export function resolveProductById(id: string | undefined): Product | undefined {
  if (!id) return undefined;
  const fromMock = getMockProductById(id);
  if (fromMock) return fromMock;
  const admin = getAdminProducts().find((p) => p.id === id);
  return admin ? mapAdminProductToProduct(admin) : undefined;
}
