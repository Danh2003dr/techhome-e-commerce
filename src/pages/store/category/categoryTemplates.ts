export type CategoryTemplateKey = 'mobile' | 'accessories' | 'audio';

export type CategoryHeroConfig = {
  kicker: string;
  title: string; // supports '\n'
  description: string;
  ctaText: string;
  ctaHref: string;
  heroImageUrl: string;
};

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

  hero: CategoryHeroConfig;
  /** Fallback when API has no child categories — not shown as chips until wired to real data */
  subCategories: CategorySubCategory[];

  defaultSortBy: string;
  sortOptions: CategorySortOption[];
};

const HERO_ACCESSORIES =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCi1GpWnEhQSlHntiNLVve9xzux9Uvoto9E-Mw4dCOwR502O-eYrKgv20d47lGjmX0Fsn0gFdDcd8tqCBTRkNIvqZcW0uBuumshu6Rg5c2zf6cXEVNcANj1ZzFLq_3xDURsHq7NJt-RLN0YAVi8ft535Ct-Kxt9FUAqYuX0d6gGiHx5P2gTpggxpKUA_QW1Ep06u5P6O8WYHbCW_nr_tdn5OqfcF5k1h7yqKkW_iQ-q_iNXmagg9U4j3ivnwHdYBpTl_EZlRFPV5oY';

const HERO_MOBILE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDHLyESEYHifHLCZfb_t_OVSm83EIh7cZEL4UoYDHCs36uf4SxLL1DMuyCkEMFXuT0dmQ0mvgIe8NNkRdb1MtDDK591tZdUINYAaoyFIWFyAj36R0eFWMn9HZoBphKn7nwbKb3Nq2G1fTtbyOVhb9gRvM_HMfRXfgABdAXDQm8faMkmbEMPJkXrzA9W4B6yW9btt6CViheK4akmAURCpdfmJx58KMvV2w_d7KgmzxOg622k7l-6MRWn5g9dY1d9zbyiQwbEqm1dJq4';

const HERO_AUDIO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCi1GpWnEhQSlHntiNLVve9xzux9Uvoto9E-Mw4dCOwR502O-eYrKgv20d47lGjmX0Fsn0gFdDcd8tqCBTRkNIvqZcW0uBuumshu6Rg5c2zf6cXEVNcANj1ZzFLq_3xDURsHq7NJt-RLN0YAVi8ft535Ct-Kxt9FUAqYuX0d6gGiHx5P2gTpggxpKUA_QW1Ep06u5P6O8WYHbCW_nr_tdn5OqfcF5k1h7yqKkW_iQ-q_iNXmagg9U4j3ivnwHdYBpTl_EZlRFPV5oY';

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

    hero: {
      kicker: 'Phiên bản giới hạn',
      title: 'Tương lai trong tay bạn',
      description:
        'Trải nghiệm công nghệ smartphone mới nhất. Nâng cấp flagship với ưu đãi thu cũ đổi mới từ TechHome.',
      ctaText: 'Mua ngay',
      ctaHref: '/category/dien-thoai',
      heroImageUrl: HERO_MOBILE,
    },

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

    hero: {
      kicker: 'LIMITED TIME OFFERS',
      title: 'Level Up Your\nTech Setup',
      description:
        'Discover high-performance peripherals and essential gear designed to boost your productivity and elevate your aesthetic.',
      ctaText: 'Shop the Collection',
      ctaHref: '/category/phu-kien',
      heroImageUrl: HERO_ACCESSORIES,
    },

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

    hero: {
      kicker: 'ÂM THANH CAO CẤP',
      title: 'Trải nghiệm\nâm thanh sống động',
      description:
        'Khám phá tai nghe và loa chuyên nghiệp chất lượng cao, thiết kế cho trải nghiệm nghe tuyệt vời.',
      ctaText: 'Mua âm thanh',
      ctaHref: '/category/am-thanh',
      heroImageUrl: HERO_AUDIO,
    },

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
