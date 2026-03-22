import type { EventStatus, EventType, PromotionEvent } from './calendarTypes';

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function compareISODate(a: string, b: string): number {
  return a.localeCompare(b);
}

export function getEventStatus(ev: PromotionEvent, today: Date = new Date()): EventStatus {
  const t = startOfDay(today).getTime();
  const s = startOfDay(parseISODate(ev.startDate)).getTime();
  const e = startOfDay(parseISODate(ev.endDate)).getTime();
  if (e < t) return 'expired';
  if (s > t) return 'upcoming';
  return 'active';
}

export function statusLabel(st: EventStatus): string {
  switch (st) {
    case 'upcoming':
      return 'Upcoming';
    case 'active':
      return 'Active';
    case 'expired':
      return 'Expired';
  }
}

export function statusBadgeClass(st: EventStatus): string {
  switch (st) {
    case 'upcoming':
      return 'bg-sky-100 text-sky-800';
    case 'active':
      return 'bg-emerald-100 text-emerald-800';
    case 'expired':
      return 'bg-slate-200 text-slate-700';
  }
}

/** Thứ Hai = 0 … Chủ Nhật = 6 */
export function weekdayIndexMon(d: Date): number {
  const js = d.getDay();
  return js === 0 ? 6 : js - 1;
}

/** Ma trận 6×7: các ô ngày hiển thị cho tháng `month` (0–11) */
export function getMonthGrid(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const startOffset = weekdayIndexMon(first);
  const gridStart = new Date(year, month, 1 - startOffset);
  const weeks: Date[][] = [];
  let cur = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const row: Date[] = [];
    for (let d = 0; d < 7; d++) {
      row.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(row);
  }
  return weeks;
}

export type WeekSegment = {
  event: PromotionEvent;
  startCol: number;
  endCol: number;
};

/** Gán lane để các segment không chồng nhau (greedy) */
export function assignLanes(segments: WeekSegment[]): (WeekSegment & { lane: number })[] {
  const sorted = [...segments].sort((a, b) => {
    if (a.startCol !== b.startCol) return a.startCol - b.startCol;
    return a.endCol - a.startCol - (b.endCol - b.startCol);
  });
  const lanes: { endCol: number }[] = [];
  const out: (WeekSegment & { lane: number })[] = [];
  for (const seg of sorted) {
    let lane = 0;
    while (lane < lanes.length && lanes[lane].endCol >= seg.startCol) {
      lane++;
    }
    if (lane === lanes.length) lanes.push({ endCol: seg.endCol });
    else lanes[lane] = { endCol: seg.endCol };
    out.push({ ...seg, lane });
  }
  return out;
}

export function segmentsForWeek(weekDays: Date[], events: PromotionEvent[]): WeekSegment[] {
  const w0 = startOfDay(weekDays[0]);
  const w6 = startOfDay(weekDays[6]);
  const segs: WeekSegment[] = [];

  for (const ev of events) {
    const eStart = startOfDay(parseISODate(ev.startDate));
    const eEnd = startOfDay(parseISODate(ev.endDate));
    if (eEnd < w0 || eStart > w6) continue;

    let startCol = -1;
    let endCol = -1;
    for (let i = 0; i < 7; i++) {
      const d = startOfDay(weekDays[i]);
      if (d >= eStart && d <= eEnd && startCol < 0) startCol = i;
      if (d >= eStart && d <= eEnd) endCol = i;
    }
    if (startCol < 0 || endCol < 0) continue;

    segs.push({ event: ev, startCol, endCol });
  }

  return segs;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function startOfWeekMon(d: Date): Date {
  const x = startOfDay(d);
  const idx = weekdayIndexMon(x);
  x.setDate(x.getDate() - idx);
  return x;
}

export function eventTouchesDay(ev: PromotionEvent, d: Date): boolean {
  const t = startOfDay(d).getTime();
  const s = startOfDay(parseISODate(ev.startDate)).getTime();
  const e = startOfDay(parseISODate(ev.endDate)).getTime();
  return s <= t && t <= e;
}

export function eventsForDay(events: PromotionEvent[], d: Date): PromotionEvent[] {
  return events.filter((ev) => eventTouchesDay(ev, d));
}

export function sortEventsUpcoming(events: PromotionEvent[]): PromotionEvent[] {
  return [...events].sort((a, b) => compareISODate(a.startDate, b.startDate));
}

export function filterEvents(
  events: PromotionEvent[],
  opts: {
    search: string;
    type: EventType | 'all';
    status: EventStatus | 'all';
  },
): PromotionEvent[] {
  const q = opts.search.trim().toLowerCase();
  return events.filter((ev) => {
    if (opts.type !== 'all' && ev.type !== opts.type) return false;
    const st = getEventStatus(ev);
    if (opts.status !== 'all' && st !== opts.status) return false;
    if (q && !ev.name.toLowerCase().includes(q)) return false;
    return true;
  });
}
