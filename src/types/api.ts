/**
 * DTOs and request/response types for backend API (http://localhost:8080/api).
 * Matches backend contract for frontend–backend linking.
 */

export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
}

export interface ProductColorDto {
  name: string;
  hex: string;
}

export interface ProductDto {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  price: number;
  categoryId: number;
  categoryName: string;
  stock: number;
  featured: boolean;
  specifications: string | null;
  colors?: ProductColorDto[];
  storageOptions?: string[];
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
}

/** Profile từ GET /api/profile (UserDto). */
export interface ProfileDto {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  defaultAddress?: string | null;
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
