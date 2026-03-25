/**
 * Sale / list price helpers for storefront display.
 */

export function discountPercentFromPrices(listPrice: number, salePrice: number): number {
  if (!(listPrice > 0) || !(salePrice >= 0) || salePrice >= listPrice) return 0;
  return Math.round(((listPrice - salePrice) / listPrice) * 100);
}

export function effectiveUnitPrice(listPrice: number, salePrice?: number | null): number {
  if (salePrice != null && salePrice > 0 && salePrice < listPrice) return salePrice;
  return listPrice;
}
