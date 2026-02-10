import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { smartHomeCategoryProducts, cartItems } from '../data';
import type { SmartHomeProduct } from '../types';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ2YZOaMFnliopxH6AH-4MQ2dX3xGP29j5wo4xTvJkyYiHUS4n4vEo7Ms66jIEtPzjd_ZIlq4Yk8uTmLXUd14iTr-WOIOYVZJDSLWwbVSd0_z_tvqjzcRS34UGSwooFMq0dVU0qZxNOB_JSm4VQTySzQiU7XzGdth4YLHjXxpauzFzlWa4u8dQ8TiWhyMKHZvjEDAcn_NSa_CIj0Q3-1Z9Po8hpiPXnWkQS-yETtPce175Lesf8_75OGyK3_b85kXO7fvfktp5OLM';

const SUB_CATEGORIES = [
  { label: 'Security Cameras', icon: 'videocam' },
  { label: 'Smart Lighting', icon: 'lightbulb' },
  { label: 'Smart Hubs', icon: 'hub' },
  { label: 'Entertainment', icon: 'tv' },
  { label: 'Robot Vacuums', icon: 'smart_toy' },
  { label: 'Climate Control', icon: 'thermostat' },
];

function formatReviews(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  return n.toLocaleString();
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        if (i < full) return <span key={i} className="material-icons text-yellow-400 text-sm">star</span>;
        if (i === full && half) return <span key={i} className="material-icons text-yellow-400 text-sm">star_half</span>;
        return <span key={i} className="material-icons text-slate-300 text-sm">star</span>;
      })}
    </div>
  );
}

function ProductCard({ product }: { product: SmartHomeProduct }) {
  const to = product.productDetailId ? `/product/${product.productDetailId}` : `/product/${product.id}`;
  const subtitleClass =
    product.subtitleVariant === 'green'
      ? 'text-green-600'
      : product.subtitleVariant === 'primary'
        ? 'text-primary'
        : 'text-slate-400';

  return (
    <div className="group bg-white dark:bg-neutral-dark rounded-xl border border-primary/5 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col">
      <div className="relative aspect-square bg-neutral-light dark:bg-slate-800/50 flex items-center justify-center p-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.badge && (
            <span
              className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${
                product.badgeVariant === 'red' ? 'bg-red-500 text-white' : 'bg-primary text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.tags.map((tag) => (
            <span
              key={tag.label}
              className="bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-[10px] font-bold border border-primary/10 flex items-center gap-1"
            >
              {tag.dotColor && <span className={`w-2 h-2 rounded-full ${tag.dotColor}`} />}
              {tag.label}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="material-icons text-primary text-sm">favorite_border</span>
        </button>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.rating} />
          <span className="text-[10px] text-slate-400 ml-1">({formatReviews(product.reviews)})</span>
        </div>
        <Link to={to} className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
          {product.name}
        </Link>
        <p className="text-xs text-slate-500 mb-4">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {product.oldPrice != null ? (
              <span className="text-[10px] text-slate-400 line-through">
                ${product.oldPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            ) : product.subtitle ? (
              <span className={`text-[10px] font-bold uppercase ${subtitleClass}`}>{product.subtitle}</span>
            ) : null}
          </div>
          <Link
            to={to}
            className="bg-primary hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center transition-colors"
          >
            <span className="material-icons">add_shopping_cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const SmartHomeCategoryPage: React.FC = () => {
  const [activeSub, setActiveSub] = useState('Security Cameras');
  const [sortBy, setSortBy] = useState('Best Selling');
  const [page, setPage] = useState(1);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300 min-h-screen">
      {/* Header - matches HTML: Categories active, search "Search devices..." */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold text-primary tracking-tighter">
                TECHHOME
              </Link>
              <nav className="hidden md:flex space-x-8 text-sm font-medium">
                <Link to="/deals" className="hover:text-primary transition-colors">Deals</Link>
                <span className="text-primary border-b-2 border-primary pb-5 mt-5">Categories</span>
                <Link to="/search" className="hover:text-primary transition-colors">Support</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <input
                  className="bg-primary/5 border-none rounded-full py-2 px-4 pl-10 focus:ring-2 focus:ring-primary w-64 text-sm"
                  placeholder="Search devices..."
                  type="text"
                />
                <span className="material-icons absolute left-3 top-2 text-primary/50 text-sm">search</span>
              </div>
              <Link to="/cart" className="p-2 hover:bg-primary/10 rounded-full transition-colors relative">
                <span className="material-icons text-primary">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                <span className="material-icons text-primary">person</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/search" className="hover:text-primary">Shop by Category</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">Smart Home</span>
        </nav>

        {/* Hero Section */}
        <section className="relative rounded-xl overflow-hidden mb-12 bg-neutral-dark aspect-[21/9] flex items-center">
          <img
            alt="Modern Smart Living Room"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            src={HERO_IMAGE}
          />
          <div className="relative z-10 px-8 md:px-16 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold tracking-widest uppercase mb-4 rounded-sm">
              Featured Tech
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Smart Living, Simplified.
            </h1>
            <p className="text-slate-200 text-lg mb-8 leading-relaxed">
              Upgrade your home with the latest in automation, security, and entertainment. Control your entire
              environment with a single touch or voice command.
            </p>
            <Link
              to="/search?category=smart-home"
              className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center gap-2 inline-flex"
            >
              Shop Now <span className="material-icons">arrow_forward</span>
            </Link>
          </div>
          <div className="absolute bottom-0 right-0 p-8 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white flex gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase opacity-60">Connected Units</span>
                <span className="text-2xl font-bold">12,400+</span>
              </div>
              <div className="w-px bg-white/20" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase opacity-60">Reliability Score</span>
                <span className="text-2xl font-bold">99.9%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Category Navigation Bar */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Explore Categories</h2>
            <Link to="/search?category=smart-home" className="text-primary font-bold text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {SUB_CATEGORIES.map((sub) => (
              <button
                key={sub.label}
                type="button"
                onClick={() => setActiveSub(sub.label)}
                className={`flex-shrink-0 group w-36 aspect-square rounded-xl border flex flex-col items-center justify-center transition-all ${
                  activeSub === sub.label
                    ? 'bg-white dark:bg-neutral-dark border-primary/50 shadow-lg shadow-primary/10'
                    : 'bg-white dark:bg-neutral-dark border-primary/5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10'
                }`}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform flex-shrink-0">
                  <span className="material-icons text-primary">{sub.icon}</span>
                </div>
                <span className="text-xs font-bold text-center">{sub.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-primary">Ecosystem</h3>
              <div className="space-y-3">
                {['Apple HomeKit', 'Google Assistant', 'Amazon Alexa', 'Matter Compatible'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-primary">Brand</h3>
              <div className="space-y-3">
                {['Philips Hue', 'Nest', 'Ring', 'Arlo'].map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-primary">Connectivity</h3>
              <div className="space-y-3">
                {['Wi-Fi', 'Zigbee / Z-Wave', 'Bluetooth'].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input name="conn" type="radio" className="w-4 h-4 border-primary/20 text-primary focus:ring-primary" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
              <h4 className="font-bold text-sm mb-2">Need Expert Help?</h4>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Schedule a free virtual consultation to design your smart home.
              </p>
              <button type="button" className="w-full py-2 bg-primary/10 text-primary text-xs font-bold rounded hover:bg-primary hover:text-white transition-colors">
                Book Now
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <section className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <p className="text-sm text-slate-500">
                Showing <span className="text-slate-900 dark:text-white font-bold tracking-tight">24 Products</span> for Smart Home
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer"
                >
                  <option>Best Selling</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {smartHomeCategoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-primary/10 hover:bg-primary/5 text-primary"
                >
                  <span className="material-icons">chevron_left</span>
                </button>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold ${
                      page === n ? 'bg-primary text-white' : 'border border-primary/10 hover:bg-primary/5'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <span className="px-2">...</span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(10, p + 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-primary/10 hover:bg-primary/5 text-primary"
                >
                  <span className="material-icons">chevron_right</span>
                </button>
              </nav>
            </div>
          </section>
        </div>
      </main>

      {/* Footer - matches HTML: TECHHOME, tagline, social, Quick Links, Support */}
      <footer className="mt-20 border-t border-primary/10 bg-white dark:bg-neutral-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="text-3xl font-bold text-primary tracking-tighter mb-6 block">
                TECHHOME
              </Link>
              <p className="text-slate-500 max-w-sm mb-8">
                Building the homes of the future with cutting-edge technology and seamless integration.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                  <span className="material-icons">facebook</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                  <span className="material-icons">camera_alt</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                  <span className="material-icons">alternate_email</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link to="/search?category=lighting" className="hover:text-primary transition-colors">Smart Lighting</Link></li>
                <li><Link to="/search?category=security" className="hover:text-primary transition-colors">Home Security</Link></li>
                <li><Link to="/search" className="hover:text-primary transition-colors">Energy Saving</Link></li>
                <li><Link to="/search?category=entertainment" className="hover:text-primary transition-colors">Entertainment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Track Order</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Installation Guide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Expert</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-primary/5 text-center text-xs text-slate-400">
            © 2024 TechHome E-Commerce. All rights reserved. Built for Smart Living.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SmartHomeCategoryPage;
