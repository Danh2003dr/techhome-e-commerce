export type AdminNavItem = {
  label: string;
  path: string;
  icon: string;
};

export const ADMIN_NAV_GROUPS: Array<{ title?: string; items: AdminNavItem[] }> = [
  {
    items: [
      { label: 'Bảng điều khiển', path: '/admin/dashboard', icon: 'dashboard' },
      { label: 'Sản phẩm', path: '/admin/products', icon: 'inventory_2' },
      { label: 'Đơn hàng', path: '/admin/orders', icon: 'receipt_long' },
      { label: 'Hộp thư khách', path: '/admin/messages', icon: 'inbox' },
      { label: 'Mã giảm giá', path: '/admin/vouchers', icon: 'confirmation_number' },
      { label: 'Cài đặt', path: '/admin/seo', icon: 'settings' },
    ],
  },
  {
    items: [{ label: 'Đăng xuất', path: '/login', icon: 'logout' }],
  },
];

export function getFlatAdminNavItems(): AdminNavItem[] {
  return ADMIN_NAV_GROUPS.flatMap((g) => g.items);
}
