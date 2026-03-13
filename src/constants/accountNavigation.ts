export interface AccountNavItem {
  label: string;
  icon: string;
  path: string;
}

export const ACCOUNT_SIDEBAR_LINKS: AccountNavItem[] = [
  { label: 'My Profile', icon: 'person', path: '/profile' },
  { label: 'Order History', icon: 'reorder', path: '/orders' },
  { label: 'Warranty Status', icon: 'verified_user', path: '/warranty' },
  { label: 'Saved Addresses', icon: 'location_on', path: '/account/addresses' },
  { label: 'Wishlist', icon: 'favorite', path: '/wishlist' },
];

