import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApiProducts } from '@/hooks/useProductApi';
import { getFallbackListingProducts } from '@/services/fallbackAdapters';
import { isApiConfigured } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatVND } from '@/utils';
import Breadcrumbs from '@/components/store/Breadcrumbs';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f1f5f9" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">📱</text></svg>');

const PER_PAGE = 12;

const ProductListingPage: React.FC = () => {
  const [sortBy, setSortBy] = useState('Popularity');
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(() => new Set());
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { data: apiProducts } = useApiProducts({ page: 0, size: 100 });
  const markImageError = (id: string) => setFailedImageIds((prev) => new Set(prev).add(id));
  const listingProducts = useMemo(
    () => (isApiConfigured() ? apiProducts : getFallbackListingProducts()),
    [apiProducts]
  );
  const totalResults = listingProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PER_PAGE));
  const [processorOpen, setProcessorOpen] = useState(true);
  const [connectivityOpen, setConnectivityOpen] = useState(false);
  const [powerOpen, setPowerOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs 
          items={[
            { label: 'Trang chủ', path: '/' },
            { label: 'Catalog', path: '/search' },
            { label: 'Smartphones' }
          ]}
          className="mb-6"
        />
        <div className="flex gap-8">
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-white">Filters</h3>
                <button className="text-xs text-primary font-medium hover:underline">Clear All</button>
              </div>
              <div className="mb-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Brands</h4>
                <div className="space-y-2">
                  {['Apple', 'Samsung', 'Daikin', 'Sony'].map((brand, idx) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" defaultChecked={idx === 0} className="rounded border-slate-300 text-primary focus:ring-primary" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary">{brand}</span>
                      <span className="text-xs text-slate-400 ml-auto">{[124, 89, 42, 56][idx]}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Price Range</h4>
                <div className="space-y-4">
                  <div className="h-1 bg-primary/20 rounded-full relative">
                    <div className="absolute h-full w-2/3 bg-primary left-0 rounded-full" />
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-2 border-primary rounded-full shadow-sm" />
                    <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-2 border-primary rounded-full shadow-sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1"><span className="text-[10px] text-slate-400 uppercase">Min</span><input type="text" defaultValue="0 ₫" className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded px-2 py-1" /></div>
                    <div className="flex-1"><span className="text-[10px] text-slate-400 uppercase">Max</span><input type="text" defaultValue="60.000.000 ₫" className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded px-2 py-1" /></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <button type="button" onClick={() => setProcessorOpen(!processorOpen)} className="flex items-center justify-between w-full text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Processor
                    <span className={`material-icons text-sm transition-transform ${processorOpen ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  {processorOpen && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" /><span className="text-sm text-slate-600 dark:text-slate-400">Apple M3</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" /><span className="text-sm text-slate-600 dark:text-slate-400">Intel Core i9</span></label>
                    </div>
                  )}
                </div>
                <hr className="border-slate-200 dark:border-slate-800" />
                <div>
                  <button type="button" onClick={() => setConnectivityOpen(!connectivityOpen)} className="flex items-center justify-between w-full text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Connectivity
                    <span className={`material-icons text-sm transition-transform ${connectivityOpen ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                </div>
                <hr className="border-slate-200 dark:border-slate-800" />
                <div>
                  <button type="button" onClick={() => setPowerOpen(!powerOpen)} className="flex items-center justify-between w-full text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Power Rating
                    <span className={`material-icons text-sm transition-transform ${powerOpen ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Top Deals</h1>
              <p className="text-sm text-slate-500">Showing 1-{Math.min(PER_PAGE, totalResults)} of {totalResults} results</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-4 py-2 focus:ring-primary min-w-[160px]">
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Customer Rating</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {listingProducts.map((product) => {
              const productId = product.productDetailId || product.id;
              const productPath = `/product/${productId}`;
              return (
                <Link
                  key={product.id}
                  to={productPath}
                  className="product-card bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden group flex flex-col hover:shadow-xl transition-all relative z-10"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                    <img
                      alt={product.name}
                      src={failedImageIds.has(product.id) || !product.image ? PLACEHOLDER_IMAGE : product.image}
                      className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                      onError={() => markImageError(product.id)}
                    />
                    {product.dealOfTheDay && <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase px-2 py-1 rounded z-10">Deal of the Day</div>}
                    <button
                      type="button"
                      className={`absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center transition-colors z-20 ${isInWishlist(productId) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleItem({
                          productId,
                          name: product.name,
                          image: product.image || '',
                          price: product.price,
                          oldPrice: product.oldPrice,
                          rating: product.rating,
                          reviews: product.reviews ?? 0,
                        });
                      }}
                      aria-label={isInWishlist(productId) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                    >
                      <span className="material-icons text-lg">{isInWishlist(productId) ? 'favorite' : 'favorite_border'}</span>
                    </button>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => {
                        const full = Math.floor(product.rating);
                        const half = product.rating % 1 >= 0.5 && i === full;
                        const filled = i < full || half;
                        return <span key={i} className={`material-icons text-sm ${filled ? 'text-amber-400' : 'text-slate-300'}`}>{i < full ? 'star' : half ? 'star_half' : 'star'}</span>;
                      })}
                      <span className="text-xs text-slate-400 ml-1">({product.reviews.toLocaleString()})</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                    <div className="mt-auto pt-4 flex items-end justify-between">
                      <div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{formatVND(product.price)}</span>
                        {product.oldPrice && <span className="block text-sm text-slate-400 line-through">{formatVND(product.oldPrice)}</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors z-20"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                          addItem({
                            productId: product.productDetailId ?? product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image || '',
                          });
                        } catch (_) {}
                      }}
                    >
                      <span className="material-icons text-lg">add_shopping_cart</span>
                      Thêm vào giỏ
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 flex items-center justify-center gap-2">
            <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors"><span className="material-icons">chevron_left</span></button>
            {[1, 2, 3].map((n) => (
              <button key={n} type="button" className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${n === 1 ? 'bg-primary text-white' : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary hover:text-primary'}`}>{n}</button>
            ))}
            <span className="text-slate-400 px-2">...</span>
            <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors">{totalPages}</button>
            <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors"><span className="material-icons">chevron_right</span></button>
          </div>
        </div>
        </div>
    </div>
  );
};

export default ProductListingPage;
