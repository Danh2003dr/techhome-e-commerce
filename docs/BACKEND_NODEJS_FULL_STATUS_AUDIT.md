# Backend NodeJS Full Status Audit

Cap nhat: 2026-03-27

Tai lieu nay tong hop nhanh va ro rang ve toan bo backend `backend_nodejs`, gom:

- Phan da hoan thien va chua hoan thien
- Backend da ket noi frontend va chua ket noi
- Mapping backend da co frontend tuong ung
- Cac cap backend/frontend tuong ung nhung frontend chua phu hop hoac chua cover het

---

## 1) Toan bo backend: da hoan thien vs chua hoan thien

## 1.1 Da hoan thien (route + nghiep vu co the dung)

### Core API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/change-password`
- `POST /api/auth/logout`

### Catalog

- Products:
  - `GET /api/products`
  - `GET /api/products/:id`
  - `GET /api/products/featured`
  - `GET /api/products/slug/:slug`
  - `POST /api/products/:id/fetch-specs`
  - `POST /api/products` (ADMIN)
  - `PUT /api/products/:id` (ADMIN)
  - `DELETE /api/products/:id` (ADMIN)
- Categories:
  - `GET /api/categories`
  - `GET /api/categories/:id`
  - `GET /api/categories/slug/:slug`
  - `GET /api/categories/children/slug/:slug`
  - `GET /api/categories/:id/products`
  - `POST /api/categories` (ADMIN)
  - `PUT /api/categories/:id` (ADMIN)
  - `DELETE /api/categories/:id` (ADMIN)

### Cart/Order/Profile/Upload

- Cart (bo moi):
  - `GET /api/cart`
  - `POST /api/cart/items`
  - `PATCH /api/cart/items/:id`
  - `DELETE /api/cart/items/:id`
  - `PUT /api/cart`
- Cart legacy (giu de tuong thich):
  - `POST /api/cart`
  - `PUT /api/cart/:itemId`
  - `DELETE /api/cart/:itemId`
- Orders (user scope):
  - `POST /api/orders`
  - `GET /api/orders`
  - `GET /api/orders/:id`
- Profile:
  - `GET /api/profile`
  - `PUT /api/profile`
  - `POST /api/profile/avatar/presign`
- Upload asset:
  - `POST /api/uploads/presign` (ADMIN/MODERATOR)

### Admin/User/Role/Inventory

- Users (ADMIN):
  - `GET /api/users`
  - `GET /api/users/:id`
  - `POST /api/users`
  - `PUT /api/users/:id`
  - `DELETE /api/users/:id`
  - `POST /api/users/enable`
  - `POST /api/users/disable`
- Roles (ADMIN):
  - `GET /api/roles`
  - `GET /api/roles/:id`
  - `POST /api/roles`
  - `PUT /api/roles/:id`
  - `DELETE /api/roles/:id`
- Inventories (ADMIN):
  - `GET /api/inventories`
  - `GET /api/inventories/:id`
  - `POST /api/inventories/add-stock`
  - `POST /api/inventories/remove-stock`
  - `POST /api/inventories/reservation`
  - `POST /api/inventories/sold`
  - `GET /api/inventories/idempotency/:action/:key`

## 1.2 Chua hoan thien (hoac moi o muc co ban)

- `POST /api/auth/resetpassword/:token`:
  - Hien tra `501` (chua implement flow reset password full).
- `POST /api/auth/forgotpassword`:
  - Dang o muc co ban, chua la full flow recovery production-ready.
- Cac khoi admin tong hop chua co API contract backend rieng:
  - Dashboard aggregate
  - Calendar event CRUD
  - Admin orders toan he thong + update status
  - Banner CRUD
  - Voucher CRUD + rule nghiep vu
  - SEO settings read/write

---

## 2) Backend da ket noi frontend vs backend chua ket noi frontend

## 2.1 Da ket noi frontend (dang duoc FE goi API that)

- Health: `GET /api/health`
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/change-password`
- Catalog:
  - `GET /api/categories`
  - `GET /api/products`
  - `GET /api/products/:id`
  - `GET /api/products/featured`
  - `POST /api/products/:id/fetch-specs`
- Cart (bo moi):
  - `GET /api/cart`
  - `POST /api/cart/items`
  - `PATCH /api/cart/items/:id`
  - `DELETE /api/cart/items/:id`
  - `PUT /api/cart`
- Orders user:
  - `POST /api/orders`
  - `GET /api/orders`
  - `GET /api/orders/:id`
- Profile:
  - `GET /api/profile`
  - `PUT /api/profile`
  - `POST /api/profile/avatar/presign`
- Admin products/categories/uploads:
  - `POST /api/products` (ADMIN)
  - `PUT /api/products/:id` (ADMIN)
  - `DELETE /api/products/:id` (ADMIN)
  - `POST /api/categories` (ADMIN)
  - `POST /api/uploads/presign` (ADMIN/MODERATOR)

## 2.2 Chua ket noi frontend (backend co, FE chua goi)

- Auth:
  - `POST /api/auth/logout` (FE hien tai logout local, chua goi API)
  - `POST /api/auth/forgotpassword`
  - `POST /api/auth/resetpassword/:token`
- Categories:
  - `GET /api/categories/:id`
  - `GET /api/categories/slug/:slug`
  - `GET /api/categories/children/slug/:slug`
  - `GET /api/categories/:id/products`
  - `PUT /api/categories/:id` (ADMIN)
  - `DELETE /api/categories/:id` (ADMIN)
- Products:
  - `GET /api/products/slug/:slug`
- Users (ADMIN): toan bo route users chua co FE calling thuc te
- Roles (ADMIN): toan bo route roles chua co FE calling thuc te
- Inventories (ADMIN): toan bo route inventories chua co FE calling thuc te
- Cart legacy:
  - `POST /api/cart`
  - `PUT /api/cart/:itemId`
  - `DELETE /api/cart/:itemId`

---

## 3) Backend da ket noi voi frontend tuong ung

## 3.1 Cap tuong ung da on

- Storefront user flow:
  - `techhome-e-commerce/src/services/backend.ts`
  - Da map duoc phan lon contract can cho luong mua hang: auth, products, categories, cart, orders, profile.
- Admin products flow:
  - `src/pages/admin/products/ProductListPage.tsx`
  - `src/pages/admin/products/ProductFormPage.tsx`
  - `src/pages/admin/products/ProductImageUpload.tsx`
  - Da ket noi API that cho CRUD product + upload + create category nhanh.

## 3.2 Cap tuong ung co nhung moi ket noi mot phan

- Catalog categories:
  - FE da dung `GET /categories`, nhung chua dung nhieu endpoint category con lai.
- Auth lifecycle:
  - FE da co login/register/me/change-password, nhung logout chua goi backend logout endpoint.

---

## 4) Backend va frontend tuong ung nhung frontend chua phu hop/chua cover het

## 4.1 Co backend, FE chua cover hoac cover 0%

- Users admin:
  - Backend da co CRUD + enable/disable
  - FE chua co module goi API users.
- Roles admin:
  - Backend da co CRUD roles
  - FE chua co module quan ly role that.
- Inventory admin:
  - Backend da co stock/reservation/sold + idempotency
  - FE chua co trang/module goi inventory API that.

## 4.2 FE co man hinh nhung van mock, chua phu hop backend hien co

- Admin dashboard:
  - FE dang dung `dashboardMockData`
  - Backend chua co dashboard aggregate endpoints.
- Admin calendar:
  - FE dang dung `calendarMockData`
  - Backend chua co event CRUD API.
- Admin orders list:
  - FE dang dung `orderListMock`
  - Backend hien la user-scoped orders, chua co admin all-orders + update status.
- Admin stock page:
  - FE dang dung `productStockMock`
  - Chua map vao `/inventories/*`.
- Admin banner/voucher/seo:
  - FE dang dung `adminMockStore` local data
  - Backend chua co CRUD tuong ung cho cac khoi nay.

## 4.3 FE cover mot phan, nhung hanh vi chua khop backend

- Logout:
  - FE logout local (`clearToken`) nhung khong goi `POST /api/auth/logout`.
- Categories/products:
  - FE chu yeu goi endpoint list/create/update co ban.
  - Cac endpoint detail theo slug/children/products-by-category chua duoc khai thac.

---

## 5) Ket luan ngan

- Backend `backend_nodejs` hien da day du cho luong mua hang user + admin products.
- Khoang trong lon nam o admin modules nang cao (dashboard/calendar/orders all-system/banner/voucher/seo) va ket noi FE cho users/roles/inventories.
- Tai lieu nay co the dung lam baseline de lap ke hoach migrate het mock sang API that theo tung khoi.

---