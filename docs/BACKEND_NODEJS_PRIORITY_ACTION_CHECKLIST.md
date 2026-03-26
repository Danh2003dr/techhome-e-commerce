# Backend NodeJS Priority Action Checklist

Tach tu: `BACKEND_NODEJS_FULL_STATUS_AUDIT.md` (phan checklist hanh dong uu tien).
Cap nhat: 2026-03-27

---

## 6) Checklist hanh dong uu tien (thuc hien ngay)

Muc tieu: giam mock nhanh nhat, tang coverage FE-BE that, va dong bo nghiep vu admin.

## 6.1 Uu tien P0 - Lam ngay (de, tac dong cao)

- [ ] FE goi that `POST /api/auth/logout` trong luong logout (thay vi chi `clearToken` local).
- [ ] FE bo sung man hinh "Quen mat khau" goi `POST /api/auth/forgotpassword` (muc basic).
- [ ] Backend implement `POST /api/auth/resetpassword/:token` (bo trang thai `501`).
- [ ] Cap nhat `BACKEND_FRONTEND_CONNECTION_STATUS.md` sau khi logout/reset password duoc ket noi.

## 6.2 Uu tien P1 - Hoan tat ket noi cac API backend da co (khong doi backend moi)

- [ ] Tao service FE cho `users` admin:
  - [ ] `GET /api/users`
  - [ ] `GET /api/users/:id`
  - [ ] `POST /api/users`
  - [ ] `PUT /api/users/:id`
  - [ ] `DELETE /api/users/:id`
  - [ ] `POST /api/users/enable`
  - [ ] `POST /api/users/disable`
- [ ] Tao service FE cho `roles` admin:
  - [ ] `GET /api/roles`
  - [ ] `GET /api/roles/:id`
  - [ ] `POST /api/roles`
  - [ ] `PUT /api/roles/:id`
  - [ ] `DELETE /api/roles/:id`
- [ ] Tao service FE cho `inventories` admin:
  - [ ] `GET /api/inventories`
  - [ ] `GET /api/inventories/:id`
  - [ ] `POST /api/inventories/add-stock`
  - [ ] `POST /api/inventories/remove-stock`
  - [ ] `POST /api/inventories/reservation`
  - [ ] `POST /api/inventories/sold`
- [ ] Remap `ProductStockPage` tu `productStockMock` sang `/inventories/*`.

## 6.3 Uu tien P2 - Dong bo contract cho khoi admin con mock lon

- [ ] Chot contract va implement backend cho Admin Orders:
  - [ ] List all orders (filter/paging)
  - [ ] Update order status
- [ ] Chot contract va implement backend cho Dashboard aggregate:
  - [ ] KPI cards
  - [ ] Revenue/Sales series
  - [ ] Segment/deals
- [ ] Chot contract va implement backend cho Calendar events CRUD:
  - [ ] list/create/update/delete event
- [ ] Chot contract va implement backend cho Banner/Voucher/SEO:
  - [ ] Banner CRUD
  - [ ] Voucher CRUD + validate rule
  - [ ] SEO settings read/write

## 6.4 Uu tien P3 - Don dep va chuan hoa sau migrate

- [ ] Loai bo import/runtime mock con lai:
  - [ ] `dashboardMockData`
  - [ ] `calendarMockData`
  - [ ] `orderListMock`
  - [ ] `productStockMock`
  - [ ] `adminMockStore` (voi runtime path da migrate)
- [ ] Chuan hoa loading/error/retry pattern cho toan bo admin pages.
- [ ] Bo sung smoke test cho cac luong admin da migrate API that.
- [ ] Cap nhat lai 3 tai lieu:
  - [ ] `BACKEND_FRONTEND_CONNECTION_STATUS.md`
  - [ ] `FRONTEND_BACKEND_GAP_CHECKLIST.md`
  - [ ] `IMPROVEMENT_ACTION_LIST.md`

## 6.5 Dinh nghia "xong pha migrate mock"

- [ ] Khong con trang admin chinh nao doc du lieu mock o runtime.
- [ ] Cac trang admin uu tien cao (products/orders/dashboard) doc-ghi API that.
- [ ] Cac API backend da co (users/roles/inventories) deu co FE flow toi thieu.
- [ ] Auth lifecycle day du: register/login/me/change-password/logout/forgot/reset.

