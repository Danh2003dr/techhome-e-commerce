export type AdminNavItem = {
  label: string;
  path: string;
  icon: string;
};

export const ADMIN_NAV_GROUPS: Array<{ title?: string; items: AdminNavItem[] }> = [
  {
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
      { label: 'Products', path: '/admin/products', icon: 'inventory_2' },
      { label: 'Orders', path: '/admin/orders', icon: 'receipt_long' },
      { label: 'Calendar', path: '/admin/calendar', icon: 'event' },
      { label: 'Vouchers', path: '/admin/vouchers', icon: 'confirmation_number' },
      { label: 'Settings', path: '/admin/seo', icon: 'settings' },
    ],
  },
  {
    items: [{ label: 'Logout', path: '/login', icon: 'logout' }],
  },
];

export function getFlatAdminNavItems(): AdminNavItem[] {
  return ADMIN_NAV_GROUPS.flatMap((g) => g.items);
}
