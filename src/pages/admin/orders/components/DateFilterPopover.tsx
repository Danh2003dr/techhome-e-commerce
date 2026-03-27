import React, { useEffect, useMemo, useState } from 'react';
import { getDaysInMonth, monthYearLabel, startOfDay } from '../orderListUtils';

type DateFilterPopoverProps = {
  initialDates: Date[];
  onApply: (dates: Date[]) => void;
  onClose: () => void;
};

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const DateFilterPopover: React.FC<DateFilterPopoverProps> = ({
  initialDates,
  onApply,
  onClose,
}) => {
  const [view, setView] = useState(() => {
    const d = initialDates[0] ? startOfDay(initialDates[0]) : new Date(2019, 1, 1);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [selectedTs, setSelectedTs] = useState<Set<number>>(() => {
    return new Set(initialDates.map((d) => startOfDay(d).getTime()));
  });

  useEffect(() => {
    setSelectedTs(new Set(initialDates.map((d) => startOfDay(d).getTime())));
    if (initialDates[0]) {
      const d = startOfDay(initialDates[0]);
      setView(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [initialDates]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay();

  const cells = useMemo(() => {
    const blanks = Array.from({ length: firstDow }, () => null as number | null);
    const nums = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...blanks, ...nums];
  }, [firstDow, daysInMonth]);

  const toggleDay = (day: number) => {
    const d = startOfDay(new Date(year, month, day));
    const t = d.getTime();
    setSelectedTs((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const prevMonth = () => setView(new Date(year, month - 1, 1));
  const nextMonth = () => setView(new Date(year, month + 1, 1));

  return (
    <div
      className="absolute left-0 top-full z-40 mt-2 w-[min(100vw-2rem,320px)] rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
      role="dialog"
      aria-label="Chọn ngày"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
          aria-label="Previous month"
        >
          <span className="material-icons text-xl">chevron_left</span>
        </button>
        <div className="text-sm font-bold text-slate-900">{monthYearLabel(view)}</div>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
          aria-label="Next month"
        >
          <span className="material-icons text-xl">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 mb-1">
        {WEEK.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) =>
          day === null ? (
            <div key={`b-${idx}`} className="h-9" />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`h-9 rounded-lg text-sm font-semibold transition-colors ${
                selectedTs.has(startOfDay(new Date(year, month, day)).getTime())
                  ? 'bg-[#4880FF] text-white'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              {day}
            </button>
          ),
        )}
      </div>

      <p className="mt-3 text-[11px] text-slate-500 italic">*Bạn có thể chọn nhiều ngày</p>

      <div className="mt-4 flex justify-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={() => {
            const dates = [...selectedTs].map((t) => new Date(t)).sort((a, b) => a.getTime() - b.getTime());
            onApply(dates);
            onClose();
          }}
          className="px-6 py-2 text-sm font-semibold text-white bg-[#4880FF] hover:bg-blue-600 rounded-lg"
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default DateFilterPopover;
