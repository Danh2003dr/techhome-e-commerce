import React from 'react';
import type { PromotionEvent } from './calendarTypes';
import { getEventStatus, statusBadgeClass, statusLabel } from './calendarUtils';

type EventItemProps = {
  ev: PromotionEvent;
  onClick?: (ev: PromotionEvent) => void;
};

const EventItem: React.FC<EventItemProps> = ({ ev, onClick }) => {
  const st = getEventStatus(ev);
  const faces = Math.min(3, Math.ceil(ev.participantCount / 8));
  return (
    <button
      type="button"
      onClick={() => onClick?.(ev)}
      className="flex w-full gap-3 rounded-xl border border-transparent p-2 text-left transition hover:border-slate-200 hover:bg-slate-50"
    >
      <img
        src={ev.coverUrl}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full object-cover bg-slate-100"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-900 truncate">{ev.name}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusBadgeClass(st)}`}>
            {statusLabel(st)}
          </span>
        </div>
        <p className="text-xs font-medium text-slate-600 mt-0.5">{ev.timeLabel}</p>
        <p className="text-[11px] text-slate-500 truncate mt-0.5">{ev.location}</p>
        <div className="mt-2 flex items-center">
          <div className="flex -space-x-2">
            {Array.from({ length: faces }).map((_, i) => (
              <span
                key={i}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[9px] font-bold text-slate-600"
              >
                {String.fromCharCode(65 + i)}
              </span>
            ))}
          </div>
          <span className="ml-2 text-[11px] font-semibold text-slate-500">+{ev.participantCount}+</span>
        </div>
      </div>
    </button>
  );
};

export default EventItem;
