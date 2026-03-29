import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Backend hiện chỉ có GET /orders theo user đăng nhập — chưa có API danh sách đơn toàn hệ thống cho admin.
 */
const OrderListPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] leading-[44px] font-normal tracking-tight text-[#202224]">Đơn hàng</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">Quản trị — chờ API</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-600">
        <p className="font-semibold text-slate-800 mb-2">Chưa có API quản trị đơn hàng</p>
        <p>
          Storefront dùng <code className="text-xs bg-white px-1 rounded border">GET /api/orders</code> (chỉ đơn của user
          đăng nhập). Để hiển thị danh sách đơn tại đây cần thêm endpoint admin (hoặc mở rộng backend).
        </p>
        <Link
          to="/orders"
          className="inline-flex mt-4 text-sm font-semibold text-primary hover:underline"
        >
          Xem lịch sử đơn (tài khoản khách)
        </Link>
      </div>
    </div>
  );
};

export default OrderListPage;
