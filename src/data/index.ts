import type { Product, OrderItem, NavItem, Category, CartItem, Banner, FooterLink, ListingProduct, ProductDetailExtras, TrendingProduct, AccessoriesProduct, OrderConfirmationData, OrderHistoryCardItem, OrderDetailsData, SavedAddress } from '@/types';

export const products: Product[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    category: 'Smartphones',
    price: 999,
    oldPrice: 1099,
    rating: 4.5,
    reviews: 482,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_sccBUw5cUouy-D3tV9IqPYf9z76Td0JO4f-8kBsEpnkKGeNSVswQN9fteby4-vYYHGhgUcL6RW8H-AF9YZs76GqBgJDLLGIUdzAJ2fhRTrI4lzOeXlSp2oH37yvjAB8HHqhP8aILLDJ0Xl6Pk6QSykxSoh1BUp4R96QsC-svGs8y2rD6y9dNoM2zEdFrBpoTbIiEB9dgmvNn8tRd0bJ11I52Eb4AzgypgnYBR7BdwvqeUsu7QNu6KPFM5xjvWPnw8y3th212CcY',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB_sccBUw5cUouy-D3tV9IqPYf9z76Td0JO4f-8kBsEpnkKGeNSVswQN9fteby4-vYYHGhgUcL6RW8H-AF9YZs76GqBgJDLLGIUdzAJ2fhRTrI4lzOeXlSp2oH37yvjAB8HHqhP8aILLDJ0Xl6Pk6QSykxSoh1BUp4R96QsC-svGs8y2rD6y9dNoM2zEdFrBpoTbIiEB9dgmvNn8tRd0bJ11I52Eb4AzgypgnYBR7BdwvqeUsu7QNu6KPFM5xjvWPnw8y3th212CcY',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD7KKy8miyr0Ige2nTlWC_JdDIPWdiB_bJ4rjNuBCk1qq5axUB00zPQLh9L5AOsoPwkQP_0tlf3QGtXv_4YfKoXp5Y52mR0Rk8lBFE8_DMXhzaJD7BxeoHlJuGv0uAQeYeBThW9yOzjSevwlNHGu9NYo6AgvUoz3wBfr-4dyLMxYQ5oEwF5ITEy0UQkXn0EHnzlOLZ05i7YcKtL95A7OcK3WT0oK6ACWhj9NBavM3p_YscA19pnyTvfP5O_21bphsTqcSq5SauTxDw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAzniQGUEmRLwkDKRrDnVraTjOxAqhZiB3W5hv10JLEXalX0n9O-9VsYYgqhM39WRKZEc1hlqO6RboR_l3CO9XHR6BB7C3vy01qjqRyHsEgUVIoM3wlBTJ3G_A3t2PxbRDblT93whR3Ue50233-kIZdqzc9tYpsacMUnHkVUslxwKDhYRBgCixgT3O5JOwnf7u51KoCnV2RhFJERNOVua-XMGAZ_KMjgRnLxygkky3o4TKn7hPvn8hXA2zUDbwn6CKq3vbBqF48AME',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD45I8oLA3zEJFrYAH9ht3g--BvdZ-oZ5YQ3qwyHimALm9UrEV9hroG2JXcoqtrQLKzbQ2w2RkKwWPb5FmZK7L8XreY3CazWLeuy7tIkS1IiHBB0OtG-8yf2cGRojUa3V2HQbxlxR8UahvqIJ4SHroqCLwquZIMadaZKOumlqTSROX52WxjUa_OIh1sEdXC4JPYmuv4gAoX5MAc4nu05Cz6MErIDoKx9DdooqoY9waacqVttxbTxLYrrsznRAmE0xeRrM1ucsV7mbk',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCdsDSTbwEStwYtKabB_mh9Z92_OYd5fiSPHWRnL1Fi0TxvE_cCXkrE2qxKUEobMWo_d9SqVTF1coE_oeJIR9Dn6i8Q4doKHGTsrSolvbJsaQ5YXa_ik-BctwiWupgK5UHWAiB_8CmZ5SNJ6FoieAIR1yFCBo4SaJyI072y4ptHuhyp8Y_nbBJODF1FBEmPXy-nDes9PjJWhGs7paUVeEPhoZU2zbMFUMrS7FDBNhGGMIJsqm73w4afkb7t9K41u2IxDAsuj8D4Cqc',
    ],
    tag: 'New Release',
    isBestSeller: true,
    sku: 'TH-IP15P-256-NT',
    inStock: true,
    description: 'Titanium. So strong. So light. So Pro. A17 Pro chip. Customizable Action button. Pro camera system.',
    colors: [
      { name: 'Natural Titanium', hex: '#BEB7A4' },
      { name: 'Black Titanium', hex: '#24292E' },
      { name: 'White Titanium', hex: '#E5E5E5' },
      { name: 'Blue Titanium', hex: '#39424F' },
    ],
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
  },
  {
    id: 'iphone-15-pro-256',
    name: 'iPhone 15 Pro - 256GB',
    category: 'Smartphones',
    price: 1199,
    rating: 5,
    reviews: 1204,
    image: 'https://picsum.photos/400/400?random=1',
    isBestSeller: true,
  },
  {
    id: 'galaxy-s24-ultra',
    name: 'Galaxy S24 Ultra',
    category: 'Smartphones',
    price: 1299.99,
    rating: 4.5,
    reviews: 856,
    image: 'https://picsum.photos/400/400?random=2',
    tag: 'In Stock',
  },
  {
    id: 'ipad-pro-12',
    name: 'iPad Pro 12.9" M2',
    category: 'Tablets',
    price: 1099,
    rating: 4.9,
    reviews: 612,
    image: 'https://picsum.photos/400/400?random=ipad',
    tag: 'In Stock',
  },
  {
    id: 'galaxy-tab-s9',
    name: 'Samsung Galaxy Tab S9',
    category: 'Tablets',
    price: 799,
    oldPrice: 899,
    rating: 4.6,
    reviews: 289,
    image: 'https://picsum.photos/400/400?random=tab',
    tag: '-11% OFF',
  },
  {
    id: 'wireless-headphones',
    name: 'High Quality Wireless Headphones',
    category: 'Audio',
    price: 450,
    rating: 4.8,
    reviews: 1203,
    image: 'https://picsum.photos/400/400?random=hp1',
  },
  {
    id: 'smart-watch',
    name: 'Smart Watch with Colorful Display',
    category: 'Accessories',
    price: 199,
    oldPrice: 249,
    rating: 4.4,
    reviews: 892,
    image: 'https://picsum.photos/400/400?random=watch',
    tag: '-20% OFF',
  },
  {
    id: 'mechanical-keyboard',
    name: 'Pro Mechanical Keyboard RGB',
    category: 'Accessories',
    price: 149,
    rating: 4.6,
    reviews: 567,
    image: 'https://picsum.photos/400/400?random=kb1',
  },
  {
    id: 'pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    category: 'Smartphones',
    price: 999,
    rating: 4.7,
    reviews: 423,
    image: 'https://picsum.photos/400/400?random=pixel',
  },
  {
    id: 'noise-cancelling-earbuds',
    name: 'Noise Cancelling True Wireless Earbuds',
    category: 'Audio',
    price: 279,
    oldPrice: 329,
    rating: 4.6,
    reviews: 1567,
    image: 'https://picsum.photos/400/400?random=earbuds',
    tag: '-15% OFF',
  },
  {
    id: 'webcam-pro',
    name: '4K Webcam Pro',
    category: 'Accessories',
    price: 129,
    rating: 4.4,
    reviews: 445,
    image: 'https://picsum.photos/400/400?random=webcam',
  },
];

/** Order history dashboard list (simple row layout) */
export const orderHistoryOrders: OrderItem[] = [
  { id: 'TH-94281-02', date: 'Oct 12, 2023', total: 1299, status: 'Delivered', itemsCount: 1, productImage: 'https://picsum.photos/100/100?random=oh1', productName: 'Gaming Laptop' },
  { id: 'TH-94852-05', date: 'Oct 24, 2023', total: 189.5, status: 'Processing', itemsCount: 1, productImage: 'https://picsum.photos/100/100?random=oh2', productName: 'Accessories' },
  { id: 'TH-94521-01', date: 'Oct 18, 2023', total: 2450, status: 'Shipped', itemsCount: 2, productImage: 'https://picsum.photos/100/100?random=oh3', productName: 'TV & Soundbar' },
  { id: 'TH-94112-09', date: 'Sep 28, 2023', total: 45, status: 'Cancelled', itemsCount: 1, productImage: 'https://picsum.photos/100/100?random=oh4', productName: 'Cable' },
];

const MACBOOK_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7ewH6GI-8JoYGPNcKgL2stU-rAa5VgApfJ9HlvbFlFOQ51GBJAJKvlXbFiKpll7Yskm-7FoMOrGHjD7_6GNNQcBYDbNV1U2kDdcjI74a3io92_O6Q72c0w3f5uz_qJN4sms2QWsJm4niBzP5nyyPlrR0qZ0AtFEJzD7Cee2jRKbGD5kNoRqclcdQeF_EEBQJcEYZnt9gwTQq5mf-cH99okKC7Sr3xmR6GqCQeDQEPoOgsLxDCwpclB9rnr5d0Smc7Skb7ItkRqbM';
const SONY_HEADPHONES_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC66drVJfOKJMZioiXGzlcdVPQ4q_QSqjreytjjJJNCWMLhAqDgkmn09KL21nElNcUc0Megk_gJrDjOda9-igGcwLhX9RFiORJpWCxBAxm20vS2DA1qXrca4Y0-EKLBy_PEQBbgLgl_Q5W5uJ1leHNg_g58nrI0WhLT0Yqpr4I1Glz9FNIvKkFjemjxpFGAgS5VR4dCRP6l1p_MIe971RvcH1AELxlIJOmsV-hojk4BlYjFxeSxsyls82d-Xbudn1jOrphiJdtHfY4';
const KEYBOARD_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQWAsqumNszJM65Ffn2iatkKSQfhpJ_bFn4achVGTspSHjdyYSo1VZPE48FNh6_XpZ-y0C8BZsK3O9_RKXF4RZGQAk3Zg3GpJmtaNXQEKbA8O_EH_GUx28rXog37L6dpo5bHki5UMeNMQL9ZkImbCHWljy7scXXnMBRLINLEkucKCasvyekdZHZediLs6zFkgX3gCze5QMjyEHl1HL0DaXVif0rAbzUVY11AzquYvGTE7_eR3czPVH0SO4FFgDTtjs-beH9r0hiOk';

/** Order history cards (product-focused layout with specs and secondary action) */
export const orderHistoryCards: OrderHistoryCardItem[] = [
  {
    id: 'TH-984210',
    date: 'October 24, 2024',
    total: 2499,
    status: 'Delivered',
    productImage: MACBOOK_IMG,
    productName: 'MacBook Pro 16" - M3 Max Chip',
    specs: 'Space Black | 32GB RAM | 1TB SSD',
    extraLine: 'Return window closed on Nov 24, 2024',
    extraType: 'return',
    secondaryAction: 'buy_again',
  },
  {
    id: 'TH-985532',
    date: 'November 12, 2024',
    total: 349,
    status: 'Processing',
    productImage: SONY_HEADPHONES_IMG,
    productName: 'Sony WH-1000XM5 Wireless Headphones',
    specs: 'Midnight Blue | Noise Cancelling',
    extraLine: 'Arriving Thursday',
    extraType: 'shipping',
    secondaryAction: 'track',
  },
  {
    id: 'TH-981045',
    date: 'September 05, 2024',
    total: 129.5,
    status: 'Cancelled',
    productImage: KEYBOARD_IMG,
    productName: 'Mechanical RGB Keyboard',
    specs: 'Cherry MX Blue Switches',
    extraLine: 'Refund processed on Sept 07, 2024',
    extraType: 'refund',
    secondaryAction: 'reorder',
  },
];

/** Order details page data keyed by order ID */
const orderDetailsMap: Record<string, OrderDetailsData> = {
  'TH-985532': {
    orderId: 'TH-985532',
    placedDate: 'November 12, 2024',
    statusLabel: 'In Transit',
    stepperSteps: [
      { label: 'Order Placed', sublabel: 'Nov 12, 09:45 AM', completed: true, active: false, icon: 'check' },
      { label: 'Shipped', sublabel: 'Nov 13, 02:20 PM', completed: true, active: false, icon: 'check' },
      { label: 'Out for Delivery', sublabel: 'Arriving Today', completed: false, active: true, icon: 'local_shipping' },
      { label: 'Delivered', sublabel: 'Estimated Nov 15', completed: false, active: false, icon: 'inventory_2' },
    ],
    lineItems: [
      { name: 'Sony WH-1000XM5 Wireless Headphones', image: SONY_HEADPHONES_IMG, specs: 'Midnight Blue | Noise Cancelling', quantity: 1, price: 349 },
      { name: 'Keychron K2 Mechanical Keyboard', image: KEYBOARD_IMG, specs: 'RGB Backlit | Aluminum Frame | Gateron Blue', quantity: 1, price: 99 },
    ],
    subtotal: 448,
    shipping: 0,
    tax: 31.36,
    total: 479.36,
    shippingAddress: {
      name: 'Alex Johnson',
      street: '1234 Tech Lane, Silicon Valley',
      cityStateZip: 'San Francisco, CA 94105',
      country: 'United States',
      phone: '+1 (555) 012-3456',
    },
    payment: { brand: 'Visa', last4: '4242', expires: '09/27' },
  },
};

export function getOrderDetails(orderId: string): OrderDetailsData | undefined {
  return orderDetailsMap[orderId];
}

export const savedAddresses: SavedAddress[] = [
  {
    id: 'addr-home',
    label: 'Home',
    tagIcon: 'home',
    tagPrimary: true,
    name: 'Alex Johnson',
    phone: '+1 (555) 000-1234',
    addressLines: ['123 Silicon Valley Drive', 'Suite 400', 'Palo Alto, CA 94301', 'United States'],
    street: '123 Silicon Valley Drive',
    apartment: 'Suite 400',
    city: 'Palo Alto',
    state: 'CA',
    zipCode: '94301',
    country: 'United States',
    isDefault: true,
  },
  {
    id: 'addr-office',
    label: 'Office',
    tagIcon: 'work',
    name: 'Alex Johnson',
    phone: '+1 (555) 987-6543',
    addressLines: ['500 Innovation Way', 'Tech Center Tower', 'San Francisco, CA 94105', 'United States'],
    street: '500 Innovation Way',
    apartment: 'Tech Center Tower',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'United States',
    isDefault: false,
  },
];

export const orders: OrderItem[] = [
  {
    id: 'TH-99420',
    date: 'Oct 15, 2023',
    total: 899,
    status: 'Shipping',
    itemsCount: 1,
    productImage: 'https://picsum.photos/100/100?random=ac1',
    productName: 'Samsung WindFree™ Split Air Conditioner',
  },
  {
    id: 'TH-8829',
    date: 'Oct 12, 2023',
    total: 1299,
    status: 'Processing',
    itemsCount: 1,
    productImage: 'https://picsum.photos/100/100?random=10',
    productName: 'Red stylish gaming laptop',
  },
  {
    id: 'TH-7741',
    date: 'Sep 05, 2023',
    total: 450,
    status: 'Delivered',
    itemsCount: 1,
    productImage: 'https://picsum.photos/100/100?random=11',
    productName: 'High quality wireless headphones',
  },
  {
    id: 'TH-6522',
    date: 'Aug 22, 2023',
    total: 199,
    status: 'Delivered',
    itemsCount: 1,
    productImage: 'https://picsum.photos/100/100?random=12',
    productName: 'Smart watch with colorful display',
  },
  {
    id: 'TH-5511',
    date: 'Aug 10, 2023',
    total: 549.99,
    status: 'Delivered',
    itemsCount: 1,
    productImage: 'https://picsum.photos/100/100?random=13',
    productName: 'Crystal 4K UHD Smart TV 55"',
  },
];

const SMARTCOOL_AC_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc_jK5XVyeOFsfWbJqDrU-jNgnPrfwmddfPzC41dEKa-C64dLysKN0qXleE0FvkgK9GxX5280S8atKY_EuHiwF4PTLltfL6q9BYZYbeQqWwTaXMBoicf5L4GxPCEfNDqTPFSASlrs9Jf-LN_BgIjqbEs5n2DlV0pb8LW7ZnfmViR-CU5c6FN-i6m3zLMpmyeWPghLKm7Hla7tzlWA-6DBNNj0lJ5TKfRArLtSTCScMCIp6jdyq9y-YcuZIPn9SCkulfFuzbKfgFak';
const TECHMOUSE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP_CpAHyWJil6lN2LjqAS3OokR3Y8ScL1utZVlWgbChwZQF89NjKocOJmaDB4Na9_bX2n5jbhies_lv6_f4H68-D2kMOIb5EG5I0Q_d4sj85qMOEtSNsJL2ZWSSpmhPrfH3ssom9hrfVoTzV1Bg3KkXV_v_muukA00OcbGHNijZyHtCVCb0bP_UBfa72kgqs2O8MHrYOnnn3tPuId8KebGwAfEEuJ5OVAjBvPpNo0qO9qmxPy1_wYwKNz5-yP9tcuxfG08n5Rx9Yw';

export const orderConfirmationSample: OrderConfirmationData = {
  orderId: 'TH-89234-2024',
  showInstallationBanner: true,
  installationMessage: 'Our certified technician will contact you within 24 hours to confirm the installation schedule for your SmartCool AC units.',
  lineItems: [
    {
      id: 'li-1',
      name: 'SmartCool AC 5000 Pro',
      image: SMARTCOOL_AC_IMAGE,
      description: '12,000 BTU, Energy Star Certified',
      quantity: 1,
      price: 899,
    },
    {
      id: 'li-2',
      name: 'TechMouse Wireless Elite',
      image: TECHMOUSE_IMAGE,
      variant: 'Midnight Black',
      quantity: 2,
      price: 118, // $59 × 2 line total shown as $118 in design
    },
  ],
  subtotal: 1017,
  shipping: 0,
  tax: 81.36,
  total: 1098.36,
  delivery: {
    estimatedDelivery: 'Thursday, Oct 24 - Saturday, Oct 26',
    shippingAddress: {
      name: 'Alex Johnson',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      stateZip: 'IL 62704',
      country: 'United States',
    },
  },
  payment: {
    brand: 'VISA',
    last4: '4242',
  },
};

export const cartItems: CartItem[] = [
  {
    id: 'cart-1',
    productId: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    variant: 'Natural Titanium, 256GB',
    price: 999,
    quantity: 1,
    image: 'https://picsum.photos/200/200?random=30',
  },
  {
    id: 'cart-2',
    productId: 'wireless-headphones',
    name: 'High Quality Wireless Headphones',
    price: 450,
    quantity: 1,
    image: 'https://picsum.photos/200/200?random=hp1',
  },
  {
    id: 'cart-3',
    productId: 'smart-watch',
    name: 'Smart Watch with Colorful Display',
    variant: 'Midnight Blue',
    price: 199,
    quantity: 2,
    image: 'https://picsum.photos/200/200?random=watch',
  },
];

export const navItems: NavItem[] = [
  { label: 'Hồ sơ cá nhân', icon: 'person', path: '/profile' },
  { label: 'Lịch sử đơn hàng', icon: 'shopping_bag', path: '/orders' },
  { label: 'Sổ địa chỉ', icon: 'location_on', path: '/account/addresses' },
];

export const banners: Banner[] = [
  {
    id: 'b1',
    title: 'The New Era of Mobile',
    subtitle: 'Limited Release',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9EZ0Q4vX9IPndOFjj7_skVf-l7pyevyQ8ULM2DpY-NM09eZjjYMJDJ_boFOXE4o5Psfs5mSqIpQlo2ZDWER7RxkgdL1vPlHd-bd21NvLpz0FL6OWhxl3HVbXXc5NVAUPBuHVCTUtqGvGUFsorSoGjuOyNGA001GS6LbQPg1qhIFBZ3z6P3oDbnTGqy2ycn7egRaB-dDNorDvx3eu_Jgx7YA8RZNQYpP8XzYdLC40WBZyQJzy6HrgULh8QUKS3SKdJ-SofEevLrTw',
    link: '/category/mobile',
    linkText: 'Shop Now',
    theme: 'primary',
  },
  {
    id: 'b2',
    title: 'Stay Cool, Stay Smart',
    subtitle: 'Summer Sale',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdtTa2GrJ-3ZpC9KUsMcU1Q9jIWd-nIEdt8lAUB2KAyGHG7nrNpvqPfQzNZpGOeEYDfLZKw_HIczAQMTMF3oBRF4UPihmKi0ppTpef11ASDtnD8FH9mOOVUwQeVjOif5JfgRCao0FzcVIAdUGyKdTYdKA3AVj6xDbl53kXBxM30h2tzMuMAbSCiVkcNXL-qUGX5zi9LHcEq4flgjEcP6R-p24qXLPv-7inYbN5fb7nP3tojXUyVwVhzKfoCdY70MANTmLOVJj6MD0',
    link: '/category/cooling',
    linkText: 'View Offers',
    theme: 'emerald',
  },
];

export const trendingProducts: TrendingProduct[] = [
  {
    id: 'trending-ultra-vision',
    name: 'Ultra-Vision X Pro Smartphone 256GB Midnight Black',
    category: 'Premium Mobile',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQgdFNeI1tp7P0_PfECd-amB52Qg4-YoEM2aMEeD1hav5smGh2vyP8bmHuvXa_aFXUKvJ3P-xqITz6bz7sqyxmQ_7X_OAOiFI7n_dDWX0j7tnjb4OYRFscB3mzODRGoau1qBOiJppMN4YEZWEvGOHe_zOG4NUMo5DjKbkjVO-lsTTEwN6bWnuQ9t3XhJfD04V9yNa39fDMRiMunRhx9K8FgbTNPXsWB4jmgpDq_GyJyCuThpp2mQLtyotMjalR2fYdUJ7f9STUAWQ',
    price: 999.99,
    oldPrice: 1199.99,
    rating: 4.5,
    reviews: 1240,
    productDetailId: 'iphone-15-pro',
  },
  {
    id: 'trending-noise-max',
    name: 'Noise-Max Active Noise Cancelling Wireless Headphones',
    category: 'Audio',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASl2ObsDQqLlvNJAnJh1kI0hXa9sl0QUbHMk8c6-gGABXTruoMC78bKdF-1z0ZkeZywFg-SCN3P49qFEVGuMcMIQtUSH-fUKIhCmEIDWBPDL1QAtYkpOBQcYyWBtOAYEXPhQdno4qWrusT__VRt7Y3AHEh489WGrCwwFdXvZNTMQzgx91eDTnMo9eKu7eiCDcczdj-RoTA1lVWLAM6p5J-OfLyFPe8rtxtWVEeWSZaiqdXRxJxWR7OALM8wPvxq7ulZ8W7EAXW-1M',
    price: 249,
    rating: 5,
    reviews: 856,
    isBestSeller: true,
    productDetailId: 'wireless-headphones',
  },
  {
    id: 'trending-propad',
    name: 'ProPad Air 11-inch Wi-Fi 128GB - Space Gray',
    category: 'Tablets',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHrJ5wOLcXGsu5AVjIusqcE-HNix6lXrHGUckLV7vbgFSPST5kaVwZwuIjbfTz3h18l_KE7AFA-MlKF__m7OLsbiand9V6kXO8q0-VckXk_jrZCccs-Nftf4AjF7RRKuNfRTiyjKhuIGJxsT_ZYodrSLYzGwjQ3RLGFbE-t7SJ7BUbdJ-4LV-OGEj4OMmJeWqpuoIxOvdm4kBJoaLVI0PYUp3MkRbuvR1QB6Wm6qeAB4RiKa5Zt9QXlZFKT-g09Z8CPvEP0XEvDS0',
    price: 599,
    rating: 4,
    reviews: 432,
    productDetailId: 'ipad-pro-12',
  },
  {
    id: 'trending-echohub',
    name: 'EchoHub Smart Speaker with High-Fidelity Audio',
    category: 'Smart Home',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUaJ4D5yFY_WEffWihE0Oe4MEacf56QI62UkbRaJKPXuW4PIiwSXeihN4qZGNzAnXtrmSjRtqP0yYnrbl7qa6Wd-rhJY5qJCjWRcsDMlwJPNPrcbxKngd0GOZstn_IptsbrT_5wZc-zLFYYdbnySzQH5i7wWaGHDxUvYqX2fCbpDYVd_JTiHyg2HYEe-vqXekYc9jNGjxsJIwZOTmsdI3TNcyHpWa52PolS5ixGk5rwrGHtzeWnwRM9w3_MSs-7dNsxYSqDkA4-oo',
    price: 129,
    rating: 5,
    reviews: 2110,
    productDetailId: 'smart-speaker',
  },
];

export const footerSupportLinks: FooterLink[] = [
  { label: 'Contact Us', href: '#' },
  { label: 'Shipping Info', href: '#' },
  { label: 'Returns & Exchanges', href: '#' },
  { label: 'FAQs', href: '#' },
];

export const footerCategoryLinks: FooterLink[] = [
  { label: 'Smartphones', href: '#' },
  { label: 'Accessories', href: '#' },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((p) => p.isBestSeller || p.tag).slice(0, limit);
}

export function getPopularProducts(limit = 4): Product[] {
  return [...products].sort((a, b) => b.reviews - a.reviews).slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

const categorySlugToName: Record<string, string> = {
  mobile: 'Smartphones',
  tablets: 'Tablets',
  accessories: 'Accessories',
  audio: 'Audio',
};

export function getProductsByCategorySlug(slug: string): Product[] {
  const categoryName = categorySlugToName[slug];
  if (!categoryName) return products;
  return products.filter((p) => p.category === categoryName);
}

// Electronic Deals listing page – 6 products matching the provided UI
export const listingProducts: ListingProduct[] = [
  {
    id: 'deal-iphone-15-pro',
    name: 'Apple iPhone 15 Pro - Titanium Blue, 256GB Storage',
    price: 999,
    oldPrice: 1099,
    rating: 4.5,
    reviews: 1248,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1yed9jjHsF1cfyvAz1rznfm_03Yrx6vvbTkdp-UzQClSoVa-uP_oFB2HB6r6A-1-F1oipHinusOo28RnOhDkMP8st_s_dDABEf9sRJ7fC71rwHH1hkpMAw1Gqp7WnAWoZ5wJBQiZzaaYHn5iWbLAWtqNOkX3kbvINVGIe4n5x6sr2hSXJ55uP9Irh0TwGzJbL1vUnpu8P64wJ2s-jUlPMuVkINkqYFdnpLCUHxysrzCQFKYkOhDrnzPsIq7cUncfyZ3A1N1yja9g',
    dealOfTheDay: true,
    productDetailId: 'iphone-15-pro',
  },
  {
    id: 'deal-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra AI Smartphone, 512GB',
    price: 1299,
    rating: 5,
    reviews: 856,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC02ntryNECo2sraVOtPYoiKGMt2PAus3rS-VpHRIKgSUkkv-ctVNWPSF0uwfhWo4a_wbFUDUjZ7H1-MQJ9WDVP21tnC4AcB1gL0rc5K8n_6qEHT1WMUnxAmIx_xoWZAFqO4kC3utcJ7ILYQgMRYz-bP1P2e6Udxoupc585zST24_bK5UtI20r0TmUgHrDH1mInrJJLfHyUYrNzC86pJkiO-zNpxy7Xf-bMB_LpK-F5LQdQATt9O-pmjsWapy3W5WcvCY-6bEmF6UE',
    productDetailId: 'galaxy-s24-ultra',
  },
  {
    id: 'deal-ipad-pro',
    name: 'Apple iPad Pro M2 Chip, 12.9-inch Liquid Retina XDR',
    price: 749,
    oldPrice: 899,
    rating: 4,
    reviews: 512,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_t6SRb3i0bqXKqr0iBMWKDjgBg3Cx3Y78bPZVNHRB2FU2m5xM397YfWGbpofVDnzIY3chIwL6-_rzei5dmHvftr4q4t3iblSTBvTPu2XYwHQBPKh97zhrVJWru37yqg4WJa8yokSAIZrDRi9oDvo1wAEg-PcZq1rwV0lhhhSKJ1bQr9WvTJppj6RkstNawuoclaq8EYJiYE_aXc9cwIGoUt653ypXFOlwew2Ya10d4k8ld38v10OJNTx97y8-yJv-JLkQLe4dk-Y',
    dealOfTheDay: true,
    productDetailId: 'ipad-pro-12',
  },
  {
    id: 'deal-dell-xps15',
    name: 'Dell XPS 15 Laptop - Intel Core i9, 32GB RAM, 1TB SSD',
    price: 2199,
    rating: 4,
    reviews: 245,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjPprfJZNeyWE4LEler0DfPws5R6QZShTUqaW-3zJMrygW28bvK-K_5d6dsEc_xpAXgLibRfoHipx1KUnBUX-8Mt4Vr2xmKMRaTTxAWxuDZNX8XcxIGySyAavNBDNBsS2Vng_BkkP45UMcKZorJpEepQsFoOfYKF0ZU73x750GcrC3s5V3c7a5aPZkQpEgqN3iXB5wcHDRyFL6G0ZKvROrrJuwceNjc112Ffvl-i46mWLkVEGeO6BgIAGxto6oMKp8T2LT_m9TsG4',
  },
  {
    id: 'deal-daikin-ac',
    name: 'Daikin 1.5 Ton 5 Star Inverter Split AC, PM 2.5 Filter',
    price: 589,
    oldPrice: 750,
    rating: 4,
    reviews: 120,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV106Ib2CpAKAgdtEUsOMi-K9ogbFhIZk6InT49ZY3haraGLgHhE8oF7VRjBWi_P6V72JtCBT8_win9dMtJdkcPJ5tMIuH1207sPbE3gtC_EFjFXsqjQYUeYP1LsTwMLxoniNkrxbGLSJU3B7DbLavTYDMQUkekYrH_ttU5KROOI5UGVTcR9aUtGxfIVMVA3LP-vIsOugLFkmWbU7r7h37-T3c9ebjCKwx4KJmS8PzvJQIPEu9tH960LSrrNtBKC-YqVvNxCIlTJI',
    dealOfTheDay: true,
  },
  {
    id: 'deal-sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Noise Cancelling Wireless Headphones',
    price: 349.99,
    rating: 5,
    reviews: 2450,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyDhlBfxAmZertL2yMTFCTnL5-umqoPK6IK9MqR7lnrOl2-7b_ptE818mSKuDgqkwyCBqrwEtiTotFR_jTCsfjHvFqagb58bBYlrVuvfhva4-vijpwaTXb-vDceMSfRzn0VGSiCY9JfVXqqb4EqRxDgU6sgdtIShqhOeA-N4mvU2wsSpjy1TSEYGzINp1wXUSdw-q9BrZyz5LSlG766FyHuVH9e3RynID_qUKMUwVnI_1ZLr1Kr7v3xf8qqyRkqrjj4tCYeH1TkOU',
  },
];

// Mobile category page – products matching the provided UI
export const mobileCategoryProducts: ListingProduct[] = [
  {
    id: 'mobile-galaxy-z-titanium',
    name: 'Galaxy Z Titanium Ultra',
    price: 1199,
    oldPrice: 1399,
    rating: 5,
    reviews: 128,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBERYCegierZB-jozgw-GAPhEUiJeWz-mqb35bTDc1DpRi8tKnsRokV8uWmLfIV9gdpIP5H4qtbgKUYOLaCG9MI1ReUkFzd45-6ZJwKJDmsU4p5P-jbMUFr7YJpjXPU_54BgNlHiYk5cyAnbu0_4cRzWhQRDotNY-ynGft9FvxLXRqFBltFPhyVmbin7M94nKdTblYMUEpDUmvUORSt81n7IL01-uc1WSYDwQMu7HUyoBz7DAvMcQof3m8w-om_9HJYF2LfSKoq4ys',
    badge: 'New Arrival',
    specs: '12GB RAM | 512GB | Titanium Gray',
    productDetailId: 'galaxy-s24-ultra',
  },
  {
    id: 'mobile-phone-pro-max-15',
    name: 'Phone Pro Max 15',
    price: 999,
    rating: 4,
    reviews: 94,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD747rf-0b77FSU8ycL-QifELp0GtqVjXy3qLc2JrUdfLlj6rJJkFqEq3YdzJZun9ahygu31chZGclGD9qYAR6e0-FTsK70rA4KDvJDXbyTDvBuwXJdD87eDL2PQanz8xDRFPeVRSlH5N69heqNbzHgSF3FnMVnLUyqBD0Npgi8qF6mxbbxnqDJ5kvU7PS9nV6fdohzw_GwtxcNDE7cXEudvPDPCjnnpxqULUvwHT7XuWSGD991x0QFxNfX_UpRv5xbUgOMXrBrToM',
    badge: 'Save 15%',
    specs: '8GB RAM | 256GB | Pacific Blue',
    productDetailId: 'iphone-15-pro',
  },
  {
    id: 'mobile-pixel-8-pro',
    name: 'Pixel 8 Pro AI',
    price: 849,
    oldPrice: 899,
    rating: 4.5,
    reviews: 210,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD89G8ECtD6pCUIQ3Ut3_J-leM_5EL7IBMqKjzUOzsgSqtk2vR4COkNdTWfZBDs8wJ5w3f5KHXGI_JBabtH5edqzndnCVG49au9CQkSAcBVPhqrBo-j3PY56uI9K9wmNjOWljV1Av-DdBh1HV0Dzhojxdip1unR1zskOaaec_gUaqN8PO3va_ln-XOvHkYIamJv0vJyRK78xIQReVJwaw2RpuevTlGVGipnoosPuO0gU8uRiIkeYit3CDLVhVca_9a2ccfRcwJ_TgQ',
    specs: '12GB RAM | 128GB | Obsidian',
    productDetailId: 'pixel-8-pro',
  },
  {
    id: 'mobile-mi-pro-13',
    name: 'Mi Pro 13 Series',
    price: 599,
    rating: 3,
    reviews: 42,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRqgGlZrG3F7K4FD0iWAqcTaJDHXl5JFa-79SCbuHynR93-aCXey8zq3Ppuo-xcQz24tj3GYDk0SpLVAZbe-FkiKUH31mmdq03n8IkE0lEGDhZE0ViIet0bpp8fl8BfYGSNXZOmB6DsnkEcfHc5j2JYZs2wOZBm0m22e_rUigjBi6kfkRRUyBe0CMw0wrNoA9wqq7ZkkdkPrycTlMFDFKuG_Yx1wwPHgen1LDWQhAnnVfez95JduR-Ni6hAcKKDG49CSf6bdzQxRM',
    badge: 'Refurbished',
    specs: '8GB RAM | 256GB | Gold Edition',
  },
  {
    id: 'mobile-xphone-core-xr',
    name: 'X-Phone Core XR',
    price: 449,
    rating: 5,
    reviews: 56,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH6kBlEDHrudWSr41Sp8h5_kMBXOEu7ZaUQ3t5J0QVnLkJu38ildwD1JOIMgx-t39BOhcKesGxvogEeFsavJ4ni57Ck6jbnUEsjDEgjM48AgY9fs6z5hs5oExeEMLFCvCUaBzklhrQhUt3MBXnpxQZ9WaHf6vkRnVUTv-9l7pyqoytP-Ex8GocaSfiR9l3il4ysaTGn68-ZGi1SEqTvRfds9HmGL2xJuriKbOvtDt2rtgIjz4IoR8yAelStPA1EztmgRb3ibeK2Rg',
    specs: '4GB RAM | 128GB | Ruby Red',
  },
  {
    id: 'mobile-z-fold-enterprise',
    name: 'Z-Fold Enterprise',
    price: 1799,
    rating: 4,
    reviews: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZCvi8EXqhuG2onqdT7LDQuOiHz2_n7zm8IRQKimeyZ1Hl3VQu7Q2__l7rO_yxEAy8lmfor1j1sVGje-66eXD-MG4U5_2mM0ylSQG9Dv34DD_rjsZjA3VdYPsXSbsTDqM_S5qmv5Gxs1V6PEteV5RwULfVgX6x2j9lS1P1g5GWeuPrAiifDDZ5Syoa8d_XBwOSJV5ygMlvtO9RANiTh-TDwNophe3qcezbQfdCII8V5BuVKL7Pdh_lQwOYi5GgtKjPllfe2DA-Uhs',
    badge: 'In Stock',
    specs: '16GB RAM | 1TB | Phantom Silver',
  },
];

// Product detail page extras (specs, reviews, related) – for iPhone 15 Pro and similar
export function getProductDetailExtras(productId: string): ProductDetailExtras | null {
  if (productId !== 'iphone-15-pro') return null;
  return {
    brand: 'Apple',
    specs: [
      { label: 'Display', value: '6.1-inch Super Retina XDR display with ProMotion' },
      { label: 'Chip', value: 'A17 Pro chip with 6-core GPU' },
      { label: 'Camera', value: 'Pro camera system (48MP Main, 12MP Ultra Wide, and 12MP Telephoto)' },
      { label: 'Battery', value: 'Up to 23 hours video playback' },
      { label: 'Connector', value: 'USB-C (supports USB 3)' },
      { label: 'Safety', value: 'Emergency SOS via satellite, Crash Detection' },
    ],
    reviewScore: 4.8,
    reviewDistribution: { 5: 85, 4: 10, 3: 3 },
    reviews: [
      { author: 'Jordan D.', initials: 'JD', rating: 5, date: '2 days ago', text: "The titanium finish is incredible. It's noticeably lighter than my previous iPhone 13 Pro. The camera performance in low light has taken a massive leap forward. Highly recommend!", verified: true },
      { author: 'Marcus S.', initials: 'MS', rating: 4, date: '1 week ago', text: 'Great phone, but the price is definitely steep. USB-C makes life much easier for charging. The screen is buttery smooth with the ProMotion display.', verified: true },
    ],
    customerPhotos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxN7CskxlGWRIbGQr92_Y8TM8VOi1EdjYpqwiBJxVC5xNIfBTKUFl6LXjv2wzDzt4Gnu4YHDiv6w9edYiEFtFApogVNkrAUGOJ0l2FAKJS0P6FicAAwk3E3FR15BHrJvsroXWX0jkDXb7hBWdq8huanLWvhTqbGMuBO_FOi_PZ3JtQr0M-5PKnp57-cBOBcka3d3VTqH7ut9vmqMPBYBDu3otAvTaxxofoQfWplOLugKsnzXGu3WPaQTfv_qoU5g_t2dqxW-wkiqo',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAICfQAcEC_GkaXrL3jMlSqPoTvdI6WttpHwaT_K0ueVWFaBhjzeE0gWr6EDDcop1J7Xdnri7dtKAodivvjCn61G4gHLsy9Hjf503x5oWn4BNiWKUorBSyFHA49kSKyL6ClH6e1id0v0UJFoulIR1Spk8ICFGbFe-cLG3m8n6AgeWghprhTIVxcSoTFv22F_ABqxQqImiVVRY613PBfiq4qyrdtXkX52TH7QhlFQjVlIGkzQMztvo2ZbI25dkqA7-zmkS6mhUOFrWw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBibcHCI_6-FlVAvjesbyxqP2YwOM5CiGO9flL-URdLuRaCVefTt2MZYMddDqpIqXnYnMd7w4OhHw0-m2_Eigjsyys_4enaj36cDBbuRiXWulmyZZvQzkYqqLCSYhA6GoBKCsJstYK07WlaOQHwCufD3-rPuCJ6qBPSiPm6TNlm2Bmi8QiL9_arZ1GPQJNv33KowyZrJZ8WJ0KIHyNQElYPYsazKXZ5LLT_6npdob2wkQFx7zjS516O1TNGfhdmwnyZ1PcXZz_KH0s',
    ],
    relatedProducts: [
      { id: 'magsafe-case', name: 'MagSafe Silicone Case', subtitle: 'Midnight Blue', price: 49, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBA7pnRp2FjNuPCyq04u8DzLhsuBu3IHjPGg3Pcq_-MCs097lyNEV8kkaW4ygXH8U6gPslaaSLRTa1ZiWjEegL8T7VaLTxbJh2C4CsPsQriEDi3gQJ9o9ShFwkjMYZQ9y-lnx88KdXh2y19juiAKcFDpihqpU7mT09tuvWmygwl3YcCUXBOwZPQdRcmOe1wmodCJJdAVTogyk6tX0IfdnmOhUwXxTP8rO-KgZW2n0ykxvysmm-UQhVh6ZrCMo5_QrYILMbkb6CNQ8' },
      { id: 'magsafe-charger', name: 'MagSafe Wireless Charger', subtitle: '15W Fast Charge', price: 39, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6jl-NMUY-xy011yKrf6fhrd4gn-h-GErIfeBNzICP_7XYj-sHJPbwRUyDOwUWaZhWzFWxM1-tvCS5WNb8PWrhdxVFHhveu7kq1gLP-TAKV8SP17HgMhSlhpaG7edpCk2Dy7AwgNevt99DABT2LOvfiTDSp1OXmwHxsSXE3m4GVw4KRsAZG-Fs0tSzEA2CyrTWjoCmxQplWPbTJA6J7QdZgysuefOAr9xQjB0_fTHPcIk54bSTZopiORwJhwKlR4lOn531LZY7LSc' },
      { id: 'usbc-adapter', name: '20W USB-C Power Adapter', subtitle: 'Compact Design', price: 19, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZSBqzK-3XEq8l78GNRLfDnkbE7EvH1iCM4zo99XxtrJGzK4GI17-So5n12mW0JY8xsLq_b6SUoe4vLBUh02r1qbQxUZo8Y6foa2P-Pup-80R3RtildvECNnhwNHqLwOQA9yPReXT6vA32T83VkYrjbSzmltlGmwZKVpEzR1YsFKeYuGR_R6qhwxp8Byu6LBv0xPE8iCibyzcHruAiVa4WaRI-rOC9LZqAXbosG1LL6bvDZBpd0hu7a00y7UHr4lUOfokBtprQNxs' },
      { id: 'airpods-pro', name: 'AirPods Pro (2nd Gen)', subtitle: 'Active Noise Cancelling', price: 249, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-WWMBQDZ2yCOZdHPCvqkrVfvx1noPKQXUEoEG3mdacnUJSPNwgNtIUCcaZZ_gscvSDTyPSOdioZvGX8u16i5BTBK_aw3iG2CulBwNzFs7VwDkXLLNTXOqmFk-jhAdXIKN6ohdbEcnzIAwIJl42tCcADcFZHdZ-edlklK5cFD_MVMQFA-_HUTQMjWoDWWSy7yJesdeWynC--x74zt0jRyPc8-Gd2dcBAfx4RHE32pJJVh1NAEdOh1OX0_h5GM1oSGZ6Uf5oYU0taM' },
    ],
  };
}


// Accessories category page – products matching the provided UI
export const accessoriesCategoryProducts: AccessoriesProduct[] = [
  {
    id: 'acc-nuphy-air75',
    name: 'NuPhy Air75 V2 Mechanical Keyboard',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeZKJchJGormjoAKhAfFeynYrRsdzz0pa3Ci-6WzatjzhG3aLxYc_FXbmx7XU1VB6VHw01elEP9fZrFSKJd5GNbGlipjW5-9CEY4f3gIJhpkgk_UyTh8M8MjMtsCDzKgM5rbIAEOES19_EVAa91o5m0pnLqRp1B3PWrYjQ_98wDjvabZN_RPKEw57Zz1KOClw1gah7eN_yw-LHY4y0So428wrC9DmNNTxWUmzwfJKfXOjbX13DcZXdkI8jtisF0QXAdLqvAi2I6to',
    price: 129.99,
    rating: 4.5,
    reviews: 124,
    badge: 'TOP RATED',
    badgeVariant: 'primary',
    tags: ['Windows/macOS', 'Bluetooth 5.0'],
    productDetailId: 'mechanical-keyboard',
  },
  {
    id: 'acc-logitech-mx',
    name: 'Logitech MX Master 3S Wireless',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE2chSVHmIHKToKRYyB9EDjVxoAv_R2qCwzib6BKQpvd3aCPXkUDL6ruMDIcg5gOxSm0xlEPQGdGK_uwDm2mY5LhZHQaslmEvc-ePuybI3eEXJ3KK1wvaD9sxFkPeXSbx9-uO-mw1i_gjHUEhwD4w327ULq0qrtNZPyzy677OAIk6jndO4mEn57v7RvFeK6U_qXpjnmWH0tyzNpnMFCdEnxHkgW0kycT_1IX4wHmYGWpUh0fe1Z2Nwn_g9lLSpXbDuJfs77PxUSF4',
    price: 99,
    rating: 4,
    reviews: 48,
    tags: ['8000 DPI', 'Logi Bolt'],
  },
  {
    id: 'acc-nomad-case',
    name: 'Nomad Modern Leather Case',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0TX9sHaJLQZ8UqZpe2FrHZMgZUtqUScUgNL42dJ2N-vy5XPL5lZX0_UBJ90SWlDPKbAVkDMJz06wfL_mZT-BU6ekPb7qlGbDEQp8BcvpuxQcnpVFHAJOhuX1ebCcq0avYPs_6zFAlZdicnOtB8HcNbyizi8xgp4w73WTvB0cHNo_otmMZOC-hPHfpvW_5ADZEK68QxO_46i9i4c6FSUflERHZpEHGXWOBHIqL5m9uSGM1_daR7BbWYKzGgWWLoQJtGO4gF-NWFME',
    price: 49,
    oldPrice: 59,
    rating: 5,
    reviews: 210,
    badge: '20% OFF',
    badgeVariant: 'red',
    tags: ['For iPhone 15 Pro', 'MagSafe'],
    productDetailId: 'smart-watch',
  },
  {
    id: 'acc-anker-737',
    name: 'Anker 737 Power Bank (PowerCore 24K)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt7Y0AAv9ou6EbeuCNIUe66mvTwXbKfDab8LSCOVenA0jl_yMgReSktqAVrVjqWxR1tcuLqfJlI6CqQPKMOvSloVf3G3wFqT9Q4zOvqtQYAO7qSRpn3fTWbjdYxTT2a6zTZPr5ZvkfEB8rhV-QwJoVqG6C2ZE1yGGWZYVSl-T7OdgxoqwrWSobHuzTzAdpjvUEOiXHdPT3se0eJ6HjJzKmLqMkdZmJHg8RvrwMPpeJzSEniH8w2iANepMpKM6-d-pYKV65t2Pa_Lk',
    price: 149.99,
    rating: 4,
    reviews: 89,
    tags: ['140W PD', '24,000mAh'],
  },
  {
    id: 'acc-satechi-cable',
    name: 'Satechi USB-C to USB-C Charging Cable',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC72RayUOEtSobNZPajlE2uhelsdg9Lm5fCKRGk_fx3TlDinJhZNYrCs2Cq09h6RsznUEveRX4MAH7MWf6Vfffean8gefxjeh0fY4-On_VuYaWXa5NZ5f6444bUIVju6eN-RAw0GLjfItavYSrZ4UuGt-gvVi7ELK8XB49BYe1FP7qtVcRvyz4gBXIYWqLp8aONB_gUXa4CEIQ_4M7-EBr7ziH3fDWac89J4ip1mhfwzxyB9HIXaNh37vQCUCXe74IJTW61oj7G9xg',
    price: 24.99,
    rating: 5,
    reviews: 342,
    tags: ['100W PD', '2 Meters'],
  },
  {
    id: 'acc-harber-sleeve',
    name: 'Harber London Leather Laptop Sleeve',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTZpafrbq9o5ShweqToYwUtmp2JC0RtVS_R-Hxgi84sqThNR9rOyEgfxZ8VRFvQWGhTmV39l4i63BugAKZKo9EPWB0uH8pIQd4_lLNBugwFcxdZvI4uXgxd9pJFYlkbBwKjmM-QPpMmnrrUhOkvskRBrXa2fXLDYYTZ6byqCMUIKWMphG3TBk6jCK45xL_UP9yOLGsWgeFNlwrwaXcRoOOqyMM00XbVlA47ISk_xh2oBhpAjbtiQAg7EiwuNagqnqLKkV_jB0vksg',
    price: 85,
    rating: 4,
    reviews: 55,
    tags: ['For MacBook Pro 14"', 'Full Grain Leather'],
  },
];

// Audio category page – products matching the provided UI (reuses AccessoriesProduct shape)
export const audioCategoryProducts: AccessoriesProduct[] = [
  {
    id: 'audio-quietcomfort',
    name: 'QuietComfort Wireless Noise Cancelling',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeZKJchJGormjoAKhAfFeynYrRsdzz0pa3Ci-6WzatjzhG3aLxYc_FXbmx7XU1VB6VHw01elEP9fZrFSKJd5GNbGlipjW5-9CEY4f3gIJhpkgk_UyTh8M8MjMtsCDzKgM5rbIAEOES19_EVAa91o5m0pnLqRp1B3PWrYjQ_98wDjvabZN_RPKEw57Zz1KOClw1gah7eN_yw-LHY4y0So428wrC9DmNNTxWUmzwfJKfXOjbX13DcZXdkI8jtisF0QXAdLqvAi2I6to',
    price: 349,
    rating: 5,
    reviews: 842,
    badge: 'BEST SELLER',
    badgeVariant: 'primary',
    tags: ['Wireless', 'Hi-Res'],
    productDetailId: 'wireless-headphones',
  },
  {
    id: 'audio-elite-earbuds',
    name: 'Elite Active Pro Earbuds',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE2chSVHmIHKToKRYyB9EDjVxoAv_R2qCwzib6BKQpvd3aCPXkUDL6ruMDIcg5gOxSm0xlEPQGdGK_uwDm2mY5LhZHQaslmEvc-ePuybI3eEXJ3KK1wvaD9sxFkPeXSbx9-uO-mw1i_gjHUEhwD4w327ULq0qrtNZPyzy677OAIk6jndO4mEn57v7RvFeK6U_qXpjnmWH0tyzNpnMFCdEnxHkgW0kycT_1IX4wHmYGWpUh0fe1Z2Nwn_g9lLSpXbDuJfs77PxUSF4',
    price: 199,
    rating: 4.5,
    reviews: 1240,
    tags: ['Wireless'],
  },
  {
    id: 'audio-soundlink-revolve',
    name: 'SoundLink Revolve+ Series II',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0TX9sHaJLQZ8UqZpe2FrHZMgZUtqUScUgNL42dJ2N-vy5XPL5lZX0_UBJ90SWlDPKbAVkDMJz06wfL_mZT-BU6ekPb7qlGbDEQp8BcvpuxQcnpVFHAJOhuX1ebCcq0avYPs_6zFAlZdicnOtB8HcNbyizi8xgp4w73WTvB0cHNo_otmMZOC-hPHfpvW_5ADZEK68QxO_46i9i4c6FSUflERHZpEHGXWOBHIqL5m9uSGM1_daR7BbWYKzGgWWLoQJtGO4gF-NWFME',
    price: 229,
    rating: 4,
    reviews: 315,
    tags: ['Wireless', 'Waterproof'],
    productDetailId: 'smart-speaker',
  },
  {
    id: 'audio-beam-soundbar',
    name: 'Beam (Gen 2) Compact Soundbar',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt7Y0AAv9ou6EbeuCNIUe66mvTwXbKfDab8LSCOVenA0jl_yMgReSktqAVrVjqWxR1tcuLqfJlI6CqQPKMOvSloVf3G3wFqT9Q4zOvqtQYAO7qSRpn3fTWbjdYxTT2a6zTZPr5ZvkfEB8rhV-QwJoVqG6C2ZE1yGGWZYVSl-T7OdgxoqwrWSobHuzTzAdpjvUEOiXHdPT3se0eJ6HjJzKmLqMkdZmJHg8RvrwMPpeJzSEniH8w2iANepMpKM6-d-pYKV65t2Pa_Lk',
    price: 382,
    oldPrice: 449,
    rating: 5,
    reviews: 45,
    badge: '15% OFF',
    badgeVariant: 'red',
    tags: ['Dolby Atmos', 'Wi-Fi'],
  },
  {
    id: 'audio-cr5x',
    name: 'CR5-X Multimedia Monitors',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC72RayUOEtSobNZPajlE2uhelsdg9Lm5fCKRGk_fx3TlDinJhZNYrCs2Cq09h6RsznUEveRX4MAH7MWf6Vfffean8gefxjeh0fY4-On_VuYaWXa5NZ5f6444bUIVju6eN-RAw0GLjfItavYSrZ4UuGt-gvVi7ELK8XB49BYe1FP7qtVcRvyz4gBXIYWqLp8aONB_gUXa4CEIQ_4M7-EBr7ziH3fDWac89J4ip1mhfwzxyB9HIXaNh37vQCUCXe74IJTW61oj7G9xg',
    price: 189.99,
    rating: 4,
    reviews: 156,
    tags: ['Wired', 'Hi-Res'],
  },
  {
    id: 'audio-lsx-ii',
    name: 'LSX II Wireless HiFi System',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTZpafrbq9o5ShweqToYwUtmp2JC0RtVS_R-Hxgi84sqThNR9rOyEgfxZ8VRFvQWGhTmV39l4i63BugAKZKo9EPWB0uH8pIQd4_lLNBugwFcxdZvI4uXgxd9pJFYlkbBwKjmM-QPpMmnrrUhOkvskRBrXa2fXLDYYTZ6byqCMUIKWMphG3TBk6jCK45xL_UP9yOLGsWgeFNlwrwaXcRoOOqyMM00XbVlA47ISk_xh2oBhpAjbtiQAg7EiwuNagqnqLKkV_jB0vksg',
    price: 1399,
    rating: 5,
    reviews: 22,
    tags: ['Wireless', 'Hi-Res'],
  },
];

