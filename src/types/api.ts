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
  /** Chỉ khi GET có `includeDeleted` — danh mục đã xóa mềm */
  isDeleted?: boolean;
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

/** Địa chỉ đã lưu trong hồ sơ — dùng khi checkout. Bản cũ có thể chỉ có `line`. */
export interface SavedAddressDto {
  id: string;
  label: string;
  line: string;
  recipientName?: string;
  recipientPhone?: string;
  street?: string;
  ward?: string;
  district?: string;
  province?: string;
  note?: string;
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
  savedAddresses?: SavedAddressDto[];
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

/** POST /api/checkout/quote — tạm tính, phí ship, giảm giá từ server */
export interface CheckoutQuoteRequest {
  items: { productId: number; quantity: number }[];
  couponCode?: string;
}

export interface CheckoutQuoteResponse {
  subtotal: number;
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
  /** Tên hiển thị từ hồ sơ user (admin list/detail). */
  userName?: string | null;
  totalPrice: number;
  status: string;
  paymentStatus?: 'UNPAID' | 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED' | string;
  paymentMethod?: string | null;
  paymentGatewayOrderId?: string | null;
  paymentRequestId?: string | null;
  paymentTransactionId?: string | null;
  paidAt?: string | null;
  paymentFailureReason?: string | null;
  createdAt: string;
  /** Snapshot địa chỉ khi đặt; đơn cũ có thể thiếu. */
  shippingAddress?: string | null;
  /** Phí ship do server tính; đơn cũ có thể thiếu. */
  shippingFee?: number | null;
  items: OrderItemDto[];
}

export type AdminOrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface AdminOrderListResponse {
  total: number;
  page: number;
  size: number;
  items: OrderDto[];
}

export interface AdminDashboardRecentOrderDto {
  id: number | string;
  userId: number | string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface AdminDashboardSummaryResponse {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: AdminDashboardRecentOrderDto[];
}

export interface OrderStatusHistoryDto {
  id: number | string;
  orderId: number | string;
  fromStatus?: string | null;
  toStatus: string;
  changedByUserId?: number | string | null;
  note?: string | null;
  createdAt: string;
}

export interface ApiErrorBody {
  message?: string;
  /** Một số endpoint (validation) trả thêm danh sách lỗi từng dòng. */
  errors?: string[];
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
  /** Backend: validTo đã qua (so với giờ server khi trả DTO) */
  expiredByDate?: boolean;
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

/** GET/POST /api/messages — chat 1–1 (backend TechHome). */
export interface MessageUserRefDto {
  id: number;
  name?: string;
  email?: string;
}

export interface MessageContentDto {
  type: 'text' | 'file';
  text: string;
}

export interface MessageDto {
  id: number;
  from: MessageUserRefDto;
  to: MessageUserRefDto;
  messageContent: MessageContentDto;
  contextType?: 'GENERAL' | 'PRODUCT_FEEDBACK' | string;
  productId?: number | null;
  productNameSnapshot?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface SupportMetaDto {
  supportUserId: number;
  isStaff: boolean;
  label: string;
}

export interface ConversationListItemDto {
  user: string;
  message: MessageDto;
}
