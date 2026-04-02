import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { accessoriesCategoryProducts } from '@/data';
import ProductCard from '@/features/products/components/ProductCard';
import { useApiCategories, useApiProducts } from '@/hooks/useProductApi';
import { findCategoryInGroup, slugGroups } from '@/services/categoryNavigation';
import { isApiConfigured } from '@/services/api';

const SUB_CATEGORIES = [
  { label: 'Charging & Cables', icon: 'usb' },
  { label: 'Keyboards & Mice', icon: 'keyboard' },
  { label: 'Laptop Sleeves', icon: 'laptop' },
  { label: 'Phone Cases', icon: 'smartphone' },
  { label: 'Power Banks', icon: 'battery_charging_full' },
  { label: 'Audio Gear', icon: 'headphones' },
];


const AccessoriesCategoryPage: React.FC = () => {
  const [activeSub, setActiveSub] = useState('Charging & Cables');
  const [sortBy, setSortBy] = useState('Newest Arrivals');
  const [page, setPage] = useState(1);
  const { data: apiCategories } = useApiCategories();
  const accessoriesCategory = findCategoryInGroup(apiCategories, slugGroups.accessories);
  const accessoriesCategoryId = accessoriesCategory ? Number(accessoriesCategory.id) : undefined;
  const { data: apiAccessoriesProducts } = useApiProducts({
    category: Number.isFinite(accessoriesCategoryId) ? accessoriesCategoryId : undefined,
    page: 0,
    size: 100,
  });
  const storefrontProducts =
    isApiConfigured() && apiAccessoriesProducts.length > 0
      ? apiAccessoriesProducts
      : accessoriesCategoryProducts;

  return (
    <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="material-icons text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-200 font-semibold">Accessories</span>
        </nav>

        <header className="mb-8" aria-labelledby="accessories-category-title">
          <p className="text-primary font-bold tracking-widest text-[10px] uppercase mb-2">Phụ kiện</p>
          <h1 id="accessories-category-title" className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Nâng cấp bộ thiết bị của bạn
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Phụ kiện và thiết bị ngoại vi chất lượng — hỗ trợ làm việc và giải trí hiệu quả hơn.
          </p>
        </header>

        {/* Sub-Category Icons Bar */}
        <section className="mb-12 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex items-center gap-4 min-w-max">
            {SUB_CATEGORIES.map((sub) => (
              <button
                key={sub.label}
                type="button"
                onClick={() => setActiveSub(sub.label)}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl w-36 shadow-sm transition-all flex-shrink-0 ${
                  activeSub === sub.label
                    ? 'bg-white dark:bg-slate-900 border-2 border-primary'
                    : 'bg-white dark:bg-slate-900 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    activeSub === sub.label ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="material-icons">{sub.icon}</span>
                </div>
                <span className="text-sm font-semibold text-center">{sub.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
                Compatibility
                <span className="material-icons text-slate-400">expand_more</span>
              </h3>
              <div className="space-y-3">
                {['MacBook Pro (M1/M2/M3)', 'iPhone 15 Series', 'iPad Pro 12.9"', 'Universal USB-C'].map((opt, idx) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      defaultChecked={idx === 1}
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className={`text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors ${idx === 1 ? 'font-medium' : ''}`}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4">Brand</h3>
              <div className="space-y-3">
                {['Satechi', 'Logitech', 'Anker', 'Apple'].map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4">Color</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { bg: 'bg-slate-900', ring: 'border-2 border-primary ring-2 ring-transparent ring-offset-2' },
                  { bg: 'bg-slate-300', ring: 'border-2 border-transparent' },
                  { bg: 'bg-blue-500', ring: 'border-2 border-transparent' },
                  { bg: 'bg-white border border-slate-200', ring: '' },
                  { bg: 'bg-rose-400', ring: 'border-2 border-transparent' },
                ].map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`w-8 h-8 rounded-full ${c.bg} ${c.ring}`}
                  />
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4">Price Range</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>$0</span>
                  <span>$500+</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <p className="text-slate-500 font-medium">Showing 1-{Math.min(12, storefrontProducts.length)} of {storefrontProducts.length} products</p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary"
                >
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {storefrontProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-icons">chevron_left</span>
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
                    page === n ? 'bg-primary text-white' : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="px-2">...</span>
              <button
                type="button"
                onClick={() => setPage(7)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                7
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(7, p + 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AccessoriesCategoryPage;
