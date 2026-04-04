import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAvatar } from '@/context/AvatarContext';
import { DEFAULT_PROFILE_IMAGE } from '@/constants/user';

type AdminTopbarProps = {
  onToggleSidebar: () => void;
  sidebarCollapsed?: boolean;
};

const AdminTopbar: React.FC<AdminTopbarProps> = ({ onToggleSidebar, sidebarCollapsed = false }) => {
  const { user, logout } = useAuth();
  const { avatarUrl } = useAvatar();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
    };
    if (isProfileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const displayName = user?.name ?? 'Admin';
  const email = user?.email ?? 'admin@techhome.local';
  const displayAvatar = avatarUrl ?? user?.avatarUrl ?? DEFAULT_PROFILE_IMAGE;

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Mở thanh bên' : 'Thu gọn thanh bên'}
            aria-pressed={!sidebarCollapsed}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
          >
            <span className={`material-icons text-slate-600 dark:text-slate-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}>menu</span>
          </button>
        </div>

        <div className="flex items-center gap-8 sm:gap-10 min-w-0">
          <Link
            to="/"
            className="text-sm font-medium text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300 transition-colors shrink-0"
          >
            Cửa hàng
          </Link>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((v) => !v)}
              className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors border border-transparent"
            >
              <img
                src={displayAvatar}
                alt=""
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{displayName}</div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-300 truncate max-w-[160px]">{email}</div>
              </div>
              <span className="material-icons text-slate-400">expand_more</span>
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-[100]">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex gap-3 items-center min-w-0">
                  <img
                    src={displayAvatar}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{displayName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{email}</div>
                  </div>
                </div>
                <div className="py-2">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Cửa hàng
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Hồ sơ
                  </Link>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
