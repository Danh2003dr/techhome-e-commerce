import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderHistoryCards } from '@/data';
import type { OrderHistoryCardItem, OrderStatus } from '@/types';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = {
    Delivered: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
    Processing: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
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
  const [filter, setFilter] = useState('All Orders');

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
                { label: 'Home', path: '/' },
                { label: 'Account', path: '/profile' },
                { label: 'Order History' },
              ]}
            />
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Order History</h1>
                <p className="text-slate-500 mt-1.5">View and manage your recent electronic purchases.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">filter_list</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary appearance-none min-w-[160px]"
                  >
                    <option>All Orders</option>
                    <option>Last 30 days</option>
                    <option>2023</option>
                    <option>2022</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {orderHistoryCards.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] overflow-hidden"
              >
                {/* Card header bar */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Order Date</p>
                      <p className="text-sm font-bold mt-1 text-slate-900 dark:text-white">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Total Amount</p>
                      <p className="text-sm font-bold mt-1 text-primary">
                        ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Order ID</p>
                      <p className="text-sm font-bold mt-1 text-slate-900 dark:text-white">#{order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <Link
                      to={`/order/${order.id}`}
                      className="px-5 py-2 bg-primary text-white text-[13px] font-bold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      View Details
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
                        {order.secondaryAction === 'buy_again' && 'Buy Again'}
                        {order.secondaryAction === 'track' && 'Track Package'}
                        {order.secondaryAction === 'reorder' && 'Re-order'}
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
