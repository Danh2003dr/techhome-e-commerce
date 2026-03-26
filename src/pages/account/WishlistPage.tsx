import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/utils';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountHeader from '@/components/account/AccountHeader';
import AccountFooter from '@/components/account/AccountFooter';
import Breadcrumb from '@/components/common/Breadcrumb';
import { StarRating } from '@/components/common/StarRating';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f1f5f9" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">📱</text></svg>');

const WishlistPage: React.FC = () => {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  const handleRemove = useCallback(
    (productId: string) => {
      removeItem(productId);
    },
    [removeItem]
  );

  const handleAddToCart = useCallback(
    (e: React.MouseEvent, productId: string, name: string, price: number, image: string) => {
      e.preventDefault();
      e.stopPropagation();
      addItem({ productId, name, price, image: image || '' });
    },
    [addItem]
  );

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
                  { label: 'Trang chủ', path: '/' },
                  { label: 'Tài khoản', path: '/profile' },
                  { label: 'Yêu thích' },
                ]}
              />
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Yêu thích</h1>
              <p className="text-slate-500 mt-1.5">Bạn đã lưu {items.length} sản phẩm.</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm self-start sm:self-auto"
            >
              <span className="material-icons text-lg">share</span>
              Chia sẻ
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
              <span className="material-icons text-6xl text-slate-300 dark:text-slate-600 mb-4">favorite_border</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Chưa có sản phẩm yêu thích</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">Nhấn biểu tượng trái tim trên sản phẩm để lưu lại xem sau.</p>
              <Link to="/search" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors">
                Khám phá sản phẩm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((item) => {
                const productId = item.productId ?? item.id.replace(/^wl-/, '');
                const productPath = `/product/${productId}`;
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] overflow-hidden group flex flex-col"
                  >
                    <Link to={productPath} className="block relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                      <img
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={item.image || PLACEHOLDER_IMAGE}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(productId);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
                        aria-label="Xóa khỏi yêu thích"
                      >
                        <span className="material-icons text-[20px]">favorite</span>
                      </button>
                      {item.onSale && (
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Sale</span>
                        </div>
                      )}
                    </Link>
                    <div className="p-6 flex flex-col flex-grow">
                      <StarRating variant="wishlist" rating={item.rating} reviews={item.reviews} />
                      <Link to={productPath}>
                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                      </Link>
                      <div className="mt-auto">
                        {item.oldPrice != null && (
                          <span className="text-slate-400 line-through text-sm font-medium mr-2">{formatVND(item.oldPrice)}</span>
                        )}
                        <p className="text-2xl font-bold text-primary">{formatVND(item.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, productId, item.name, item.price, item.image)}
                        className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-icons text-[20px]">shopping_cart</span>
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <AccountFooter />
    </div>
  );
};

export default WishlistPage;
