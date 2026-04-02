# Frontend-Backend Gap Checklist

Muc dich: theo doi ro cac phan da migrate sang API that, phan chua thuc hien, va phan chua the thuc hien do backend chua du endpoint/contract.

Cap nhat: 2026-03-26

---

## 1) Da migrate sang API that

### Storefront/User flow

- `src/services/backend.ts`
  - Da dung dung contract cho cart: `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id`, `PUT /cart`.
- `src/pages/account/OrderHistoryPage.tsx`
  - Da bo fallback mock order history, doc tu `GET /orders`.
- `src/pages/account/OrderDetailsPage.tsx`
  - Da bo fallback mock order detail, doc tu `GET /orders/:id`.
- `src/pages/store/ProductDetail.tsx`
  - Product chinh doc tu API (`GET /products/:id`), khong con fallback product mock.

### Admin - Products (uu tien 1 da xong)

- `src/pages/admin/products/ProductListPage.tsx`
  - Da bo `MOCK_PRODUCTS`, doc danh sach tu `GET /products`.
- `src/pages/admin/products/ProductFormPage.tsx`
  - Da bo luu/load local mock store.
  - Da dung API that:
    - `GET /categories`
    - `GET /products/:id`
    - `POST /products`
    - `PUT /products/:id`
    - `POST /categories` (quick add category)
- `src/services/backend.ts`
  - Da them ham admin product/category:
    - `createAdminProduct`
    - `updateAdminProduct`
    - `deleteAdminProduct`
    - `createAdminCategory`

---

## 2) Chua thuc hien (con mock o frontend)

## 2.1 Admin Dashboard (mock data)

- Files:
  - `src/pages/admin/DashboardPage.tsx`
  - `src/pages/admin/dashboard/dashboardMockData.ts`
  - `src/pages/admin/dashboard/*` (charts, deals, segments)
- Trang thai: chua migrate API.

## 2.2 Admin Calendar (mock events)

- Files:
  - `src/pages/admin/CalendarPage.tsx`
  - `src/pages/admin/calendar/calendarMockData.ts`
  - `src/pages/admin/calendar/EventModal.tsx`
- Trang thai: chua migrate API.

## 2.3 Admin Orders List (mock order list)

- Files:
  - `src/pages/admin/orders/OrderListPage.tsx`
  - `src/pages/admin/orders/orderListMock.ts`
  - `src/pages/admin/orders/components/*`
- Trang thai: chua migrate API.

## 2.4 Admin Product Stock page (mock stock table)

- Files:
  - `src/pages/admin/products/ProductStockPage.tsx`
  - `src/pages/admin/products/productStockMock.ts`
  - `src/pages/admin/products/components/ProductStockTable.tsx`
  - `src/pages/admin/products/components/ProductStockModal.tsx`
- Trang thai: chua migrate API.

## 2.5 Admin Voucher/SEO

- Voucher:
  - `src/pages/admin/vouchers/VoucherBuilderPage.tsx`
- SEO:
  - `src/pages/admin/seo/SEOSettingsPage.tsx`
- Trang thai: chua migrate API.

---

## 3) Chua thuc hien duoc (block boi backend/API)

Luu y: cac muc duoi day khong nen ep bo mock truoc khi backend bo sung endpoint ro rang.

1. Admin Dashboard aggregate API
   - Thieu endpoint KPI/timeseries/deals/segment.
   - Can mot contract dashboard tong hop thay vi doc truc tiep tu products/orders raw.

2. Admin Calendar event CRUD API
   - Thieu endpoint event:
     - list/create/update/delete
   - Can schema event cho promo campaign.

3. Admin Orders toan he thong + cap nhat trang thai
   - Hien co `GET /orders`, `GET /orders/:id` la theo user dang nhap.
   - Thieu endpoint admin:
     - list all orders (filter/paging)
     - update order status.

4. Admin Stock management contract
   - Chua co endpoint rieng cho stock table theo UI admin (search/sort/edit nhanh).
   - Can thong nhat dung product CRUD hien co hay tao inventory endpoint rieng.

5. Admin Voucher/SEO API
   - Thieu CRUD vouchers + business rule validate.
   - Thieu read/write SEO settings.

---

## 4) Checklist hanh dong tiep theo

## FE co the lam ngay (khong doi backend)

- [ ] Don dep import/type mock con sot trong admin products components (neu khong can nua).
- [ ] Chuan hoa error/loading state cho ProductForm/ProductList theo cung pattern.
- [ ] Viet test smoke cho create/update product flow.

## Can backend bo sung truoc

- [ ] Admin order endpoints (all orders + update status).
- [ ] Dashboard aggregate endpoints.
- [ ] Calendar event CRUD endpoints.
- [ ] Voucher/SEO endpoints.
- [ ] (Neu can) stock-specific endpoints.

---

## 5) Dinh nghia "done" cho pha bo mock admin

- Khong con import `dashboardMockData`, `calendarMockData`, `orderListMock`, `productStockMock` trong code runtime.
- Cac page admin uu tien cao (products, orders, dashboard) doc/ghi tu API that.
- Cac mock con lai chi nam trong test/dev-only path, khong nam trong luong runtime chinh.

