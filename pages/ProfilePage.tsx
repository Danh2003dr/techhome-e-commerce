import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cartItems } from '../data';

const profileNavItems = [
  { label: 'My Profile', path: '/profile', icon: 'person' },
  { label: 'Order History', path: '/dashboard', icon: 'history' },
  { label: 'Warranty Status', path: '/warranty', icon: 'verified_user' },
  { label: 'Saved Addresses', path: '/addresses', icon: 'location_on' },
  { label: 'Wishlist', path: '/wishlist', icon: 'favorite' },
];

const ProfilePage: React.FC = () => {
  const location = useLocation();
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display">
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
              <input
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary"
                placeholder="Search tech..."
                type="text"
              />
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
                <img
                  alt="Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1cYFm0td7RC_stH8Qi9Zli0kI97ANPxkaKBqH7Dpm9qrgD6yQZ_QyPuFCuZL8oZv9yKDQCXntTxkGra1tJSdZLcK9T4Ao5Jx8NGXu3B7vHeIBusDizdPs-M-L9NtEx8Q3-B35Lzccf0oydmf7oqlwxY7Q-frZsy_qMsJ9hcpwekTMVKA4gQM_j9aRAowsjprmoUT1mGLEVzMdo5osiRGqXscAM8mpGOZaZ98tPeI36i-W8EPRWnl2ja9FHYK34aEovOW2NpWT7zM"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold leading-none text-slate-900 dark:text-white">Alex Johnson</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Premium</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 py-10 flex gap-10">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <nav className="space-y-1.5">
            {profileNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md group'
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
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <nav className="flex items-center gap-2 text-[13px] font-semibold text-slate-400 mb-3">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="material-icons text-sm">chevron_right</span>
                <Link to="/profile" className="hover:text-primary transition-colors">Account</Link>
                <span className="material-icons text-sm">chevron_right</span>
                <span className="text-primary">Profile</span>
              </nav>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
              <p className="text-slate-500 mt-1.5">Manage your account settings and security preferences.</p>
            </div>
            <div className="flex items-center gap-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md w-full lg:w-auto">
              <div className="relative group flex-shrink-0">
                <img
                  alt="Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr-5cpNGoo6_fXpCQEnJFpyIGX4571JMorTIFS1W_oR0yGp1IBTI1_wLO51A6b6JfC_35uve5CoPYM2-is77gcOReXdd7VPBeLws-awri7PskL8u2xh1eUq1gEueTXzsqrp1FazpahCNs2KQX5oD6Y71wxx9yphpqUC_70AN9j0OhuIPUMTQtlrRSkHGsR-Ae0MukU5Jd4FVlVWsEW6CT2kWvy2xncJ-4KiWGLTbYe6MdSfuaEhKi8EN4oTy2OdUS4X6E2bOW0w5E"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-50 dark:ring-slate-800"
                />
                <button type="button" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-icons text-white">photo_camera</span>
                </button>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Profile Picture</h3>
                <p className="text-[12px] text-slate-500 mb-3">JPG, GIF or PNG. Max 2MB.</p>
                <div className="flex gap-2">
                  <button type="button" className="px-4 py-2 bg-primary text-white text-[12px] font-bold rounded-lg hover:bg-blue-600 transition-colors">Upload New</button>
                  <button type="button" className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[12px] font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Remove</button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-icons text-primary">badge</span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2>
                </div>
                <button type="button" className="flex items-center gap-1.5 text-primary text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors">
                  <span className="material-icons text-lg">edit</span>
                  Edit
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                  <input readOnly className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-700 dark:text-slate-300 focus:ring-primary focus:border-primary transition-all" type="text" value="Alex Johnson" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                  <input readOnly className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-700 dark:text-slate-300 focus:ring-primary focus:border-primary transition-all" type="email" value="alex.johnson@example.com" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
                  <input readOnly className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-slate-700 dark:text-slate-300 focus:ring-primary focus:border-primary transition-all" type="tel" value="+1 (555) 000-1234" />
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <span className="material-icons text-primary">security</span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security</h2>
              </div>
              <form className="p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Current Password</label>
                  <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="••••••••••••" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">New Password</label>
                    <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="••••••••••••" type="password" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Confirm Password</label>
                    <input className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="••••••••••••" type="password" />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20">Update Password</button>
                </div>
              </form>
            </section>
          </div>

          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
              <span className="material-icons text-primary">notifications</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
            </div>
            <div className="px-8 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="py-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-slate-500 mt-0.5">Receive order updates and newsletter.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary after:border-gray-300" />
                </label>
              </div>
              <div className="py-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">SMS Alerts</p>
                  <p className="text-sm text-slate-500 mt-0.5">Real-time shipping notifications via text.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary after:border-gray-300" />
                </label>
              </div>
              <div className="py-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                </div>
                <button type="button" className="text-primary text-sm font-bold border-2 border-primary/20 bg-primary/5 px-6 py-2 rounded-xl hover:bg-primary/10 transition-colors">Enable</button>
              </div>
            </div>
          </section>
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

export default ProfilePage;
