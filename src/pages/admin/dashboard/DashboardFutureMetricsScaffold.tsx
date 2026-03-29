import React from 'react';

/**
 * Khung UI cho KPI doanh thu, biểu đồ theo thời gian và bảng đơn hàng gần đây —
 * cần API admin aggregate đơn hàng (hiện backend chưa có).
 */
const DashboardFutureMetricsScaffold: React.FC = () => {
  return (
    <section
      className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-6 space-y-4"
      aria-label="Khu vực dự phòng: doanh thu và đơn hàng toàn hệ thống"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-900">Doanh thu & đơn hàng (sắp tích hợp)</h2>
        <p className="mt-1 text-sm text-slate-600 max-w-3xl">
          Các phần dưới đây cần endpoint quản trị đọc toàn bộ đơn hàng hoặc tổng hợp (ví dụ{' '}
          <code className="text-xs bg-white px-1 py-0.5 rounded border border-slate-200">GET /api/admin/orders</code>,{' '}
          <code className="text-xs bg-white px-1 py-0.5 rounded border border-slate-200">GET /api/admin/dashboard/summary</code>
          ). Khi backend sẵn sàng, thay các khung placeholder bằng biểu đồ và bảng thật.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 min-h-[100px] flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase text-slate-500">KPI doanh thu đơn hàng</p>
          <p className="mt-2 text-sm text-slate-400 italic">Chờ API tổng hợp từ collection Order</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 min-h-[100px] flex flex-col justify-center lg:col-span-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Tổng doanh thu / theo ngày–tháng</p>
          <p className="mt-2 text-sm text-slate-400 italic">Chờ aggregate theo createdAt + totalPrice</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 min-h-[200px] flex flex-col justify-center items-center text-center">
        <p className="text-xs font-semibold uppercase text-slate-500">Biểu đồ bán hàng theo thời gian</p>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          Placeholder cho đường / cột theo chuỗi thời gian (bucket ngày hoặc tháng).
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
          <p className="text-xs font-semibold uppercase text-slate-500">Giao dịch / đơn hàng gần đây (toàn hệ thống)</p>
        </div>
        <div className="p-8 text-center text-sm text-slate-400 italic">
          Chờ API liệt kê đơn cho admin — hiện GET /api/orders chỉ trả đơn của user đang đăng nhập.
        </div>
      </div>
    </section>
  );
};

export default DashboardFutureMetricsScaffold;
