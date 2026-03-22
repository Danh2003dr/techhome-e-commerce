/** Domain types — thay bằng API response khi có backend */

export type EventType = 'flash_sale' | 'voucher' | 'discount' | 'launch';

export type EventStatus = 'upcoming' | 'active' | 'expired';

export type CalendarViewMode = 'day' | 'week' | 'month';

export type CalendarMainTab = 'calendar' | 'list';

export type PromotionEvent = {
  id: string;
  name: string;
  type: EventType;
  /** ISO date yyyy-mm-dd */
  startDate: string;
  endDate: string;
  /** Hiển thị trong sidebar / list, ví dụ "Today 07:19 AM" */
  timeLabel: string;
  description: string;
  location: string;
  participantCount: number;
  /** URL ảnh avatar đại diện event (mock) */
  coverUrl: string;
  /** optional — liên kết sản phẩm khuyến mãi */
  productId?: string;
};
