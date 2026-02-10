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
  /** e.g. "Return window closed on Nov 24, 2024" or "Arriving Thursday" or "Refund processed on Sept 07, 2024" */
  extraLine: string;
  /** 'return' = italic grey, 'shipping' = blue with icon, 'refund' = red */
  extraType: 'return' | 'shipping' | 'refund';
  /** Secondary button label */
  secondaryAction: 'buy_again' | 'track' | 'reorder';
}

/** Line item on order confirmation */
export interface OrderConfirmationLineItem {
  id: string;
  name: string;
  image: string;
  description?: string;
  variant?: string;
  quantity: number;
  price: number; // line total (unit * qty)
}

/** Order confirmation page payload */
export interface OrderConfirmationData {
  orderId: string;
  lineItems: OrderConfirmationLineItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  /** Show "Installation Scheduled" banner for AC/appliance orders */
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
  payment: {
    brand: string;
    last4: string;
  };
}

/** Single step in order details stepper */
export interface OrderDetailsStep {
  label: string;
  sublabel: string;
  completed: boolean;
  active: boolean;
  icon: string; // 'check' | 'local_shipping' | 'inventory_2'
}

/** Line item on order details page */
export interface OrderDetailsLineItem {
  name: string;
  image: string;
  specs: string;
  quantity: number;
  price: number;
}

/** Full order details page payload */
export interface OrderDetailsData {
  orderId: string;
  placedDate: string;
  statusLabel: string; // e.g. "In Transit"
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

/** Single warranty card on Warranty Status page */
export interface WarrantyItem {
  id: string;
  productName: string;
  serial: string;
  status: 'active' | 'expired';
  purchaseDate: string;
  expiryDate: string;
  planType: string;
  /** Material icon name e.g. laptop_mac, headphones, smartphone */
  icon: string;
  /** Expiry date style: default, amber (approaching), red (expired) */
  expiryVariant?: 'default' | 'amber' | 'red';
  /** Plan type in primary color when true */
  planHighlight?: boolean;
}

/** Saved shipping address for Saved Addresses page */
export interface SavedAddress {
  id: string;
  /** e.g. "Home", "Office" - shown as tag; "Home" uses primary styling */
  label: string;
  /** Material icon for tag: "home" (filled for Home) or "work" */
  tagIcon: string;
  tagPrimary?: boolean;
  name: string;
  phone: string;
  /** Address lines in order (e.g. street, suite, city state zip, country) */
  addressLines: string[];
  /** Optional structured fields for Edit Address form */
  street?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}

/** Wishlist product card for My Wishlist page */
export interface WishlistItem {
  id: string;
  productId?: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  /** 1–5, can be fractional e.g. 3.5 */
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

/** Homepage "Trending Now" product card */
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
  /** Link to existing product detail page when set */
  productDetailId?: string;
  /** Card badge e.g. "New Arrival", "Save 15%", "Refurbished", "In Stock" */
  badge?: string;
  /** Short spec line e.g. "12GB RAM | 512GB | Titanium Gray" */
  specs?: string;
}

/** Cooling category page product card */
export interface CoolingProduct {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  /** Badges e.g. "5-STAR ENERGY", "PROFESSIONAL INSTALLATION", "PORTABLE" */
  badges: string[];
  btu: string;
  tech: string;
  techIcon?: string;
  productDetailId?: string;
}

/** Accessories category page product card */
export interface AccessoriesProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  /** e.g. "TOP RATED", "20% OFF" */
  badge?: string;
  badgeVariant?: 'primary' | 'red';
  tags: string[];
  productDetailId?: string;
  isInWishlist?: boolean;
}

/** Smart Home category – ecosystem tag with optional dot color */
export interface SmartHomeTag {
  label: string;
  dotColor?: string; // e.g. 'bg-blue-500', 'bg-orange-500', 'bg-purple-500'
}

/** Smart Home category page product card */
export interface SmartHomeProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  description: string;
  /** Ecosystem/feature tags with optional colored dot */
  tags: SmartHomeTag[];
  /** Main badge e.g. "Best Seller", "Hot Deal" */
  badge?: string;
  badgeVariant?: 'primary' | 'red';
  /** Below price: "In Stock", "Fast Delivery", "Free Setup" */
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
  /** Brand for breadcrumb e.g. Apple */
  brand?: string;
}
