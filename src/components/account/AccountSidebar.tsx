import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ACCOUNT_SIDEBAR_LINKS } from '@/constants/accountNavigation';

const AccountSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <nav className="space-y-1.5">
        {ACCOUNT_SIDEBAR_LINKS.map((item) => {
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
        <Link
          to="/login"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-semibold transition-all"
        >
          <span className="material-icons text-[22px]">logout</span>
          <span>Đăng xuất</span>
        </Link>
      </div>
    </aside>
  );
};

export default AccountSidebar;

