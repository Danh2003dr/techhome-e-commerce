/**
 * DTOs and request/response types for backend API (http://localhost:8080/api).
 * Matches backend contract for frontend–backend linking.
 */

export interface CategoryDto {
  id: number;
  name: string;
  description?: string | null;
}

export interface ProductDto {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  categoryId: number;
  categoryName: string;
  stock: number;
  featured: boolean;
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
  id: number;
  name: string;
  email: string;
  /** Backend trả về lowercase: 'admin' | 'customer' */
  role?: 'admin' | 'customer';
}

/** Profile từ GET /api/profile (UserDto). */
export interface ProfileDto {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  passwordChangedAt?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUserDto;
}

export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  totalPrice: number;
  items: CreateOrderItemRequest[];
  shippingAddressId?: number | null;
  subtotal?: number | null;
  discountAmount?: number | null;
  shippingCost?: number | null;
  paymentMethod?: string | null;
  notes?: string | null;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  productImage?: string | null;
  quantity: number;
  priceAtOrder: number;
}

export interface OrderDto {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  paymentMethod?: string | null;
  createdAt: string;
  items: OrderItemDto[];
}

/** Admin order payload used by /api/admin/orders */
export interface AdminOrderItemDto {
  productId: number | null;
  productName: string;
  productImage?: string | null;
  quantity: number;
  priceAtOrder: number;
  lineTotal: number;
  selectedColor?: string | null;
  selectedStorage?: string | null;
}

export interface AdminOrderDto {
  id: number;
  customerName: string;
  shippingAddressSummary: string;
  items: AdminOrderItemDto[];
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  totalPrice: number;
  paymentMethod?: string | null;
  notes?: string | null;
  status: string;
  createdAt: string;
}

export interface UpdateAdminOrderStatusRequest {
  status: string;
}

export interface ApiErrorBody {
  message?: string;
  [key: string]: unknown;
}

// ——— Cart DTOs (matches backend CartDto / CartItemDto) ———

export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  productImage: string | null;
  quantity: number;
  selectedColor: string | null;
  selectedStorage: string | null;
  priceAtAdd: number;
  lineTotal: number;
}

export interface CartDto {
  id: number;
  userId: number;
  items: CartItemDto[];
  itemCount: number;
  totalPrice: number;
}

/** Địa chỉ — GET/POST/PATCH /api/addresses */
export interface AddressDto {
  id: number;
  name: string;
  phone: string;
  street: string;
  apartment?: string | null;
  label?: string | null;
  city: string;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  isDefault?: boolean;
}
