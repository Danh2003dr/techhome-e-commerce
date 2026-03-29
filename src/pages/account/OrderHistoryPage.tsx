import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { OrderHistoryCardItem, OrderStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/services/backend';
import { isApiConfigured } from '@/services/api';
import { ApiError } from '@/services/api';
import type { OrderDto } from '@/types/api';
import { formatDate } from '@/utils/formatDate';
import { formatVND } from '@/utils';
import { orderStatusLabelVi } from '@/utils/orderDisplay';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';

function mapOrderDtoToCard(dto: OrderDto): OrderHistoryCardItem {
  const first = dto.items[0];
  const dateFormatted = formatDate(dto.createdAt);
  const rawStatus = String(dto.status || 'PENDING').toUpperCase();
  const statusMap: Record<string, OrderStatus> = {
    PENDING: 'PENDING',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    SHIPPING: 'Shipping',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  };
  const status = statusMap[rawStatus] ?? 'PENDING';
  return {
    id: String(dto.id),
    date: dateFormatted,
    total: dto.totalPrice,
    status,
    productImage: first?.productImage && String(first.productImage).trim() ? String(first.productImage) : '',
    productName: first ? first.productName : `Đơn #${dto.id}`,
    specs: first
      ? `${dto.items.length} mặt hàng · Đơn giá ${formatVND(first.priceAtOrder)}`
      : 'Không có dòng sản phẩm',
    extraLine: '',
    extraType: 'return',
    secondaryAction: 'buy_again',
  };
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const label = orderStatusLabelVi(status);
  const config: Record<string, { bg: string; text: string; dot: string }> = {
    Delivered: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
    Processing: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
    PENDING: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-300', dot: 'bg-amber-500' },
    Shipped: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
    Shipping: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
    Cancelled: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400', dot: 'bg-slate-400' },
  };
  const { bg, text, dot } = config[status] ?? config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

const OrderHistoryPage: React.FC = () => {
  const [apiOrders, setApiOrders] = useState<OrderHistoryCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const apiOn = isApiConfigured();
  const useApiOrders = apiOn && isAuthenticated;

  useEffect(() => {
    if (!useApiOrders) {
      setApiOrders([]);
      setLoadError(null);
      return;
    }
    setLoading(true);
    setLoadError(null);
    getOrders()
      .then((list) => {
        setApiOrders(list.map(mapOrderDtoToCard));
      })
      .catch((e: unknown) => {
        setApiOrders([]);
        setLoadError(e instanceof ApiError ? e.message : 'Không tải được danh sách đơn hàng.');
      })
      .finally(() => setLoading(false));
  }, [useApiOrders]);

  const orders = useApiOrders ? apiOrders : [];

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <AccountHeader />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10 w-full">
        <AccountSidebar />

        <main className="flex-grow space-y-8 min-w-0">
          <div>
            <Breadcrumb
              items={[
                { label: 'Trang chủ', path: '/' },
                { label: 'Tài khoản', path: '/profile' },
                { label: 'Lịch sử đơn hàng' },
              ]}
            />
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Lịch sử đơn hàng</h1>
                <p className="text-slate-500 mt-1.5">Đơn hàng từ server (theo tài khoản đang đăng nhập).</p>
              </div>
              {loading && <p className="text-sm text-slate-500">Đang tải…</p>}
            </div>
          </div>

          {!apiOn && (
            <p className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-sm px-4 py-3">
              Cấu hình <code className="font-mono text-xs">VITE_API_URL</code> để xem đơn hàng thật.
            </p>
          )}

          {apiOn && !isAuthenticated && (
            <p className="text-slate-600 dark:text-slate-400">
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Đăng nhập
              </Link>{' '}
              để xem lịch sử đơn hàng.
            </p>
          )}

          {loadError && (
            <p className="text-red-600 dark:text-red-400 text-sm" role="alert">
              {loadError}
            </p>
          )}

          <div className="space-y-6">
            {orders.length === 0 && !loading && useApiOrders && !loadError && (
              <p className="text-slate-500 py-8 text-center border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                Chưa có đơn hàng nào.
              </p>
            )}
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] overflow-hidden"
              >
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Ngày đặt</p>
                      <p className="text-sm font-bold mt-1 text-slate-900 dark:text-white">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Tổng tiền</p>
                      <p className="text-sm font-bold mt-1 text-primary">{formatVND(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Mã đơn</p>
                      <p className="text-sm font-bold mt-1 text-slate-900 dark:text-white">#{order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <Link
                      to={`/order/${order.id}`}
                      className="px-5 py-2 bg-primary text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div
                      className={`w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl p-2 flex items-center justify-center flex-shrink-0 ${order.status === 'Cancelled' ? 'opacity-60' : ''}`}
                    >
                      {order.productImage ? (
                        <img
                          alt=""
                          src={order.productImage}
                          className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                        />
                      ) : (
                        <span className="material-icons text-slate-400 text-3xl">inventory_2</span>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white">{order.productName}</h4>
                      <p className="text-sm text-slate-500 mt-1">{order.specs}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <AccountFooter />
    </div>
  );
};

export default OrderHistoryPage;
