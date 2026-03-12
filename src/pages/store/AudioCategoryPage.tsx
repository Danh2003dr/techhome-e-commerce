import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { audioCategoryProducts, cartItems } from '@/data';
import type { AccessoriesProduct } from '@/types';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCi1GpWnEhQSlHntiNLVve9xzux9Uvoto9E-Mw4dCOwR502O-eYrKgv20d47lGjmX0Fsn0gFdDcd8tqCBTRkNIvqZcW0uBuumshu6Rg5c2zf6cXEVNcANj1ZzFLq_3xDURsHq7NJt-RLN0YAVi8ft535Ct-Kxt9FUAqYuX0d6gGiHx5P2gTpggxpKUA_QW1Ep06u5P6O8WYHbCW_nr_tdn5OqfcF5k1h7yqKkW_iQ-q_iNXmagg9U4j3ivnwHdYBpTl_EZlRFPV5oY';

const SUB_CATEGORIES = [
  { label: 'Headphones', icon: 'headphones' },
  { label: 'Earbuds', icon: 'headset' },
  { label: 'Bluetooth Speakers', icon: 'speaker' },
  { label: 'Home Audio', icon: 'surround_sound' },
  { label: 'Soundbars', icon: 'graphic_eq' },
];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        if (i < full) return <span key={i} className="material-icons text-amber-400 text-sm">star</span>;
        if (i === full && half) return <span key={i} className="material-icons text-amber-400 text-sm">star_half</span>;
        return <span key={i} className="material-icons text-slate-200 text-sm">star</span>;
      })}
    </div>
  );
}

function ProductCard({ product }: { product: AccessoriesProduct }) {
  const to = product.productDetailId ? `/product/${product.productDetailId}` : `/product/${product.id}`;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 group hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col">
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button
          type="button"
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-900/80 rounded-full hover:text-primary transition-colors backdrop-blur-md"
        >
          <span className={`material-icons text-xl ${product.isInWishlist ? 'text-primary' : ''}`}>
            {product.isInWishlist ? 'favorite' : 'favorite_border'}
          </span>
        </button>
        {product.badge && (
          <div className={product.badgeVariant === 'red' ? 'absolute top-3 left-3' : 'absolute bottom-3 left-3'}>
            <span
              className={`text-[10px] px-2 py-1 rounded font-bold ${
                product.badgeVariant === 'red' ? 'bg-red-500 text-white' : 'bg-primary/90 text-white'
              }`}
            >
              {product.badge}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-slate-400 ml-1">({product.reviews})</span>
        </div>
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through">
                ${product.oldPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <Link
            to={to}
            className="bg-primary hover:bg-blue-600 text-white p-2.5 rounded-lg flex items-center justify-center transition-colors"
          >
            <span className="material-icons">add_shopping_cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const AudioCategoryPage: React.FC = () => {
  const [activeSub, setActiveSub] = useState('Headphones');
  const [sortBy, setSortBy] = useState('Most Popular');
  const [page, setPage] = useState(1);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="material-icons text-3xl">terminal</span>
              TechHome
            </Link>
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <Link to="/search" className="hover:text-primary transition-colors">Computer & Laptops</Link>
              <Link to="/category/mobile" className="hover:text-primary transition-colors">Smartphones</Link>
              <span className="text-primary">Audio</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Search audio..."
                type="text"
              />
              <span className="material-icons absolute left-3 top-2 text-slate-400 text-lg">search</span>
            </div>
            <Link to="/cart" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
              <span className="material-icons">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-icons">person_outline</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="material-icons text-xs">chevron_right</span>
          <Link to="/search" className="hover:text-primary">Shop by Category</Link>
          <span className="material-icons text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-200 font-semibold">Audio</span>
        </nav>

        {/* Hero Banner */}
        <section className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-10 group">
          <img
            src={HERO_IMAGE}
            alt="Audio Hero"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/40 to-transparent flex flex-col justify-center px-8 md:px-16">
            <span className="text-primary font-bold tracking-widest text-sm mb-2">PREMIUM SOUND</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Immersive Sound
              <br />
              Experiences
            </h1>
            <p className="text-slate-300 max-w-md mb-6 hidden md:block">
              Explore our curated collection of high-fidelity headphones and professional speakers designed for the ultimate listening experience.
            </p>
            <div>
              <Link
                to="/search?category=audio"
                className="inline-block bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-primary/20"
              >
                Shop Audio
              </Link>
            </div>
          </div>
        </section>

        {/* Sub-Category Bar */}
        <section className="mb-12 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex items-center gap-4 min-w-max">
            {SUB_CATEGORIES.map((sub) => (
              <button
                key={sub.label}
                type="button"
                onClick={() => setActiveSub(sub.label)}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl w-40 shadow-sm transition-all flex-shrink-0 ${
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
                Audio Type
                <span className="material-icons text-slate-400">expand_more</span>
              </h3>
              <div className="space-y-3">
                {['Over-Ear', 'In-Ear', 'On-Ear', 'Bookshelf Speakers'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4">Brand</h3>
              <div className="space-y-3">
                {['Bose', 'Sony', 'JBL', 'Apple'].map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4">Battery Life</h3>
              <div className="space-y-3">
                {['Up to 10 hours', '10 - 20 hours', '20+ hours'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4">Connection Type</h3>
              <div className="space-y-3">
                {['Wireless (Bluetooth)', 'Wired (3.5mm)', 'Optical / HDMI'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <p className="text-slate-500 font-medium">Showing 1-12 of 156 products</p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary"
                >
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {audioCategoryProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <ProductCard product={product} />
                </React.Fragment>
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
                onClick={() => setPage(13)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                13
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(13, p + 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2 mb-6">
                <span className="material-icons text-3xl">terminal</span>
                TechHome
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Your premier destination for high-quality audio equipment and professional sound solutions. Experience pure sound with TechHome.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg hover:text-primary transition-colors">
                  <span className="material-icons">facebook</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg hover:text-primary transition-colors">
                  <span className="material-icons">photo_camera</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg hover:text-primary transition-colors">
                  <span className="material-icons">alternate_email</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Best Sellers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Audio Guides</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Trade-in Program</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Warranty Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Newsletter</h4>
              <p className="text-sm text-slate-500 mb-4">Get exclusive deals on the latest audio tech.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50"
                  placeholder="Your email"
                  type="email"
                />
                <button type="submit" className="bg-primary hover:bg-blue-600 text-white px-4 rounded-lg transition-colors">
                  <span className="material-icons">send</span>
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2024 TechHome Audio. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a>
              <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AudioCategoryPage;
