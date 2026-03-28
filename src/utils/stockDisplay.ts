/**
 * Hiển thị trạng thái tồn trên storefront — ngưỡng "sắp hết" cố định phía FE.
 */

import type { Product } from '@/types';

/** Gồm cả 1: từ 1 đến ngưỡng (kể cả) được coi là sắp hết. */
export const LOW_STOCK_THRESHOLD = 5;

export type StockDisplay = {
  kind: 'out' | 'low' | 'ok';
  label: string;
  textClass: string;
  canPurchase: boolean;
};

export function getProductStockDisplay(product: Product): StockDisplay {
  const raw = product.stock;
  if (raw !== undefined && raw !== null && !Number.isNaN(Number(raw))) {
    const s = Math.max(0, Math.floor(Number(raw)));
    if (s <= 0) {
      return { kind: 'out', label: 'Hết hàng', textClass: 'text-red-600 dark:text-red-400', canPurchase: false };
    }
    if (s <= LOW_STOCK_THRESHOLD) {
      return {
        kind: 'low',
        label: `Chỉ còn ${s} sản phẩm · Sắp hết hàng`,
        textClass: 'text-amber-600 dark:text-amber-500',
        canPurchase: true,
      };
    }
    return {
      kind: 'ok',
      label: 'Còn hàng · Sẵn sàng giao',
      textClass: 'text-green-600 dark:text-green-500',
      canPurchase: true,
    };
  }
  if (product.inStock === false) {
    return { kind: 'out', label: 'Hết hàng', textClass: 'text-red-600 dark:text-red-400', canPurchase: false };
  }
  return {
    kind: 'ok',
    label: 'Còn hàng · Sẵn sàng giao',
    textClass: 'text-green-600 dark:text-green-500',
    canPurchase: true,
  };
}
