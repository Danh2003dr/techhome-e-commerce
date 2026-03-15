# So sánh Backend vs Giao diện (Frontend) đã làm

## Backend đã có (backend/server.js)

| Chức năng | Endpoint | Ghi chú |
|-----------|----------|--------|
| Health | `GET /api/health` | Kiểm tra API sống |
| Danh mục | `GET /api/categories` | Trả về categories (id, name, slug) |
| Sản phẩm | `GET /api/products`, `GET /api/products/featured`, `GET /api/products/:id` | Giá VND, ảnh CDN, specs, colors, storageOptions |
| Đăng nhập / Đăng ký | `POST /api/auth/login`, `POST /api/auth/register` | User trả về: `id`, `name`, `email` (không có phone, gender, ngày sinh) |
| Đơn hàng | `POST /api/orders`, `GET /api/orders` | Tạo đơn, lấy lịch sử đơn (cần auth) |
| Giỏ hàng | `GET /api/cart`, `POST /api/cart/items`, `PATCH /api/cart/items/:id`, `DELETE /api/cart/items/:id`, `PUT /api/cart` | Đồng bộ giỏ theo user (cần auth) |

---

## Backend Spring Boot đã bổ sung (webdienthoai)

*(Code trong `backend/backend_springboot/webdienthoai/webdienthoai/`)*

| Chức năng | Endpoint | Ghi chú |
|-----------|----------|--------|
| **Profile** | `GET /api/profile`, `PATCH /api/profile` | User mở rộng: phone, gender, dateOfBirth, defaultAddress |
| **Wishlist** | `GET /api/wishlist`, `POST /api/wishlist/items` (body: `productId`), `DELETE /api/wishlist/items/{productId}` | Bảng `wishlist_items` |
| **Địa chỉ** | `GET /api/addresses`, `POST /api/addresses`, `PATCH /api/addresses/{id}`, `DELETE /api/addresses/{id}` | Bảng `addresses` |
| **Đổi mật khẩu** | `POST /api/auth/change-password` (body: `currentPassword`, `newPassword`) | Trong AuthController |

Tất cả endpoint trên yêu cầu **Authorization: Bearer &lt;token&gt;** (đã đăng nhập).

---

## Các phần giao diện đã làm (trước đây chưa có backend)

### 1. Yêu thích (Wishlist) — ✅ Đã có Spring Boot
- **Frontend:** `WishlistContext` lưu danh sách yêu thích trong **localStorage** (`techhome_wishlist`).
- **Backend:** Chưa có API wishlist.
- **Đề xuất backend:** Thêm `GET /api/wishlist`, `POST /api/wishlist/items` (body: `productId`), `DELETE /api/wishlist/items/:productId`, lưu theo `userId` (tương tự cart).

### 2. Thông tin cá nhân (Profile mở rộng) — ✅ Đã có Spring Boot
- **Frontend:** Họ tên, SĐT, Giới tính, Email, Ngày sinh, Địa chỉ mặc định — lưu trong **localStorage** (`techhome_profile`). Nút "Cập nhật" chỉ cập nhật localStorage.
- **Backend:** Chỉ có user `id`, `name`, `email` từ login/register. Không có API cập nhật profile (phone, gender, dateOfBirth, defaultAddress).
- **Đề xuất backend:**  
  - Mở rộng user (trong bộ nhớ hoặc DB): `phone`, `gender`, `dateOfBirth`, `defaultAddressId` hoặc `defaultAddress` (string).  
  - Thêm `GET /api/profile` (hoặc `GET /api/users/me`) và `PATCH /api/profile` (body: `name`, `phone`, `gender`, `dateOfBirth`, `defaultAddress`).

### 3. Sổ địa chỉ — ✅ Đã có Spring Boot
- **Frontend:** Trang `/account/addresses` (SavedAddressesPage) dùng dữ liệu mock từ `@/data` (savedAddresses). Chưa gọi API.
- **Backend:** Chưa có API địa chỉ.
- **Đề xuất backend:**  
  - `GET /api/addresses` — danh sách địa chỉ của user.  
  - `POST /api/addresses` — thêm địa chỉ.  
  - `PATCH /api/addresses/:id` — sửa địa chỉ.  
  - `DELETE /api/addresses/:id` — xóa địa chỉ.  
  - Trường: name, phone, street, apartment, city, state, zipCode, country, label (Home/Office/Other), isDefault.

### 4. Mật khẩu — ✅ Đã có Spring Boot
- **Frontend:** Chỉ hiển thị "Cập nhật lần cuối lúc: ..." (lưu trong localStorage) và nút "Thay đổi mật khẩu" (chỉ cập nhật thời gian trong localStorage). Chưa có form đổi mật khẩu thật.
- **Backend:** Không có endpoint đổi mật khẩu.
- **Đề xuất backend:** `POST /api/auth/change-password` (body: `currentPassword`, `newPassword`), kiểm tra `currentPassword` đúng với user đang đăng nhập rồi cập nhật password (trong bộ nhớ/DB).

### 5. Tài khoản liên kết (Google, Zalo)
- **Frontend:** Chỉ UI trạng thái "Đã liên kết" / "Chưa liên kết" và nút "Hủy liên kết" / "Liên kết". Chưa gọi API.
- **Backend:** Chưa có OAuth (Google, Zalo) và API liên kết/hủy liên kết.
- **Đề xuất backend:**  
  - OAuth flow (Google, Zalo) + lưu `googleId`, `zaloId` (hoặc tương đương) vào user.  
  - `GET /api/profile` trả thêm `linkedGoogle`, `linkedZalo`.  
  - `POST /api/auth/link/google` hoặc tương tự, `DELETE /api/auth/unlink/google`, v.v.

---

## Tóm tắt

| Phần giao diện | Backend có chưa? | Lưu trữ hiện tại |
|----------------|------------------|-------------------|
| Sản phẩm, giá VND, ảnh, màu/dung lượng | Có | API backend |
| Giỏ hàng | Có | API backend (khi đăng nhập) + localStorage (khi chưa đăng nhập) |
| Đăng nhập / Đăng ký | Có | API backend |
| Đơn hàng | Có | API backend |
| **Yêu thích (Wishlist)** | **Có (Spring Boot)** | API khi đăng nhập, localStorage khi chưa đăng nhập |
| **Thông tin cá nhân (phone, giới tính, ngày sinh, địa chỉ mặc định)** | **Có (Spring Boot)** | API `/api/profile` |
| **Sổ địa chỉ** | **Có (Spring Boot)** | API `/api/addresses` |
| **Mật khẩu (thay đổi mật khẩu)** | **Có (Spring Boot)** | API `/api/auth/change-password` |
| **Tài khoản liên kết (Google, Zalo)** | **Chưa** | **Chỉ UI** |

Nếu bạn muốn đồng bộ dữ liệu giữa các thiết bị hoặc lưu lâu dài trên server, cần bổ sung các API backend tương ứng cho từng mục in đậm ở bảng trên.
