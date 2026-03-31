import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAdminOrder } from '@/services/backend';
import { isApiConfigured, ApiError } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { OrderDto } from '@/types/api';
import { formatVND } from '@/utils';
import { formatDate } from '@/utils/formatDate';
import { orderStatusLabelVi } from '@/utils/orderDisplay';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [dto, setDto] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !isApiConfigured() || !isAuthenticated) {
      setDto(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getAdminOrder(orderId)
      .then(setDto)
      .catch((e: unknown) => {
        setDto(null);
        setError(e instanceof ApiError ? e.message : 'Không tải được đơn.');
      })
      .finally(() => setLoading(false));
  }, [orderId, isAuthenticated]);

  const invoiceHref =
    orderId != null
      ? `/admin/orders/invoice?orderId=${encodeURIComponent(orderId)}`
      : '/admin/orders/invoice';

  const handleDownloadPdf = () => {
    if (orderId == null) return;
    navigate(`/admin/orders/invoice?orderId=${encodeURIComponent(orderId)}&autoprint=1`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Chi tiết đơn</h1>
          <p className="text-xs font-semibold text-slate-500">
            Mã đơn: <span className="font-bold text-slate-700">{orderId ?? '—'}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">Dữ liệu lấy từ API admin orders.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {orderId != null && (
            <>
              <Link
                to={invoiceHref}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="material-icons text-[18px]">description</span>
                Hóa đơn
              </Link>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span className="material-icons text-[18px]">print</span>
                In nhanh
              </button>
            </>
          )}
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="material-icons text-[18px]">arrow_back</span>
            Quay lại
          </Link>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Đang tải…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {dto && (
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-slate-900">Đơn #{dto.id}</div>
              <div className="text-xs text-slate-500 mt-1">{formatDate(dto.createdAt)}</div>
            </div>
            <div className="text-sm font-semibold text-primary">{orderStatusLabelVi(dto.status)}</div>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-sm font-bold text-slate-900">Sản phẩm</div>
            <ul className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {dto.items.map((item, idx) => (
                <li key={`${item.productId}-${idx}`} className="px-4 py-3 flex justify-between gap-4 text-sm">
                  <span className="text-slate-800">{item.productName}</span>
                  <span className="text-slate-500 shrink-0">
                    {item.quantity} × {formatVND(item.priceAtOrder)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-base font-bold text-slate-900">
              <span>Tổng</span>
              <span className="text-primary">{formatVND(dto.totalPrice)}</span>
            </div>
          </div>
        </section>
      )}

      {!loading && !dto && !error && orderId && isApiConfigured() && isAuthenticated && (
        <p className="text-sm text-slate-500">Không có dữ liệu.</p>
      )}
    </div>
  );
};

export default OrderDetailPage;
