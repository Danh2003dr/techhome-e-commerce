const KEY = 'techhome_user_purchased_products_v1';

function readMap(): Record<string, string[]> {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as Record<string, string[]>;
    return p && typeof p === 'object' ? p : {};
  } catch {
    return {};
  }
}

function writeMap(m: Record<string, string[]>) {
  window.localStorage.setItem(KEY, JSON.stringify(m));
}

/** Record product ids the user has purchased (mock / client-only), for review eligibility. */
export function recordPurchasedProducts(userId: string, productIds: string[]) {
  if (typeof window === 'undefined' || !userId || !productIds.length) return;
  const map = readMap();
  const key = userId;
  const prev = new Set(map[key] ?? []);
  productIds.forEach((id) => prev.add(String(id)));
  map[key] = [...prev];
  writeMap(map);
}

export function hasPurchasedProduct(userId: string | undefined, productId: string): boolean {
  if (typeof window === 'undefined' || !userId) return false;
  const ids = readMap()[userId];
  return Array.isArray(ids) && ids.includes(String(productId));
}
