import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mobileCategoryProducts } from '@/data';

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

const HeroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDHLyESEYHifHLCZfb_t_OVSm83EIh7cZEL4UoYDHCs36uf4SxLL1DMuyCkEMFXuT0dmQ0mvgIe8NNkRdb1MtDDK591tZdUINYAaoyFIWFyAj36R0eFWMn9HZoBphKn7nwbKb3Nq2G1fTtbyOVhb9gRvM_HMfRXfgABdAXDQm8faMkmbEMPJkXrzA9W4B6yW9btt6CViheK4akmAURCpdfmJx58KMvV2w_d7KgmzxOg622k7l-6MRWn5g9dY1d9zbyiQwbEqm1dJq4';

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <>
      {[...Array(5)].map((_, i) => {
        if (i < full) return <span key={i} className="material-icons text-yellow-400 text-sm">star</span>;
        if (i === full && half) return <span key={i} className="material-icons text-yellow-400 text-sm">star_half</span>;
        return <span key={i} className="material-icons text-slate-300 text-sm">star</span>;
      })}
    </>
  );
}

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
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [selectedSub, setSelectedSub] = useState('All Products');
  const [selectedRam, setSelectedRam] = useState<string | null>('12 GB');
  const [storage, setStorage] = useState<string | null>(null);
  const [page, setPage] = useState(1);

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
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="material-icons text-xs">chevron_right</span>
          <Link to="/search" className="hover:text-primary">Shop by Category</Link>
          <span className="material-icons text-xs">chevron_right</span>
          <span className="text-primary font-medium">Mobile</span>
        </nav>

        {/* Hero Banner */}
        <section className="relative rounded-xl overflow-hidden mb-12 bg-primary">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-700 opacity-90" />
          <div className="relative flex flex-col md:flex-row items-center justify-between px-8 py-12 md:px-16 md:py-16">
            <div className="max-w-lg mb-8 md:mb-0 text-white z-10 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Limited Edition
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">The Future in Your Hands</h1>
              <p className="text-lg text-blue-100 mb-8 font-light">
                Experience the latest in smartphone innovation. Upgrade to the new flagship models today with exclusive TechHome trade-in offers.
              </p>
              <Link
                to="/search?category=mobile"
                className="inline-block bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-slate-50 transition-colors shadow-lg shadow-blue-900/20"
              >
                Shop Now
              </Link>
            </div>
            <div className="relative w-full md:w-1/2 flex justify-center md:justify-end">
              <img
                className="w-72 md:w-96 drop-shadow-2xl"
                src={HeroImage}
                alt="Two sleek modern flagship smartphones side by side"
              />
            </div>
          </div>
        </section>

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
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">$0</span>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">$2,000+</span>
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
                Showing <span className="font-bold text-slate-900 dark:text-white">{mobileCategoryProducts.length}</span> products from{' '}
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
              {mobileCategoryProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative p-6 h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
                    {product.badge && (
                      <Badge label={product.badge} variant={getBadgeVariant(product.badge)} />
                    )}
                    <button
                      type="button"
                      className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-slate-700/80 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-icons text-lg">favorite_border</span>
                    </button>
                    <img
                      className="h-48 group-hover:scale-105 transition-transform duration-300 object-contain"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                      <StarRating rating={product.rating} />
                      <span className="text-xs text-slate-400 ml-1">({product.reviews} reviews)</span>
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
                          ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-slate-400 line-through">
                            ${product.oldPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                      <Link
                        to={product.productDetailId ? `/product/${product.productDetailId}` : `/product/${product.id}`}
                        className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-icons text-sm">shopping_cart</span>
                        Add to Cart
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
