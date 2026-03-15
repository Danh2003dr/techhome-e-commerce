import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useAvatar } from '@/context/AvatarContext';
import { DEFAULT_PROFILE_IMAGE, DEFAULT_USER_NAME, DEFAULT_USER_TIER } from '@/constants/user';

const AccountHeader: React.FC = () => {
  const { user } = useAuth();
  const { avatarUrl } = useAvatar();
  const { totalCount: cartCount } = useCart();
  const displayName = user?.name ?? DEFAULT_USER_NAME;
  const displayAvatar = avatarUrl ?? DEFAULT_PROFILE_IMAGE;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl">
              <span className="material-icons text-white text-2xl">devices</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Tech<span className="text-primary">Home</span>
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <Link to="/search" className="hover:text-primary transition-colors">
              Shop
            </Link>
            <Link to="/deals" className="hover:text-primary transition-colors">
              Deals
            </Link>
            <Link to="/search" className="hover:text-primary transition-colors">
              Support
            </Link>
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
            <Link
              to="/cart"
              className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
            >
              <span className="material-icons">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] text-white flex items-center justify-center rounded-full font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <Link
              to="/profile"
              className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <img
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                src={displayAvatar}
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-none text-slate-900 dark:text-white">{displayName}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{DEFAULT_USER_TIER}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AccountHeader;

