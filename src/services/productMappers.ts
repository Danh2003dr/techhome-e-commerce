/**
 * Map backend DTOs to frontend types for display.
 */

import type { CategoryDto, ProductDto } from '@/types/api';
import type { Category, Product, TrendingProduct, ListingProduct } from '@/types';

/** Sinh slug từ tên danh mục (bỏ dấu, lowercase, gạch ngang) */
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Map slug/tên → icon Material Symbol */
const iconMap: Record<string, string> = {
  mobile: 'smartphone',
  smartphone: 'smartphone',
  'dien-thoai': 'smartphone',
  tablets: 'tablet',
  tablet: 'tablet',
  'may-tinh-bang': 'tablet',
  accessories: 'keyboard',
  'phu-kien': 'keyboard',
  audio: 'headset',
  'am-thanh': 'headset',
  cooling: 'ac_unit',
  'lam-mat': 'ac_unit',
  'smart-home': 'tv',
  'nha-thong-minh': 'tv',
};

export function mapCategoryDtoToCategory(dto: CategoryDto): Category {
  const slug = nameToSlug(dto.name);
  return {
    id: String(dto.id),
    name: dto.name,
    slug,
    icon: iconMap[slug] ?? 'category',
  };
}

export function mapProductDtoToTrending(dto: ProductDto): TrendingProduct {
  const price = Number(dto.price);
  return {
    id: String(dto.id),
    name: dto.name,
    category: dto.categoryName,
    image: dto.image ?? '',
    price,
    oldPrice: dto.featured ? Math.round(price * 1.15) : undefined,
    rating: 4,
    reviews: 0,
    isBestSeller: dto.featured,
    productDetailId: String(dto.id),
  };
}

export function mapProductDtoToListing(dto: ProductDto): ListingProduct {
  return {
    id: String(dto.id),
    name: dto.name,
    price: dto.price,
    image: dto.image ?? '',
    rating: 4,
    reviews: 0,
    productDetailId: String(dto.id),
  };
}

export function mapProductDtoToProduct(dto: ProductDto): Product {
  const image = dto.image ?? '';
  return {
    id: String(dto.id),
    name: dto.name,
    category: dto.categoryName,
    price: dto.price,
    rating: 4,
    reviews: 0,
    image,
    images: image ? [image] : undefined,
    description: dto.description ?? undefined,
    inStock: dto.stock > 0,
  };
}
