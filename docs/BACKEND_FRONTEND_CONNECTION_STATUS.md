# Backend-Frontend Connection Status

Cap nhat: 2026-03-27

Tai lieu nay tong hop:

- Endpoint backend da ket noi vao frontend
- Endpoint backend chua ket noi
- Muc do san sang de ket noi (co the lam ngay / can luu y / chua hoan thien)

---

## 1) Da ket noi vao frontend (dang dung)

### Core storefront/user

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/change-password`
- `GET /categories`
- `GET /products`
- `GET /products/:id`
- `GET /products/featured`
- `POST /products/:id/fetch-specs`
- `GET /profile`
- `PUT /profile`
- `POST /profile/avatar/presign`
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:id`
- `DELETE /cart/items/:id`
- `PUT /cart`
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`

### Admin products/category (da co luong ket noi)

- `POST /categories` (ADMIN)
- `POST /products` (ADMIN)
- `PUT /products/:id` (ADMIN)
- `DELETE /products/:id` (ADMIN)
- `POST /uploads/presign` (ADMIN/MODERATOR)

---

## 2) Chua ket noi frontend nhung co the ket noi ngay

Nhom nay backend da san sang, frontend co the goi API ngay khi co man hinh/flow.

- `POST /auth/logout`
- `GET /categories/:id`
- `GET /categories/slug/:slug`
- `GET /categories/children/slug/:slug`
- `PUT /categories/:id` (ADMIN)
- `DELETE /categories/:id` (ADMIN)
- `GET /products/slug/:slug`
- `GET /users` (ADMIN)
- `GET /users/:id` (ADMIN)
- `POST /users` (ADMIN)
- `PUT /users/:id` (ADMIN)
- `DELETE /users/:id` (ADMIN)

---

## 3) Ket noi duoc nhung can luu y

### Auth recovery

- `POST /auth/forgotpassword`
  - Co endpoint, nhung hien o muc co ban (response don gian, phu thuoc cau hinh gui mail).

### Upload admin asset

- `POST /uploads/presign`
  - Da ket noi cho admin product flow.
  - Neu dung them cho luong moi: can role dung (`ADMIN`/`MODERATOR`) va cau hinh object storage day du.

### Legacy cart routes (khong khuyen nghi cho frontend moi)

- `POST /cart`
- `PUT /cart/:itemId`
- `DELETE /cart/:itemId`

Frontend hien dung bo route moi `/cart/items/*`; chi giu legacy de tuong thich nguoc.

---

## 4) Chua san sang ket noi (backend chua hoan thien)

- `POST /auth/resetpassword/:token` -> hien tra `501`
- Roles API:
  - `POST /roles` -> `501`
  - `PUT /roles/:id` -> `501`
  - `DELETE /roles/:id` -> `501`
  - `GET /roles` va `GET /roles/:id` hien mang tinh placeholder, chua co nghiep vu thuc te

---

## 5) Cac khoi tinh nang lon van chua co contract backend day du

Theo current gap checklist, frontend admin van con mock o cac khoi:

- Dashboard aggregate
- Calendar events CRUD
- Admin orders all-system + update status
- Stock management endpoint chuyen biet
- Banner/Voucher/SEO CRUD

Day la cac khoi can backend bo sung contract ro truoc khi migrate frontend sang API that.

---

## 6) Goi y uu tien tiep theo

1. Ket noi `POST /auth/logout` de dong bo hanh vi FE/BE khi dang xuat.
2. Bo sung UI admin users neu can quan tri tai khoan.
3. Chot contract cho admin orders + dashboard (2 khoi anh huong lon nhat den bo mock admin).
4. Hoan thien reset password flow (`/auth/resetpassword/:token`) de dong bo auth lifecycle.

