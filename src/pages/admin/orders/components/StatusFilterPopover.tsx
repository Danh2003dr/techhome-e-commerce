import React, { useEffect, useState } from 'react';
import { ORDER_STATUS_OPTIONS, type OrderStatus } from '../orderListMock';

type StatusFilterPopoverProps = {
  initialStatuses: Set<OrderStatus>;
  onApply: (statuses: Set<OrderStatus>) => void;
  onClose: () => void;
};

const StatusFilterPopover: React.FC<StatusFilterPopoverProps> = ({
  initialStatuses,
  onApply,
  onClose,
}) => {
  const [draft, setDraft] = useState<Set<OrderStatus>>(() => new Set(initialStatuses));

  useEffect(() => {
    setDraft(new Set(initialStatuses));
  }, [initialStatuses]);

  const toggle = (s: OrderStatus) => {
    setDraft((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  return (
    <div
      className="absolute left-0 top-full z-40 mt-2 w-[min(100vw-2rem,320px)] rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
      role="dialog"
      aria-label="Select order status"
    >
      <div className="text-sm font-bold text-slate-900 mb-3">Select Order Status</div>
      <div className="flex flex-wrap gap-2">
        {ORDER_STATUS_OPTIONS.map((opt) => {
          const on = draft.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                on
                  ? 'border-[#4880FF] bg-[#4880FF] text-white'
                  : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-slate-500 italic">*You can choose multiple Order Status</p>
      <div className="mt-4 flex justify-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onApply(new Set(draft));
            onClose();
          }}
          className="px-6 py-2 text-sm font-semibold text-white bg-[#4880FF] hover:bg-blue-600 rounded-lg"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default StatusFilterPopover;
