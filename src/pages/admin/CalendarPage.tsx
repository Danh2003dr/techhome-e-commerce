import React, { useMemo, useState } from 'react';
import { DayPanel, WeekPanel } from './calendar/CalendarDayWeekPanels';
import CalendarListView from './calendar/CalendarListView';
import EventModal from './calendar/EventModal';
import EventSidebar from './calendar/EventSidebar';
import MonthCalendar from './calendar/MonthCalendar';
import { buildRollingDemoEvents } from './calendar/calendarMockData';
import type { CalendarMainTab, CalendarViewMode, EventStatus, EventType, PromotionEvent } from './calendar/calendarTypes';
import { addDays, filterEvents, sortEventsUpcoming, startOfDay, startOfWeekMon } from './calendar/calendarUtils';

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<PromotionEvent[]>(() => buildRollingDemoEvents());
  const [viewDate, setViewDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [mainTab, setMainTab] = useState<CalendarMainTab>('calendar');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PromotionEvent | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<EventStatus | 'all'>('all');

  const filtered = useMemo(
    () => filterEvents(events, { search, type: filterType, status: filterStatus }),
    [events, search, filterType, filterStatus],
  );

  const sidebarPool = useMemo(() => sortEventsUpcoming(filtered), [filtered]);
  const sidebarEvents = sidebarExpanded ? sidebarPool : sidebarPool.slice(0, 6);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const navLabel = useMemo(() => {
    if (viewMode === 'month') {
      return viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    if (viewMode === 'week') {
      const ws = startOfWeekMon(viewDate);
      const we = addDays(ws, 6);
      const a = ws.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const b = we.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${a} – ${b}`;
    }
    return viewDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [viewDate, viewMode]);

  const goPrev = () => {
    if (viewMode === 'month') {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
      return;
    }
    if (viewMode === 'week') {
      setViewDate((d) => addDays(d, -7));
      return;
    }
    setViewDate((d) => addDays(d, -1));
  };

  const goNext = () => {
    if (viewMode === 'month') {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
      return;
    }
    if (viewMode === 'week') {
      setViewDate((d) => addDays(d, 7));
      return;
    }
    setViewDate((d) => addDays(d, 1));
  };

  const goToday = () => {
    setViewDate(startOfDay(new Date()));
  };

  const openCreate = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const openEdit = (ev: PromotionEvent) => {
    setEditingEvent(ev);
    setModalOpen(true);
  };

  const handleSave = (ev: PromotionEvent) => {
    setEvents((prev) => {
      const i = prev.findIndex((e) => e.id === ev.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = ev;
        return next;
      }
      return [...prev, ev];
    });
  };

  const handleDeleteById = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-5 max-w-[1600px]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Calender</h1>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setMainTab('calendar')}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              mainTab === 'calendar' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Calendar View
          </button>
          <button
            type="button"
            onClick={() => setMainTab('list')}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              mainTab === 'list' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <input
          type="search"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as EventType | 'all')}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm"
          >
            <option value="all">All types</option>
            <option value="flash_sale">Flash sale</option>
            <option value="voucher">Voucher</option>
            <option value="discount">Discount</option>
            <option value="launch">Launch</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as EventStatus | 'all')}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm"
          >
            <option value="all">All status</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {mainTab === 'list' ? (
        <CalendarListView rows={filtered} onEdit={openEdit} onDelete={(ev) => handleDeleteById(ev.id)} />
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(280px,360px)_1fr]">
          <EventSidebar
            events={sidebarEvents}
            expanded={sidebarExpanded}
            showSeeMoreToggle={sidebarPool.length > 6}
            onAdd={openCreate}
            onSelectEvent={openEdit}
            onSeeMore={() => setSidebarExpanded((v) => !v)}
          />

          <div className="space-y-4 min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={goToday}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100"
                >
                  Today
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                    aria-label="Previous"
                  >
                    <span className="material-icons text-[22px]">chevron_left</span>
                  </button>
                  <span className="min-w-[160px] text-center text-sm font-bold text-slate-900 px-2">{navLabel}</span>
                  <button
                    type="button"
                    onClick={goNext}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                    aria-label="Next"
                  >
                    <span className="material-icons text-[22px]">chevron_right</span>
                  </button>
                </div>
              </div>

              <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                {(['day', 'week', 'month'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setViewMode(m)}
                    className={`rounded-md px-3 py-1.5 text-xs font-bold capitalize ${
                      viewMode === m ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {viewMode === 'month' && (
              <MonthCalendar year={year} month={month} events={filtered} onEventClick={openEdit} />
            )}
            {viewMode === 'week' && <WeekPanel anchor={viewDate} events={filtered} onEventClick={openEdit} />}
            {viewMode === 'day' && <DayPanel day={viewDate} events={filtered} onEventClick={openEdit} />}
          </div>
        </div>
      )}

      <EventModal
        open={modalOpen}
        initial={editingEvent}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDeleteById}
      />
    </div>
  );
};

export default CalendarPage;
