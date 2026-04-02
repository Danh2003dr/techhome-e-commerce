# Phân tích frontend NodeJS (TechHome) — chuẩn giao diện

Phạm vi: **chỉ frontend** trong repo `techhome-e-commerce` (React + Vite + TypeScript, `react-router-dom` v7).  
**Router:** `HashRouter` (`src/App.tsx`) → URL thực tế dạng `/#/...` (ví dụ `/#/product/...`).

---

## 1. Danh sách route (`src/routes/AppRoutes.tsx`)

| Route | Component |
|--------|-----------|
| `/` | `HomePage` |
| `/search` | `SearchResults` |
| `/product/:slug` | `ProductDetail` |
| `/cart` | `CartPage` |
| `/checkout` | `CheckoutPage` |
| `/deals` | `ProductListingPage` |
| `/category/:slug` | `CategoryDynamicPage` |
| `/profile` | `ProfilePage` |
| `/order-confirmation` | `Navigate` → `/orders` |
| `/order-confirmation/:orderId` | `OrderConfirmationPage` |
| `/login` | `LoginPage` |
| `/signup` | `SignUpPage` |
| `/forgot-password` | `ForgotPasswordPage` |
| `/reset-password/:token` | `ResetPasswordPage` |
| `/orders` | `OrderHistoryPage` |
| `/order/:orderId` | `OrderDetailsPage` |
| `/403` | `ForbiddenPage` |
| `/admin` | `Navigate` → `/admin/dashboard` |
| `/admin/dashboard` | `DashboardPage` |
| `/admin/calendar` | `CalendarPage` |
| `/admin/vouchers` | `VoucherBuilderPage` |
| `/admin/products` | `ProductListPage` |
| `/admin/products/stock` | `ProductStockPage` |
| `/admin/products/new` | `ProductFormPage` |
| `/admin/products/:id` | `ProductFormPage` |
| `/admin/orders/invoice` | `InvoicePage` |
| `/admin/orders` | `OrderListPage` |
| `/admin/orders/:orderId` | `OrderDetailPage` |
| `/admin/seo` | `SEOSettingsPage` |
| `/*` | `NotFoundPage` |

Nhánh `/admin/*` bọc trong `AdminRoute` (đăng nhập + `role === 'ADMIN'`).

**Cần kiểm tra / không nằm trong routing:** `MobileCategoryPage`, `AudioCategoryPage`, `AccessoriesCategoryPage`, `AdminDashboardPage`, `OrderListsVariantPage`; `PrivateRoute.tsx`; `components/layout/Sidebar.tsx` — không thấy dùng trong `AppRoutes`.

---

## 2. Layout & component dùng lại nhiều

- **Storefront:** `MainLayout` → `Header` + `Outlet` + `Footer`.
- **Tài khoản:** `AccountHeader` + `AccountSidebar` + nội dung + `AccountFooter` (`/profile`, `/orders`, `/order/:id`).
- **Admin:** `AdminLayout` → `AdminSidebar` + `AdminTopbar` + `Outlet`.
- **Listing:** `ProductListingLayout` + `ProductCard`; danh mục động: `CategoryPageTemplate` + `categoryTemplates`.
- **Chung:** `StarRating`, `Breadcrumbs` (store) / `Breadcrumb` (account), `CheckoutStepper` + các bước checkout.

**Context app:** `AuthContext`, `AvatarContext`, `CartContext`, `CheckoutContext` (`App.tsx`).

---

## 3. Bảng module / trang

| Module/Trang | Route | Mục đích | Layout chính | Component chính | Ghi chú |
|--------------|-------|----------|--------------|-----------------|--------|
| **Home** | `/` | Landing: intro + CTA, SP nổi bật, điều hướng mua sắm | `MainLayout` | `HomePage`, `StarRating` | API featured; thêm giỏ từ card |
| **Tìm kiếm / hub** | `/search` | Kết quả `?q=`, `?category=`, `?sort=` | `MainLayout` | `SearchResults`, `ProductCard` | Chỉ `?category=` → redirect `/category/:slug` |
| **Danh mục động** | `/category/:slug` | PLP theo API, chip con, sort, phân trang | `MainLayout` | `CategoryDynamicPage` → `CategoryPageTemplate`, `ProductListingLayout` | Template theo nhánh; cần `VITE_API_URL` |
| **Ưu đãi / deals** | `/deals` | Danh sách SP (nhãn “Ưu đãi”), sort + phân trang | `MainLayout` | `ProductListingPage`, `ProductListingLayout` | API products không lọc category |
| **Chi tiết SP** | `/product/:slug` | Chi tiết, biến thể, đánh giá, thêm giỏ | `MainLayout` | `ProductDetail`, `Breadcrumbs` | Đánh giá qua `reviewsStore` nếu đăng nhập |
| **Giỏ** | `/cart` | SL, báo giá, mã giảm | `MainLayout` | `CartPage` | Quote API; rỗng → chặn checkout |
| **Checkout** | `/checkout` | Bước 1 địa chỉ, bước 2 thanh toán; giỏ rỗng → `/cart` | `MainLayout` | `CheckoutStepper`, `CheckoutStep1`, `CheckoutStep3`, `PaymentTabs` | `CheckoutContext`: 2 bước; đặt hàng → `/order-confirmation/:id` |
| **Xác nhận đơn** | `/order-confirmation/:orderId` | Cảm ơn + tóm tắt | Nav mini riêng (không `MainLayout`) | `OrderConfirmationPage` | Cần đăng nhập + API |
| **Đăng nhập** | `/login` | Đăng nhập | Full page | `LoginPage` | `state.from`; không API → `/profile` |
| **Đăng ký** | `/signup` | Tạo tài khoản | Full page | `SignUpPage` | — |
| **Quên MK** | `/forgot-password` | Quên mật khẩu | Full page | `ForgotPasswordPage` | — |
| **Reset MK** | `/reset-password/:token` | Đặt lại MK | Full page | `ResetPasswordPage` | — |
| **Hồ sơ** | `/profile` | Sửa thông tin, avatar, MK | Account layout | `ProfilePage`, `AccountSidebar` | Chưa login → `/login` |
| **Lịch sử đơn** | `/orders` | Danh sách đơn API | Account layout | `OrderHistoryPage` | Khách: không load API |
| **Chi tiết đơn (KH)** | `/order/:orderId` | Chi tiết đơn | Account layout | `OrderDetailsPage` | Cần auth + API |
| **403** | `/403` | Không quyền | Minimal | `ForbiddenPage` | `AdminRoute` non-admin |
| **404** | `/*` | Không tìm thấy | Minimal | `NotFoundPage` | — |
| **Admin Dashboard** | `/admin/dashboard` | Thống kê, đơn gần đây, low stock | `AdminLayout` | `DashboardPage`, `StatCard`, `LowStockTable` | `AdminRoute` |
| **Admin Calendar** | `/admin/calendar` | Lịch khuyến mãi (mock local) | `AdminLayout` | `CalendarPage`, `MonthCalendar`, `EventModal` | Demo data |
| **Admin Vouchers** | `/admin/vouchers` | Voucher | `AdminLayout` | `VoucherBuilderPage` | — |
| **Admin SP — list** | `/admin/products` | Danh sách / CRUD | `AdminLayout` | `ProductListPage`, `AdminProductsTabs` | — |
| **Admin SP — tồn** | `/admin/products/stock` | Tồn kho | `AdminLayout` | `ProductStockPage`, `ProductStockTable` | — |
| **Admin SP — form** | `/admin/products/new`, `/admin/products/:id` | Tạo/sửa SP | `AdminLayout` | `ProductFormPage` | — |
| **Admin đơn — list** | `/admin/orders` | Lọc, bảng đơn | `AdminLayout` | `OrderListPage`, `OrderTable` | Có mock trong code |
| **Admin đơn — chi tiết** | `/admin/orders/:orderId` | Chi tiết + đổi trạng thái | `AdminLayout` | `OrderDetailPage`, `OrderStatusChanger` | — |
| **Admin hóa đơn** | `/admin/orders/invoice` | Invoice | `AdminLayout` | `InvoicePage` | Route tĩnh trước `:orderId` |
| **Admin SEO** | `/admin/seo` | Cài đặt SEO | `AdminLayout` | `SEOSettingsPage` | — |

---

## 4. Phân loại

- **Cốt lõi storefront:** Home, search/danh mục, PDP, giỏ, checkout.
- **Phụ / hỗ trợ:** deals, xác nhận đơn, forgot/reset, 403/404.
- **Tài khoản:** profile, lịch sử, chi tiết đơn.
- **Admin:** toàn bộ `/admin/*` sau `AdminRoute`.
- **Shared:** `MainLayout`, `Header`/`Footer`, `ProductListingLayout`, `ProductCard`, `CategoryPageTemplate`, layout account, layout admin, `CheckoutStepper` + steps, `StarRating`, breadcrumbs.

**Flow người dùng:** Duyệt → PLP/PDP → giỏ → checkout (2 bước) → `order-confirmation/:id` → (tuỳ chọn) `/orders`, `/order/:id`.  
**Flow admin:** Login ADMIN → dashboard và quản lý catalog, đơn, marketing, SEO; calendar dùng dữ liệu demo FE.

---

## 5. Route quan trọng nhất

- `/`, `/category/:slug`, `/search`, `/product/:slug` — khám phá & mua.
- `/cart`, `/checkout` — chốt đơn.
- `/login`, `/profile`, `/orders` — người dùng & đơn.
- `/admin/dashboard`, `/admin/products`, `/admin/orders` — trục admin.

---

## 6. Layout / component tái sử dụng nhiều nhất

- `MainLayout` + `Header` + `Footer` — storefront.
- `ProductListingLayout` + `ProductCard` — listing.
- `AccountHeader` / `AccountSidebar` / `AccountFooter` — tài khoản.
- `AdminLayout` + `AdminSidebar` + `AdminTopbar` — admin.
- `CheckoutContext` + `CheckoutStepper` + các bước checkout.

---

## 7. Flow quan trọng nhất (FE)

1. **Mua hàng:** điều hướng danh mục/header → PLP → PDP → giỏ → (tuỳ chọn) đăng nhập → checkout → xác nhận đơn.
2. **Tài khoản:** đăng nhập → profile / lịch sử → chi tiết đơn.
3. **Admin:** đăng nhập admin → dashboard và quản lý (catalog, đơn, voucher, SEO); lịch là module riêng (mock).

---

*Mục đích: cái nhìn có cấu trúc về frontend NodeJS làm chuẩn giao diện cho bước tiếp theo. Không so sánh Spring; các file không gắn route cần xác nhận trước khi coi là chuẩn thay thế.*
