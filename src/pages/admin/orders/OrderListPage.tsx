import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminOrders } from '@/services/backend';
import { ApiError } from '@/services/api';
import type { OrderDto } from '@/types/api';
import { formatVND } from '@/utils';
import { formatDate } from '@/utils/formatDate';
import { orderStatusLabelVi } from '@/utils/orderDisplay';

const PAGE_SIZE = 10;

const OrderListPage: React.FC = () => {
  const [rows, setRows] = useState<OrderDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAdminOrders({
      page,
      size: PAGE_SIZE,
      status: status || undefined,
      paymentStatus: paymentStatus || undefined,
    })
      .then((res) => {
        setRows(res.items);
        setTotal(res.total);
      })
      .catch((e: unknown) => {
        setRows([]);
        setTotal(0);
        setError(e instanceof ApiError ? e.message : 'Không tải được danh sách đơn hàng admin.');
      })
      .finally(() => setLoading(false));
  }, [page, status, paymentStatus]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-[32px] leading-[44px] font-normal tracking-tight text-[#202224]">Đơn hàng</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Quản trị — dữ liệu từ <code className="text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">GET /api/orders/admin</code>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600">
            Trạng thái
            <select
              value={status}
              onChange={(e) => {
                setPage(0);
                setStatus(e.target.value);
              }}
              className="ml-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              <option value="PENDING">PENDING</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="SHIPPING">SHIPPING</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-600">
            Thanh toán
            <select
              value={paymentStatus}
              onChange={(e) => {
                setPage(0);
                setPaymentStatus(e.target.value);
              }}
              className="ml-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              <option value="UNPAID">UNPAID</option>
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="FAILED">FAILED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading && <p className="px-5 py-4 text-sm text-slate-500">Đang tải dữ liệu…</p>}
        {error && <p className="px-5 py-4 text-sm text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                  <th className="py-4 px-4">Order ID</th>
                  <th className="py-4 px-4">User ID</th>
                  <th className="py-4 px-4">Ngày đặt</th>
                  <th className="py-4 px-4">Trạng thái</th>
                  <th className="py-4 px-4">Thanh toán</th>
                  <th className="py-4 px-4 text-right">Tổng</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-4 text-center text-sm font-semibold text-slate-500">
                      Không có đơn hàng phù hợp.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={String(row.id)} className="text-sm text-slate-900">
                      <td className="py-4 px-4 font-semibold tabular-nums">#{row.id}</td>
                      <td className="py-4 px-4 tabular-nums">{row.userId}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                      <td className="py-4 px-4">{orderStatusLabelVi(row.status)}</td>
                      <td className="py-4 px-4">{row.paymentStatus ?? 'UNPAID'}</td>
                      <td className="py-4 px-4 text-right font-semibold text-primary">{formatVND(row.totalPrice)}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Link
                            to={`/admin/orders/${encodeURIComponent(String(row.id))}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            View
                          </Link>
                          <Link
                            to={`/admin/orders/invoice?orderId=${encodeURIComponent(String(row.id))}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Invoice
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/70 text-sm">
            <p className="text-slate-600">
              Tổng: <span className="font-semibold">{total}</span> đơn
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-slate-600">
                Page {page + 1}/{totalPages}
              </span>
              <button
                type="button"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;
