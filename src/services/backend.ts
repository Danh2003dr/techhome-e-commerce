/**
 * Backend API service – endpoints as per backend–frontend linking doc.
 * All paths are relative to API_BASE (e.g. http://localhost:8080/api).
 */

import {
  apiGet,
  apiPost,
  apiPostText,
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
  AvatarPresignResponse,
  AssetUploadScope,
  AdminUserDto,
  AdminRoleDto,
  InventoryDto,
  InventoryIdempotencyDto,
} from '@/types/api';
import type { CartItem } from '@/types';

interface BackendCartItemRaw {
  id?: string | number;
  _id?: string;
  productId?: string | number;
  name?: string;
  quantity?: number;
  variant?: string | null;
  price?: number;
  image?: string | null;
}

interface BackendCartRaw {
  items?: BackendCartItemRaw[];
}

function mapBackendCartItem(raw: BackendCartItemRaw, index: number): CartItem {
  const id = String(raw.id ?? raw._id ?? `cart-item-${index}`);
  const productId = String(raw.productId ?? '');
  return {
    id,
    productId,
    name: raw.name ?? '',
    variant: raw.variant ?? undefined,
    price: Number(raw.price ?? 0),
    quantity: Number(raw.quantity ?? 1),
    image: raw.image ?? '',
  };
}

function mapBackendCartResponse(raw: unknown): CartItem[] {
  if (Array.isArray(raw)) {
    return raw.map((item, idx) => mapBackendCartItem(item as BackendCartItemRaw, idx));
  }
  if (raw && typeof raw === 'object' && Array.isArray((raw as BackendCartRaw).items)) {
    return (raw as BackendCartRaw).items!.map((item, idx) => mapBackendCartItem(item, idx));
  }
  return [];
}

export interface ProductsParams {
  category?: number;
  q?: string;
  page?: number;
  size?: number;
}

export interface AdminProductUpsertPayload {
  name: string;
  categoryId: number;
  price: number;
  description?: string;
  image?: string | null;
  images?: string[] | null;
  salePrice?: number | null;
  stock?: number;
  featured?: boolean;
  colors?: { name: string; hex: string }[];
  storageOptions?: string[];
  specifications?: string | null;
  sku?: string | null;
  tag?: string | null;
}

/** GET /api/health */
export async function health(): Promise<{ status: string }> {
  return apiGet<{ status: string }>('/health', { auth: false });
}

/** GET /api/categories — hỗ trợ lọc theo tên (substring, server), parentId, includeDeleted. */
export interface CategoriesParams {
  name?: string;
  includeDeleted?: boolean;
  /** Lọc theo danh mục cha; `null` = danh mục gốc. */
  parentId?: number | null;
}

export async function getCategories(params?: CategoriesParams): Promise<CategoryDto[]> {
  const sp = new URLSearchParams();
  if (params?.name != null && String(params.name).trim() !== '') {
    sp.set('name', String(params.name).trim());
  }
  if (params?.includeDeleted) sp.set('includeDeleted', 'true');
  if (params?.parentId !== undefined) {
    if (params.parentId === null) sp.set('parentId', 'null');
    else sp.set('parentId', String(params.parentId));
  }
  const query = sp.toString();
  return apiGet<CategoryDto[]>(query ? `/categories?${query}` : '/categories', { auth: false });
}

/** POST /api/categories (ADMIN) */
export async function createAdminCategory(payload: {
  name: string;
  icon?: string | null;
  imageUrl?: string | null;
  parentId?: number | null;
}): Promise<CategoryDto> {
  return apiPost<CategoryDto>('/categories', payload, { auth: true });
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

/** POST /api/products (ADMIN) */
export async function createAdminProduct(payload: AdminProductUpsertPayload): Promise<ProductDto> {
  return apiPost<ProductDto>('/products', payload, { auth: true });
}

/** PUT /api/products/:id (ADMIN) */
export async function updateAdminProduct(
  id: number | string,
  payload: Partial<AdminProductUpsertPayload>
): Promise<ProductDto> {
  return apiPut<ProductDto>(`/products/${id}`, payload, { auth: true });
}

/** DELETE /api/products/:id (ADMIN) */
export async function deleteAdminProduct(id: number | string): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/products/${id}`, { auth: true });
}

/** GET /api/products/{id} — admin / numeric-id lookups */
export async function getProduct(id: number | string): Promise<ProductDto> {
  return apiGet<ProductDto>(`/products/${id}`, { auth: false });
}

/** GET /api/products/slug/:slug — storefront product detail by slug */
export async function getProductBySlug(slug: string): Promise<ProductDto> {
  const s = encodeURIComponent(String(slug).trim());
  return apiGet<ProductDto>(`/products/slug/${s}`, { auth: false });
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

/** POST /api/auth/forgotpassword — body `{ email }`; backend trả plain text. */
export async function forgotPassword(email: string): Promise<string> {
  return apiPostText('/auth/forgotpassword', { email }, { auth: false });
}

/** POST /api/auth/resetpassword/:token — body `{ newPassword }`; không cần đăng nhập. */
export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  const t = encodeURIComponent(token);
  return apiPost<{ message: string }>(`/auth/resetpassword/${t}`, { newPassword }, { auth: false });
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

/** POST /api/auth/logout, luôn dọn token local kể cả khi API lỗi. */
export async function logout(): Promise<void> {
  try {
    await apiPost<unknown>('/auth/logout', {}, { auth: true });
  } finally {
    clearToken();
  }
}

// ——— Cart API (requires auth) ———

/** GET /api/cart */
export async function getCart(): Promise<CartItem[]> {
  const res = await apiGet<unknown>('/cart', { auth: true });
  return mapBackendCartResponse(res);
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
  const res = await apiPost<unknown>(
    '/cart/items',
    {
      productId: payload.productId,
      price: payload.price,
      quantity: payload.quantity ?? 1,
      variant: payload.variant,
      name: payload.name,
      image: payload.image,
    },
    { auth: true }
  );
  return mapBackendCartResponse(res);
}

/** PATCH /api/cart/items/:id */
export async function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem[]> {
  const res = await apiPatch<unknown>(
    `/cart/items/${encodeURIComponent(cartItemId)}`,
    { quantity },
    { auth: true }
  );
  return mapBackendCartResponse(res);
}

/** DELETE /api/cart/items/:id */
export async function removeCartItem(cartItemId: string): Promise<CartItem[]> {
  const res = await apiDelete<unknown>(`/cart/items/${encodeURIComponent(cartItemId)}`, { auth: true });
  return mapBackendCartResponse(res);
}

/** PUT /api/cart — replace entire cart */
export async function setCart(items: CartItem[]): Promise<CartItem[]> {
  const res = await apiPut<unknown>('/cart', { items }, { auth: true });
  return mapBackendCartResponse(res);
}

// ——— Profile & Password (requires auth) ———

/** GET /api/profile */
export async function getProfile(): Promise<ProfileDto> {
  const res = await apiGet<Record<string, unknown>>('/profile', { auth: true });
  return {
    id: (res.id ?? '') as string | number,
    name: String(res.name ?? ''),
    email: String(res.email ?? ''),
    phone: (res.phone as string | null | undefined) ?? null,
    gender: (res.gender as string | null | undefined) ?? null,
    dateOfBirth: (res.dateOfBirth as string | null | undefined) ?? null,
    defaultAddress: (res.defaultAddress as string | null | undefined) ?? null,
    passwordChangedAt: (res.passwordChangedAt as string | null | undefined) ?? null,
    avatarUrl: (res.avatarUrl as string | null | undefined) ?? null,
  };
}

/** POST /api/profile/avatar/presign — S3-compatible (Cloudflare R2: S3_ENDPOINT + token + PUBLIC_ASSET_BASE_URL) */
export async function requestAvatarPresign(contentType: string, fileSize: number): Promise<AvatarPresignResponse> {
  return apiPost<AvatarPresignResponse>(
    '/profile/avatar/presign',
    { contentType, fileSize },
    { auth: true }
  );
}

/** POST /api/uploads/presign — ADMIN/MODERATOR; ảnh catalog (product | category) */
export async function requestAssetUploadPresign(
  scope: AssetUploadScope,
  contentType: string,
  fileSize: number
): Promise<AvatarPresignResponse> {
  return apiPost<AvatarPresignResponse>(
    '/uploads/presign',
    { scope, contentType, fileSize },
    { auth: true }
  );
}

async function putFileToPresignedUrl(file: File, presign: AvatarPresignResponse): Promise<void> {
  const method = presign.method?.toUpperCase() === 'PUT' ? 'PUT' : 'PUT';
  const putRes = await fetch(presign.uploadUrl, {
    method,
    body: file,
    headers: presign.headers,
  });
  if (!putRes.ok) {
    const text = await putRes.text().catch(() => '');
    throw new Error(text || `Upload thất bại (${putRes.status})`);
  }
}

/**
 * Upload một ảnh catalog lên R2 (presign admin), trả publicUrl — không gọi API Node cho binary.
 */
export async function uploadImageFileToR2(file: File, scope: AssetUploadScope): Promise<string> {
  const presign = await requestAssetUploadPresign(scope, file.type, file.size);
  await putFileToPresignedUrl(file, presign);
  return presign.publicUrl;
}

/**
 * Upload file thẳng lên bucket (presigned PUT), sau đó PUT profile chỉ lưu publicUrl.
 * Không gửi file qua API Node.
 */
export async function uploadAvatarFile(file: File): Promise<ProfileDto> {
  const presign = await requestAvatarPresign(file.type, file.size);
  await putFileToPresignedUrl(file, presign);
  return updateProfile({ avatarUrl: presign.publicUrl });
}

/** PUT /api/profile */
export async function updateProfile(payload: {
  name?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  defaultAddress?: string;
  avatarUrl?: string | null;
}): Promise<ProfileDto> {
  const res = await apiPut<Record<string, unknown>>('/profile', {
    name: payload.name,
    phone: payload.phone,
    gender: payload.gender,
    dateOfBirth: payload.dateOfBirth,
    defaultAddress: payload.defaultAddress,
    avatarUrl: payload.avatarUrl,
  }, { auth: true });
  return {
    id: (res.id ?? '') as string | number,
    name: String(res.name ?? ''),
    email: String(res.email ?? ''),
    phone: (res.phone as string | null | undefined) ?? null,
    gender: (res.gender as string | null | undefined) ?? null,
    dateOfBirth: (res.dateOfBirth as string | null | undefined) ?? null,
    defaultAddress: (res.defaultAddress as string | null | undefined) ?? null,
    passwordChangedAt: (res.passwordChangedAt as string | null | undefined) ?? null,
    avatarUrl: (res.avatarUrl as string | null | undefined) ?? null,
  };
}

/** POST /api/auth/change-password */
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string; passwordChangedAt?: string }> {
  const res = await apiPost<unknown>('/auth/change-password', {
    currentPassword,
    newPassword,
  }, { auth: true });
  if (typeof res === 'string') {
    return { message: res };
  }
  if (res && typeof res === 'object') {
    const body = res as Record<string, unknown>;
    return {
      message: String(body.message ?? 'Password changed successfully'),
      passwordChangedAt: body.passwordChangedAt as string | undefined,
    };
  }
  return { message: 'Password changed successfully' };
}

// --- Admin users / roles ---

export async function getAdminUsers(): Promise<AdminUserDto[]> {
  return apiGet<AdminUserDto[]>('/users', { auth: true });
}

export async function getAdminUser(id: number | string): Promise<AdminUserDto> {
  return apiGet<AdminUserDto>(`/users/${id}`, { auth: true });
}

export async function createAdminUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AdminUserDto> {
  return apiPost<AdminUserDto>('/users', payload, { auth: true });
}

export async function updateAdminUser(
  id: number | string,
  payload: Partial<{
    name: string;
    email: string;
    status: boolean;
    loginCount: number;
    avatar_url: string | null;
    role: string;
  }>
): Promise<AdminUserDto> {
  return apiPut<AdminUserDto>(`/users/${id}`, payload, { auth: true });
}

export async function deleteAdminUser(id: number | string): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/users/${id}`, { auth: true });
}

export async function enableAdminUser(emailOrUsername: string): Promise<AdminUserDto> {
  return apiPost<AdminUserDto>('/users/enable', { email: emailOrUsername }, { auth: true });
}

export async function disableAdminUser(emailOrUsername: string): Promise<AdminUserDto> {
  return apiPost<AdminUserDto>('/users/disable', { email: emailOrUsername }, { auth: true });
}

export async function getAdminRoles(): Promise<AdminRoleDto[]> {
  return apiGet<AdminRoleDto[]>('/roles', { auth: true });
}

export async function getAdminRole(id: number | string): Promise<AdminRoleDto> {
  return apiGet<AdminRoleDto>(`/roles/${id}`, { auth: true });
}

export async function createAdminRole(payload: {
  name: string;
  description?: string;
}): Promise<AdminRoleDto> {
  return apiPost<AdminRoleDto>('/roles', payload, { auth: true });
}

export async function updateAdminRole(
  id: number | string,
  payload: Partial<{ name: string; description: string | null }>
): Promise<AdminRoleDto> {
  return apiPut<AdminRoleDto>(`/roles/${id}`, payload, { auth: true });
}

export async function deleteAdminRole(id: number | string): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`/roles/${id}`, { auth: true });
}

// --- Admin inventories ---

export async function getAdminInventories(): Promise<InventoryDto[]> {
  return apiGet<InventoryDto[]>('/inventories', { auth: true });
}

export async function getAdminInventory(id: number | string): Promise<InventoryDto> {
  return apiGet<InventoryDto>(`/inventories/${id}`, { auth: true });
}

export async function addInventoryStock(product: number, quantity: number): Promise<InventoryDto> {
  return apiPost<InventoryDto>('/inventories/add-stock', { product, quantity }, { auth: true });
}

export async function removeInventoryStock(product: number, quantity: number): Promise<InventoryDto> {
  return apiPost<InventoryDto>('/inventories/remove-stock', { product, quantity }, { auth: true });
}

export async function reserveInventoryStock(
  product: number,
  quantity: number,
  idempotencyKey: string
): Promise<InventoryDto> {
  return apiPost<InventoryDto>(
    '/inventories/reservation',
    { product, quantity, idempotencyKey },
    { auth: true }
  );
}

export async function soldInventoryStock(
  product: number,
  quantity: number,
  idempotencyKey: string
): Promise<InventoryDto> {
  return apiPost<InventoryDto>(
    '/inventories/sold',
    { product, quantity, idempotencyKey },
    { auth: true }
  );
}

export async function getInventoryIdempotency(
  action: 'reservation' | 'sold',
  key: string
): Promise<InventoryIdempotencyDto> {
  return apiGet<InventoryIdempotencyDto>(
    `/inventories/idempotency/${encodeURIComponent(action)}/${encodeURIComponent(key)}`,
    { auth: true }
  );
}
