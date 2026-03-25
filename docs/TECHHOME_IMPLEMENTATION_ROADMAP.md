# TechHome backend — Lộ trình & hướng triển khai

Tài liệu tham chiếu khi implement: bám **`TECHHOME_BACKEND_API_SPEC.md`** (contract frontend) và **`MASTER_CODING_STANDARD.md`** (cấu trúc Express, middleware, quy ước repo). Cập nhật file này khi thay đổi quyết định kiến trúc hoặc thứ tự ưu tiên.

---

## 1. Ưu tiên giữa spec, Master và repo thực tế

| Nguồn | Vai trò |
|--------|--------|
| **TechHome API spec** | **Bắt buộc** khớp URL, HTTP method, JSON DTO, Bearer, CORS dev, nghiệp vụ đặt hàng/giỏ. Tiêu chí “done” với frontend `techhome-e-commerce`. |
| **Master Coding Standard** | **Cách tổ chức:** `routes/` → middleware (validator, `checkLogin`) → logic/controller/schema; quy ước tên file; JWT + cookie/header; thông điệp lỗi. |
| **Repo đang chạy** | **DB:** hiện dùng MySQL (`mysql2`) cho cart/profile — không bắt buộc chuyển Mongoose chỉ vì Master; có thể cập nhật Master cho khớt stack thật. |

**Nguyên tắc:** API theo **spec**; cấu trúc code và middleware theo **Master**; response lỗi JSON có **`message`** (string) để frontend parse (`ApiErrorBody`).

---

## 2. Hướng giải quyết tổng thể

1. **Một cây route dưới `/api`** trùng bảng endpoint trong spec (có thể giữ alias `/api/v1/...` tạm cho tương thích cũ).
2. **Danh mục storefront:** `GET /categories` → `CategoryDto` (gồm `icon?`, `imageUrl?`); header `techhome-e-commerce` dùng danh sách này + `src/services/categoryNavigation.ts` để link `/category/...` hoặc `/search?category=...` — đồng bộ với `docs/TECHHOME_BACKEND_API_SPEC.md` (repo backend).
3. **Lớp mapper:** DB (`snake_case`, kiểu DB) → `toProductDto`, `toProfileDto`, `toCartItem`, `toOrderDto` — response luôn đúng contract TypeScript.
4. **Auth:** JWT; **register** trả `{ token, user }`; **change-password** đúng path/body spec (`POST /auth/change-password`, `currentPassword` / `newPassword`).
5. **Orders:** module mới + bảng `orders` / `order_items`; transaction; **tính lại giá/tồn server-side**, không tin mù `totalPrice` / `items[].price` từ client.
6. **Cart:** đủ path `GET/POST/PATCH/DELETE/PUT` theo spec; mọi mutation trả **`CartItem[]`** đầy đủ sau thao tác.
7. **Products:** `GET /products` với `category`, `q`, `page`, `size`; thống nhất với frontend: mảng `ProductDto[]` hay object phân trang — **đối chiếu `src/services/backend.ts`**.
8. **Global:** CORS whitelist theo spec; error handler cho `/api/**` trả JSON `{ message }` (không render view cho API).

---

## 3. Lộ trình theo giai đoạn

| Giai đoạn | Nội dung | Ghi chú |
|-----------|----------|---------|
| **A — Nền** | `GET /health`; CORS; `express.json()`; lỗi JSON cho API | Thứ tự middleware như Master §1.2 |
| **B — Catalog** | Categories; products list/detail/featured; mapper `ProductDto` | Thứ tự route: `/featured` trước `/:id` |
| **C — Auth** | Register/login → `AuthResponse`; Bearer-first cho SPA | `checkLogin` ưu tiên `Authorization: Bearer` |
| **D — Profile & password** | `GET /profile` → `ProfileDto`; `POST /auth/change-password` | Validator/cập nhật field camelCase trong body |
| **E — Cart** | Đủ 5 endpoint cart; `CartItem[]` sau mọi thay đổi | `routes/cart.js` hoặc `carts.js` theo convention repo |
| **F — Orders** | SQL + CRUD list/detail/create; ownership user | Transaction + §6.1 spec |
| **G — fetch-specs** | `POST /products/:id/fetch-specs` — stub hoặc enrich | Có thể trả `ProductDto` hiện tại nếu chưa có pipeline |
| **H — Mở rộng** | Upload file, socket (Master §0.6–0.7) | Sau khi storefront API ổn định |

Thứ tự gợi ý trong spec §8 tương đương: health → catalog → auth → profile/password → cart → orders → fetch-specs.

---

## 4. Cách thực hiện theo khối

### 4.1 CSDL

- Migration/SQL: `orders`, `order_items`; chỉnh `products`/bảng liên quan nếu thiếu cột cho `salePrice`, gallery, v.v.
- Cart: dùng `carts` / `cart_items` hiện có; bổ sung cột snapshot nếu cần (`name`, `price`, `image` theo dòng).

### 4.2 Products & categories

- Query SQL + join category → `categoryName`, `categoryId`.
- List: lọc `category`, tìm `q`, phân trang `page`/`size`.

### 4.3 Auth

- Sau register: ký JWT giống login.
- Đổi mật khẩu: bcrypt; cập nhật hash + `password_changed_at` / `passwordChangedAt` trong response khi có.

### 4.4 Cart

- Hàm nội bộ `getCartItemsForUser(userId)` → `CartItem[]` dùng lại cho GET và sau POST/PATCH/DELETE/PUT.
- `id` dòng giỏ / `productId`: stringify nếu spec yêu cầu string.
- `PUT /cart`: replace toàn bộ trong transaction.

### 4.5 Orders

- **POST:** mỗi dòng — load sản phẩm, kiểm tra tồn, giá server; tổng server là nguồn sự thật; từ chối khi lệch giá/tồn.
- **GET:** chỉ đơn của `req.user.id`; `:id` kiểm tra ownership.

### 4.6 Lỗi & validator

- Ưu tiên body `{ message: string }` cho API.
- Validator: có thể dùng 400 thay vì 404 cho lỗi validation nếu muốn rõ nghĩa — **khớp cách parse trong `api.ts` frontend**.

---

## 5. Rủi ro / điểm cần thống nhất sớm

1. **`GET /products`:** response chỉ `ProductDto[]` hay kèm meta phân trang — phải khớp `backend.ts`.
2. **Master mô tả Mongoose:** code thực tế MySQL — mapper + query module; cân nhắc sửa Master cho đúng stack.
3. **Socket / file:** không chặn MVP storefront; lên kế hoạch sau.

---

## 6. Định nghĩa hoàn thành (MVP khớp frontend)

- Toàn bộ endpoint trong **TechHome spec §4** hoạt động với schema **§5**.
- Frontend: `VITE_API_URL=http://<host>:<port>/api` — kiểm tra luồng §9 spec.
- Code tách route / middleware / mapper rõ; không dùng view engine cho JSON API.

---

## 7. File liên quan trong repo

| File | Mục đích |
|------|----------|
| `docs/TECHHOME_BACKEND_API_SPEC.md` | Contract API & DTO (tên chuẩn dùng chung với repo backend) |
| `docs/MASTER_CODING_STANDARD.md` | Chuẩn cấu trúc & pattern repo |
| `docs/TECHHOME_IMPLEMENTATION_ROADMAP.md` | **File này** — lộ trình và cách làm |

**Repo frontend `techhome-e-commerce` (hiện tại):** nội dung contract tương đương nằm ở `docs/BACKEND_API_SPEC_FOR_AI.md` — giữ hai file đồng bộ nội dung hoặc đổi tên/copy thành `TECHHOME_BACKEND_API_SPEC.md` khi thống nhất tên giữa các repo.

Frontend (monorepo khác): `src/services/backend.ts`, `src/services/api.ts`, `src/types/api.ts`.

---

*Cập nhật khi đổi thứ tự ưu tiên, quyết định DB, hoặc sau khi đồng bộ với frontend.*
