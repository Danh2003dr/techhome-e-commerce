import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '@/services/backend';
import { isApiConfigured } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { OrderDto } from '@/types/api';
import { formatVND } from '@/utils';
import { formatDate } from '@/utils/formatDate';
import { orderStatusLabelVi, paymentMethodLabelVi, codAwarePaymentStatusVi } from '@/utils/orderDisplay';

type LineRow = {
  key: string;
  name: string;
  image: string | null;
  quantity: number;
  lineTotal: number;
};

function mapDtoToView(dto: OrderDto): {
  orderId: string;
  statusLabel: string;
  paymentStatusLabel: string;
  paymentMethodLabel: string;
  transactionId: string | null;
  paidAtLabel: string | null;
  placedAt: string;
  lineItems: LineRow[];
  total: number;
  shippingAddress: string | null;
  codUnpaidNote: boolean;
} {
  const ship =
    dto.shippingAddress != null && String(dto.shippingAddress).trim() !== ''
      ? String(dto.shippingAddress).trim()
      : null;
  return {
    orderId: String(dto.id),
    statusLabel: orderStatusLabelVi(dto.status),
    paymentStatusLabel: codAwarePaymentStatusVi({
      paymentMethod: dto.paymentMethod,
      paymentStatus: dto.paymentStatus,
      orderStatus: dto.status,
    }),
    paymentMethodLabel:
      dto.paymentMethod != null && String(dto.paymentMethod).trim() !== ''
        ? paymentMethodLabelVi(dto.paymentMethod)
        : '—',
    transactionId:
      dto.paymentTransactionId != null && String(dto.paymentTransactionId).trim() !== ''
        ? String(dto.paymentTransactionId).trim()
        : null,
    paidAtLabel:
      dto.paidAt != null && String(dto.paidAt).trim() !== ''
        ? formatDate(String(dto.paidAt))
        : null,
    placedAt: formatDate(dto.createdAt),
    lineItems: dto.items.map((item, idx) => ({
      key: `${item.productId}-${idx}`,
      name: item.productName,
      image: item.productImage && String(item.productImage).trim() ? String(item.productImage) : null,
      quantity: item.quantity,
      lineTotal: Number(item.priceAtOrder) * Number(item.quantity),
    })),
    total: Number(dto.totalPrice),
    shippingAddress: ship,
    codUnpaidNote:
      String(dto.paymentMethod ?? '')
        .trim()
        .toUpperCase() === 'COD' &&
      String(dto.paymentStatus ?? '')
        .trim()
        .toUpperCase() === 'UNPAID',
  };
}

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const { isAuthenticated } = useAuth();
  const [dto, setDto] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canFetch = Boolean(orderId && isApiConfigured() && isAuthenticated);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError(null);
      setDto(null);
      return;
    }
    if (!canFetch) {
      setLoading(false);
      setDto(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    getOrder(orderId)
      .then((res) => {
        setDto(res);
      })
      .catch((e: unknown) => {
        setDto(null);
        setError(e instanceof Error ? e.message : 'Không tải được đơn hàng.');
      })
      .finally(() => setLoading(false));
  }, [orderId, canFetch]);

  const view = useMemo(() => (dto ? mapDtoToView(dto) : null), [dto]);

  if (!orderId) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Thiếu mã đơn hàng trong đường dẫn.</p>
          <Link to="/orders" className="text-primary font-semibold hover:underline">
            Xem lịch sử đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  if (!isApiConfigured()) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center px-6">
        <p className="text-slate-600 dark:text-slate-400 text-center">
          Cần cấu hình kết nối máy chủ để xem xác nhận đơn hàng.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Vui lòng đăng nhập để xem đơn hàng.</p>
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Đang tải đơn hàng…</p>
      </div>
    );
  }

  if (error || !view) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-slate-600 dark:text-slate-400 mb-2">{error ?? 'Không tìm thấy đơn hàng.'}</p>
          <Link to="/orders" className="text-primary font-semibold hover:underline">
            Quay lại lịch sử đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <nav className="bg-white dark:bg-background-dark/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="material-icons text-white text-xl">devices</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">TechHome</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/search" className="hover:text-primary transition-colors">
              Mua sắm
            </Link>
            <Link to="/profile" className="hover:text-primary transition-colors">
              Tài khoản
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <span className="material-icons text-green-600 dark:text-green-400 text-5xl">check_circle</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Cảm ơn bạn đã đặt hàng!</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Đơn hàng #{view.orderId}</p>
          <p className="text-sm text-slate-500 mt-2">
            Trạng thái: <span className="font-semibold text-slate-700 dark:text-slate-300">{view.statusLabel}</span>
            {' · '}
            {view.placedAt}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Thanh toán:{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{view.paymentStatusLabel}</span>
            {' · '}
            Phương thức: <span className="font-semibold text-slate-700 dark:text-slate-300">{view.paymentMethodLabel}</span>
          </p>
          {view.transactionId && (
            <p className="text-xs text-slate-500 mt-1">
              Mã giao dịch: <span className="font-medium text-slate-700 dark:text-slate-300">{view.transactionId}</span>
            </p>
          )}
          {view.paidAtLabel && (
            <p className="text-xs text-slate-500 mt-1">
              Thanh toán lúc: <span className="font-medium text-slate-700 dark:text-slate-300">{view.paidAtLabel}</span>
            </p>
          )}
          <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            Địa chỉ giao hàng đã lưu trên đơn. Chi tiết sản phẩm và tổng tiền xem bên dưới hoặc trang chi tiết đơn.
          </p>
          {view.codUnpaidNote && (
            <p className="text-sm text-amber-900 dark:text-amber-100 mt-4 max-w-xl mx-auto bg-amber-50 dark:bg-amber-900/25 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
              Đơn thanh toán khi nhận hàng (COD): vui lòng chuẩn bị tiền mặt đúng tổng đơn khi shipper giao hàng.
            </p>
          )}
        </div>

        {view.shippingAddress && (
          <div className="max-w-2xl mx-auto mb-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-5 text-left">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Địa chỉ giao hàng</h2>
            <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{view.shippingAddress}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mb-12">
          <Link
            to="/orders"
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            <span className="material-icons text-sm">receipt_long</span>
            Lịch sử đơn hàng
          </Link>
          <Link
            to={`/order/${encodeURIComponent(view.orderId)}`}
            className="px-8 py-3 bg-white dark:bg-slate-800 border-2 border-primary/20 hover:border-primary text-primary font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <span className="material-icons text-sm">visibility</span>
            Chi tiết đơn hàng
          </Link>
          <Link
            to="/"
            className="px-8 py-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-lg transition-all hover:border-primary/40 flex items-center justify-center gap-2"
          >
            <span className="material-icons text-sm">shopping_bag</span>
            Tiếp tục mua sắm
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-bold text-lg text-slate-800 dark:text-white">Tóm tắt đơn hàng</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {view.lineItems.map((item) => (
              <div key={item.key} className="p-6 flex gap-6 items-center">
                <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-icons text-slate-400 text-3xl">inventory_2</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-sm text-slate-400 mt-1">SL: {item.quantity}</p>
                </div>
                <div className="text-right font-bold text-slate-900 dark:text-white">{formatVND(item.lineTotal)}</div>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 flex justify-between items-center">
            <span className="text-lg font-bold text-slate-900 dark:text-white">Tổng cộng</span>
            <span className="text-2xl font-bold text-primary">{formatVND(view.total)}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;
