import type { PromotionEvent } from './calendarTypes';
import { toISODate } from './calendarUtils';

/** Sản phẩm gợi ý (mock) — thay bằng API products khi có */
export const MOCK_PRODUCT_OPTIONS: { id: string; name: string }[] = [
  { id: 'prod-aw', name: 'Apple Watch Series 4' },
  { id: 'prod-ap', name: 'AirPods Pro' },
  { id: 'prod-sp', name: 'Smart Speaker Mini' },
  { id: 'prod-ch', name: 'Minimal Chair' },
];

/**
 * Sinh event mẫu trong **tháng hiện tại** (cùng layout ngày như mockup Oct 2019)
 * để badge trạng thái / filter upcoming hoạt động khi demo.
 * TODO: thay bằng API; có thể thêm tham số year/month nếu cần snapshot cố định.
 */
export function buildRollingDemoEvents(): PromotionEvent[] {
  const t = new Date();
  const y = t.getFullYear();
  const m = t.getMonth();
  const dim = new Date(y, m + 1, 0).getDate();
  const clamp = (d: number) => Math.min(Math.max(1, d), dim);
  const iso = (d: number) => toISODate(new Date(y, m, clamp(d)));
  const spanStart = clamp(19);
  let spanEnd = clamp(22);
  if (spanEnd < spanStart) spanEnd = spanStart;
  const monthLong = t.toLocaleDateString('en-US', { month: 'long' });

  return [
    {
      id: 'evt-design',
      name: 'Design Conference',
      type: 'launch',
      startDate: iso(3),
      endDate: iso(3),
      timeLabel: 'Today 07:19 AM',
      description: 'Internal design sync and conference.',
      location: '56 Davion Mission Suite 157',
      participantCount: 15,
      coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120&h=120&fit=crop&auto=format',
      productId: 'prod-aw',
    },
    {
      id: 'evt-weekend',
      name: 'Weekend Festival',
      type: 'discount',
      startDate: iso(16),
      endDate: iso(16),
      timeLabel: `16 ${monthLong} ${y} at 5:00 PM`,
      description: 'Weekend promotion campaign.',
      location: 'Meaghanberg',
      participantCount: 20,
      coverUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=120&h=120&fit=crop&auto=format',
    },
    {
      id: 'evt-glasto',
      name: 'Glastonbury Festival',
      type: 'flash_sale',
      startDate: iso(spanStart),
      endDate: iso(spanEnd),
      timeLabel: `${spanStart} ${monthLong} – ${spanEnd} ${monthLong} ${y}`,
      description: 'Multi-day flash sale window.',
      location: 'Outdoor venues',
      participantCount: 40,
      coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=120&h=120&fit=crop&auto=format',
    },
    {
      id: 'evt-glasto-2',
      name: 'Glastonbury Festival',
      type: 'voucher',
      startDate: iso(24),
      endDate: iso(24),
      timeLabel: `24 ${monthLong} ${y}`,
      description: 'Voucher drop.',
      location: 'Online',
      participantCount: 12,
      coverUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e8916d093?w=120&h=120&fit=crop&auto=format',
    },
  ];
}

export const INITIAL_PROMOTION_EVENTS: PromotionEvent[] = buildRollingDemoEvents();
