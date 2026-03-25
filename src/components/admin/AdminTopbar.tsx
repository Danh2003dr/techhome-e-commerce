import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'A';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

type AdminTopbarProps = {
  onToggleSidebar: () => void;
  sidebarCollapsed?: boolean;
};

const AdminTopbar: React.FC<AdminTopbarProps> = ({ onToggleSidebar, sidebarCollapsed = false }) => {
  const { user } = useAuth();

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
  const initials = getInitials(displayName);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            aria-pressed={!sidebarCollapsed}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0"
          >
            <span className={`material-icons text-slate-600 dark:text-slate-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}>menu</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <span className="material-icons text-slate-600 dark:text-slate-300">notifications_none</span>
          </button>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((v) => !v)}
              className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors border border-transparent"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                <span className="text-sm font-bold">{initials}</span>
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{displayName}</div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-300 truncate max-w-[160px]">{email}</div>
              </div>
              <span className="material-icons text-slate-400">expand_more</span>
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-1 w-52 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-[100]">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{displayName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{email}</div>
                </div>
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Admin Profile
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Logout
                  </Link>
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
