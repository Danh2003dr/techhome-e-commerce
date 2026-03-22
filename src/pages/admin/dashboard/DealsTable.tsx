import React, { useState } from 'react';
import { MONTH_OPTIONS, type DealRow } from './dashboardMockData';

type DealsTableProps = {
  rows: DealRow[];
};

const statusClass: Record<DealRow['status'], string> = {
  Delivered: 'bg-teal-500 text-white',
  Processing: 'bg-amber-100 text-amber-800',
  Pending: 'bg-slate-200 text-slate-800',
};

const DealsTable: React.FC<DealsTableProps> = ({ rows }) => {
  const [month, setMonth] = useState<(typeof MONTH_OPTIONS)[number]>('October');

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-bold text-slate-900">Deals Details</h2>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span className="sr-only">Month</span>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value as (typeof MONTH_OPTIONS)[number])}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="overflow-x-auto -mx-1">
        <table className="min-w-[720px] w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
              <th className="py-3 px-3">Product Name</th>
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-3 whitespace-nowrap">Date - Time</th>
              <th className="py-3 px-3">Piece</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="text-sm text-slate-900">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={row.imageUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg object-cover bg-slate-100"
                      loading="lazy"
                    />
                    <span className="font-medium truncate">{row.productName}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-700 max-w-[200px] truncate">{row.location}</td>
                <td className="py-3 px-3 text-slate-700 whitespace-nowrap">{row.dateTime}</td>
                <td className="py-3 px-3 tabular-nums">{row.piece}</td>
                <td className="py-3 px-3 font-semibold tabular-nums">
                  ${row.amountUsd.toLocaleString('en-US')}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealsTable;
