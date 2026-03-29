/**
 * Maps PLP dropdown labels → `GET /api/products?sort=` (backend_nodejs Product.findCatalog).
 * `undefined` = omit param → server default (id ascending).
 */

export type CatalogSortApiValue = 'id_desc' | 'price_asc' | 'price_desc' | 'popular';

export function storefrontSortLabelToApiSort(sortBy: string): CatalogSortApiValue | undefined {
  const s = sortBy.trim();
  if (s === 'Price: Low to High') return 'price_asc';
  if (s === 'Price: High to Low') return 'price_desc';
  if (s === 'Newest Arrivals' || s === 'Newest First') return 'id_desc';
  if (s === 'Most Popular' || s === 'Popularity' || s === 'Customer Rating') return 'popular';
  return undefined;
}
