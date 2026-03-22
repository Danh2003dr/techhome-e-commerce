import React from 'react';
import { EVENT_TYPE_BAR_CLASS } from './calendarConstants';
import type { PromotionEvent } from './calendarTypes';
import { addDays, eventTouchesDay, eventsForDay, startOfWeekMon, toISODate } from './calendarUtils';

type PanelProps = {
  onEventClick: (ev: PromotionEvent) => void;
};

export const DayPanel: React.FC<
  PanelProps & {
    day: Date;
    events: PromotionEvent[];
  }
> = ({ day, events, onEventClick }) => {
  const list = eventsForDay(events, day);
  const label = day.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm min-h-[320px]">
      <h3 className="text-sm font-bold text-slate-500 mb-4">{label}</h3>
      {list.length === 0 ? (
        <p className="text-sm text-slate-500">No events on this day.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((ev) => (
            <li key={ev.id}>
              <button
                type="button"
                onClick={() => onEventClick(ev)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-semibold shadow-sm ${EVENT_TYPE_BAR_CLASS[ev.type]}`}
              >
                {ev.name}
                <span className="block text-[11px] font-medium opacity-90 mt-0.5">{ev.timeLabel}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const WeekPanel: React.FC<
  PanelProps & {
    anchor: Date;
    events: PromotionEvent[];
  }
> = ({ anchor, events, onEventClick }) => {
  const start = startOfWeekMon(anchor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
      <div className="grid grid-cols-7 min-w-[720px] divide-x divide-slate-100">
        {days.map((d) => {
          const list = events.filter((ev) => eventTouchesDay(ev, d));
          const head = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
          return (
            <div key={toISODate(d)} className="min-h-[280px] p-2 bg-white">
              <div className="text-center text-[11px] font-bold text-slate-500 py-2 border-b border-slate-100">{head}</div>
              <div className="mt-2 space-y-1.5">
                {list.map((ev) => (
                  <button
                    type="button"
                    key={ev.id + toISODate(d)}
                    onClick={() => onEventClick(ev)}
                    className={`w-full rounded-md border px-1.5 py-1 text-left text-[10px] font-bold leading-snug ${EVENT_TYPE_BAR_CLASS[ev.type]}`}
                  >
                    {ev.name}
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
