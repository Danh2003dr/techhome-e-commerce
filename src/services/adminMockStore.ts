/* eslint-disable @typescript-eslint/no-explicit-any */

export type AdminOrderStatus = 'Completed' | 'Processing' | 'Rejected' | 'On Hold' | 'In Transit' | 'Shipping';

export type AdminProductSpec = { id: string; key: string; value: string };

export type AdminProductVariant = {
  id: string;
  sku: string;
  color?: string;
  storage?: string;
  size?: string;
  stock: number;
  price?: number;
};

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  featured: boolean;
  colors: string[];
  description: string;
  images: string[];
  specs: AdminProductSpec[];
  /** Promotional price; when lower than `price`, item is on sale. */
  salePrice?: number | null;
  variants: AdminProductVariant[];
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
};

export type VoucherDiscountType = 'percent' | 'fixed';

export type AdminVoucher = {
  id: string;
  code: string;
  discountType: VoucherDiscountType;
  /** percent 1–100 or fixed amount in same currency as storefront */
  value: number;
  expiresAt: string;
  maxUses: number;
  usedCount: number;
  active: boolean;
};

export type AdminOrderItem = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  address: string;
  date: string;
  type: string;
  status: AdminOrderStatus;
  items: AdminOrderItem[];
};

export type AdminSEO = {
  siteName: string;
  copyright: string;
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
  metaTags: string;
  logoDataUrl?: string;
};

export type AdminCalendarEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  time: string;
  description: string;
};

const KEYS = {
  products: 'techhome_admin_products_mock_v1',
  productsV2: 'techhome_admin_products_mock_v2',
  categories: 'techhome_admin_categories_mock_v1',
  vouchers: 'techhome_admin_vouchers_mock_v1',
  orders: 'techhome_admin_orders_mock_v1',
  seo: 'techhome_admin_seo_mock_v1',
  calendarEvents: 'techhome_admin_calendar_events_mock_v1',
} as const;

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

/** Public id helper for new admin entities (products, etc.). */
export function newEntityId(prefix = 'p') {
  return uid(prefix);
}

function safeReadJSON<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeWriteJSON(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeVariant(v: any, fallbackStock: number): AdminProductVariant {
  return {
    id: String(v?.id ?? uid('var')),
    sku: String(v?.sku ?? `SKU-${uid('').slice(-6)}`),
    color: v?.color ? String(v.color) : undefined,
    storage: v?.storage ? String(v.storage) : undefined,
    size: v?.size ? String(v.size) : undefined,
    stock: Number(v?.stock ?? fallbackStock) || 0,
    price: v?.price != null && v.price !== '' ? Number(v.price) : undefined,
  };
}

function normalizeAdminProduct(raw: any): AdminProduct {
  const id = String(raw?.id ?? '');
  const price = Number(raw?.price ?? 0);
  const stock = Number(raw?.stock ?? 0);
  const specs: AdminProductSpec[] = Array.isArray(raw?.specs)
    ? raw.specs.map((s: any) => ({
        id: String(s?.id ?? uid('spec')),
        key: String(s?.key ?? ''),
        value: String(s?.value ?? ''),
      }))
    : [];
  const images: string[] = Array.isArray(raw?.images) ? raw.images.map(String) : [];
  const colors: string[] = Array.isArray(raw?.colors) ? raw.colors.map(String) : [];
  let variants: AdminProductVariant[] = [];
  if (Array.isArray(raw?.variants) && raw.variants.length > 0) {
    variants = raw.variants.map((v: any) => normalizeVariant(v, stock));
  } else {
    variants = [
      {
        id: uid('var'),
        sku: String(raw?.sku ?? `SKU-${id.replace(/\W/g, '').slice(0, 8) || 'DEF'}`),
        stock,
        price: undefined,
      },
    ];
  }
  const saleRaw = raw?.salePrice;
  const salePrice = saleRaw == null || saleRaw === '' ? null : Number(saleRaw);

  return {
    id,
    name: String(raw?.name ?? ''),
    category: String(raw?.category ?? 'Uncategorized'),
    price,
    stock,
    featured: Boolean(raw?.featured),
    colors,
    description: String(raw?.description ?? ''),
    images,
    specs,
    salePrice: Number.isFinite(salePrice) ? salePrice : null,
    variants,
  };
}

function migrateProductsFromV1(): void {
  const v2 = safeReadJSON<any[]>(KEYS.productsV2);
  if (v2?.length) return;
  const v1 = safeReadJSON<any[]>(KEYS.products);
  if (!v1?.length) return;
  const next = v1.map((p) => normalizeAdminProduct(p));
  safeWriteJSON(KEYS.productsV2, next);
}

export function initAdminMockData() {
  if (typeof window === 'undefined') return;
  seedIfMissing();
}

function defaultAdminOrders(): AdminOrder[] {
  return [
    {
      id: '00001',
      customerName: 'Christine Brooks',
      address: '089 Kutch Green Apt.',
      date: '14 Feb 2019',
      type: 'Health & Beauty',
      status: 'Completed',
      items: [
        { id: uid('it'), productName: 'iPhone X', quantity: 1, unitPrice: 1000 },
        { id: uid('it'), productName: 'Children Toy', quantity: 2, unitPrice: 20 },
      ],
    },
    {
      id: '00002',
      customerName: 'Rosie Pearson',
      address: '979 Immanuel Ferry Suite 526',
      date: '15 Feb 2019',
      type: 'Book & Stationery',
      status: 'Processing',
      items: [
        { id: uid('it'), productName: 'Asian Laptop', quantity: 1, unitPrice: 500 },
        { id: uid('it'), productName: 'Makeup', quantity: 2, unitPrice: 50 },
      ],
    },
    {
      id: '00003',
      customerName: 'Darrel Caldwell',
      address: '8587 Frida Ports',
      date: '16 Feb 2019',
      type: 'Services & Industry',
      status: 'Rejected',
      items: [{ id: uid('it'), productName: 'Headphones', quantity: 1, unitPrice: 199 }],
    },
    {
      id: '00004',
      customerName: 'Evelyn Parker',
      address: '221 Shoreline Avenue',
      date: '17 Feb 2019',
      type: 'Electronics',
      status: 'In Transit',
      items: [
        { id: uid('it'), productName: 'Smart Watch', quantity: 1, unitPrice: 199 },
        { id: uid('it'), productName: 'Audio Cable', quantity: 3, unitPrice: 15 },
      ],
    },
    {
      id: '00005',
      customerName: 'Nathan Brooks',
      address: '44 Riverside Road',
      date: '18 Feb 2019',
      type: 'Mobile & Phone',
      status: 'On Hold',
      items: [{ id: uid('it'), productName: 'Phone Case', quantity: 2, unitPrice: 25 }],
    },
  ];
}

function seedIfMissing() {
  migrateProductsFromV1();

  const hasProducts = (safeReadJSON<any[]>(KEYS.productsV2)?.length ?? 0) > 0;
  if (!hasProducts) {

  const products: AdminProduct[] = [
    normalizeAdminProduct({
      id: 'p_1',
      name: 'Apple Watch Series 4',
      category: 'Digital Product',
      price: 699,
      salePrice: 599,
      stock: 63,
      featured: true,
      colors: ['Black', 'Silver', 'Blue'],
      description: 'Smartwatch placeholder description for Admin UI.',
      images: ['https://picsum.photos/seed/admin-prod-1/240/240'],
      specs: [
        { id: uid('spec'), key: 'Weight', value: '250g' },
        { id: uid('spec'), key: 'Battery', value: '3000mAh' },
      ],
      variants: [
        { id: uid('var'), sku: 'AW-S4-BLK-40', color: 'Black', stock: 20, price: 699 },
        { id: uid('var'), sku: 'AW-S4-SLV-40', color: 'Silver', stock: 25, price: 699 },
        { id: uid('var'), sku: 'AW-S4-BLU-44', color: 'Blue', stock: 18, price: 729 },
      ],
    }),
    normalizeAdminProduct({
      id: 'p_2',
      name: 'Microsoft Headsquare',
      category: 'Digital Product',
      price: 190,
      stock: 13,
      featured: false,
      colors: ['Red', 'Green'],
      description: 'Placeholder product description for Admin UI.',
      images: ['https://picsum.photos/seed/admin-prod-2/240/240'],
      specs: [{ id: uid('spec'), key: 'Trong hộp', value: 'Cable, quick guide' }],
      variants: [{ id: uid('var'), sku: 'MS-HS-01', stock: 13 }],
    }),
  ];

    const orders: AdminOrder[] = defaultAdminOrders();

  const seo: AdminSEO = {
    siteName: 'TechHome',
    copyright: 'All rights reserved by TechHome',
    seoTitle: 'TechHome e-commerce',
    seoKeywords: 'techhome, ecommerce, mobile, audio',
    seoDescription: 'TechHome is an e-commerce platform for modern devices.',
    metaTags: 'og:title, og:description, twitter:card',
    logoDataUrl: undefined,
  };

  const calendarEvents: AdminCalendarEvent[] = [
    {
      id: 'e1',
      title: 'Design Conference',
      date: 'Oct 5',
      location: 'Lyndon Convention Center',
      time: '12:30 BOT',
      description: 'A design conference placeholder event with static data to match the template UI state.',
    },
    {
      id: 'e2',
      title: 'Weekend Festival',
      date: 'Oct 12',
      location: 'Central Park',
      time: '8:00 PM',
      description: 'Festival details placeholder for Dashboard #19 event detail overlay.',
    },
    {
      id: 'e3',
      title: 'Glastonbury Festival',
      date: 'Oct 16',
      location: 'Glastonbury',
      time: '6:00 PM',
      description: 'Glastonbury festival placeholder.',
    },
  ];

    safeWriteJSON(KEYS.productsV2, products);
    safeWriteJSON(KEYS.orders, orders);
    safeWriteJSON(KEYS.seo, seo);
    safeWriteJSON(KEYS.calendarEvents, calendarEvents);
    seedCategories();
    seedVouchers();
    return;
  }

  if (!safeReadJSON(KEYS.orders)) {
    safeWriteJSON(KEYS.orders, defaultAdminOrders());
  }
  if (!safeReadJSON(KEYS.categories)) seedCategories();
  if (!safeReadJSON(KEYS.vouchers)) seedVouchers();
  if (!safeReadJSON(KEYS.seo)) {
    safeWriteJSON(KEYS.seo, {
      siteName: 'TechHome',
      copyright: 'All rights reserved by TechHome',
      seoTitle: 'TechHome e-commerce',
      seoKeywords: 'techhome, ecommerce, mobile, audio',
      seoDescription: 'TechHome is an e-commerce platform for modern devices.',
      metaTags: 'og:title, og:description, twitter:card',
      logoDataUrl: undefined,
    });
  }
  if (!safeReadJSON(KEYS.calendarEvents)) {
    safeWriteJSON(KEYS.calendarEvents, []);
  }
}

function seedCategories() {
  const list: AdminCategory[] = [
    { id: 'cat_mobile', name: 'Mobile', slug: 'mobile' },
    { id: 'cat_tablets', name: 'Tablets', slug: 'tablets' },
    { id: 'cat_acc', name: 'Accessories', slug: 'accessories' },
    { id: 'cat_audio', name: 'Audio', slug: 'audio' },
    { id: 'cat_dig', name: 'Digital Product', slug: 'digital-product' },
  ];
  safeWriteJSON(KEYS.categories, list);
}

function seedVouchers() {
  const expires = new Date();
  expires.setMonth(expires.getMonth() + 3);
  const list: AdminVoucher[] = [
    {
      id: uid('voc'),
      code: 'TECH10',
      discountType: 'percent',
      value: 10,
      expiresAt: expires.toISOString(),
      maxUses: 100,
      usedCount: 0,
      active: true,
    },
    {
      id: uid('voc'),
      code: 'SAVE50K',
      discountType: 'fixed',
      value: 50000,
      expiresAt: expires.toISOString(),
      maxUses: 50,
      usedCount: 0,
      active: true,
    },
  ];
  safeWriteJSON(KEYS.vouchers, list);
}

export function getAdminProducts(): AdminProduct[] {
  initAdminMockData();
  const raw = safeReadJSON<any[]>(KEYS.productsV2);
  if (!raw?.length) return [];
  return raw.map((p) => normalizeAdminProduct(p));
}

export function getAdminProductById(productId: string): AdminProduct | undefined {
  return getAdminProducts().find((p) => p.id === productId);
}

export function upsertAdminProduct(product: AdminProduct): AdminProduct[] {
  initAdminMockData();
  const list = getAdminProducts();
  const normalized = normalizeAdminProduct(product);
  const idx = list.findIndex((p) => p.id === normalized.id);
  const next = idx >= 0 ? [...list.slice(0, idx), normalized, ...list.slice(idx + 1)] : [normalized, ...list];
  safeWriteJSON(KEYS.productsV2, next);
  return next;
}

export function deleteAdminProduct(productId: string): AdminProduct[] {
  initAdminMockData();
  const list = getAdminProducts();
  const next = list.filter((p) => p.id !== productId);
  safeWriteJSON(KEYS.productsV2, next);
  return next;
}

export function getAdminOrders(): AdminOrder[] {
  initAdminMockData();
  return safeReadJSON<AdminOrder[]>(KEYS.orders) ?? [];
}

export function getAdminOrder(orderId: string): AdminOrder | undefined {
  return getAdminOrders().find((o) => o.id === orderId);
}

export function updateAdminOrderStatus(orderId: string, status: AdminOrderStatus): AdminOrder | undefined {
  initAdminMockData();
  const list = getAdminOrders();
  const idx = list.findIndex((o) => o.id === orderId);
  if (idx < 0) return undefined;
  const updated = { ...list[idx], status };
  const next = [...list.slice(0, idx), updated, ...list.slice(idx + 1)];
  safeWriteJSON(KEYS.orders, next);
  return updated;
}

export function getAdminSEO(): AdminSEO {
  initAdminMockData();
  return (
    safeReadJSON<AdminSEO>(KEYS.seo) ?? {
      siteName: '',
      copyright: '',
      seoTitle: '',
      seoKeywords: '',
      seoDescription: '',
      metaTags: '',
    }
  );
}

export function saveAdminSEO(seo: AdminSEO): AdminSEO {
  initAdminMockData();
  safeWriteJSON(KEYS.seo, seo);
  return seo;
}

export function getAdminCalendarEvents(): AdminCalendarEvent[] {
  initAdminMockData();
  return safeReadJSON<AdminCalendarEvent[]>(KEYS.calendarEvents) ?? [];
}

export function addAdminCalendarEvent(event: Omit<AdminCalendarEvent, 'id'>): AdminCalendarEvent[] {
  initAdminMockData();
  const list = getAdminCalendarEvents();
  const nextEvent: AdminCalendarEvent = { id: uid('e'), ...event };
  const next = [nextEvent, ...list];
  safeWriteJSON(KEYS.calendarEvents, next);
  return next;
}

// ——— Categories ———

export function getAdminCategories(): AdminCategory[] {
  initAdminMockData();
  return safeReadJSON<AdminCategory[]>(KEYS.categories) ?? [];
}

export function addAdminCategory(input: { name: string; slug?: string }): AdminCategory[] {
  initAdminMockData();
  const list = getAdminCategories();
  const slug =
    input.slug?.trim() ||
    input.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') ||
    uid('slug');
  const cat: AdminCategory = { id: uid('cat'), name: input.name.trim(), slug };
  const next = [...list, cat];
  safeWriteJSON(KEYS.categories, next);
  return next;
}

// ——— Vouchers ———

export function getAdminVouchers(): AdminVoucher[] {
  initAdminMockData();
  return safeReadJSON<AdminVoucher[]>(KEYS.vouchers) ?? [];
}

export function upsertAdminVoucher(v: AdminVoucher): AdminVoucher[] {
  initAdminMockData();
  const list = getAdminVouchers();
  const idx = list.findIndex((x) => x.id === v.id);
  const next = idx >= 0 ? [...list.slice(0, idx), v, ...list.slice(idx + 1)] : [...list, v];
  safeWriteJSON(KEYS.vouchers, next);
  return next;
}

export function addAdminVoucher(
  input: Omit<AdminVoucher, 'id' | 'usedCount'> & { usedCount?: number }
): AdminVoucher[] {
  const v: AdminVoucher = {
    id: uid('voc'),
    usedCount: input.usedCount ?? 0,
    ...input,
  };
  initAdminMockData();
  const list = getAdminVouchers();
  const next = [v, ...list];
  safeWriteJSON(KEYS.vouchers, next);
  return next;
}

export function deleteAdminVoucher(id: string): AdminVoucher[] {
  initAdminMockData();
  const next = getAdminVouchers().filter((v) => v.id !== id);
  safeWriteJSON(KEYS.vouchers, next);
  return next;
}

export function incrementVoucherUse(code: string): void {
  initAdminMockData();
  const list = getAdminVouchers();
  const idx = list.findIndex((v) => v.code.toUpperCase() === code.toUpperCase());
  if (idx < 0) return;
  const v = list[idx];
  const updated = { ...v, usedCount: v.usedCount + 1 };
  const next = [...list.slice(0, idx), updated, ...list.slice(idx + 1)];
  safeWriteJSON(KEYS.vouchers, next);
}
