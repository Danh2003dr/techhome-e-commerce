/**
 * Map backend DTOs to frontend types for display.
 */

import type { CategoryDto, ProductDto } from '@/types/api';
import type { Category, Product, TrendingProduct, ListingProduct } from '@/types';
import { discountPercentFromPrices, effectiveUnitPrice } from '@/utils/pricing';
import { productDtoNeedsPdpBeforeAddToCart } from '@/utils/productVariantChoice';

/** Giá list + sale + đơn giá hiển thị — dùng chung cho map product DTO. */
function computeProductPricing(dto: ProductDto) {
  const listPrice = Number(dto.price);
  const sale = dto.salePrice != null && dto.salePrice > 0 ? Number(dto.salePrice) : null;
  const price = effectiveUnitPrice(listPrice, sale);
  const onSale = sale != null && sale < listPrice;
  return { listPrice, sale, price, onSale };
}

function primaryImageFromDto(dto: ProductDto): string {
  return (dto.images && dto.images.length > 0 ? dto.images[0] : null) ?? dto.image ?? '';
}

function galleryFromDto(dto: ProductDto): string[] {
  if (dto.images && dto.images.length > 0) return dto.images;
  if (dto.image) return [dto.image];
  return [];
}

/** Chuẩn hóa màu từ API — backend: `{ name, hex }`; hex không hợp lệ → xám mặc định. */
function normalizeColorsFromDto(dto: ProductDto): Product['colors'] | undefined {
  if (!dto.colors?.length) return undefined;
  const fallbackHex = '#6b7280';
  const out: { name: string; hex: string }[] = [];
  for (const c of dto.colors) {
    const name = String(c.name ?? '').trim();
    if (!name) continue;
    const raw = String(c.hex ?? '').trim();
    const hex = /^#[0-9A-Fa-f]{6}$/.test(raw) ? raw : fallbackHex;
    out.push({ name, hex });
  }
  return out.length ? out : undefined;
}

function normalizeStorageOptionsFromDto(dto: ProductDto): string[] | undefined {
  if (!dto.storageOptions?.length) return undefined;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of dto.storageOptions) {
    const v = String(s ?? '').trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out.length ? out : undefined;
}

const slugToIcon: Record<string, string> = {
  mobile: 'smartphone',
  smartphones: 'smartphone',
  'dien-thoai': 'smartphone',
  tablets: 'tablet',
  tablet: 'tablet',
  accessories: 'keyboard',
  'phu-kien': 'keyboard',
  audio: 'headset',
  'am-thanh': 'headset',
  cooling: 'ac_unit',
  'smart-home': 'tv',
  laptop: 'laptop',
  laptops: 'laptop',
  smartwatch: 'watch',
  'dong-ho-thong-minh': 'watch',
};

/** Alias tên icon API → tên Material Icons dùng trong UI */
const iconAliases: Record<string, string> = {
  headset: 'headphones',
  headphones: 'headphones',
};

function resolveCategoryIcon(dto: CategoryDto): string {
  const raw = dto.icon != null ? String(dto.icon).trim() : '';
  if (raw) return iconAliases[raw] ?? raw;
  return slugToIcon[dto.slug] ?? 'devices';
}

export function mapCategoryDtoToCategory(dto: CategoryDto): Category {
  const img = dto.imageUrl != null ? String(dto.imageUrl).trim() : '';
  return {
    id: String(dto.id),
    name: dto.name,
    slug: dto.slug,
    parentId: dto.parentId ?? undefined,
    icon: resolveCategoryIcon(dto),
    imageUrl: img || undefined,
  };
}

export function mapProductDtoToTrending(dto: ProductDto): TrendingProduct {
  const { listPrice, sale, price, onSale } = computeProductPricing(dto);
  const oldPrice = onSale ? listPrice : dto.featured ? Math.round(listPrice * 1.15) : undefined;
  const discountPercent = onSale && sale != null ? discountPercentFromPrices(listPrice, sale) : undefined;
  const img = primaryImageFromDto(dto);
  return {
    id: String(dto.id),
    name: dto.name,
    category: dto.categoryName,
    slug: dto.slug,
    image: img,
    price,
    oldPrice,
    discountPercent,
    rating: 4,
    reviews: 0,
    isBestSeller: dto.featured,
    productDetailId: String(dto.id),
    requiresVariantChoice: productDtoNeedsPdpBeforeAddToCart(dto),
  };
}

export function mapProductDtoToListing(dto: ProductDto): ListingProduct {
  const { listPrice, sale, price, onSale } = computeProductPricing(dto);
  const img = primaryImageFromDto(dto);
  return {
    id: String(dto.id),
    name: dto.name,
    price,
    oldPrice: onSale ? listPrice : undefined,
    discountPercent: onSale && sale != null ? discountPercentFromPrices(listPrice, sale) : undefined,
    image: img,
    rating: 4,
    reviews: 0,
    productDetailId: String(dto.id),
    slug: dto.slug,
    requiresVariantChoice: productDtoNeedsPdpBeforeAddToCart(dto),
  };
}

export function mapProductDtoToProduct(dto: ProductDto): Product {
  const { listPrice, sale, price, onSale } = computeProductPricing(dto);
  const gallery = galleryFromDto(dto);
  const image = gallery[0] ?? dto.image ?? '';
  const sku = dto.sku != null && String(dto.sku).trim() !== '' ? String(dto.sku).trim() : undefined;
  const tag = dto.tag != null && String(dto.tag).trim() !== '' ? String(dto.tag).trim() : undefined;
  const stockNum = dto.stock != null ? Math.max(0, Number(dto.stock)) : 0;

  return {
    id: String(dto.id),
    name: dto.name,
    category: dto.categoryName,
    price,
    oldPrice: onSale ? listPrice : undefined,
    salePrice: onSale && sale != null ? sale : undefined,
    rating: 4,
    reviews: 0,
    image,
    images: gallery.length ? gallery : undefined,
    description: dto.description ?? undefined,
    stock: stockNum,
    inStock: stockNum > 0,
    specifications: dto.specifications ?? undefined,
    colors: normalizeColorsFromDto(dto),
    storageOptions: normalizeStorageOptionsFromDto(dto),
    sku,
    tag,
    slug: dto.slug,
    requiresVariantChoice: productDtoNeedsPdpBeforeAddToCart(dto),
  };
}
