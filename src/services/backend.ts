/**
 * Backend API service – endpoints as per backend–frontend linking doc.
 * All paths are relative to API_BASE (e.g. http://localhost:8080/api).
 */

import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  setToken as storeToken,
  setStoredUser,
  clearToken,
} from './api';
import type {
  CategoryDto,
  ProductDto,
  AuthRequest,
  RegisterRequest,
  AuthResponse,
  CreateOrderRequest,
  AdminOrderDto,
  UpdateAdminOrderStatusRequest,
  OrderDto,
  ProfileDto,
  CartDto,
  CartItemDto,
  AddressDto,
} from '@/types/api';
import type { CartItem } from '@/types';

export interface ProductsParams {
  category?: number;
  q?: string;
  page?: number;
  size?: number;
}

interface PageResponse<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  [key: string]: unknown;
}

/** Handle both plain array and Spring Page object from backend */
function extractList<T>(response: T[] | PageResponse<T>): T[] {
  if (Array.isArray(response)) return response;
  if (response && typeof response === 'object' && Array.isArray((response as PageResponse<T>).content)) {
    return (response as PageResponse<T>).content;
  }
  return [];
}

/** Map CartDto (backend) → CartItem[] (frontend) */
function mapCartDto(dto: CartDto): CartItem[] {
  if (!dto || !Array.isArray(dto.items)) return [];
  return dto.items.map((item: CartItemDto) => ({
    id: String(item.id),
    productId: String(item.productId),
    name: item.productName ?? '',
    variant: item.selectedColor || item.selectedStorage || undefined,
    price: Number(item.priceAtAdd ?? 0),
    quantity: item.quantity ?? 1,
    image: item.productImage ?? '',
  }));
}

/** GET /api/health */
export async function health(): Promise<{ status: string }> {
  return apiGet<{ status: string }>('/health', { auth: false });
}

/** GET /api/categories */
export async function getCategories(): Promise<CategoryDto[]> {
  const raw = await apiGet<CategoryDto[] | PageResponse<CategoryDto>>('/categories', { auth: false });
  return extractList(raw);
}

/** GET /api/products?category=&q=&page=&size= */
export async function getProducts(params: ProductsParams = {}): Promise<ProductDto[]> {
  const sp = new URLSearchParams();
  if (params.category != null) sp.set('category', String(params.category));
  if (params.q != null && params.q !== '') sp.set('q', params.q);
  if (params.page != null) sp.set('page', String(params.page));
  if (params.size != null) sp.set('size', String(params.size));
  const query = sp.toString();
  const path = query ? `/products?${query}` : '/products';
  const raw = await apiGet<ProductDto[] | PageResponse<ProductDto>>(path, { auth: false });
  return extractList(raw);
}

/** GET /api/products/{id} */
export async function getProduct(id: number | string): Promise<ProductDto> {
  return apiGet<ProductDto>(`/products/${id}`, { auth: false });
}

/** GET /api/products/featured */
export async function getFeaturedProducts(): Promise<ProductDto[]> {
  const raw = await apiGet<ProductDto[] | PageResponse<ProductDto>>('/products/featured', { auth: false });
  return extractList(raw);
}

// ——— Admin: Products ———

export interface AdminProductPayload {
  name: string;
  description?: string | null;
  image?: string | null;
  price: number;
  categoryId: number;
  stock: number;
  featured?: boolean;
}

// ——— File Upload ———

/** POST /api/upload — upload ảnh từ máy, trả về { url } */
export async function uploadImage(file: File): Promise<string> {
  const { getToken } = await import('./api');
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `Upload lỗi ${res.status}`);
  }
  const data = await res.json() as { url: string };
  return data.url;
}

// ——— Admin: Stats ———

export interface AdminStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalCategories: number;
}

/** GET /api/admin/stats */
export async function adminGetStats(): Promise<AdminStats> {
  return apiGet<AdminStats>('/admin/stats', { auth: true });
}

/** GET /api/admin/products */
export async function adminGetProducts(): Promise<ProductDto[]> {
  const raw = await apiGet<ProductDto[] | PageResponse<ProductDto>>('/admin/products', { auth: true });
  return extractList(raw);
}

/** POST /api/admin/products */
export async function adminCreateProduct(body: AdminProductPayload): Promise<ProductDto> {
  return apiPost<ProductDto>('/admin/products', body, { auth: true });
}

/** PATCH /api/admin/products/{id} */
export async function adminUpdateProduct(id: number | string, body: Partial<AdminProductPayload>): Promise<ProductDto> {
  return apiPatch<ProductDto>(`/admin/products/${id}`, body, { auth: true });
}

/** DELETE /api/admin/products/{id} */
export async function adminDeleteProduct(id: number | string): Promise<void> {
  return apiDelete<void>(`/admin/products/${id}`, { auth: true });
}

// ——— Admin: Categories ———

/** GET /api/admin/categories */
export async function adminGetCategories(): Promise<CategoryDto[]> {
  const raw = await apiGet<CategoryDto[] | PageResponse<CategoryDto>>('/admin/categories', { auth: true });
  return extractList(raw);
}

/** POST /api/admin/categories */
export async function adminCreateCategory(body: { name: string; description?: string }): Promise<CategoryDto> {
  return apiPost<CategoryDto>('/admin/categories', body, { auth: true });
}

/** PATCH /api/admin/categories/{id} */
export async function adminUpdateCategory(id: number | string, body: { name?: string; description?: string }): Promise<CategoryDto> {
  return apiPatch<CategoryDto>(`/admin/categories/${id}`, body, { auth: true });
}

/** DELETE /api/admin/categories/{id} */
export async function adminDeleteCategory(id: number | string): Promise<void> {
  return apiDelete<void>(`/admin/categories/${id}`, { auth: true });
}

// ——— Admin: Orders ———
/** GET /api/admin/orders */
export async function adminGetOrders(): Promise<AdminOrderDto[]> {
  return apiGet<AdminOrderDto[]>('/admin/orders', { auth: true });
}

/** GET /api/admin/orders/{id} */
export async function adminGetOrder(orderId: number | string): Promise<AdminOrderDto> {
  return apiGet<AdminOrderDto>(`/admin/orders/${orderId}`, { auth: true });
}

/** PATCH /api/admin/orders/{id}/status */
export async function adminUpdateOrderStatus(
  orderId: number | string,
  body: UpdateAdminOrderStatusRequest,
): Promise<AdminOrderDto> {
  return apiPatch<AdminOrderDto>(`/admin/orders/${orderId}/status`, body, { auth: true });
}

/** POST /api/auth/login */
export async function login(body: AuthRequest): Promise<AuthResponse> {
  const res = await apiPost<AuthResponse>('/auth/login', body, { auth: false });
  storeToken(res.token);
  setStoredUser(res.user);
  return res;
}

/** POST /api/auth/register */
export async function register(body: RegisterRequest): Promise<AuthResponse> {
  const res = await apiPost<AuthResponse>('/auth/register', body, { auth: false });
  storeToken(res.token);
  setStoredUser(res.user);
  return res;
}

/** POST /api/orders – requires Authorization */
export async function createOrder(body: CreateOrderRequest): Promise<OrderDto> {
  return apiPost<OrderDto>('/orders', body, { auth: true });
}

/** GET /api/orders – requires Authorization */
export async function getOrders(): Promise<OrderDto[]> {
  return apiGet<OrderDto[]>('/orders', { auth: true });
}

/** GET /api/orders/:id – requires Authorization */
export async function getOrder(id: number | string): Promise<OrderDto> {
  return apiGet<OrderDto>(`/orders/${id}`, { auth: true });
}

/** PATCH /api/orders/{id}/receive — COD: customer confirms received */
export async function receiveOrder(orderId: number | string): Promise<OrderDto> {
  return apiPatch<OrderDto>(`/orders/${orderId}/receive`, {}, { auth: true });
}

/** Logout: clear token and user from storage (no backend call). */
export function logout(): void {
  clearToken();
}

// ——— Cart API (requires auth) ———

/** GET /api/cart – trả về CartItem[] (mapped từ CartDto) */
export async function getCart(): Promise<CartItem[]> {
  const dto = await apiGet<CartDto>('/cart', { auth: true });
  return mapCartDto(dto);
}

/** POST /api/cart/items */
export async function addCartItem(payload: {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  variant?: string;
}): Promise<CartItem[]> {
  const dto = await apiPost<CartDto>('/cart/items', {
    productId: Number(payload.productId),
    quantity: payload.quantity ?? 1,
    variant: payload.variant,
  }, { auth: true });
  return mapCartDto(dto);
}

/** PATCH /api/cart/items/:id */
export async function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem[]> {
  const dto = await apiPatch<CartDto>(`/cart/items/${encodeURIComponent(cartItemId)}`, { quantity }, { auth: true });
  return mapCartDto(dto);
}

/** DELETE /api/cart/items/:id */
export async function removeCartItem(cartItemId: string): Promise<CartItem[]> {
  const dto = await apiDelete<CartDto>(`/cart/items/${encodeURIComponent(cartItemId)}`, { auth: true });
  return mapCartDto(dto);
}

/** PUT /api/cart – replace entire cart */
export async function setCart(items: CartItem[]): Promise<CartItem[]> {
  const dto = await apiPut<CartDto>('/cart', { items }, { auth: true });
  return mapCartDto(dto);
}

// ——— Profile & Password (requires auth) ———

/** GET /api/profile */
export async function getProfile(): Promise<ProfileDto> {
  return apiGet<ProfileDto>('/profile', { auth: true });
}

/** PATCH /api/profile */
export async function updateProfile(body: {
  name?: string;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
}): Promise<ProfileDto> {
  return apiPatch<ProfileDto>('/profile', body, { auth: true });
}

/** POST /api/auth/change-password */
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string; passwordChangedAt?: string }> {
  return apiPost<{ message: string; passwordChangedAt?: string }>('/auth/change-password', {
    currentPassword,
    newPassword,
  }, { auth: true });
}

// ——— Addresses (requires auth) ———

export interface AddressPayload {
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

/** GET /api/addresses */
export async function getAddresses(): Promise<AddressDto[]> {
  return apiGet<AddressDto[]>('/addresses', { auth: true });
}

/** POST /api/addresses */
export async function createAddress(body: AddressPayload): Promise<AddressDto> {
  return apiPost<AddressDto>('/addresses', body, { auth: true });
}

/** PATCH /api/addresses/:id */
export async function updateAddress(id: number, body: Partial<AddressPayload>): Promise<AddressDto> {
  return apiPatch<AddressDto>(`/addresses/${id}`, body, { auth: true });
}

/** DELETE /api/addresses/:id */
export async function deleteAddress(id: number): Promise<void> {
  await apiDelete<{ message?: string }>(`/addresses/${id}`, { auth: true });
}

/** PUT /api/addresses/:id/set-default */
export async function setDefaultAddress(id: number): Promise<AddressDto> {
  return apiPut<AddressDto>(`/addresses/${id}/set-default`, {}, { auth: true });
}
