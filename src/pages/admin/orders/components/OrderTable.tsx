import React from 'react';
import type { AdminOrderRow } from '../orderListMock';
import { formatOrderDate } from '../orderListUtils';
import OrderStatusBadge from './OrderStatusBadge';

type OrderTableProps = {
  rows: AdminOrderRow[];
};

const OrderTable: React.FC<OrderTableProps> = ({ rows }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
            <th className="py-4 px-4">ID</th>
            <th className="py-4 px-4">Name</th>
            <th className="py-4 px-4">Address</th>
            <th className="py-4 px-4">Date</th>
            <th className="py-4 px-4">Type</th>
            <th className="py-4 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 px-4 text-center text-sm font-semibold text-slate-500">
                No orders match the current filters.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="text-sm text-slate-900">
                <td className="py-4 px-4 font-semibold tabular-nums">{row.id}</td>
                <td className="py-4 px-4 font-medium">{row.name}</td>
                <td className="py-4 px-4 text-slate-700">{row.address}</td>
                <td className="py-4 px-4 text-slate-700 whitespace-nowrap">{formatOrderDate(row.date)}</td>
                <td className="py-4 px-4 text-slate-700">{row.typeLabel}</td>
                <td className="py-4 px-4">
                  <OrderStatusBadge status={row.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
