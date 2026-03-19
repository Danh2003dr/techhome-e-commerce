import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './admin.css';

type NavItem = {
  to: string;
  label: string;
};

const coreNav: NavItem[] = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Order Lists' },
  { to: '/admin/inbox', label: 'Inbox' },
  { to: '/admin/calendar', label: 'Calendar' },
  { to: '/admin/todo', label: 'To-Do' },
];

const pageNav: NavItem[] = [
  { to: '/admin/seo', label: 'Settings / SEO' },
  { to: '/admin/products/new', label: 'Add Product' },
];

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-shell">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-brand">DashStack</div>

          {coreNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}

          <div className="admin-sidebar-group-title">Pages</div>
          {pageNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </aside>

        <section className="admin-main">
          <header className="admin-topbar">
            <input className="admin-search" placeholder="Search admin pages..." />
            <div className="admin-topbar-right">
              <span>EN</span>
              <span>Notifications</span>
              <span className="admin-avatar">MR</span>
            </div>
          </header>
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
