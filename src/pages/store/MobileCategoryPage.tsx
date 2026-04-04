import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mobileCategoryProducts } from '@/data';
import { useCart } from '@/context/CartContext';
import { useApiCategories, useApiProducts } from '@/hooks/useProductApi';
import { findCategoryInGroup, slugGroups } from '@/services/categoryNavigation';
import { isApiConfigured } from '@/services/api';
import { formatVND } from '@/utils';
import { productRequiresDetailForAddToCart } from '@/utils/productVariantChoice';
import { StarRating } from '@/components/common/StarRating';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f1f5f9" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">📱</text></svg>');

const SUB_CATEGORIES = ['iOS', 'Android', 'Feature Phones', 'Refurbished', 'All Products'];
const BRANDS = [
  { name: 'Apple', count: 24 },
  { name: 'Samsung', count: 18 },
  { name: 'Xiaomi', count: 12 },
  { name: 'Google', count: 6 },
];
const RAM_OPTIONS = ['4 GB', '8 GB', '12 GB', '16 GB'];
const STORAGE_OPTIONS = ['128 GB', '256 GB', '512 GB'];
const TOTAL_PRODUCTS = 60;
const PER_PAGE = 12;
const TOTAL_PAGES = 10;

function Badge({ label, variant }: { label: string; variant: 'primary' | 'red' | 'slate' | 'green' }) {
  const bg =
    variant === 'primary'
      ? 'bg-primary'
      : variant === 'red'
        ? 'bg-red-500'
        : variant === 'slate'
          ? 'bg-slate-800'
          : 'bg-green-500';
  return (
    <span className={`absolute top-4 left-4 ${bg} text-white text-[10px] font-bold px-2 py-1 rounded uppercase`}>
      {label}
    </span>
  );
}

const MobileCategoryPage: React.FC = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { data: apiCategories } = useApiCategories();
  const mobileCategory = findCategoryInGroup(apiCategories, slugGroups.mobile);
  const mobileCategoryId = mobileCategory ? Number(mobileCategory.id) : undefined;
  const { data: apiMobileProducts } = useApiProducts({
    category: Number.isFinite(mobileCategoryId) ? mobileCategoryId : undefined,
    page: 0,
    size: 100,
  });
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [selectedSub, setSelectedSub] = useState('All Products');
  const [selectedRam, setSelectedRam] = useState<string | null>('12 GB');
  const [storage, setStorage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(() => new Set());
  const markImageError = (id: string) => setFailedImageIds((prev) => new Set(prev).add(id));
  const storefrontProducts = isApiConfigured() && apiMobileProducts.length > 0 ? apiMobileProducts : mobileCategoryProducts;

  const getBadgeVariant = (badge: string): 'primary' | 'red' | 'slate' | 'green' => {
    if (badge === 'New Arrival') return 'primary';
    if (badge === 'Save 15%') return 'red';
    if (badge === 'Refurbished') return 'slate';
    if (badge === 'In Stock') return 'green';
    return 'primary';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span className="material-icons text-xs">chevron_right</span>
          <Link to="/search" className="hover:text-primary">Mua theo danh mục</Link>
          <span className="material-icons text-xs">chevron_right</span>
          <span className="text-primary font-medium">Mobile</span>
        </nav>

        {/* Sub-Category Ribbon */}
        <section className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {SUB_CATEGORIES.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setSelectedSub(label)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
                selectedSub === label
                  ? 'bg-primary/10 border border-primary/20 text-primary font-bold'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                <button type="button" className="text-xs text-primary font-medium hover:underline">
                  Clear All
                </button>
              </div>
              <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Brand</h3>
                <div className="space-y-3">
                  {BRANDS.map((b) => (
                    <label key={b.name} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-slate-800"
                      />
                      <span className="text-sm group-hover:text-primary transition-colors">{b.name}</span>
                      <span className="text-xs text-slate-400 ml-auto">{b.count}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Price Range</h3>
                <input
                  type="range"
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">0 ₫</span>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">50.000.000+ ₫</span>
                </div>
              </div>
              <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">RAM</h3>
                <div className="grid grid-cols-2 gap-2">
                  {RAM_OPTIONS.map((ram) => (
                    <button
                      key={ram}
                      type="button"
                      onClick={() => setSelectedRam(selectedRam === ram ? null : ram)}
                      className={`px-2 py-2 text-xs rounded transition-all ${
                        selectedRam === ram
                          ? 'border border-primary text-primary bg-primary/5 font-bold'
                          : 'border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {ram}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Storage</h3>
                <div className="space-y-3">
                  {STORAGE_OPTIONS.map((s) => (
                    <label key={s} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="storage"
                        checked={storage === s}
                        onChange={() => setStorage(s)}
                        className="text-primary focus:ring-primary bg-white dark:bg-slate-800 border-slate-300"
                      />
                      <span className="text-sm group-hover:text-primary">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-900 dark:text-white">{storefrontProducts.length}</span> products from{' '}
                <span className="font-bold text-slate-900 dark:text-white">{TOTAL_PRODUCTS}</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border-none bg-transparent font-bold focus:ring-0 cursor-pointer"
                >
                  <option>Most Relevant</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {storefrontProducts.map((product) => {
                const productId = product.productDetailId || product.id;
                const pathSegment = product.slug?.trim() || productId;
                const productPath = `/product/${encodeURIComponent(pathSegment)}`;
                return (
                  <Link
                    key={product.id}
                    to={productPath}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                  <div className="relative p-6 h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
                    {product.badge && (
                      <Badge label={product.badge} variant={getBadgeVariant(product.badge)} />
                    )}
                    <img
                      className="h-48 group-hover:scale-105 transition-transform duration-300 object-contain"
                      src={failedImageIds.has(product.id) || !product.image ? PLACEHOLDER_IMAGE : product.image}
                      alt={product.name}
                      onError={() => markImageError(product.id)}
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                      <StarRating variant="category" rating={product.rating} />
                      <span className="text-xs text-slate-400 ml-1">({product.reviews} đánh giá)</span>
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    {product.specs && (
                      <p className="text-xs text-slate-500 mb-4 font-medium">{product.specs}</p>
                    )}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                          {formatVND(product.price)}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-slate-400 line-through">
                            {formatVND(product.oldPrice)}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 z-20"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (productRequiresDetailForAddToCart(product)) {
                            navigate(productPath);
                            return;
                          }
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
                        <span className="material-icons text-sm">shopping_cart</span>
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all"
                >
                  <span className="material-icons text-sm">chevron_left</span>
                </button>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`w-10 h-10 flex items-center justify-center rounded font-bold transition-all ${
                      page === n ? 'bg-primary text-white' : 'border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <span className="px-2 text-slate-400">...</span>
                <button
                  type="button"
                  onClick={() => setPage(TOTAL_PAGES)}
                  className="w-10 h-10 flex items-center justify-center rounded border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all"
                >
                  {TOTAL_PAGES}
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
                  className="w-10 h-10 flex items-center justify-center rounded border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-all"
                >
                  <span className="material-icons text-sm">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
    </div>
  );
};

export default MobileCategoryPage;
