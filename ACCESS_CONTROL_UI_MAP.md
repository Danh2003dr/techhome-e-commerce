# Bản đồ giao diện + phân quyền + truy cập — TechHome E‑Commerce

> Workspace: `E:\webbandienthoai\techhome-e-commerce`  
> Nguồn tổng hợp: code hiện tại (đặc biệt `src/routes/AppRoutes.tsx`, `src/routes/PrivateRoute.tsx`) + docs nội bộ (`PROJECT_STATUS.md`, `FRONTEND_REQUIREMENTS.md`, `PROGRESS_REPORT.md`).
>
> Mục tiêu file này: trả lời rõ “**Dự án có những giao diện nào, cho ai, phân quyền ra sao, truy cập như nào**”.

---

## 1) Tóm tắt nhanh (đúng theo code hiện tại)

- **Có 2 phân hệ chính về UI**:
  - **Client/Store (khách hàng)**: đã có nhiều trang (Home, Listing, Detail, Cart, Checkout, Search…).
  - **Admin (quản trị)**: **chưa có** trong code hiện tại (mới nằm ở phần yêu cầu).
- **Phân quyền / bảo vệ route (auth)**:
  - Có `PrivateRoute` nhưng đang **stub**: `isAuthenticated = true`.
  - `AppRoutes.tsx` hiện **chưa áp dụng `PrivateRoute`** cho bất kỳ route nào.
  - Kết quả: **mọi route đều truy cập được** (không chặn đăng nhập).

---

## 2) Persona (ai dùng hệ thống?)

### 2.1 Khách vãng lai (Guest)
- Xem trang chủ, duyệt sản phẩm, xem chi tiết, tìm kiếm.
- Có thể vào các trang “Account” theo route hiện tại (nhưng về mặt nghiệp vụ thường không nên).

### 2.2 Người dùng đã đăng nhập (Customer/User)
- Tất cả hành vi của Guest + quản lý hồ sơ, địa chỉ, wishlist, xem lịch sử/chi tiết đơn hàng.
- Theo yêu cầu tương lai: checkout/đặt hàng thường gắn với user.

### 2.3 Quản trị viên (Admin)
- Theo tài liệu yêu cầu: quản lý sản phẩm/đơn hàng/SEO + tiện ích nội bộ.
- **Lưu ý**: hiện tại **chưa có** `src/pages/admin/*` và chưa có route `/admin`.

---

## 3) Danh sách giao diện (Screens) theo route hiện có

> Tham chiếu: `src/routes/AppRoutes.tsx`

### 3.1 Nhóm Store/Client (dùng `MainLayout` = Header/Footer)

| Route | Màn hình | File page | Ai dùng | Yêu cầu đăng nhập (hiện tại) |
|---|---|---|---|---|
| `/` | Home | `src/pages/store/HomePage.tsx` | Guest/User | Không |
| `/search` | Search Results | `src/pages/store/SearchResults.tsx` | Guest/User | Không |
| `/product/:id` | Product Detail | `src/pages/store/ProductDetail.tsx` | Guest/User | Không |
| `/deals` | Product Listing / Deals | `src/pages/store/ProductListingPage.tsx` | Guest/User | Không |
| `/category/mobile` | Category: Mobile | `src/pages/store/MobileCategoryPage.tsx` | Guest/User | Không |
| `/category/accessories` | Category: Accessories | `src/pages/store/AccessoriesCategoryPage.tsx` | Guest/User | Không |
| `/category/audio` | Category: Audio | `src/pages/store/AudioCategoryPage.tsx` | Guest/User | Không |
| `/cart` | Cart | `src/pages/checkout/CartPage.tsx` | Guest/User | Không |
| `/checkout` | Checkout | `src/pages/checkout/CheckoutPage.tsx` | Guest/User | Không |

### 3.2 Nhóm Auth (không dùng `MainLayout`)

| Route | Màn hình | File page | Ai dùng | Yêu cầu đăng nhập (hiện tại) |
|---|---|---|---|---|
| `/login` | Login | `src/pages/auth/LoginPage.tsx` | Guest | Không |
| `/signup` | Sign Up | `src/pages/auth/SignUpPage.tsx` | Guest | Không |
| `/forgot-password` | Forgot Password | `src/pages/auth/ForgotPasswordPage.tsx` | Guest | Không |

### 3.3 Nhóm Account / Orders (không dùng `MainLayout`)

| Route | Màn hình | File page | Ai dùng | Yêu cầu đăng nhập (hiện tại) |
|---|---|---|---|---|
| `/profile` | Profile | `src/pages/account/ProfilePage.tsx` | User *(nên)* | **Không (stub)** |
| `/orders` | Order History | `src/pages/account/OrderHistoryPage.tsx` | User *(nên)* | **Không (stub)** |
| `/order/:orderId` | Order Details | `src/pages/account/OrderDetailsPage.tsx` | User *(nên)* | **Không (stub)** |
| `/warranty` | Warranty | `src/pages/account/WarrantyPage.tsx` | User *(nên)* | **Không (stub)** |
| `/account/addresses` | Saved Addresses | `src/pages/account/SavedAddressesPage.tsx` | User *(nên)* | **Không (stub)** |
| `/wishlist` | Wishlist | `src/pages/account/WishlistPage.tsx` | User *(nên)* | **Không (stub)** |

### 3.4 Nhóm Order Confirmation + 404

| Route | Màn hình | File page | Ai dùng | Yêu cầu đăng nhập (hiện tại) |
|---|---|---|---|---|
| `/order-confirmation` | Order Confirmation | `src/pages/checkout/OrderConfirmationPage.tsx` | Guest/User | Không |
| `/order-confirmation/:orderId` | Order Confirmation (by id) | `src/pages/checkout/OrderConfirmationPage.tsx` | Guest/User | Không |
| `/*` | Not Found | `src/pages/NotFoundPage.tsx` | All | Không |

---

## 4) Phân quyền (Authorization) — hiện tại vs mục tiêu

### 4.1 Hiện tại (AS‑IS)
- **Không có role-based access control (RBAC)**.
- `PrivateRoute` tồn tại nhưng:
  - `isAuthenticated` đang hardcode `true`.
  - Chưa được dùng trong `AppRoutes.tsx`.
- Không có:
  - AuthContext/token storage/refresh token.
  - Guard theo vai trò (admin/user).
  - Redirect sau login dựa trên `from`.

### 4.2 Mục tiêu hợp lý (TO‑BE) đề xuất

> Đây là “đề xuất chuẩn” cho e-commerce; có thể điều chỉnh theo nghiệp vụ/back-end.

#### Rule A — Public routes (không cần đăng nhập)
- `/`, `/search`, `/product/:id`, `/deals`, `/category/*`
- Auth pages: `/login`, `/signup`, `/forgot-password`

#### Rule B — User routes (cần đăng nhập)
- `/profile`, `/orders`, `/order/:orderId`, `/wishlist`, `/account/addresses`, `/warranty`
- `/checkout` *(thường cần, tùy: có thể cho guest checkout nhưng sẽ phức tạp hơn)*

#### Rule C — Admin routes (cần đăng nhập + role = admin)
- Dự kiến: `/admin/*` (chưa có trong code hiện tại)

---

## 5) Truy cập như nào? (luồng truy cập & chặn)

### 5.1 Luồng chặn chuẩn khi dùng `PrivateRoute`
- Khi user truy cập route cần auth:
  - Nếu chưa đăng nhập → redirect sang `/login`
  - Kèm `state.from = location` để login xong quay lại trang trước đó.

> Code hiện có đã “gợi ý” cơ chế này trong `src/routes/PrivateRoute.tsx` nhưng chưa bật thật.

### 5.2 Cách “áp” bảo vệ route (mô tả cấp cao)
- Với các route User routes: wrap element bằng `<PrivateRoute>...</PrivateRoute>`.
- Với Admin: tạo thêm guard `AdminRoute` (hoặc reuse `PrivateRoute` + check role).

---

## 6) Những điểm cần lưu ý (gap so với yêu cầu)

### 6.1 Admin UI
- Tài liệu yêu cầu có Admin dashboard + CRUD + socket orders + SEO + inbox/calendar/todo
- **Code hiện tại chưa có**.

### 6.2 Auth/JWT
- `FRONTEND_REQUIREMENTS.md` yêu cầu JWT auth + refresh token + protected routes
- **Hiện tại chưa có**, PrivateRoute đang stub.

---

## 7) File tham chiếu nhanh trong repo

- `src/routes/AppRoutes.tsx` — định nghĩa tất cả route hiện có
- `src/routes/PrivateRoute.tsx` — khung bảo vệ route (stub)
- `PROJECT_STATUS.md` — snapshot kỹ thuật + tình trạng
- `FRONTEND_REQUIREMENTS.md` — yêu cầu frontend (client + admin + auth)
- `PROGRESS_REPORT.md` — tiến độ (UI đã có / thiếu)


