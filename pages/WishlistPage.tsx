import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { wishlistItems, cartItems } from '../data';
import type { WishlistItem } from '../types';

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA1cYFm0td7RC_stH8Qi9Zli0kI97ANPxkaKBqH7Dpm9qrgD6yQZ_QyPuFCuZL8oZv9yKDQCXntTxkGra1tJSdZLcK9T4Ao5Jx8NGXu3B7vHeIBusDizdPs-M-L9NtEx8Q3-B35Lzccf0oydmf7oqlwxY7Q-frZsy_qMsJ9hcpwekTMVKA4gQM_j9aRAowsjprmoUT1mGLEVzMdo5osiRGqXscAM8mpGOZaZ98tPeI36i-W8EPRWnl2ja9FHYK34aEovOW2NpWT7zM';

const SIDEBAR_LINKS = [
  { label: 'My Profile', icon: 'person', path: '/profile' },
  { label: 'Order History', icon: 'reorder', path: '/dashboard' },
  { label: 'Warranty Status', icon: 'verified_user', path: '/warranty' },
  { label: 'Saved Addresses', icon: 'location_on', path: '/addresses' },
  { label: 'Wishlist', icon: 'favorite', path: '/wishlist' },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return (
    <div className="flex items-center gap-1 text-amber-400 mb-2">
      {Array.from({ length: full }, (_, i) => (
        <span key={`f-${i}`} className="material-icons text-sm">star</span>
      ))}
      {hasHalf && <span className="material-icons text-sm">star_half</span>}
      {Array.from({ length: empty }, (_, i) => (
        <span key={`e-${i}`} className="material-icons text-sm text-slate-200">star</span>
      ))}
      <span className="text-xs text-slate-400 font-bold ml-1">({reviews})</span>
    </div>
  );
}

const WishlistPage: React.FC = () => {
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [items, setItems] = useState<WishlistItem[]>(() => wishlistItems);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Header */}
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
              <input className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary" placeholder="Search tech..." type="text" />
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
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <nav className="space-y-1.5">
            {SIDEBAR_LINKS.map((item) => {
              const isActive = item.path === '/wishlist';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                    isActive ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md group'
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

        <main className="flex-grow space-y-8 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <nav className="flex items-center gap-2 text-[13px] font-semibold text-slate-400 mb-3">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="material-icons text-sm">chevron_right</span>
                <Link to="/profile" className="hover:text-primary transition-colors">Account</Link>
                <span className="material-icons text-sm">chevron_right</span>
                <span className="text-primary">Wishlist</span>
              </nav>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Wishlist</h1>
              <p className="text-slate-500 mt-1.5">You have {items.length} item{items.length !== 1 ? 's' : ''} saved for later.</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm self-start sm:self-auto"
            >
              <span className="material-icons text-lg">share</span>
              Share Wishlist
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] overflow-hidden group flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                  <img
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={item.image}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    <span className="material-icons text-[20px]">delete</span>
                  </button>
                  {item.onSale && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Sale</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <StarRating rating={item.rating} reviews={item.reviews} />
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                  <div className="mt-auto">
                    {item.oldPrice != null && (
                      <span className="text-slate-400 line-through text-sm font-medium mr-2">{formatPrice(item.oldPrice)}</span>
                    )}
                    <p className="text-2xl font-bold text-primary">{formatPrice(item.price)}</p>
                  </div>
                  <Link
                    to="/cart"
                    className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-icons text-[20px]">shopping_cart</span>
                    Add to Cart
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
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

export default WishlistPage;
