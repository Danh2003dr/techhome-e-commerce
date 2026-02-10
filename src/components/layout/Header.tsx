import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartItems } from '@/data';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Find a Store</a>
            <a href="#" className="hover:text-primary transition-colors">TechHome Plus</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
          <div className="flex gap-6">
            <span className="flex items-center gap-1">
              <span className="material-icons text-sm">local_shipping</span>
              Free Shipping over $35
            </span>
            <span className="flex items-center gap-1">
              <span className="material-icons text-sm">verified</span>
              Price Match Guarantee
            </span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-8">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-primary p-1 rounded-lg text-white">
              <span className="material-icons text-2xl">devices</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tech<span className="text-primary">Home</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-grow max-w-3xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="material-icons text-slate-400 group-focus-within:text-primary transition-colors">search</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-24 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all text-sm"
                placeholder="Search for laptops, smart home, appliances..."
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-primary text-white px-4 rounded-md font-semibold text-sm hover:bg-blue-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-6">
            <Link to="/profile" className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
              <span className="material-icons">person_outline</span>
              <span className="text-[10px] font-bold uppercase">Account</span>
            </Link>
            <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
              <span className="material-icons">history</span>
              <span className="text-[10px] font-bold uppercase">Orders</span>
            </Link>
            <Link to="/cart" className="relative flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
              <span className="material-icons">shopping_cart</span>
              <span className="text-[10px] font-bold uppercase">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-4 flex items-center h-12 gap-8 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Link to="/search" className="flex items-center gap-2 hover:text-primary transition-colors">
              <span className="material-icons text-lg">menu</span>
              Shop Categories
            </Link>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
            <Link to="/deals" className="hover:text-primary transition-colors">Top Deals</Link>
            <Link to="/compare" className="hover:text-primary transition-colors">Compare</Link>
            <Link to="/search" className="hover:text-primary transition-colors">New Releases</Link>
            <Link to="/search?category=computing" className="hover:text-primary transition-colors">Computing</Link>
            <Link to="/search?category=cooling" className="hover:text-primary transition-colors">Appliances</Link>
            <Link to="/search" className="hover:text-primary transition-colors">Gaming</Link>
            <Link to="/deals" className="text-red-500 font-bold hover:text-red-600 transition-colors">Outlet</Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
