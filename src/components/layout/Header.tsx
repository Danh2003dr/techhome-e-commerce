import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartItems } from '@/data';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    if (isCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoriesOpen]);

  // Category menu items with routes
  const categoryMenuItems = [
    { name: 'Smartphones', path: '/category/mobile', icon: 'smartphone' },
    { name: 'Tablets', path: '/search?category=tablets', icon: 'tablet' },
    { name: 'Laptops', path: '/search?category=laptops', icon: 'laptop' },
    { name: 'Accessories', path: '/category/accessories', icon: 'keyboard' },
    { name: 'Audio', path: '/category/audio', icon: 'headset' },
    { name: 'Smartwatch', path: '/search?category=smartwatch', icon: 'watch' },
  ];

  return (
    <>
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
                placeholder="Search for smartphones, tablets, accessories..."
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
            <Link to="/orders" className="flex flex-col items-center gap-0.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
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

        <nav className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative">
          <div className="container mx-auto px-4 flex items-center h-12 gap-8 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <div 
              ref={categoriesRef}
              className="relative"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-icons text-lg">menu</span>
                Shop Categories
                <span className={`material-icons text-sm transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Dropdown Menu */}
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[100] overflow-hidden">
                  <div className="py-2">
                    {categoryMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                      >
                        <span className="material-icons text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
            <Link to="/deals" className="hover:text-primary transition-colors">Top Deals</Link>
            <Link to="/search?sort=newest" className="hover:text-primary transition-colors">New Releases</Link>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
