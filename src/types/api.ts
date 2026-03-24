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
  createdAt: string;
  items: OrderItemDto[];
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
