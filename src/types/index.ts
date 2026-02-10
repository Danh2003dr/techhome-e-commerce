export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  tag?: string;
  isBestSeller?: boolean;
  description?: string;
  sku?: string;
  inStock?: boolean;
  colors?: { name: string; hex: string }[];
  storageOptions?: string[];
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

export interface WarrantyItem {
  id: string;
  productName: string;
  serial: string;
  status: 'active' | 'expired';
  purchaseDate: string;
  expiryDate: string;
  planType: string;
  icon: string;
  expiryVariant?: 'default' | 'amber' | 'red';
  planHighlight?: boolean;
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

export interface WishlistItem {
  id: string;
  productId?: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  onSale?: boolean;
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
  rating: number;
  reviews: number;
  isBestSeller?: boolean;
  productDetailId?: string;
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
  rating: number;
  reviews: number;
  image: string;
  dealOfTheDay?: boolean;
  productDetailId?: string;
  badge?: string;
  specs?: string;
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
  isInWishlist?: boolean;
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
  author: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  verified?: boolean;
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
