/**
 * Mock Product Stock — thay bằng API / admin store khi tích hợp backend.
 */

export type StockProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  piece: number;
  /** Mã hex (#rrggbb) cho chấm màu */
  colors: string[];
  /** URL ảnh hoặc data URL */
  image: string;
};

export const STOCK_CATEGORY_OPTIONS = [
  'Digital Product',
  'Fashion',
  'Mobile',
  'Electronic',
] as const;

/** Preset cho form multi-select (value = hex) */
export const STOCK_COLOR_PRESETS: { hex: string; label: string }[] = [
  { hex: '#111827', label: 'Black' },
  { hex: '#9CA3AF', label: 'Gray' },
  { hex: '#EC4899', label: 'Pink' },
  { hex: '#EF4444', label: 'Red' },
  { hex: '#3B82F6', label: 'Blue' },
  { hex: '#F59E0B', label: 'Yellow' },
  { hex: '#10B981', label: 'Green' },
  { hex: '#F97316', label: 'Orange' },
];

const IMG_SEEDS = ['watch', 'headphone', 'dress', 'phone', 'camera', 'laptop', 'tablet', 'earbuds'];

const NAME_POOL = [
  'Apple Watch Series 4',
  'Microsoft Headsquare',
  "Women's Dress",
  'Samsung A50',
  'Camera',
  'Sony WH-1000XM5',
  'iPad Air',
  'Keychron K2',
  'Smart Speaker Mini',
  'Minimal Chair Tool',
];

function buildInitialStock(): StockProduct[] {
  const cats = [...STOCK_CATEGORY_OPTIONS];
  const out: StockProduct[] = [];

  for (let i = 0; i < 78; i++) {
    const seed = IMG_SEEDS[i % IMG_SEEDS.length];
    const name = `${NAME_POOL[i % NAME_POOL.length]}${i >= NAME_POOL.length ? ` #${i + 1}` : ''}`;
    const category = cats[i % cats.length];
    const price = 29.99 + (i % 20) * 15 + (i % 3) * 5;
    const piece = 5 + (i * 7) % 900;
    const colorCount = 2 + (i % 4);
    const colors = STOCK_COLOR_PRESETS.slice(0, colorCount).map((c) => c.hex);

    out.push({
      id: `ps-${String(i + 1).padStart(5, '0')}`,
      name,
      category,
      price: Math.round(price * 100) / 100,
      piece,
      colors,
      image: `https://picsum.photos/seed/${seed}${i}/120/120`,
    });
  }

  return out;
}

export const INITIAL_STOCK_PRODUCTS: StockProduct[] = buildInitialStock();

export function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}
