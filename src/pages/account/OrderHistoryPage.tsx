import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { orderHistoryCards, cartItems } from '@/data';
import type { OrderHistoryCardItem, OrderStatus } from '@/types';

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA1cYFm0td7RC_stH8Qi9Zli0kI97ANPxkaKBqH7Dpm9qrgD6yQZ_QyPuFCuZL8oZv9yKDQCXntTxkGra1tJSdZLcK9T4Ao5Jx8NGXu3B7vHeIBusDizdPs-M-L9NtEx8Q3-B35Lzccf0oydmf7oqlwxY7Q-frZsy_qMsJ9hcpwekTMVKA4gQM_j9aRAowsjprmoUT1mGLEVzMdo5osiRGqXscAM8mpGOZaZ98tPeI36i-W8EPRWnl2ja9FHYK34aEovOW2NpWT7zM';

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

const SIDEBAR_LINKS = [
  { label: 'My Profile', icon: 'person', path: '/profile' },
  { label: 'Order History', icon: 'reorder', path: '/dashboard' },
  { label: 'Warranty Status', icon: 'verified_user', path: '/warranty' },
  { label: 'Saved Addresses', icon: 'location_on', path: '/addresses' },
  { label: 'Wishlist', icon: 'favorite', path: '/wishlist' },
];

const OrderHistoryPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('All Orders');
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Header - match Profile */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-12">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <span className="material-icons text-white text-2xl">devices</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Tech<span className="text-primary">Home</span></span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <Link to="/search" className="hover:text-primary transition-colors">Shop</Link>
              <Link to="/deals" className="hover:text-primary transition-colors">Deals</Link>
              <Link to="/search" className="hover:text-primary transition-colors">Support</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary"
                placeholder="Search tech..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-2">
              <Link to="/cart" className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                <span className="material-icons">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
              <Link to="/profile" className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <img alt="Profile" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" src={PROFILE_IMAGE} />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold leading-none text-slate-900 dark:text-white">Alex Johnson</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Premium</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10 w-full">
        {/* Sidebar - match Profile */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <nav className="space-y-1.5">
            {SIDEBAR_LINKS.map((item) => {
              const isActive = item.path === '/dashboard';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md group'
                  }`}
                >
                  <span className={`material-icons text-[22px] ${isActive ? '' : 'group-hover:text-primary'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link to="/login" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-semibold transition-all">
              <span className="material-icons text-[22px]">logout</span>
              <span>Sign Out</span>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-grow space-y-8 min-w-0">
          <div>
            <nav className="flex items-center gap-2 text-[13px] font-semibold text-slate-400 mb-3">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-icons text-sm">chevron_right</span>
              <Link to="/profile" className="hover:text-primary transition-colors">Account</Link>
              <span className="material-icons text-sm">chevron_right</span>
              <span className="text-primary">Order History</span>
            </nav>
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

      {/* Footer - match Profile */}
      <footer className="mt-20 py-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <span className="material-icons text-white text-xl">devices</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Tech<span className="text-primary">Home</span></span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">Your one-stop destination for premium electronics and smart home solutions. We provide high-quality gadgets for modern living.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Support</h4>
            <ul className="text-[14px] text-slate-500 space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns & Refunds</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
            <ul className="text-[14px] text-slate-500 space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Newsletter</h4>
            <p className="text-[14px] text-slate-500 mb-5 leading-relaxed">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-primary" placeholder="Email address" type="email" />
              <button type="submit" className="bg-primary text-white px-4 rounded-xl hover:bg-blue-600 transition-colors shadow-md">
                <span className="material-icons">send</span>
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-slate-400">© 2024 TechHome E-commerce. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">leaderboard</span></a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">share</span></a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">rss_feed</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrderHistoryPage;
