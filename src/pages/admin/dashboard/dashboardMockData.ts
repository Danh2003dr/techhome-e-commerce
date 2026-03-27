/**
 * Mock dữ liệu Dashboard — thay bằng fetch API khi backend sẵn sàng.
 * Giữ shape ổn định để map response dễ dàng.
 */

export type KpiTrend = 'up' | 'down';

export type KpiStat = {
  id: string;
  label: string;
  value: string;
  trendLabel: string;
  trend: KpiTrend;
  /** Material Icons glyph name */
  icon: string;
  iconWrapClass: string;
};

export type ChartPoint = {
  label: string;
  sales: number;
  profit: number;
};

export type SalesLinePoint = {
  name: string;
  value: number;
};

export type DealRow = {
  id: string;
  productName: string;
  imageUrl: string;
  location: string;
  dateTime: string;
  piece: number;
  amountUsd: number;
  status: 'Delivered' | 'Processing' | 'Pending';
};

export type CustomerSegment = {
  key: 'new' | 'repeated';
  label: string;
  value: number;
  color: string;
};

export type FeaturedProductItem = {
  id: string;
  name: string;
  priceUsd: number;
  imageUrl: string;
};

export type AnalyticsYearPoint = {
  year: string;
  seriesA: number;
  seriesB: number;
};

export const MONTH_OPTIONS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const kpiStats: KpiStat[] = [
  {
    id: 'users',
    label: 'Tổng người dùng',
    value: '40,689',
    trendLabel: '+8.5% tăng so với hôm qua',
    trend: 'up',
    icon: 'person',
    iconWrapClass: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'orders',
    label: 'Tổng đơn hàng',
    value: '10,293',
    trendLabel: '+1.3% tăng so với tuần trước',
    trend: 'up',
    icon: 'inventory_2',
    iconWrapClass: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'sales',
    label: 'Tổng doanh thu',
    value: '$89,000',
    trendLabel: '-4.3% giảm so với hôm qua',
    trend: 'down',
    icon: 'trending_up',
    iconWrapClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'pending',
    label: 'Tổng đang chờ',
    value: '2,040',
    trendLabel: '+1.8% tăng so với hôm qua',
    trend: 'up',
    icon: 'schedule',
    iconWrapClass: 'bg-orange-100 text-orange-700',
  },
];

/** Line chart — Sales Details */
export const salesLineData: SalesLinePoint[] = [
  { name: '5k', value: 12000 },
  { name: '10k', value: 28000 },
  { name: '20k', value: 42000 },
  { name: '30k', value: 38000 },
  { name: '40k', value: 52000 },
  { name: '50k', value: 64525.64 },
  { name: '60k', value: 48000 },
  { name: '70k', value: 56000 },
  { name: '80k', value: 62000 },
];

/** Area chart — Revenue (Sales + Profit) */
export const revenueAreaData: ChartPoint[] = [
  { label: '5k', sales: 22000, profit: 12000 },
  { label: '10k', sales: 35000, profit: 18000 },
  { label: '15k', sales: 28000, profit: 22000 },
  { label: '20k', sales: 62000, profit: 32000 },
  { label: '25k', sales: 48000, profit: 28000 },
  { label: '30k', sales: 72000, profit: 38000 },
  { label: '35k', sales: 55000, profit: 30000 },
  { label: '40k', sales: 88000, profit: 42000 },
  { label: '45k', sales: 65000, profit: 35000 },
  { label: '50k', sales: 92000, profit: 48000 },
  { label: '55k', sales: 78000, profit: 40000 },
  { label: '60k', sales: 95000, profit: 52000 },
];

export const dealsRows: DealRow[] = [
  {
    id: '1',
    productName: 'Apple Watch',
    imageUrl:
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=120&h=120&fit=crop&auto=format',
    location: '6096 Marylane Landing',
    dateTime: '12.09.2019 - 12:53 PM',
    piece: 423,
    amountUsd: 34295,
    status: 'Delivered',
  },
  {
    id: '2',
    productName: 'AirPods Pro',
    imageUrl:
      'https://images.unsplash.com/photo-1600294037681-c80db4cb5d02?w=120&h=120&fit=crop&auto=format',
    location: '8892 Docklands St',
    dateTime: '15.10.2019 - 09:12 AM',
    piece: 120,
    amountUsd: 8900,
    status: 'Delivered',
  },
  {
    id: '3',
    productName: 'Minimal Chair',
    imageUrl:
      'https://images.unsplash.com/photo-1503602642458-232111445657?w=120&h=120&fit=crop&auto=format',
    location: '221B Baker Street',
    dateTime: '02.11.2019 - 04:30 PM',
    piece: 58,
    amountUsd: 1299,
    status: 'Processing',
  },
];

export const customerSegments: CustomerSegment[] = [
  { key: 'new', label: 'New Customers', value: 34249, color: '#3b82f6' },
  { key: 'repeated', label: 'Repeated', value: 1420, color: '#93c5fd' },
];

export const featuredProducts: FeaturedProductItem[] = [
  {
    id: 'fp1',
    name: 'Beats Headphone 2019',
    priceUsd: 89.0,
    imageUrl:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop&auto=format',
  },
  {
    id: 'fp2',
    name: 'Wireless Earbuds Pro',
    priceUsd: 129.0,
    imageUrl:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop&auto=format',
  },
  {
    id: 'fp3',
    name: 'Smart Speaker Mini',
    priceUsd: 59.99,
    imageUrl:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e2?w=800&h=800&fit=crop&auto=format',
  },
];

export const analyticsYearData: AnalyticsYearPoint[] = [
  { year: '2015', seriesA: 32, seriesB: 28 },
  { year: '2016', seriesA: 45, seriesB: 38 },
  { year: '2017', seriesA: 52, seriesB: 48 },
  { year: '2018', seriesA: 68, seriesB: 55 },
  { year: '2019', seriesA: 82, seriesB: 72 },
];
