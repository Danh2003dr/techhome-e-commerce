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
  OrderDto,
  ProfileDto,
} from '@/types/api';
import type { CartItem } from '@/types';

export interface ProductsParams {
  category?: number;
  q?: string;
  page?: number;
  size?: number;
}

/** GET /api/health */
export async function health(): Promise<{ status: string }> {
  return apiGet<{ status: string }>('/health', { auth: false });
}

/** GET /api/categories */
export async function getCategories(): Promise<CategoryDto[]> {
  return apiGet<CategoryDto[]>('/categories', { auth: false });
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
  return apiGet<ProductDto[]>(path, { auth: false });
}

/** GET /api/products/{id} */
export async function getProduct(id: number | string): Promise<ProductDto> {
  return apiGet<ProductDto>(`/products/${id}`, { auth: false });
}

/** GET /api/products/featured */
export async function getFeaturedProducts(): Promise<ProductDto[]> {
  return apiGet<ProductDto[]>('/products/featured', { auth: false });
}

/** POST /api/products/{id}/fetch-specs */
export async function fetchProductSpecs(id: number | string): Promise<ProductDto> {
  return apiPost<ProductDto>(`/products/${id}/fetch-specs`, {}, { auth: false });
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

/** Logout: clear token and user from storage (no backend call). */
export function logout(): void {
  clearToken();
}

// ——— Cart API (requires auth) ———

/** GET /api/cart */
export async function getCart(): Promise<CartItem[]> {
  return apiGet<CartItem[]>('/cart', { auth: true });
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
  const res = await apiPost<CartItem[]>('/cart/items', payload, { auth: true });
  return res;
}

/** PATCH /api/cart/items/:id */
export async function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem[]> {
  return apiPatch<CartItem[]>(`/cart/items/${encodeURIComponent(cartItemId)}`, { quantity }, { auth: true });
}

/** DELETE /api/cart/items/:id */
export async function removeCartItem(cartItemId: string): Promise<CartItem[]> {
  return apiDelete<CartItem[]>(`/cart/items/${encodeURIComponent(cartItemId)}`, { auth: true });
}

/** PUT /api/cart – replace entire cart */
export async function setCart(items: CartItem[]): Promise<CartItem[]> {
  return apiPut<CartItem[]>('/cart', { items }, { auth: true });
}

// ——— Profile & Password (requires auth) ———

/** GET /api/profile */
export async function getProfile(): Promise<ProfileDto> {
  return apiGet<ProfileDto>('/profile', { auth: true });
}

/** POST /api/auth/change-password */
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string; passwordChangedAt?: string }> {
  return apiPost<{ message: string; passwordChangedAt?: string }>('/auth/change-password', {
    currentPassword,
    newPassword,
  }, { auth: true });
}
