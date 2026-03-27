import React, { useEffect, useRef } from 'react';
import type { OrderStatus, OrderTypeOption } from '../orderListMock';
import { formatOrderDate } from '../orderListUtils';
import DateFilterPopover from './DateFilterPopover';
import StatusFilterPopover from './StatusFilterPopover';
import TypeFilterPopover from './TypeFilterPopover';

export type FilterPanel = 'date' | 'type' | 'status' | null;

type OrderFilterBarProps = {
  openPanel: FilterPanel;
  setOpenPanel: (p: FilterPanel) => void;
  appliedDates: Date[];
  onApplyDates: (dates: Date[]) => void;
  appliedTypes: Set<OrderTypeOption>;
  onApplyTypes: (types: Set<OrderTypeOption>) => void;
  appliedStatuses: Set<OrderStatus>;
  onApplyStatuses: (statuses: Set<OrderStatus>) => void;
  onReset: () => void;
};

function dateTriggerLabel(dates: Date[]): string {
  if (dates.length === 0) return 'Ngày';
  if (dates.length === 1) return formatOrderDate(dates[0]);
  return `${dates.length} ngày`;
}

function typeTriggerLabel(types: Set<OrderTypeOption>): string {
  if (types.size === 0) return 'Loại đơn';
  if (types.size === 1) return [...types][0];
  return `${types.size} loại đã chọn`;
}

function statusTriggerLabel(statuses: Set<OrderStatus>): string {
  if (statuses.size === 0) return 'Trạng thái đơn';
  if (statuses.size === 1) return [...statuses][0];
  return `${statuses.size} trạng thái`;
}

const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
  openPanel,
  setOpenPanel,
  appliedDates,
  onApplyDates,
  appliedTypes,
  onApplyTypes,
  appliedStatuses,
  onApplyStatuses,
  onReset,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openPanel) return;
    const close = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openPanel, setOpenPanel]);

  const toggle = (p: Exclude<FilterPanel, null>) => {
    setOpenPanel(openPanel === p ? null : p);
  };

  return (
    <div
      ref={rootRef}
      className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-stretch"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 sm:border-b-0 sm:border-r border-slate-100">
        <span className="material-icons text-slate-500 text-[22px]">filter_alt</span>
      </div>

      <div className="flex items-center px-4 py-3 text-sm font-semibold text-slate-700 border-b border-slate-100 sm:border-b-0 sm:border-r border-slate-100">
        Lọc theo
      </div>

      <div className="relative flex-1 min-w-[140px] border-b border-slate-100 sm:border-b-0 sm:border-r border-slate-100">
        <button
          type="button"
          onClick={() => toggle('date')}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50/80 transition-colors"
        >
          <span className="truncate">{dateTriggerLabel(appliedDates)}</span>
          <span className="material-icons text-slate-400 text-xl shrink-0">expand_more</span>
        </button>
        {openPanel === 'date' && (
          <DateFilterPopover
            initialDates={appliedDates}
            onApply={onApplyDates}
            onClose={() => setOpenPanel(null)}
          />
        )}
      </div>

      <div className="relative flex-1 min-w-[140px] border-b border-slate-100 sm:border-b-0 sm:border-r border-slate-100">
        <button
          type="button"
          onClick={() => toggle('type')}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50/80 transition-colors"
        >
          <span className="truncate text-left">{typeTriggerLabel(appliedTypes)}</span>
          <span className="material-icons text-slate-400 text-xl shrink-0">expand_more</span>
        </button>
        {openPanel === 'type' && (
          <TypeFilterPopover
            initialTypes={appliedTypes}
            onApply={onApplyTypes}
            onClose={() => setOpenPanel(null)}
          />
        )}
      </div>

      <div className="relative flex-1 min-w-[140px] border-b border-slate-100 sm:border-b-0 sm:border-r border-slate-100">
        <button
          type="button"
          onClick={() => toggle('status')}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50/80 transition-colors"
        >
          <span className="truncate text-left">{statusTriggerLabel(appliedStatuses)}</span>
          <span className="material-icons text-slate-400 text-xl shrink-0">expand_more</span>
        </button>
        {openPanel === 'status' && (
          <StatusFilterPopover
            initialStatuses={appliedStatuses}
            onApply={onApplyStatuses}
            onClose={() => setOpenPanel(null)}
          />
        )}
      </div>

      <div className="flex items-center justify-end px-4 py-3 flex-1 min-w-[140px]">
        <button
          type="button"
          onClick={() => {
            onReset();
            setOpenPanel(null);
          }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors"
        >
          <span className="material-icons text-[20px]">refresh</span>
          Đặt lại bộ lọc
        </button>
      </div>
    </div>
  );
};

export default OrderFilterBar;
