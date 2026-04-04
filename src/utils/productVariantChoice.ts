import type { Product } from '@/types';

/**
 * Dùng cho DTO listing/featured: cần vào trang chi tiết để chọn màu hoặc dung lượng
 * (giống luồng trên PDP — không thêm nhanh từ lưới).
 */
export function productDtoNeedsPdpBeforeAddToCart(dto: {
  colors?: { name?: string | null }[] | null;
  storageOptions?: (string | null | undefined)[] | null;
}): boolean {
  const colorCount = dto.colors?.filter((c) => String(c?.name ?? '').trim()).length ?? 0;
  const storageCount = dto.storageOptions?.filter((s) => String(s ?? '').trim()).length ?? 0;
  if (colorCount > 1 || storageCount > 1) return true;
  if (colorCount >= 1 && storageCount >= 1) return true;
  return false;
}

type CartListingShape = Pick<Product, 'colors' | 'storageOptions' | 'variants'> & {
  requiresVariantChoice?: boolean;
};

/**
 * Thẻ sản phẩm / listing: có bắt buộc mở PDP trước khi thêm giỏ không.
 */
export function productRequiresDetailForAddToCart(p: CartListingShape): boolean {
  if (p.requiresVariantChoice === true) return true;
  if (p.requiresVariantChoice === false) return false;
  if (p.variants && p.variants.length > 1) return true;
  let colorCount = 0;
  let storageCount = 0;
  if (p.variants?.length) {
    colorCount = new Set(p.variants.map((v) => v.color).filter(Boolean)).size;
    storageCount = new Set(p.variants.map((v) => v.storage).filter(Boolean)).size;
  } else {
    colorCount = p.colors?.length ?? 0;
    storageCount = p.storageOptions?.length ?? 0;
  }
  if (colorCount > 1 || storageCount > 1) return true;
  if (colorCount >= 1 && storageCount >= 1) return true;
  return false;
}
