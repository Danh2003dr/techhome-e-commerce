import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AdminOrderRow } from '../orderListMock';
import { formatOrderDate } from '../orderListUtils';
import OrderStatusBadge from './OrderStatusBadge';

type OrderTableProps = {
  rows: AdminOrderRow[];
};

const OrderTable: React.FC<OrderTableProps> = ({ rows }) => {
  const navigate = useNavigate();

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
            <th className="py-4 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 px-4 text-center text-sm font-semibold text-slate-500">
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
                <td className="py-4 px-4 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link
                      to={`/admin/orders/${row.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <span className="material-icons text-[16px]">visibility</span>
                      View
                    </Link>
                    <Link
                      to={`/admin/orders/invoice?orderId=${encodeURIComponent(row.id)}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <span className="material-icons text-[16px]">receipt_long</span>
                      View Invoice
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/orders/invoice?orderId=${encodeURIComponent(row.id)}&autoprint=1`,
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
                    >
                      <span className="material-icons text-[16px]">picture_as_pdf</span>
                      Download PDF
                    </button>
                  </div>
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
