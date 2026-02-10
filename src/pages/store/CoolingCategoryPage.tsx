import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { coolingCategoryProducts } from '@/data';
import type { CoolingProduct } from '@/types';

const SUB_CATEGORIES = [
  { title: 'Split AC', desc: 'Wall-mounted high efficiency', icon: 'ac_unit' },
  { title: 'Portable AC', desc: 'Flexible cooling for any room', icon: 'vibration' },
  { title: 'Air Purifiers', desc: 'Breath clean, stay healthy', icon: 'air' },
  { title: 'Smart Fans', desc: 'Quiet & powerful circulation', icon: 'mode_fan' },
];

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBbqgrr52XN3SWyGm7DLwLuPF2e-n_ZoJb85WvYdQKPeIjR4Uudyg8DaySW2waKcAcQf3BwN5Z6imqsMqOYaS3hT9IzIlH3kU6tzaIace_HOVypjY2LZKyKgwSM9Ds5BLuR6WynvQcWQLMoxiei5s2iWJ1YbtQvXFem6p11qLyqeH3E-3ZJpcG_aeVBunDEXWQmv_nGFiFrq8txaAQ7B-VV0VCsVunsmCKYMRkGVe7x8Asj0wEaU_5fv3g362ZUhsH3VwgJKJyQxIc';

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex text-amber-400">
      {[...Array(5)].map((_, i) => {
        if (i < full) return <span key={i} className="material-icons text-sm">star</span>;
        if (i === full && half) return <span key={i} className="material-icons text-sm">star_half</span>;
        return <span key={i} className="material-icons text-sm text-slate-300">star</span>;
      })}
    </div>
  );
}

function Badge({ label }: { label: string }) {
  const isGreen = label.includes('ENERGY');
  const isPrimary = label.includes('INSTALLATION');
  const bg = isGreen ? 'bg-emerald-500' : isPrimary ? 'bg-primary' : 'bg-slate-800';
  return (
    <span className={`${bg} text-white text-[10px] font-bold px-2 py-1 rounded`}>
      {label}
    </span>
  );
}

function ProductCard({ product }: { product: CoolingProduct }) {
  const to = product.productDetailId ? `/product/${product.productDetailId}` : `/product/${product.id}`;
  const techIcon = product.techIcon ?? 'eco';
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-primary/5 hover:border-primary/50 transition-all group shadow-sm">
      <div className="relative h-48 overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
          {product.badges.map((b) => (
            <Badge key={b} label={b} />
          ))}
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-primary uppercase">{product.brand}</span>
          <StarRating rating={product.rating} />
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="material-icons text-sm">bolt</span>
            {product.btu}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="material-icons text-sm">{techIcon}</span>
            {product.tech}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            {product.oldPrice && (
              <span className="block text-xs text-slate-400 line-through">
                ${product.oldPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <Link
            to={to}
            className="bg-primary text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span className="material-icons">add_shopping_cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const CoolingCategoryPage: React.FC = () => {
  const [inverterOn, setInverterOn] = useState(true);
  const [energyStar, setEnergyStar] = useState<number | null>(5);
  const [sortBy, setSortBy] = useState('Most Popular');
  const [gridView, setGridView] = useState(true);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
              TechHome
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link to="/search" className="hover:text-primary transition-colors">Categories</Link>
              <Link to="/deals" className="hover:text-primary transition-colors">Deals</Link>
              <Link to="/search?category=smart-home" className="hover:text-primary transition-colors">Smart Home</Link>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <input
                className="w-64 bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 px-4 text-sm focus:ring-2 focus:ring-primary"
                placeholder="Search appliances..."
                type="text"
              />
              <span className="material-icons absolute right-3 top-2 text-slate-400 text-sm">search</span>
            </div>
            <Link to="/cart" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-icons">shopping_cart</span>
            </Link>
            <Link to="/profile" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-icons">person_outline</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="material-icons text-[10px]">chevron_right</span>
          <Link to="/search" className="hover:text-primary">Shop by Category</Link>
          <span className="material-icons text-[10px]">chevron_right</span>
          <span className="text-primary font-semibold">Cooling</span>
        </nav>

        {/* Hero Banner */}
        <section className="relative w-full aspect-[21/9] lg:aspect-[3/1] rounded-xl overflow-hidden mb-12 bg-slate-200 dark:bg-slate-800">
          <img
            src={HERO_IMAGE}
            alt="Modern Living Room with Air Conditioner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/60 to-transparent flex items-center p-8 lg:p-16">
            <div className="max-w-xl text-white">
              <span className="inline-block px-3 py-1 bg-primary rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                Summer Special
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-4">
                Beat the Heat with <span className="text-primary">Smart Cooling</span>
              </h1>
              <p className="text-lg text-slate-200 mb-8">
                Experience ultimate comfort with energy-efficient air conditioners and air purifiers. Up to 30% off on premium brands.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/search?category=cooling"
                  className="bg-primary hover:bg-blue-600 px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
                >
                  Shop Now
                </Link>
                <button
                  type="button"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 px-8 py-3 rounded-lg font-bold transition-all"
                >
                  Explore Tech
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Category Tiles */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {SUB_CATEGORIES.map((sub) => (
            <button
              key={sub.title}
              type="button"
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-primary/5 hover:border-primary/30 transition-all cursor-pointer group shadow-sm text-left flex flex-col items-start h-full min-h-[160px]"
            >
              <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <span className="material-icons text-3xl">{sub.icon}</span>
              </div>
              <h3 className="font-bold text-lg leading-tight">{sub.title}</h3>
              <p className="text-sm text-slate-500 mt-1 leading-tight">{sub.desc}</p>
            </button>
          ))}
        </section>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            <div>
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-icons text-primary">filter_list</span>
                Filters
              </h4>
              <div className="space-y-6">
                <div>
                  <span className="block text-sm font-semibold mb-3 uppercase tracking-wider text-slate-400">BTU Capacity</span>
                  <div className="space-y-2">
                    {['9,000 BTU', '12,000 BTU', '18,000 BTU', '24,000 BTU'].map((btu, idx) => (
                      <label key={btu} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          defaultChecked={idx === 1}
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">{btu}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-semibold mb-3 uppercase tracking-wider text-slate-400">Technology</span>
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="text-sm">Inverter Tech</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={inverterOn}
                      onClick={() => setInverterOn(!inverterOn)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        inverterOn ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          inverterOn ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-semibold mb-3 uppercase tracking-wider text-slate-400">Energy Rating</span>
                  <div className="flex gap-2">
                    {([3, 4, 5] as const).map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEnergyStar(energyStar === star ? null : star)}
                        className={`w-8 h-8 rounded border flex items-center justify-center text-xs transition-colors ${
                          energyStar === star
                            ? 'border-primary bg-primary text-white'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-primary hover:text-white'
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-semibold mb-3 uppercase tracking-wider text-slate-400">Brand</span>
                  <div className="space-y-2">
                    {['Daikin', 'Panasonic', 'LG', 'Samsung'].map((brand) => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-primary/5">
              <span className="text-sm text-slate-500">
                <span className="font-bold text-slate-900 dark:text-white">124</span> products found
              </span>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer"
                >
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
                <div className="flex border-l border-slate-200 dark:border-slate-700 pl-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setGridView(true)}
                    className={`p-1 ${gridView ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
                  >
                    <span className="material-icons">grid_view</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridView(false)}
                    className={`p-1 ${!gridView ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
                  >
                    <span className="material-icons">view_list</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {coolingCategoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button
                type="button"
                className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-primary/20 hover:bg-primary/5 px-8 py-3 rounded-lg font-bold transition-all shadow-sm"
              >
                Load More Products
                <span className="material-icons text-sm">expand_more</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="text-2xl font-bold text-primary">TechHome</div>
              <p className="text-sm text-slate-500">Your one-stop destination for modern electronics and smart home solutions.</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Shop</h5>
              <ul className="text-sm text-slate-500 space-y-2">
                <li><a href="#" className="hover:text-primary transition-colors">Air Conditioners</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Air Purifiers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Refrigerators</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Smart Home</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Support</h5>
              <ul className="text-sm text-slate-500 space-y-2">
                <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Installation Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Warranty Info</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Newsletter</h5>
              <p className="text-sm text-slate-500 mb-4">Get the latest cooling tech news.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="flex-1 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary"
                  placeholder="Email address"
                  type="email"
                />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">
                  Join
                </button>
              </form>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
            © 2024 TechHome Electronics Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CoolingCategoryPage;
