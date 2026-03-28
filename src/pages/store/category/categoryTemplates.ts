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

type CheckboxOption = {
  label: string;
  defaultChecked?: boolean;
  rightText?: string;
};

export type CategoryFilterSection =
  | {
      id: string;
      type: 'checkbox';
      title: string;
      options: CheckboxOption[];
    }
  | {
      id: string;
      type: 'swatches';
      title: string;
      swatches: { bgClass: string; ringClass?: string }[];
    }
  | {
      id: string;
      type: 'range';
      title: string;
      minLabel: string;
      maxLabel: string;
    }
  | {
      id: string;
      type: 'toggle';
      title: string;
      mode: 'single';
      options: string[];
      initialValue?: string | null;
    }
  | {
      id: string;
      type: 'radio';
      title: string;
      options: string[];
      initialValue?: string | null;
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
  subCategories: CategorySubCategory[];
  filters: CategoryFilterSection[];

  defaultSortBy: string;
  sortOptions: CategorySortOption[];
};

const HERO_ACCESSORIES =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCi1GpWnEhQSlHntiNLVve9xzux9Uvoto9E-Mw4dCOwR502O-eYrKgv20d47lGjmX0Fsn0gFdDcd8tqCBTRkNIvqZcW0uBuumshu6Rg5c2zf6cXEVNcANj1ZzFLq_3xDURsHq7NJt-RLN0YAVi8ft535Ct-Kxt9FUAqYuX0d6gGiHx5P2gTpggxpKUA_QW1Ep06u5P6O8WYHbCW_nr_tdn5OqfcF5k1h7yqKkW_iQ-q_iNXmagg9U4j3ivnwHdYBpTl_EZlRFPV5oY';

const HERO_MOBILE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDHLyESEYHifHLCZfb_t_OVSm83EIh7cZEL4UoYDHCs36uf4SxLL1DMuyCkEMFXuT0dmQ0mvgIe8NNkRdb1MtDDK591tZdUINYAaoyFIWFyAj36R0eFWMn9HZoBphKn7nwbKb3Nq2G1fTtbyOVhb9gRvM_HMfRXfgABdAXDQm8faMkmbEMPJkXrzA9W4B6yW9btt6CViheK4akmAURCpdfmJx58KMvV2w_d7KgmzxOg622k7l-6MRWn5g9dY1d9zbyiQwbEqm1dJq4';

const HERO_AUDIO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCi1GpWnEhQSlHntiNLVve9xzux9Uvoto9E-Mw4dCOwR502O-eYrKgv20d47lGjmX0Fsn0gFdDcd8tqCBTRkNIvqZcW0uBuumshu6Rg5c2zf6cXEVNcANj1ZzFLq_3xDURsHq7NJt-RLN0YAVi8ft535Ct-Kxt9FUAqYuX0d6gGiHx5P2gTpggxpKUA_QW1Ep06u5P6O8WYHbCW_nr_tdn5OqfcF5k1h7yqKkW_iQ-q_iNXmagg9U4j3ivnwHdYBpTl_EZlRFPV5oY';

// Keep a shared set of sort labels for UI consistency across all categories.
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

    filters: [
      {
        id: 'mobile-brand',
        type: 'checkbox',
        title: 'Brand',
        options: [
          { label: 'Apple', rightText: '24' },
          { label: 'Samsung', rightText: '18' },
          { label: 'Xiaomi', rightText: '12' },
          { label: 'Google', rightText: '6' },
        ],
      },
      {
        id: 'mobile-price',
        type: 'range',
        title: 'Price Range',
        minLabel: '0 ₫',
        maxLabel: '50.000.000+ ₫',
      },
      {
        id: 'mobile-ram',
        type: 'toggle',
        mode: 'single',
        title: 'RAM',
        options: ['4 GB', '8 GB', '12 GB', '16 GB'],
        initialValue: '12 GB',
      },
      {
        id: 'mobile-storage',
        type: 'radio',
        title: 'Storage',
        options: ['128 GB', '256 GB', '512 GB'],
        initialValue: null,
      },
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

    filters: [
      {
        id: 'acc-compatibility',
        type: 'checkbox',
        title: 'Compatibility',
        options: [
          { label: 'MacBook Pro (M1/M2/M3)' },
          { label: 'iPhone 15 Series', defaultChecked: true },
          { label: 'iPad Pro 12.9"' },
          { label: 'Universal USB-C' },
        ],
      },
      {
        id: 'acc-brand',
        type: 'checkbox',
        title: 'Brand',
        options: [{ label: 'Satechi' }, { label: 'Logitech' }, { label: 'Anker' }, { label: 'Apple' }],
      },
      {
        id: 'acc-color',
        type: 'swatches',
        title: 'Color',
        swatches: [
          { bgClass: 'bg-slate-900', ringClass: 'border-2 border-primary ring-2 ring-transparent ring-offset-2' },
          { bgClass: 'bg-slate-300', ringClass: 'border-2 border-transparent' },
          { bgClass: 'bg-blue-500', ringClass: 'border-2 border-transparent' },
          { bgClass: 'bg-white border border-slate-200', ringClass: '' },
          { bgClass: 'bg-rose-400', ringClass: 'border-2 border-transparent' },
        ],
      },
      {
        id: 'acc-price',
        type: 'range',
        title: 'Price Range',
        minLabel: '$0',
        maxLabel: '$500+',
      },
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

    filters: [
      {
        id: 'audio-type',
        type: 'checkbox',
        title: 'Audio Type',
        options: [
          { label: 'Over-Ear' },
          { label: 'In-Ear' },
          { label: 'On-Ear' },
          { label: 'Bookshelf Speakers' },
        ],
      },
      {
        id: 'audio-brand',
        type: 'checkbox',
        title: 'Brand',
        options: [{ label: 'Bose' }, { label: 'Sony' }, { label: 'JBL' }, { label: 'Apple' }],
      },
      {
        id: 'audio-battery',
        type: 'checkbox',
        title: 'Battery Life',
        options: [
          { label: 'Up to 10 hours' },
          { label: '10 - 20 hours' },
          { label: '20+ hours' },
        ],
      },
      {
        id: 'audio-connection',
        type: 'checkbox',
        title: 'Connection Type',
        options: [
          { label: 'Wireless (Bluetooth)' },
          { label: 'Wired (3.5mm)' },
          { label: 'Optical / HDMI' },
        ],
      },
    ],

    defaultSortBy: 'Most Popular',
    sortOptions: DEFAULT_SORT_OPTIONS,
  },
};

