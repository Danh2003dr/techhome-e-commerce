import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { OrderHistoryCardItem, OrderStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/services/backend';
import { isApiConfigured } from '@/services/api';
import { getFallbackOrderHistoryCards } from '@/services/fallbackAdapters';
import type { OrderDto } from '@/types/api';
import { formatDate } from '@/utils/formatDate';
import { formatVND } from '@/utils';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';

const PLACEHOLDER_IMG = 'https://picsum.photos/100/100?random=order';

function mapOrderDtoToCard(dto: OrderDto): OrderHistoryCardItem {
  const first = dto.items[0];
  const dateFormatted = formatDate(dto.createdAt);
  return {
    id: String(dto.id),
    date: dateFormatted,
    total: dto.totalPrice,
    status: (dto.status as OrderStatus) || 'Processing',
    productImage: first?.productImage || PLACEHOLDER_IMG,
    productName: first ? first.productName : 'Đơn hàng',
    specs: first ? `SL: ${first.quantity} · ${formatVND(first.priceAtOrder)}` : '',
    extraLine: '',
    extraType: 'return',
    secondaryAction: 'buy_again',
  };
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<string, { bg: string; text: string; dot: string }> = {
    Delivered: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
    Processing: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
    PENDING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
    Shipped: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
    Shipping: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
    Cancelled: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400', dot: 'bg-slate-400' },
  };
  const { bg, text, dot } = config[status] ?? config.Cancelled;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

const OrderHistoryPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('Tất cả đơn hàng');
  const [apiOrders, setApiOrders] = useState<OrderHistoryCardItem[]>([]);
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isApiConfigured() || !isAuthenticated) return;
    setLoading(true);
    getOrders()
      .then((list) => {
        setApiOrders(list.map(mapOrderDtoToCard));
        setApiUnavailable(false);
      })
      .catch(() => {
        // Backend orders is not available yet -> keep temporary mock fallback.
        setApiOrders([]);
        setApiUnavailable(true);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const useApiOrders = isApiConfigured() && isAuthenticated && !apiUnavailable;
  const orders = useApiOrders ? apiOrders : getFallbackOrderHistoryCards();

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <AccountHeader />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10 w-full">
        <AccountSidebar />

        {/* Main */}
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
                <p className="text-slate-500 mt-1.5">Xem và quản lý các đơn hàng gần đây.</p>
              </div>
              {(isApiConfigured() && isAuthenticated && loading) && (
                <p className="text-sm text-slate-500">Đang tải đơn hàng...</p>
              )}
              {(isApiConfigured() && isAuthenticated && apiUnavailable && !loading) && (
                <p className="text-sm text-amber-600">Backend chưa có API đơn hàng, đang hiển thị dữ liệu mẫu tạm thời.</p>
              )}
              <div className="flex gap-3">
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">filter_list</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary appearance-none min-w-[160px]"
                  >
                    <option>Tất cả đơn hàng</option>
                    <option>30 ngày qua</option>
                    <option>2023</option>
                    <option>2022</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {orders.length === 0 && !loading && (
              <p className="text-slate-500 py-8 text-center">Chưa có đơn hàng nào.</p>
            )}
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] overflow-hidden"
              >
                {/* Card header bar */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Ngày đặt</p>
                      <p className="text-sm font-bold mt-1 text-slate-900 dark:text-white">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Tổng tiền</p>
                      <p className="text-sm font-bold mt-1 text-primary">
                        {formatVND(order.total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Mã đơn hàng</p>
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
                {/* Product row */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div
                      className={`w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl p-2 flex items-center justify-center flex-shrink-0 ${order.status === 'Cancelled' ? 'opacity-60' : ''}`}
                    >
                      <img
                        alt={order.productName}
                        src={order.productImage}
                        className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white">{order.productName}</h4>
                      <p className="text-sm text-slate-500 mt-1">{order.specs}</p>
                      {order.extraType === 'return' && (
                        <p className="text-[12px] text-slate-400 mt-2 italic">{order.extraLine}</p>
                      )}
                      {order.extraType === 'shipping' && (
                        <p className="text-[12px] text-primary mt-2 font-medium flex items-center gap-1">
                          <span className="material-icons text-[14px]">local_shipping</span>
                          {order.extraLine}
                        </p>
                      )}
                      {order.extraType === 'refund' && (
                        <p className="text-[12px] text-red-500 mt-2 font-medium">{order.extraLine}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[12px] font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        {order.secondaryAction === 'buy_again' && 'Mua lại'}
                        {order.secondaryAction === 'track' && 'Theo dõi đơn'}
                        {order.secondaryAction === 'reorder' && 'Đặt lại'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center pt-4">
            <nav className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors"
              >
                <span className="material-icons text-lg">chevron_left</span>
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                    page === n
                      ? 'bg-primary text-white'
                      : 'border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(3, p + 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors"
              >
                <span className="material-icons text-lg">chevron_right</span>
              </button>
            </nav>
          </div>
        </main>
      </div>

      <AccountFooter />
    </div>
  );
};

export default OrderHistoryPage;
