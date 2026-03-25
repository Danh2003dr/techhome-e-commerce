/**
 * Map backend DTOs to frontend types for display.
 */

import type { CategoryDto, ProductDto } from '@/types/api';
import type { Category, Product, TrendingProduct, ListingProduct } from '@/types';
import { discountPercentFromPrices, effectiveUnitPrice } from '@/utils/pricing';

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
  const listPrice = Number(dto.price);
  const sale =
    dto.salePrice != null && dto.salePrice > 0 ? Number(dto.salePrice) : null;
  const price = effectiveUnitPrice(listPrice, sale);
  const onSale = sale != null && sale < listPrice;
  const oldPrice = onSale ? listPrice : dto.featured ? Math.round(listPrice * 1.15) : undefined;
  const discountPercent = onSale ? discountPercentFromPrices(listPrice, sale) : undefined;
  const img =
    (dto.images && dto.images.length > 0 ? dto.images[0] : null) ?? dto.image ?? '';
  return {
    id: String(dto.id),
    name: dto.name,
    category: dto.categoryName,
    image: img,
    price,
    oldPrice,
    discountPercent,
    rating: 4,
    reviews: 0,
    isBestSeller: dto.featured,
    productDetailId: String(dto.id),
  };
}

export function mapProductDtoToListing(dto: ProductDto): ListingProduct {
  const listPrice = Number(dto.price);
  const sale =
    dto.salePrice != null && dto.salePrice > 0 ? Number(dto.salePrice) : null;
  const price = effectiveUnitPrice(listPrice, sale);
  const onSale = sale != null && sale < listPrice;
  const img =
    (dto.images && dto.images.length > 0 ? dto.images[0] : null) ?? dto.image ?? '';
  return {
    id: String(dto.id),
    name: dto.name,
    price,
    oldPrice: onSale ? listPrice : undefined,
    discountPercent: onSale ? discountPercentFromPrices(listPrice, sale!) : undefined,
    image: img,
    rating: 4,
    reviews: 0,
    productDetailId: String(dto.id),
  };
}

export function mapProductDtoToProduct(dto: ProductDto): Product {
  const listPrice = Number(dto.price);
  const sale =
    dto.salePrice != null && dto.salePrice > 0 ? Number(dto.salePrice) : null;
  const price = effectiveUnitPrice(listPrice, sale);
  const onSale = sale != null && sale < listPrice;
  const gallery =
    dto.images && dto.images.length > 0
      ? dto.images
      : dto.image
        ? [dto.image]
        : [];
  const image = gallery[0] ?? dto.image ?? '';
  return {
    id: String(dto.id),
    name: dto.name,
    category: dto.categoryName,
    price,
    oldPrice: onSale ? listPrice : undefined,
    salePrice: onSale ? sale! : undefined,
    rating: 4,
    reviews: 0,
    image,
    images: gallery.length ? gallery : undefined,
    description: dto.description ?? undefined,
    inStock: dto.stock > 0,
    specifications: dto.specifications ?? undefined,
    colors: dto.colors?.length ? dto.colors : undefined,
    storageOptions: dto.storageOptions?.length ? dto.storageOptions : undefined,
  };
}
