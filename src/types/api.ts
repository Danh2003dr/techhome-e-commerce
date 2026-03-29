/**
 * DTOs and request/response types for backend API (http://localhost:8080/api).
 * Matches backend contract for frontend–backend linking.
 */

export interface CategoryDto {
  id: number | string;
  name: string;
  slug: string;
  /** Optional parent category id for hierarchy (null for top-level). */
  parentId?: number | string | null;
  /** Tên icon (ví dụ Material Icons) — tuỳ chọn */
  icon?: string | null;
  /** URL ảnh đại diện danh mục — tuỳ chọn */
  imageUrl?: string | null;
}

export interface ProductColorDto {
  name: string;
  hex: string;
}

export interface ProductDto {
  id: number | string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  /** Gallery URLs; first image is typically the primary. */
  images?: string[] | null;
  price: number;
  /** When set and lower than `price`, product is on sale (storefront shows discount %). */
  salePrice?: number | null;
  categoryId: number;
  categoryName: string;
  stock: number;
  featured: boolean;
  specifications: string | null;
  colors?: ProductColorDto[];
  storageOptions?: string[];
  /** Mã SKU — backend có trường, optional */
  sku?: string | null;
  /** Nhãn hiển thị — backend có trường, optional */
  tag?: string | null;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: number | string;
  name: string;
  email: string;
  role?: 'USER' | 'ADMIN' | 'MODERATOR' | string;
  /** URL ảnh đại diện (CDN) — đồng bộ với GET /profile */
  avatarUrl?: string | null;
}

/** Profile từ GET /api/profile (UserDto). */
export interface ProfileDto {
  id: number | string;
  name: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  defaultAddress?: string | null;
  passwordChangedAt?: string | null;
  /** URL http(s) tới ảnh (CDN/S3); bản ghi cũ có thể còn data URL từ trước khi đổi luồng */
  avatarUrl?: string | null;
}

/** POST /api/profile/avatar/presign — cùng shape với POST /uploads/presign */
export interface AvatarPresignResponse {
  uploadUrl: string;
  publicUrl: string;
  method: string;
  headers: Record<string, string>;
  expiresIn: number;
}

/** POST /api/uploads/presign — scope product | category (ADMIN) */
export type AssetUploadScope = 'product' | 'category';

export interface AuthResponse {
  token: string;
  user: AuthUserDto;
  /** Gợi ý từ API (ví dụ `/admin` khi role ADMIN) — storefront có thể dùng sau đăng nhập. */
  postLoginRedirect?: string | null;
}

export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  totalPrice: number;
  items: CreateOrderItemRequest[];
  /** Địa chỉ giao hàng đầy đủ — bắt buộc, lưu snapshot trên đơn. */
  shippingAddress: string;
  couponCode?: string;
}

/** POST /api/checkout/quote — tạm tính + thuế + giảm giá từ server */
export interface CheckoutQuoteRequest {
  items: { productId: number; quantity: number }[];
  couponCode?: string;
}

export interface CheckoutQuoteResponse {
  subtotal: number;
  totalTax: number;
  discountTotal: number;
  /** Tiền hàng sau giảm (chưa ship) — khớp backend goodsTotal */
  goodsTotal: number;
  shippingFee: number;
  /** Tổng thanh toán = goodsTotal + shippingFee */
  grandTotal: number;
  coupon: { id: number; code: string } | null;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  productImage?: string | null;
  quantity: number;
  priceAtOrder: number;
}

export interface OrderDto {
  id: number | string;
  userId: number | string;
  totalPrice: number;
  status: string;
  createdAt: string;
  /** Snapshot địa chỉ khi đặt; đơn cũ có thể thiếu. */
  shippingAddress?: string | null;
  /** Phí ship do server tính; đơn cũ có thể thiếu. */
  shippingFee?: number | null;
  items: OrderItemDto[];
}

export interface ApiErrorBody {
  message?: string;
  [key: string]: unknown;
}

export interface AdminUserDto {
  id: number | string;
  name: string;
  email: string;
  username?: string;
  fullName?: string;
  role?: string;
  status?: boolean;
  loginCount?: number;
  avatarUrl?: string | null;
}

export interface AdminRoleDto {
  id: number | string;
  name: string;
  description?: string | null;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

export interface InventoryDto {
  id: number | string;
  product: number;
  stock: number;
  reserved: number;
  soldCount: number;
}

export interface InventoryIdempotencyDto {
  id?: number | string;
  action: 'reservation' | 'sold' | string;
  key: string;
  product: number;
  quantity: number;
  status: 'PENDING' | 'COMPLETED' | string;
  response?: unknown;
}

/** GET/POST/PATCH/DELETE /api/coupons — quản trị mã giảm giá (ADMIN) */
export type CouponDiscountTypeUi = 'percent' | 'fixed';

export interface CouponAdminDto {
  id: number;
  code: string;
  discountType: CouponDiscountTypeUi;
  type: 'PERCENT' | 'FIXED';
  value: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  validFrom: string | null;
  validTo: string | null;
  expiresAt: string | null;
  usageLimit: number | null;
  maxUses: number | null;
  perUserLimit: number | null;
  active: boolean;
  usedCount: number;
  excludedProductIds: number[];
  applicableCategoryIds: number[];
}

export interface CouponAdminListResponse {
  items: CouponAdminDto[];
  total: number;
  page: number;
  size: number;
}
