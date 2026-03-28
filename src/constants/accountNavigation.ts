export interface AccountNavItem {
  label: string;
  icon: string;
  path: string;
}

export const ACCOUNT_SIDEBAR_LINKS: AccountNavItem[] = [
  { label: 'Hồ sơ cá nhân', icon: 'person', path: '/profile' },
  { label: 'Lịch sử đơn hàng', icon: 'reorder', path: '/orders' },
  { label: 'Bảo hành', icon: 'verified_user', path: '/warranty' },
  { label: 'Sổ địa chỉ', icon: 'location_on', path: '/account/addresses' },
];

