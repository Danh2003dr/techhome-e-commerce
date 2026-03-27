import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { orderHistoryCards } from '@/data';
import type { OrderHistoryCardItem } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/services/backend';
import { isApiConfigured } from '@/services/api';
import type { OrderDto } from '@/types/api';
import { formatDate } from '@/utils/formatDate';
import { formatVND } from '@/utils';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';

const PLACEHOLDER_IMG = 'https://picsum.photos/100/100?random=order';
const PAGE_SIZE = 3;

function mapOrderDtoToCard(dto: OrderDto): OrderHistoryCardItem {
  const first = dto.items[0];
  const dateFormatted = formatDate(dto.createdAt);
  return {
    id: String(dto.id),
    date: dateFormatted,
    createdAtRaw: dto.createdAt,
    total: dto.totalPrice,
    status: String(dto.status ?? 'Processing'),
    productImage: first?.productImage || PLACEHOLDER_IMG,
    productName: first ? first.productName : 'Đơn hàng',
    specs: first ? `SL: ${first.quantity} · ${formatVND(first.priceAtOrder)}` : '',
    extraLine: '',
    extraType: 'return',
    secondaryAction: 'buy_again',
  };
}

function StatusBadge({ status }: { status: string }) {
  const s = String(status ?? '').trim().toUpperCase();
  const config: Record<
    string,
    { bg: string; text: string; dot: string; label: string }
  > = {
    DELIVERED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500', label: 'Đã giao' },
    PROCESSING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500', label: 'Đang xử lý' },
    PENDING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500', label: 'Đang xử lý' },
    PAID: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500', label: 'Đã thanh toán' },
    SHIPPED: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500', label: 'Đã giao' },
    SHIPPING: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500', label: 'Đang giao' },
    CANCELLED: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400', dot: 'bg-slate-400', label: 'Đã hủy' },
  };
  const cfg = config[s] ?? config.CANCELLED;
  const { bg, text, dot, label } = cfg;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

const OrderHistoryPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('Tất cả đơn hàng');
  const [apiOrders, setApiOrders] = useState<OrderHistoryCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const useApi = isApiConfigured() && isAuthenticated;

  useEffect(() => {
    if (!useApi) return;
    setLoading(true);
    getOrders()
      .then((list) => setApiOrders(list.map(mapOrderDtoToCard)))
      .catch(() => setApiOrders([]))
      .finally(() => setLoading(false));
  }, [useApi]);

  const filteredOrders = useMemo(() => {
    if (!useApi) return orderHistoryCards;
    if (filter === 'Tất cả đơn hàng') return apiOrders;

    const now = Date.now();
    const ms30 = 30 * 24 * 60 * 60 * 1000;

    // Fail-open: nếu parse date lỗi thì vẫn giữ đơn để tránh "mất đơn" do format.
    return apiOrders.filter((o) => {
      const t = o.createdAtRaw ? Date.parse(o.createdAtRaw) : NaN;
      if (Number.isNaN(t)) return true;

      if (filter === '30 ngày qua') return t >= now - ms30;

      if (filter === '2023' || filter === '2022') {
        return new Date(t).getFullYear() === Number(filter);
      }

      return true;
    });
  }, [apiOrders, filter, useApi]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const clampedPage = Math.max(1, Math.min(page, pageCount));
  const displayedOrders = filteredOrders.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [filter, useApi]);

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount]);

  const maxButtons = 3;
  const startCandidate = Math.max(1, clampedPage - 1);
  const endCandidate = Math.min(pageCount, startCandidate + maxButtons - 1);
  const startPage = Math.max(1, endCandidate - maxButtons + 1);
  const pageNumbers = Array.from(
    { length: endCandidate - startPage + 1 },
    (_, i) => startPage + i
  );

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
            {displayedOrders.length === 0 && !loading && (
              <p className="text-slate-500 py-8 text-center">Chưa có đơn hàng nào.</p>
            )}
            {displayedOrders.map((order) => (
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
                      className={`w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl p-2 flex items-center justify-center flex-shrink-0 ${
                        String(order.status ?? '').trim().toUpperCase() === 'CANCELLED' ? 'opacity-60' : ''
                      }`}
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
                disabled={clampedPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors disabled:opacity-60"
              >
                <span className="material-icons text-lg">chevron_left</span>
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                    clampedPage === n
                      ? 'bg-primary text-white'
                      : 'border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={clampedPage >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-colors disabled:opacity-60"
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
