/**
 * Định tuyến storefront + map slug query ↔ danh mục API (slug EN/VN có thể khác nhau).
 */

import type { Category } from '@/types';

/** Nhóm slug tương đương (một danh mục trong DB chỉ có một slug). */
export const slugGroups = {
  mobile: ['mobile', 'smartphones', 'dien-thoai'],
  accessories: ['accessories', 'phu-kien'],
  audio: ['audio', 'am-thanh'],
  tablet: ['tablet', 'tablets'],
  laptop: ['laptop', 'laptops'],
  smartwatch: ['smartwatch', 'dong-ho-thong-minh', 'smart-watch'],
} as const;

export function findCategoryInGroup(categories: Category[], group: readonly string[]): Category | undefined {
  return categories.find((c) => group.includes(c.slug));
}

/** `?category=` trên /search → id số cho GET /products?category= */
export function findCategoryIdByUrlSlug(categories: Category[], urlSlug: string): number | undefined {
  if (!urlSlug) return undefined;
  const u = urlSlug.trim().toLowerCase();
  const direct = categories.find((c) => c.slug === u);
  if (direct) {
    const n = Number(direct.id);
    return Number.isFinite(n) ? n : undefined;
  }
  const allGroups = Object.values(slugGroups) as unknown as string[][];
  const group = allGroups.find((g) => g.includes(u));
  if (!group) return undefined;
  const cat = categories.find((c) => group.includes(c.slug));
  if (!cat) return undefined;
  const n = Number(cat.id);
  return Number.isFinite(n) ? n : undefined;
}

/** Link đích cho một danh mục (dropdown header) — luôn dùng `/category/:slug`. */
export function resolveStorefrontPathForCategorySlug(slug: string): string {
  const s = String(slug).trim();
  return `/category/${encodeURIComponent(s)}`;
}
