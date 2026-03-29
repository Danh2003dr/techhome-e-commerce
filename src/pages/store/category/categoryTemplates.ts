export type CategoryTemplateKey = 'mobile' | 'accessories' | 'audio';

export type CategorySubCategory = {
  label: string;
  icon: string; // Material icon name
  /** Stable value for controlling active state. Defaults to `label` when omitted. */
  value?: string;
};

export type CategorySortOption = {
  value: string;
  label: string;
};

export type CategoryTemplateConfig = {
  key: CategoryTemplateKey;
  displayName: string;
  breadcrumbCurrentLabel: string;
  breadcrumbHomeLabel: string;
  breadcrumbIntermediateLabel: string;

  /** Fallback when API has no child categories — not shown as chips until wired to real data */
  subCategories: CategorySubCategory[];

  defaultSortBy: string;
  sortOptions: CategorySortOption[];
};

const DEFAULT_SORT_OPTIONS: CategorySortOption[] = [
  { value: 'Newest Arrivals', label: 'Newest Arrivals' },
  { value: 'Price: Low to High', label: 'Price: Low to High' },
  { value: 'Price: High to Low', label: 'Price: High to Low' },
  { value: 'Most Popular', label: 'Most Popular' },
];

export const categoryTemplates: Record<CategoryTemplateKey, CategoryTemplateConfig> = {
  mobile: {
    key: 'mobile',
    displayName: 'Mobile',
    breadcrumbCurrentLabel: 'Mobile',
    breadcrumbHomeLabel: 'Trang chủ',
    breadcrumbIntermediateLabel: 'Mua theo danh mục',

    subCategories: [
      { label: 'iOS', icon: 'phone_iphone' },
      { label: 'Android', icon: 'android' },
      { label: 'Feature Phones', icon: 'devices' },
      { label: 'Refurbished', icon: 'refresh' },
      { label: 'All Products', icon: 'apps' },
    ],

    defaultSortBy: 'Most Popular',
    sortOptions: DEFAULT_SORT_OPTIONS,
  },

  accessories: {
    key: 'accessories',
    displayName: 'Accessories',
    breadcrumbCurrentLabel: 'Accessories',
    breadcrumbHomeLabel: 'Trang chủ',
    breadcrumbIntermediateLabel: 'Mua theo danh mục',

    subCategories: [
      { label: 'Charging & Cables', icon: 'usb' },
      { label: 'Keyboards & Mice', icon: 'keyboard' },
      { label: 'Laptop Sleeves', icon: 'laptop' },
      { label: 'Phone Cases', icon: 'smartphone' },
      { label: 'Power Banks', icon: 'battery_charging_full' },
      { label: 'Audio Gear', icon: 'headphones' },
    ],

    defaultSortBy: 'Newest Arrivals',
    sortOptions: DEFAULT_SORT_OPTIONS,
  },

  audio: {
    key: 'audio',
    displayName: 'Audio',
    breadcrumbCurrentLabel: 'Audio',
    breadcrumbHomeLabel: 'Trang chủ',
    breadcrumbIntermediateLabel: 'Mua theo danh mục',

    subCategories: [
      { label: 'Headphones', icon: 'headphones' },
      { label: 'Earbuds', icon: 'headset' },
      { label: 'Bluetooth Speakers', icon: 'speaker' },
      { label: 'Home Audio', icon: 'surround_sound' },
      { label: 'Soundbars', icon: 'graphic_eq' },
    ],

    defaultSortBy: 'Most Popular',
    sortOptions: DEFAULT_SORT_OPTIONS,
  },
};
