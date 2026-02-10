import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { listingProducts } from '@/data';

const TOTAL_RESULTS = 348;
const PER_PAGE = 12;
const TOTAL_PAGES = 12;

const ProductListingPage: React.FC = () => {
  const [sortBy, setSortBy] = useState('Popularity');
  const [processorOpen, setProcessorOpen] = useState(true);
  const [connectivityOpen, setConnectivityOpen] = useState(false);
  const [powerOpen, setPowerOpen] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-icons">devices</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">TechHome</span>
          </Link>
          <div className="flex-grow max-w-2xl relative">
            <input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" placeholder="Search for electronics, brands, or categories..." type="text" />
            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
              <span className="material-icons">person_outline</span>
              <span className="text-sm font-medium hidden md:inline">Account</span>
            </Link>
            <Link to="/cart" className="flex items-center gap-1 hover:text-primary transition-colors relative">
              <span className="material-icons">shopping_cart</span>
              <span className="text-sm font-medium hidden md:inline">Cart</span>
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
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
                    <div className="flex-1"><span className="text-[10px] text-slate-400 uppercase">Min</span><input type="text" defaultValue="$0" className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded px-2 py-1" /></div>
                    <div className="flex-1"><span className="text-[10px] text-slate-400 uppercase">Max</span><input type="text" defaultValue="$2500" className="w-full text-sm border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded px-2 py-1" /></div>
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
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Electronic Deals</h1>
              <p className="text-sm text-slate-500">Showing 1-12 of {TOTAL_RESULTS} results</p>
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
            {listingProducts.map((product) => (
              <div key={product.id} className="product-card bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden group flex flex-col">
                <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                  <img alt={product.name} src={product.image} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500" />
                  {product.dealOfTheDay && <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase px-2 py-1 rounded">Deal of the Day</div>}
                  <button type="button" className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-icons text-lg">favorite_border</span>
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
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">{product.name}</h3>
                  <div className="mt-auto pt-4 flex items-end justify-between">
                    <div>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                      {product.oldPrice && <span className="block text-sm text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>}
                    </div>
                  </div>
                  <Link to={`/product/${product.productDetailId ?? product.id}`} className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <span className="material-icons text-lg">add_shopping_cart</span>
                    Add to Cart
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-2">
            <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors"><span className="material-icons">chevron_left</span></button>
            {[1, 2, 3].map((n) => (
              <button key={n} type="button" className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${n === 1 ? 'bg-primary text-white' : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary hover:text-primary'}`}>{n}</button>
            ))}
            <span className="text-slate-400 px-2">...</span>
            <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors">{TOTAL_PAGES}</button>
            <button type="button" className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary hover:text-primary transition-colors"><span className="material-icons">chevron_right</span></button>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white"><span className="material-icons text-sm">devices</span></div>
              <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">TechHome</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">Your one-stop destination for premium electronics and smart home solutions.</p>
          </div>
          <div><h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Quick Links</h4><ul className="space-y-2 text-sm text-slate-500"><li><a className="hover:text-primary" href="#">About Us</a></li><li><a className="hover:text-primary" href="#">Track Order</a></li><li><a className="hover:text-primary" href="#">Shipping Policy</a></li><li><a className="hover:text-primary" href="#">Returns & Exchanges</a></li></ul></div>
          <div><h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Customer Support</h4><ul className="space-y-2 text-sm text-slate-500"><li><a className="hover:text-primary" href="#">Help Center</a></li><li><a className="hover:text-primary" href="#">Contact Us</a></li><li><a className="hover:text-primary" href="#">Live Chat</a></li><li><a className="hover:text-primary" href="#">Warranty Information</a></li></ul></div>
          <div><h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Newsletter</h4><p className="text-sm text-slate-500 mb-4">Subscribe to get special offers and once-in-a-lifetime deals.</p><div className="flex gap-2"><input type="email" placeholder="Your email" className="flex-grow bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary" /><button type="button" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Join</button></div></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">© 2024 TechHome E-Commerce. All rights reserved.</p>
          <div className="flex gap-4"><div className="w-8 h-5 bg-slate-200 dark:bg-slate-700 rounded-sm" /><div className="w-8 h-5 bg-slate-200 dark:bg-slate-700 rounded-sm" /><div className="w-8 h-5 bg-slate-200 dark:bg-slate-700 rounded-sm" /></div>
        </div>
      </footer>
    </div>
  );
};

export default ProductListingPage;
