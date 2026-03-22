import type { EventType } from './calendarTypes';

/** Mapping type → màu block trên lịch (theo yêu cầu nâng cao) */
export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  flash_sale: 'Flash sale',
  voucher: 'Voucher',
  discount: 'Discount',
  launch: 'Launch',
};

export const EVENT_TYPE_BAR_CLASS: Record<EventType, string> = {
  flash_sale: 'bg-red-100 text-red-900 border-red-200',
  voucher: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  discount: 'bg-orange-100 text-orange-900 border-orange-200',
  launch: 'bg-violet-100 text-violet-900 border-violet-200',
};
