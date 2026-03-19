import React, { useEffect, useRef, useState } from 'react';
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
  const [openDropdown, setOpenDropdown] = useState<null | 'profile' | 'language' | 'notifications'>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (e.target instanceof Node && rootRef.current.contains(e.target)) return;
      setOpenDropdown(null);
    };

    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  return (
    <div className="admin-shell" ref={rootRef}>
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
              <button
                type="button"
                className="admin-topbar-action"
                onClick={() => setOpenDropdown((v) => (v === 'language' ? null : 'language'))}
                aria-label="Language"
              >
                <span className="admin-flag-dot" aria-hidden />
                <span>English</span>
                <span className="admin-caret" aria-hidden>
                  ▼
                </span>
              </button>

              <button
                type="button"
                className="admin-topbar-action"
                onClick={() => setOpenDropdown((v) => (v === 'notifications' ? null : 'notifications'))}
                aria-label="Notifications"
              >
                <span className="material-icons" aria-hidden>
                  notifications_none
                </span>
              </button>

              <button
                type="button"
                className="admin-avatar"
                onClick={() => setOpenDropdown((v) => (v === 'profile' ? null : 'profile'))}
                aria-label="Profile menu"
              >
                MR
              </button>
            </div>

            {/* Dropdowns - UI state only (no auth logic) */}
            {openDropdown === 'language' && (
              <div className="admin-dropdown" role="menu" aria-label="Language menu">
                <button type="button" className="admin-dropdown-item">
                  English
                </button>
                <button type="button" className="admin-dropdown-item">
                  French
                </button>
                <button type="button" className="admin-dropdown-item">
                  Spanish
                </button>
              </div>
            )}

            {openDropdown === 'notifications' && (
              <div className="admin-dropdown admin-dropdown-notifications" role="menu" aria-label="Notifications menu">
                <div className="admin-dropdown-header">Notifications</div>
                <div className="admin-dropdown-body">
                  <div className="admin-notification-item">
                    <span className="admin-notification-dot" />
                    <div>
                      <div className="admin-notification-title">Profile update</div>
                      <div className="admin-notification-subtitle">New profile information has been saved.</div>
                    </div>
                  </div>
                  <div className="admin-notification-item">
                    <span className="admin-notification-dot admin-dot-blue" />
                    <div>
                      <div className="admin-notification-title">Activation error</div>
                      <div className="admin-notification-subtitle">See details in your account settings.</div>
                    </div>
                  </div>
                </div>
                <button type="button" className="admin-dropdown-footer">
                  See all notifications
                </button>
              </div>
            )}

            {openDropdown === 'profile' && (
              <div className="admin-dropdown admin-dropdown-profile" role="menu" aria-label="Profile menu">
                <button type="button" className="admin-dropdown-item">
                  Manage Account
                </button>
                <button type="button" className="admin-dropdown-item">
                  Change Password
                </button>
                <button type="button" className="admin-dropdown-item">
                  Activity Log
                </button>
                <button type="button" className="admin-dropdown-item">
                  Log out
                </button>
              </div>
            )}
          </header>
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
