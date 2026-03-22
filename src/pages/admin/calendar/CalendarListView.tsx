import React from 'react';
import type { PromotionEvent } from './calendarTypes';
import { getEventStatus, statusBadgeClass, statusLabel } from './calendarUtils';
import { EVENT_TYPE_LABEL } from './calendarConstants';

type CalendarListViewProps = {
  rows: PromotionEvent[];
  onEdit: (ev: PromotionEvent) => void;
  onDelete: (ev: PromotionEvent) => void;
};

const CalendarListView: React.FC<CalendarListViewProps> = ({ rows, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4 whitespace-nowrap">Start Date</th>
              <th className="py-4 px-4 whitespace-nowrap">End Date</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-4 text-center text-sm font-semibold text-slate-500">
                  No events match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((ev) => {
                const st = getEventStatus(ev);
                return (
                  <tr key={ev.id} className="text-sm text-slate-900">
                    <td className="py-3 px-4 font-semibold">{ev.name}</td>
                    <td className="py-3 px-4 text-slate-700">{EVENT_TYPE_LABEL[ev.type]}</td>
                    <td className="py-3 px-4 tabular-nums text-slate-700">{ev.startDate}</td>
                    <td className="py-3 px-4 tabular-nums text-slate-700">{ev.endDate}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(st)}`}>
                        {statusLabel(st)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(ev)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <span className="material-icons text-[16px]">edit</span>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete “${ev.name}”?`)) onDelete(ev);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          <span className="material-icons text-[16px]">delete</span>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarListView;
