import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ADMIN_NAV_GROUPS } from '@/components/admin/adminNavConfig';

type AdminSidebarProps = {
  collapsed?: boolean;
};

function pathMatchesItem(currentPath: string, itemPath: string): boolean {
  if (itemPath === '/admin/dashboard') return currentPath === '/admin/dashboard';
  if (itemPath === '/admin/products') {
    return (
      currentPath === '/admin/products' ||
      currentPath.startsWith('/admin/products/') ||
      currentPath.startsWith('/admin/products/new')
    );
  }
  if (itemPath === '/admin/orders') {
    return currentPath === '/admin/orders' || currentPath.startsWith('/admin/orders/');
  }
  if (itemPath === '/admin/seo') return currentPath.startsWith('/admin/seo');
  if (itemPath === '/admin/banners') return currentPath.startsWith('/admin/banners');
  if (itemPath === '/admin/vouchers') return currentPath.startsWith('/admin/vouchers');
  if (itemPath === '/login') return false;
  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className={`flex flex-col flex-shrink-0 sticky top-0 h-screen bg-white border-r border-slate-200 transition-[width] duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="px-4 pt-6 pb-4 transition-all duration-300">
        <div className="flex items-center gap-3 px-3">
          <div
            className={`bg-primary/90 flex items-center justify-center text-white shrink-0 ${
              collapsed ? 'w-6 h-6 rounded-lg' : 'w-10 h-10 rounded-xl'
            }`}
          >
            <span className={`material-icons ${collapsed ? 'text-[18px]' : 'text-[22px]'}`}>dashboard</span>
          </div>
          {!collapsed && (
            <div className="leading-tight min-w-0">
              <div className="text-sm font-semibold text-slate-900">DashStack</div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">TechHome Admin</div>
            </div>
          )}
        </div>
      </div>

      <nav className="px-4 pb-4 flex-1 overflow-y-auto">
        {ADMIN_NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="mb-5">
            {group.title && !collapsed && (
              <div className="px-2 mb-2">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{group.title}</div>
              </div>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathMatchesItem(currentPath, item.path);
                return (
                  <Link
                    key={`${item.path}-${item.label}`}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold
                      ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <span className="material-icons text-[20px]">{item.icon}</span>
                    {!collapsed && <span className="text-sm">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
