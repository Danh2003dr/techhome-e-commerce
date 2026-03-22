import React from 'react';
import Button from '@/components/ui/Button';
import EventItem from './EventItem';
import type { PromotionEvent } from './calendarTypes';

type EventSidebarProps = {
  events: PromotionEvent[];
  expanded?: boolean;
  showSeeMoreToggle?: boolean;
  onAdd: () => void;
  onSelectEvent: (ev: PromotionEvent) => void;
  onSeeMore?: () => void;
};

const EventSidebar: React.FC<EventSidebarProps> = ({
  events,
  expanded = false,
  showSeeMoreToggle = true,
  onAdd,
  onSelectEvent,
  onSeeMore,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col min-h-[420px]">
      <Button type="button" className="w-full gap-2 mb-6" size="lg" onClick={onAdd}>
        <span className="material-icons text-[20px]">add</span>
        Add New Event
      </Button>

      <h2 className="text-sm font-bold text-slate-900 mb-3">You are going to</h2>

      <div className="flex-1 space-y-1 overflow-y-auto min-h-0">
        {events.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No upcoming events match filters.</p>
        ) : (
          events.map((ev) => <EventItem key={ev.id} ev={ev} onClick={onSelectEvent} />)
        )}
      </div>

      {showSeeMoreToggle && (
        <button
          type="button"
          onClick={onSeeMore}
          className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
        >
          {expanded ? 'See Less' : 'See More'}
        </button>
      )}
    </div>
  );
};

export default EventSidebar;
