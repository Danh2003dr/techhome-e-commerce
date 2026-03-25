# TechHome — Neo ngữ cảnh & hướng triển khai (để bám theo)

> Tài liệu **tổng hợp trạng thái codebase**, **ưu tiên**, và **sự thật có/không** của các chức năng — dùng làm neo cho phiên phát triển sau, prompt AI, hoặc onboarding.  
> **Khoảng trống sản phẩm (nghiệp vụ / UX / tính năng so TMĐT):** xem [`ECOMMERCE_GAP_AND_ROADMAP.md`](./ECOMMERCE_GAP_AND_ROADMAP.md).

---

## 1. Stack & chạy local

| Hạng mục | Giá trị |
|----------|---------|
| Frontend | React 19, Vite, TypeScript, React Router (**HashRouter** → URL dạng `/#/...`) |
| Styling | Tailwind (class trong component) |
| Biểu đồ admin | Recharts |
| Cổng dev Vite | **3000** (`vite.config.ts`, `host: 0.0.0.0`) |
| API mặc định | `http://localhost:8080/api` |
| Biến môi trường | `VITE_API_URL` — xem `.env.example` |

**Lệnh:** `npm install` → `npm run dev`.

---

## 2. Cấu trúc quan trọng (chỗ cần sửa khi nối backend / mở rộng)

| Vùng | Đường dẫn | Vai trò |
|------|-----------|---------|
| Routes | `src/routes/AppRoutes.tsx` | Toàn bộ route client + admin |
| Bảo vệ đăng nhập | `src/routes/PrivateRoute.tsx` | **Có file** nhưng **chưa bọc** route admin trong `AppRoutes` |
| HTTP + token | `src/services/api.ts` | `apiGet/Post/...`, `VITE_API_URL`, `Authorization: Bearer` |
| Endpoint backend | `src/services/backend.ts` | Mọi gọi API cửa hàng (auth, products, orders, cart, profile…) |
| DTO / contract | `src/types/api.ts` | Khớp body/query với backend |
| Mapper API → UI | `src/services/productMappers.ts` | `ProductDto` → type dùng trên store |
| Hook load SP/category | `src/hooks/useProductApi.ts` | Khi không cấu hình API → data rỗng, trang dùng mock |
| Mock storefront | `src/data/index.ts` | Categories, products, … cho demo |
| Mock admin (persist LS) | `src/services/adminMockStore.ts` | `getAdminProducts`, `upsertAdminProduct`, … — **hiện không có import từ page** |
| Admin Product Form | `src/pages/admin/products/ProductFormPage.tsx` | **Placeholder**: input disabled, chưa CRUD |
| Admin Product Stock | `src/pages/admin/products/ProductStockPage.tsx` + `productStockMock.ts` + `ProductStockModal.tsx` | **Có** thêm/sửa/xóa trong modal; category = **dropdown cố định**; state **trong bộ nhớ trang** (comment: thay API sau) |

---

## 3. Route — tóm tắt

**Store (có `MainLayout`):** `/`, `/search`, `/product/:id`, `/cart`, `/checkout`, `/deals`, `/category/mobile|accessories|audio`, …

**Tài khoản / auth (không MainLayout):** `/login`, `/signup`, `/forgot-password`, `/profile`, `/orders`, `/order/:orderId`, `/warranty`, `/account/addresses`, `/wishlist`, `/order-confirmation`, …

**Admin (`AdminLayout`):** `/admin` → redirect `/admin/dashboard`; `/admin/products`, `/admin/products/new`, `/admin/products/:id`, `/admin/products/stock`, `/admin/orders`, `/admin/orders/:orderId`, `/admin/orders/invoice`, `/admin/seo`, `/admin/calendar`.

**Lỗi đã biết:** Sidebar admin có link `/admin/inbox`, `/admin/to-do` (hoặc tương tự) nhưng **không có route** tương ứng trong `AppRoutes.tsx` → dễ 404 (file page có thể tồn tại nhưng chưa đăng ký route).

---

## 4. Sự thật chức năng (tránh hiểu nhầm khi implement)

### 4.1 Thêm / sửa sản phẩm (admin)

- **`/admin/products/new` và `/admin/products/:id`:** form **chưa triển khai** — chỉ UI placeholder, ghi chú “sẽ nối CRUD + upload + specs”.
- **`/admin/products/stock`:** có luồng tạo/sửa trong modal; **danh mục** lấy từ `STOCK_CATEGORY_OPTIONS` trong `productStockMock.ts` (vài nhãn cố định) — **không** có quản lý danh mục master, **không** gõ “ngoài danh mục” tùy ý trừ khi đổi code.
- **`adminMockStore`:** có logic `upsertAdminProduct` nhưng **chưa gắn UI** — khi làm CRUD đầy đủ nên quyết định: dùng store này + persist, hoặc bỏ dần thay API.

### 4.2 Dữ liệu cửa hàng (khách)

- Có **hai nguồn:** API (khi `VITE_API_URL` hợp lệ và gọi thành công) và **mock** trong `src/data`.
- Trang như `HomePage`, `ProductDetail` thường: API trước, không có thì fallback mock — **đồng bộ danh mục admin ↔ storefront** chưa được đảm bảo bằng một nguồn duy nhất.

### 4.3 Đặt hàng

- Checkout bước 3: khi API + đăng nhập + giỏ hợp lệ có thể `POST /orders` — backend cần validate giá/tồn (client vẫn gửi `totalPrice` trong contract hiện tại).

### 4.4 Shop chỉ bán điện thoại (gợi ý sản phẩm)

- **Không bắt buộc** phải có “thêm danh mục mới” liên tục nếu menu cố định (VD: Điện thoại, Phụ kiện, Âm thanh) đủ phạm vi.
- **Nên có** CRUD danh mục (hoặc ít nhất cấu hình) khi mở rộng ngành hàng hoặc SEO theo nhóm.

---

## 5. Kết nối backend (repo riêng)

- Backend có thể chạy tách (ví dụ Node repo khác); frontend chỉ cần **đúng base URL** + **CORS** cho origin `http://localhost:3000`.
- Contract endpoint: bám `src/services/backend.ts` + `src/types/api.ts`; đổi backend thì ưu tiên cập nhật **một chỗ** (service + type + mapper).
- **Spec đầy đủ cho AI / backend:** [`BACKEND_API_SPEC_FOR_AI.md`](./BACKEND_API_SPEC_FOR_AI.md) — bảng endpoint, schema JSON, auth, quy tắc đặt hàng và giỏ.

---

## 6. Nợ kỹ thuật — checklist khi “làm cho ra sản phẩm”

- [ ] Bọc `/admin/*` bằng auth + role (dùng `PrivateRoute` hoặc tương đương + `AuthContext`).
- [ ] Đăng ký route cho Inbox / To-Do **hoặc** ẩn khỏi menu tới khi có route.
- [ ] Hoàn thiện `ProductFormPage` **hoặc** gộp luồng tạo SP vào một màn duy nhất + API.
- [ ] Quyết định nguồn sự thật: **API** cho catalog/orders; giảm phân mảnh mock.
- [ ] (Tuỳ yêu cầu) Test tự động cho luồng auth + giỏ + đặt hàng.

---

## 7. Thứ tự gợi ý khi triển khai (ưu tiên tương đối)

1. Khớp **health + auth + categories + products** với backend thật.  
2. **CRUD sản phẩm** (form hoặc stock) nối API; thống nhất **category** với `GET /categories`.  
3. Bảo vệ **admin**.  
4. Voucher / tracking đơn / thanh toán cổng — theo [`ECOMMERCE_GAP_AND_ROADMAP.md`](./ECOMMERCE_GAP_AND_ROADMAP.md).

---

## 8. Cập nhật tài liệu

Khi đổi route, contract API, hoặc hoàn thành một mục checklist — **cập nhật file này** để các phiên sau không lệch thực tế.

---

*Tạo để làm neo ngữ cảnh; đồng bộ với codebase tại thời điểm chỉnh sửa gần nhất.*
