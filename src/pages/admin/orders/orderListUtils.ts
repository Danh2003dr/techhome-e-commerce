import type { AdminOrderRow, OrderStatus, OrderTypeOption } from './orderListMock';

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "14 Feb 2019" */
export function formatOrderDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function monthYearLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Ngày duy nhất (đầu ngày), sort tăng dần */
export function uniqueSortedDates(dates: Date[]): Date[] {
  const map = new Map<number, Date>();
  for (const d of dates) {
    const s = startOfDay(d);
    map.set(s.getTime(), s);
  }
  return [...map.values()].sort((a, b) => a.getTime() - b.getTime());
}

export type OrderFilters = {
  /** Rỗng = không lọc theo ngày */
  dates: Date[];
  types: Set<OrderTypeOption>;
  statuses: Set<OrderStatus>;
};

export function filterOrders(orders: AdminOrderRow[], f: OrderFilters): AdminOrderRow[] {
  return orders.filter((o) => {
    if (f.dates.length > 0) {
      const matchDay = f.dates.some((fd) => isSameDay(o.date, fd));
      if (!matchDay) return false;
    }
    if (f.types.size > 0) {
      const hit = o.typeKeys.some((k) => f.types.has(k));
      if (!hit) return false;
    }
    if (f.statuses.size > 0 && !f.statuses.has(o.status)) return false;
    return true;
  });
}

/** Ngày có đơn sau khi chỉ áp type + status (không lọc ngày) — dùng cho Prev/Next Date */
export function datesAvailableForNav(
  orders: AdminOrderRow[],
  types: Set<OrderTypeOption>,
  statuses: Set<OrderStatus>,
): Date[] {
  const base = filterOrders(orders, { dates: [], types, statuses });
  return uniqueSortedDates(base.map((o) => o.date));
}
