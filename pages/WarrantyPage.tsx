import React from 'react';
import { Link } from 'react-router-dom';
import { warrantyItems, cartItems } from '../data';

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA1cYFm0td7RC_stH8Qi9Zli0kI97ANPxkaKBqH7Dpm9qrgD6yQZ_QyPuFCuZL8oZv9yKDQCXntTxkGra1tJSdZLcK9T4Ao5Jx8NGXu3B7vHeIBusDizdPs-M-L9NtEx8Q3-B35Lzccf0oydmf7oqlwxY7Q-frZsy_qMsJ9hcpwekTMVKA4gQM_j9aRAowsjprmoUT1mGLEVzMdo5osiRGqXscAM8mpGOZaZ98tPeI36i-W8EPRWnl2ja9FHYK34aEovOW2NpWT7zM';

const SIDEBAR_LINKS = [
  { label: 'My Profile', icon: 'person', path: '/profile' },
  { label: 'Order History', icon: 'reorder', path: '/dashboard' },
  { label: 'Warranty Status', icon: 'verified_user', path: '/warranty' },
  { label: 'Saved Addresses', icon: 'location_on', path: '/addresses' },
  { label: 'Wishlist', icon: 'favorite', path: '/wishlist' },
];

const WarrantyPage: React.FC = () => {
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-12">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <span className="material-icons text-white text-2xl">devices</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Tech<span className="text-primary">Home</span></span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <Link to="/search" className="hover:text-primary transition-colors">Shop</Link>
              <Link to="/deals" className="hover:text-primary transition-colors">Deals</Link>
              <Link to="/search" className="hover:text-primary transition-colors">Support</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary" placeholder="Search tech..." type="text" />
            </div>
            <div className="flex items-center gap-2">
              <Link to="/cart" className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                <span className="material-icons">shopping_cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
              <Link to="/profile" className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <img alt="Profile" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" src={PROFILE_IMAGE} />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold leading-none text-slate-900 dark:text-white">Alex Johnson</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Premium Member</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10 w-full">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <nav className="space-y-1.5">
            {SIDEBAR_LINKS.map((item) => {
              const isActive = item.path === '/warranty';
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                    isActive ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md group'
                  }`}
                >
                  <span className={`material-icons text-[22px] ${isActive ? '' : 'group-hover:text-primary'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link to="/login" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-semibold transition-all">
              <span className="material-icons text-[22px]">logout</span>
              <span>Sign Out</span>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-grow space-y-8 min-w-0">
          <div>
            <nav className="flex items-center gap-2 text-[13px] font-semibold text-slate-400 mb-3">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-icons text-sm">chevron_right</span>
              <Link to="/profile" className="hover:text-primary transition-colors">Account</Link>
              <span className="material-icons text-sm">chevron_right</span>
              <span className="text-primary">Warranty Status</span>
            </nav>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Warranty Status</h1>
            <p className="text-slate-500 mt-1.5">Track and manage your product coverage and claims.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {warrantyItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05),0_2px_10px_-2px_rgba(0,0,0,0.03)] overflow-hidden ${item.status === 'expired' ? 'opacity-75' : ''}`}
              >
                <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-800">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 flex-shrink-0">
                      <span className="material-icons text-4xl text-slate-400">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{item.productName}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Serial: <span className="font-mono text-slate-700 dark:text-slate-300">{item.serial}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {item.status === 'active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                            Active Coverage
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
                            Expired
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    {item.status === 'active' ? (
                      <button type="button" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-primary/20">
                        File a Claim
                      </button>
                    ) : (
                      <button type="button" className="border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        Renew Protection
                      </button>
                    )}
                  </div>
                </div>
                <div className="px-6 sm:px-8 py-5 bg-slate-50/50 dark:bg-slate-800/30 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Purchase Date</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Expiry Date</p>
                    <p
                      className={`text-sm font-semibold ${
                        item.expiryVariant === 'red' ? 'text-red-500' : item.expiryVariant === 'amber' ? 'text-amber-600' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.expiryDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Plan Type</p>
                    <p className={`text-sm font-semibold ${item.planHighlight ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{item.planType}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full shadow-lg flex items-center justify-center mb-6">
              <span className="material-icons text-primary text-3xl">add_moderator</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Have a new product?</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-[15px]">Register your new TechHome purchases to activate your warranty and unlock exclusive premium support benefits.</p>
            <button type="button" className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-primary/20">
              Register New Product
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <span className="material-icons text-white text-xl">devices</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Tech<span className="text-primary">Home</span></span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">Your one-stop destination for premium electronics and smart home solutions. We provide high-quality gadgets for modern living.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Support</h4>
            <ul className="text-[14px] text-slate-500 space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns & Refunds</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
            <ul className="text-[14px] text-slate-500 space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Newsletter</h4>
            <p className="text-[14px] text-slate-500 mb-5 leading-relaxed">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-primary" placeholder="Email address" type="email" />
              <button type="submit" className="bg-primary text-white px-4 rounded-xl hover:bg-blue-600 transition-colors shadow-md">
                <span className="material-icons">send</span>
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-slate-400">© 2024 TechHome E-commerce. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">leaderboard</span></a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">share</span></a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-icons">rss_feed</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WarrantyPage;
