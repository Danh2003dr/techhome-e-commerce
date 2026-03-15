/**
 * Map backend DTOs to frontend types for display.
 */

import type { CategoryDto, ProductDto } from '@/types/api';
import type { Category, Product, TrendingProduct, ListingProduct } from '@/types';

const slugToIcon: Record<string, string> = {
  mobile: 'smartphone',
  smartphones: 'smartphone',
  tablets: 'tablet',
  tablet: 'tablet',
  accessories: 'keyboard',
  audio: 'headset',
  cooling: 'ac_unit',
  'smart-home': 'tv',
};

export function mapCategoryDtoToCategory(dto: CategoryDto): Category {
  return {
    id: String(dto.id),
    name: dto.name,
    slug: dto.slug,
    icon: slugToIcon[dto.slug] ?? 'category',
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
    specifications: dto.specifications ?? undefined,
    colors: dto.colors?.length ? dto.colors : undefined,
    storageOptions: dto.storageOptions?.length ? dto.storageOptions : undefined,
  };
}
