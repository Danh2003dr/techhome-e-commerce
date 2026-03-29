import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getOrder } from '@/services/backend';
import { isApiConfigured, ApiError } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { OrderDto } from '@/types/api';
import { formatVND } from '@/utils';
import { formatDate } from '@/utils/formatDate';
import { orderStatusLabelVi } from '@/utils/orderDisplay';

const InvoicePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const autoprint = searchParams.get('autoprint') === '1';
  const { isAuthenticated } = useAuth();
  const [dto, setDto] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!autoprint) return;
    const t = window.setTimeout(() => {
      window.print();
    }, 400);
    return () => window.clearTimeout(t);
  }, [autoprint]);

  useEffect(() => {
    if (!orderId || !isApiConfigured() || !isAuthenticated) {
      setDto(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getOrder(orderId)
      .then(setDto)
      .catch((e: unknown) => {
        setDto(null);
        setError(e instanceof ApiError ? e.message : 'Không tải được đơn.');
      })
      .finally(() => setLoading(false));
  }, [orderId, isAuthenticated]);

  const rows = useMemo(() => {
    if (!dto) return [];
    return dto.items.map((item, idx) => ({
      key: `${item.productId}-${idx}`,
      description: item.productName,
      quantity: item.quantity,
      unit: Number(item.priceAtOrder),
      total: Number(item.priceAtOrder) * Number(item.quantity),
    }));
  }, [dto]);

  const totalAmount = dto ? Number(dto.totalPrice) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-[44px] font-semibold tracking-tight text-[#202224]">Hóa đơn</h1>
          {orderId && (
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Mã đơn: <span className="text-slate-800">{orderId}</span>
            </p>
          )}
        </div>
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="material-icons text-[18px]">arrow_back</span>
          Quay lại
        </Link>
      </div>

      {!orderId && (
        <p className="text-sm text-slate-500">Thêm <code className="text-xs">?orderId=</code> để tải đơn (theo tài khoản đang đăng nhập).</p>
      )}

      {orderId && !isApiConfigured() && (
        <p className="text-sm text-amber-700">Cấu hình VITE_API_URL.</p>
      )}

      {orderId && isApiConfigured() && !isAuthenticated && (
        <p className="text-sm text-slate-600">
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Đăng nhập
          </Link>{' '}
          — chỉ xem được đơn của chính user.
        </p>
      )}

      {loading && <p className="text-sm text-slate-500">Đang tải…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {dto && (
        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-4 md:p-7 lg:p-8 print:shadow-none print:border-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
            <div>
              <p className="text-sm font-semibold text-slate-500">TechHome</p>
              <p className="text-sm text-slate-600 mt-1">Hóa đơn bán hàng (theo dữ liệu đơn API)</p>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-semibold text-slate-500">Ngày đặt: </span>
                <span className="text-slate-900">{formatDate(dto.createdAt)}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-500">Trạng thái: </span>
                <span className="text-slate-900">{orderStatusLabelVi(dto.status)}</span>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-100/90">
                  <th className="text-left text-xs md:text-sm font-semibold text-slate-600 px-5 py-3 rounded-l-xl">#</th>
                  <th className="text-left text-xs md:text-sm font-semibold text-slate-600 px-5 py-3">Mặt hàng</th>
                  <th className="text-right text-xs md:text-sm font-semibold text-slate-600 px-5 py-3">SL</th>
                  <th className="text-right text-xs md:text-sm font-semibold text-slate-600 px-5 py-3">Đơn giá</th>
                  <th className="text-right text-xs md:text-sm font-semibold text-slate-600 px-5 py-3 rounded-r-xl">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, i) => (
                  <tr key={item.key}>
                    <td className="px-5 py-4 text-sm text-slate-700 border-b border-slate-100">{i + 1}</td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-800 border-b border-slate-100">{item.description}</td>
                    <td className="px-5 py-4 text-sm text-right text-slate-700 border-b border-slate-100">{item.quantity}</td>
                    <td className="px-5 py-4 text-sm text-right text-slate-700 border-b border-slate-100">{formatVND(item.unit)}</td>
                    <td className="px-5 py-4 text-sm text-right text-slate-800 font-semibold border-b border-slate-100">
                      {formatVND(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex justify-end">
            <div className="flex items-center gap-4 text-lg">
              <span className="text-slate-700">Tổng</span>
              <span className="font-extrabold text-slate-900">{formatVND(totalAmount)}</span>
            </div>
          </div>

          <div className="mt-8 flex justify-end print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="w-11 h-11 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center justify-center"
              aria-label="In"
            >
              <span className="material-icons text-[20px]">print</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default InvoicePage;
