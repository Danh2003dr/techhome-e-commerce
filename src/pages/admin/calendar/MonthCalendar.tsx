import React from 'react';
import { EVENT_TYPE_BAR_CLASS } from './calendarConstants';
import type { PromotionEvent } from './calendarTypes';
import { assignLanes, getMonthGrid, sameDay, segmentsForWeek, startOfDay, toISODate } from './calendarUtils';

type MonthCalendarProps = {
  year: number;
  month: number;
  events: PromotionEvent[];
  onEventClick: (ev: PromotionEvent) => void;
};

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;

const offMonthClass =
  'bg-[repeating-linear-gradient(135deg,rgba(226,232,240,0.55)_0px,rgba(226,232,240,0.55)_4px,transparent_4px,transparent_8px)]';

const MonthCalendar: React.FC<MonthCalendarProps> = ({ year, month, events, onEventClick }) => {
  const weeks = getMonthGrid(year, month);
  const today = startOfDay(new Date());
  const inViewMonth = (d: Date) => d.getMonth() === month && d.getFullYear() === year;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2 text-center text-[11px] font-bold tracking-wide text-slate-500">
            {d}
          </div>
        ))}
      </div>

      <div>
        {weeks.map((weekDays, wi) => {
          const rawSegs = segmentsForWeek(weekDays, events);
          const laned = assignLanes(rawSegs);
          const maxLanes = laned.length ? Math.max(...laned.map((s) => s.lane)) + 1 : 0;
          const rowLanes = Math.max(maxLanes, 1);
          const lanePx = 26;

          return (
            <div key={`w-${wi}-${toISODate(weekDays[0])}`} className="border-b border-slate-100 last:border-b-0">
              <div
                className="grid w-full"
                style={{
                  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                  gridTemplateRows: `minmax(52px, auto) repeat(${rowLanes}, ${lanePx}px)`,
                }}
              >
                {weekDays.map((d, di) => {
                  const isOff = !inViewMonth(d);
                  const isTodayCell = sameDay(d, today);
                  return (
                    <div
                      key={`${wi}-d-${di}`}
                      style={{ gridColumn: di + 1, gridRow: 1 }}
                      className={`border-r border-slate-100 last:border-r-0 px-1 pt-1 ${isOff ? offMonthClass : ''} ${
                        isTodayCell ? 'ring-inset ring-2 ring-primary/35 z-[1]' : ''
                      }`}
                    >
                      <span className="float-right text-xs font-semibold tabular-nums text-slate-800">{d.getDate()}</span>
                    </div>
                  );
                })}

                {laned.map((s) => (
                  <button
                    type="button"
                    key={`${s.event.id}-w${wi}-${s.startCol}-${s.endCol}-${s.lane}`}
                    style={{
                      gridColumn: `${s.startCol + 1} / ${s.endCol + 2}`,
                      gridRow: s.lane + 2,
                    }}
                    onClick={() => onEventClick(s.event)}
                    className={`mx-0.5 mb-0.5 truncate rounded-md border px-1.5 py-0.5 text-left text-[10px] font-bold leading-tight shadow-sm hover:brightness-95 ${EVENT_TYPE_BAR_CLASS[s.event.type]}`}
                  >
                    {s.event.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
