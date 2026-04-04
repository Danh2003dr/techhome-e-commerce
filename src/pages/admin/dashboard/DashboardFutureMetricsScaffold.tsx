import React from 'react';

type RecentOrder = {
  id: number | string;
  userId: number | string;
  totalPrice: number;
  status: string;
  createdAt: string;
};

interface DashboardFutureMetricsScaffoldProps {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: RecentOrder[];
  loading?: boolean;
}

function formatMoneyVnd(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(
    Number(value) || 0
  );
}

function formatDateTime(value: string): string {
  const t = Date.parse(value);
  if (Number.isNaN(t)) return '-';
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(t));
}

const DashboardFutureMetricsScaffold: React.FC<DashboardFutureMetricsScaffoldProps> = ({
  totalOrders,
  totalRevenue,
  ordersByStatus,
  recentOrders,
  loading = false,
}) => {
  const statusEntries = Object.entries(ordersByStatus || {}).sort((a, b) => b[1] - a[1]);

  return (
    <section
      className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-6 space-y-4"
      aria-label="Doanh thu và đơn hàng toàn hệ thống"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-900">Doanh thu & đơn hàng</h2>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl">Số liệu tổng hợp trên hệ thống quản trị.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 min-h-[100px] flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase text-slate-500">Tổng đơn hàng</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{loading ? '...' : totalOrders}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 min-h-[100px] flex flex-col justify-center lg:col-span-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Tổng doanh thu (không tính đơn đã hủy)</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{loading ? '...' : formatMoneyVnd(totalRevenue)}</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase text-slate-500 mb-3">Phân bổ trạng thái đơn</p>
        {loading ? (
          <p className="text-sm text-slate-400 italic">Đang tải...</p>
        ) : statusEntries.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Chưa có dữ liệu trạng thái đơn.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {statusEntries.map(([status, count]) => (
              <div key={status} className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="text-xs text-slate-500">{status}</p>
                <p className="text-lg font-semibold text-slate-900">{count}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
          <p className="text-xs font-semibold uppercase text-slate-500">Đơn hàng gần đây (toàn hệ thống)</p>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-400 italic">Đang tải...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400 italic">Chưa có đơn hàng nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="px-4 py-2 text-left">Mã đơn</th>
                  <th className="px-4 py-2 text-left">User ID</th>
                  <th className="px-4 py-2 text-left">Trạng thái</th>
                  <th className="px-4 py-2 text-right">Tổng tiền</th>
                  <th className="px-4 py-2 text-left">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={String(order.id)} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-slate-900">#{order.id}</td>
                    <td className="px-4 py-2 text-slate-700">{order.userId}</td>
                    <td className="px-4 py-2 text-slate-700">{order.status}</td>
                    <td className="px-4 py-2 text-right text-slate-900">{formatMoneyVnd(order.totalPrice)}</td>
                    <td className="px-4 py-2 text-slate-700">{formatDateTime(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardFutureMetricsScaffold;
