/* eslint-disable @typescript-eslint/no-explicit-any */

export type AdminOrderStatus = 'Completed' | 'Processing' | 'Rejected' | 'On Hold' | 'In Transit' | 'Shipping';

export type AdminProductSpec = { id: string; key: string; value: string };

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
  date: string; // e.g. "14 Feb 2019"
  type: string; // Order type filter chip
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
  orders: 'techhome_admin_orders_mock_v1',
  seo: 'techhome_admin_seo_mock_v1',
  calendarEvents: 'techhome_admin_calendar_events_mock_v1',
} as const;

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
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

function seedIfMissing() {
  if (safeReadJSON<AdminProduct[]>(KEYS.products)) {
    return;
  }

  const products: AdminProduct[] = [
    {
      id: 'p_1',
      name: 'Apple Watch Series 4',
      category: 'Digital Product',
      price: 699,
      stock: 63,
      featured: true,
      colors: ['Black', 'Silver', 'Blue'],
      description: 'Smartwatch placeholder description for Admin UI.',
      images: ['https://picsum.photos/seed/admin-prod-1/240/240'],
      specs: [
        { id: uid('spec'), key: 'Weight', value: '250g' },
        { id: uid('spec'), key: 'Battery', value: '3000mAh' },
      ],
    },
    {
      id: 'p_2',
      name: 'Microsoft Headsquare',
      category: 'Digital Product',
      price: 190,
      stock: 13,
      featured: false,
      colors: ['Red', 'Green'],
      description: 'Placeholder product description for Admin UI.',
      images: ['https://picsum.photos/seed/admin-prod-2/240/240'],
      specs: [{ id: uid('spec'), key: 'Warranty', value: '12 months' }],
    },
  ];

  const orders: AdminOrder[] = [
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

  safeWriteJSON(KEYS.products, products);
  safeWriteJSON(KEYS.orders, orders);
  safeWriteJSON(KEYS.seo, seo);
  safeWriteJSON(KEYS.calendarEvents, calendarEvents);
}

export function initAdminMockData() {
  // Guard for SSR-like environments
  if (typeof window === 'undefined') return;
  seedIfMissing();
}

export function getAdminProducts(): AdminProduct[] {
  initAdminMockData();
  return safeReadJSON<AdminProduct[]>(KEYS.products) ?? [];
}

export function upsertAdminProduct(product: AdminProduct): AdminProduct[] {
  initAdminMockData();
  const list = getAdminProducts();
  const idx = list.findIndex((p) => p.id === product.id);
  const next = idx >= 0 ? [...list.slice(0, idx), product, ...list.slice(idx + 1)] : [product, ...list];
  safeWriteJSON(KEYS.products, next);
  return next;
}

export function deleteAdminProduct(productId: string): AdminProduct[] {
  initAdminMockData();
  const list = getAdminProducts();
  const next = list.filter((p) => p.id !== productId);
  safeWriteJSON(KEYS.products, next);
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
  return safeReadJSON<AdminSEO>(KEYS.seo) ?? {
    siteName: '',
    copyright: '',
    seoTitle: '',
    seoKeywords: '',
    seoDescription: '',
    metaTags: '',
  };
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

