import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navGroups: Array<{
  title?: string;
  items: Array<{ label: string; path: string; icon: string }>;
}> = [
  {
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
      { label: 'Products', path: '/admin/products', icon: 'inventory_2' },
      { label: 'Favorites', path: '/admin/favorites', icon: 'favorite_border' },
      { label: 'Inbox', path: '/admin/inbox', icon: 'mail_outline' },
      { label: 'Order Lists', path: '/admin/orders', icon: 'receipt_long' },
      { label: 'Product Stock', path: '/admin/products/stock', icon: 'bar_chart' },
    ],
  },
  {
    title: 'PAGES',
    items: [
      { label: 'Pricing', path: '/admin/pricing', icon: 'local_offer' },
      { label: 'Calendar', path: '/admin/calendar', icon: 'event' },
      { label: 'To-Do', path: '/admin/todo', icon: 'checklist' },
      { label: 'Contact', path: '/admin/contact', icon: 'contact_page' },
      { label: 'Invoice', path: '/admin/orders/invoice', icon: 'receipt' },
      { label: 'UI Elements', path: '/admin/ui-elements', icon: 'widgets' },
      { label: 'Team', path: '/admin/team', icon: 'groups' },
      { label: 'Table', path: '/admin/table', icon: 'table_chart' },
      { label: 'SEO', path: '/admin/seo', icon: 'settings' },
      { label: 'Logout', path: '/login', icon: 'logout' },
    ],
  },
];

type AdminSidebarProps = {
  /**
   * When true, sidebar collapses to icon-only mode.
   * (The "ẩn/mở sidebar" behavior controlled by AdminLayout)
   */
  collapsed?: boolean;
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed = false }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside
      className={`flex flex-col flex-shrink-0 sticky top-0 h-screen bg-white border-r border-slate-200 transition-[width] duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Cùng cấu trúc padding với <nav> (px-4) + mỗi Link (px-3) để icon/logo thẳng hàng khi sidebar thu gọn */}
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
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-5">
            {group.title && !collapsed && (
              <div className="px-2 mb-2">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {group.title}
                </div>
              </div>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  item.path === '/admin/dashboard'
                    ? currentPath === '/admin/dashboard'
                    : item.path === '/admin/products'
                      ? currentPath === '/admin/products' ||
                        (currentPath.startsWith('/admin/products/') &&
                          !currentPath.startsWith('/admin/products/stock'))
                      : item.path === '/admin/products/stock'
                        ? currentPath === '/admin/products/stock'
                        : currentPath.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
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

