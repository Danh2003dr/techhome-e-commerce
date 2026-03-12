import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { wishlistItems } from '@/data';
import type { WishlistItem } from '@/types';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';

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
  const [items, setItems] = useState<WishlistItem[]>(() => wishlistItems);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <AccountHeader />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10 w-full">
        <AccountSidebar />

        <main className="flex-grow space-y-8 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <Breadcrumb
                items={[
                  { label: 'Home', path: '/' },
                  { label: 'Account', path: '/profile' },
                  { label: 'Wishlist' },
                ]}
              />
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

      <AccountFooter />
    </div>
  );
};

export default WishlistPage;
