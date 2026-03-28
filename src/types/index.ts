export interface Product {
  id: string;
  name: string;
  category: string;
  /** Current selling price (after sale if any). */
  price: number;
  /** List / MSRP when item is on promotion; shown struck-through with `salePrice` or derived sale. */
  oldPrice?: number;
  /** Explicit sale price from catalog (optional; may match `price` when on sale). */
  salePrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  tag?: string;
  isBestSeller?: boolean;
  description?: string;
  sku?: string;
  /** Số từ API catalog; có thể thiếu với dữ liệu mock cũ — khi đó dùng `inStock`. */
  stock?: number;
  inStock?: boolean;
  colors?: { name: string; hex: string }[];
  storageOptions?: string[];
  /** JSON string from API (backend product specs: manHinh, cameraSau, ...) */
  specifications?: string | null;
  /** Admin catalog: SKU rows for PDP / cart line. */
  variants?: Array<{
    sku: string;
    color?: string;
    storage?: string;
    size?: string;
    stock: number;
    price?: number;
  }>;
  /** URL segment for `/product/:slug` (from API catalog). */
  slug?: string;
}

export type OrderStatus = 'Processing' | 'Delivered' | 'Shipping' | 'Shipped' | 'Cancelled';

export interface OrderItem {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
  productImage: string;
  productName?: string;
}

/** Order history card with product details and secondary action */
export interface OrderHistoryCardItem {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  productImage: string;
  productName: string;
  specs: string;
  extraLine: string;
  extraType: 'return' | 'shipping' | 'refund';
  secondaryAction: 'buy_again' | 'track' | 'reorder';
}

export interface OrderConfirmationLineItem {
  id: string;
  name: string;
  image: string;
  description?: string;
  variant?: string;
  quantity: number;
  price: number;
}

export interface OrderConfirmationData {
  orderId: string;
  lineItems: OrderConfirmationLineItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  showInstallationBanner?: boolean;
  installationMessage?: string;
  delivery: {
    estimatedDelivery: string;
    shippingAddress: {
      name: string;
      street: string;
      city: string;
      stateZip: string;
      country: string;
    };
  };
  payment: { brand: string; last4: string };
}

export interface OrderDetailsStep {
  label: string;
  sublabel: string;
  completed: boolean;
  active: boolean;
  icon: string;
}

export interface OrderDetailsLineItem {
  name: string;
  image: string;
  specs: string;
  quantity: number;
  price: number;
}

export interface OrderDetailsData {
  orderId: string;
  placedDate: string;
  statusLabel: string;
  stepperSteps: OrderDetailsStep[];
  lineItems: OrderDetailsLineItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    cityStateZip: string;
    country: string;
    phone: string;
  };
  payment: {
    brand: string;
    last4: string;
    expires: string;
  };
}

export interface SavedAddress {
  id: string;
  label: string;
  tagIcon: string;
  tagPrimary?: boolean;
  name: string;
  phone: string;
  addressLines: string[];
  street?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface NavItem {
  label: string;
  icon: string;
  path: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  /** null/undefined for top-level categories (danh mục cha) */
  parentId?: string | number | null;
  /** Ảnh đại diện từ API; khi có thì UI ưu tiên thay cho icon */
  imageUrl?: string | null;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  linkText: string;
  theme: 'indigo' | 'emerald' | 'primary';
}

export interface TrendingProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  /** e.g. 15 for −15% badge */
  discountPercent?: number;
  rating: number;
  reviews: number;
  isBestSeller?: boolean;
  productDetailId?: string;
  /** Canonical slug for product detail URL when present. */
  slug?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface ListingProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  rating: number;
  reviews: number;
  image: string;
  dealOfTheDay?: boolean;
  productDetailId?: string;
  badge?: string;
  specs?: string;
  slug?: string;
}

export interface CoolingProduct {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  badges: string[];
  btu: string;
  tech: string;
  techIcon?: string;
  productDetailId?: string;
}

export interface AccessoriesProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  badgeVariant?: 'primary' | 'red';
  tags: string[];
  productDetailId?: string;
}

export interface SmartHomeTag {
  label: string;
  dotColor?: string;
}

export interface SmartHomeProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  description: string;
  tags: SmartHomeTag[];
  badge?: string;
  badgeVariant?: 'primary' | 'red';
  subtitle?: string;
  subtitleVariant?: 'green' | 'primary' | 'muted';
  productDetailId?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id?: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  verified?: boolean;
  photos?: string[];
}

export interface RelatedProduct {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
}

export interface ProductDetailExtras {
  specs: ProductSpec[];
  reviewScore: number;
  reviewDistribution: { 5: number; 4: number; 3: number };
  reviews: ProductReview[];
  customerPhotos: string[];
  relatedProducts: RelatedProduct[];
  brand?: string;
}
