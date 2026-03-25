# TechHome — Backend API specification (for AI / implementers)

> **Mục đích:** Tài liệu neo để AI hoặc developer xây backend (Node hoặc stack khác) **khớp chính xác** với frontend `techhome-e-commerce`.  
> **Nguồn sự thật trong repo:** `src/services/backend.ts`, `src/services/api.ts`, `src/types/api.ts`, `src/types/index.ts` (`CartItem`).

---

## 1. Bối cảnh

| Hạng mục | Giá trị |
|----------|---------|
| Frontend | React + Vite, dev server **port 3000** |
| Base URL API | Biến **`VITE_API_URL`** — ví dụ `http://localhost:8080/api` (**không** có `/` ở cuối) |
| Mặc định nếu thiếu env | `http://localhost:8080/api` (xem `src/services/api.ts`) |
| Prefix route | Mọi path trong bảng §4 là **relative** sau base (đã bao gồm `/api`) |

**CORS:** Cho phép origin dev: `http://localhost:3000`, `http://127.0.0.1:3000` (và có thể `3001` nếu đổi port frontend).  
**Content-Type:** `application/json` cho body có JSON.

---

## 2. Xác thực

- Header: **`Authorization: Bearer <token>`** cho mọi route đánh dấu *Requires auth* ở §4.
- Login / Register trả về **`token`** (chuỗi) + **`user`** — frontend lưu `localStorage` (không bắt buộc cookie).
- Backend nên dùng **JWT** (hoặc tương đương); thuật toán và claim do bạn chọn, miễn token in ra header đúng format.

**Logout:** Frontend **không** gọi endpoint — chỉ xóa token client-side.

---

## 3. Định dạng lỗi

- HTTP status: 4xx / 5xx theo chuẩn.
- Body JSON nên có **`message`** (string) — frontend parse qua `ApiErrorBody` (`src/types/api.ts`).
- Có thể thêm field khác; frontend chủ yếu hiển thị `message`.
- **204 No Content:** Một số helper client coi 204 là thành công, không đọc JSON — tránh 204 nếu response cần body (hoặc đảm bảo client không expect JSON).

---

## 4. Bảng endpoint (bắt buộc khớp)

Path trong cột **Path** = nối sau base URL (vd. base `.../api` + path `/health` → `GET .../api/health`).

### 4.1 Public (không bắt buộc Bearer)

| Method | Path | Query / Body | Response JSON |
|--------|------|----------------|---------------|
| GET | `/health` | — | `{ "status": string }` |
| GET | `/categories` | — | `CategoryDto[]` |
| GET | `/products` | Query: `category?` (number), `q?`, `page?`, `size?` — có thể rỗng | `ProductDto[]` |
| GET | `/products/:id` | `id` numeric | `ProductDto` |
| GET | `/products/featured` | — | `ProductDto[]` |
| POST | `/products/:id/fetch-specs` | Body: `{}` | `ProductDto` |
| POST | `/auth/login` | `AuthRequest` | `AuthResponse` |
| POST | `/auth/register` | `RegisterRequest` | `AuthResponse` |

**Ghi chú:** `GET /health` và `POST .../fetch-specs` có thể chưa được gọi từ UI nhưng **đã khai báo** trong `backend.ts` — nên implement để contract đầy đủ.

### 4.2 Requires auth (Bearer)

| Method | Path | Body | Response JSON |
|--------|------|------|---------------|
| POST | `/auth/change-password` | `{ "currentPassword": string, "newPassword": string }` | `{ "message": string, "passwordChangedAt"?: string }` |
| GET | `/profile` | — | `ProfileDto` |
| GET | `/orders` | — | `OrderDto[]` — **chỉ đơn của user đang đăng nhập** |
| GET | `/orders/:id` | — | `OrderDto` — **chỉ nếu đơn thuộc user** |
| POST | `/orders` | `CreateOrderRequest` | `OrderDto` |
| GET | `/cart` | — | `CartItem[]` |
| POST | `/cart/items` | Xem §5.1 | `CartItem[]` (**toàn bộ giỏ sau thao tác**) |
| PATCH | `/cart/items/:id` | `{ "quantity": number }` | `CartItem[]` |
| DELETE | `/cart/items/:id` | — | `CartItem[]` |
| PUT | `/cart` | `{ "items": CartItem[] }` | `CartItem[]` |

---

## 5. Schema JSON (TypeScript = contract)

### 5.1 CategoryDto

```ts
{
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
  imageUrl?: string | null;
}
```

`icon` / `imageUrl` tuỳ chọn — storefront ưu tiên `imageUrl` khi có (menu header).

### 5.2 ProductDto

```ts
{
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  images?: string[] | null;  // gallery; UI ưu tiên images[0] nếu có
  price: number;
  salePrice?: number | null; // khi có và < price → hiển thị giảm giá
  categoryId: number;
  categoryName: string;
  stock: number;
  featured: boolean;
  specifications: string | null; // thường là JSON string specs
  colors?: { name: string; hex: string }[];
  storageOptions?: string[];
}
```

### 5.3 Auth

```ts
// POST /auth/login
type AuthRequest = { email: string; password: string };

// POST /auth/register
type RegisterRequest = { name: string; email: string; password: string };

type AuthUserDto = { id: number; name: string; email: string };

// Response login + register
type AuthResponse = { token: string; user: AuthUserDto };
```

### 5.4 ProfileDto

```ts
{
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  defaultAddress?: string | null;
  passwordChangedAt?: string | null;
}
```

### 5.5 Orders

```ts
type CreateOrderItemRequest = {
  productId: number;
  quantity: number;
  price: number; // đơn giá tại thời điểm đặt (client gửi — server phải validate)
};

type CreateOrderRequest = {
  totalPrice: number;
  items: CreateOrderItemRequest[];
};

type OrderItemDto = {
  productId: number;
  productName: string;
  productImage?: string | null;
  quantity: number;
  priceAtOrder: number;
};

type OrderDto = {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createdAt: string; // ISO 8601 khuyến nghị
  items: OrderItemDto[];
};
```

### 5.6 CartItem (mỗi dòng giỏ)

```ts
{
  id: string;           // id dòng giỏ (server-generated hoặc stable)
  productId: string;    // frontend dùng string; map sang product DB
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}
```

**POST `/cart/items` — body frontend gửi:**

```ts
{
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  variant?: string;
}
```

Mọi response **POST/PATCH/DELETE/PUT** trên cart phải trả **`CartItem[]`** = trạng thái giỏ đầy đủ sau thao tác.

---

## 6. Quy tắc nghiệp vụ (bắt buộc đọc khi implement)

### 6.1 Đặt hàng `POST /orders`

- Frontend chỉ gọi khi user đã đăng nhập và `productId` mỗi dòng parse được thành **số**.
- Body có **`totalPrice`** và **`items[].price`** từ client — **không được tin mù**: backend phải:
  - Tra giá/tồn từ DB tại thời điểm đặt;
  - Tính lại tổng (và thuế/phí nếu có) theo quy tắc server;
  - Từ chối nếu không đủ hàng hoặc giá lệch.
- Client hiện tại có thể gửi total gồm subtotal − voucher (mock) + ship + tax 8% — server không bắt buộc khớp công thức đó nhưng **phải có nguồn sự thật phía server**.

### 6.2 Query `GET /products`

- Tham số: `category`, `q`, `page`, `size` — tất cả optional.
- Frontend có thể gọi với `page=0`, `size=100` — backend nên hỗ trợ phân trang hoặc trả mảng rút gọn hợp lý.

### 6.3 Trạng thái đơn (`OrderDto.status`)

- Kiểu **string**. UI có badge cho các nhãn gần giống: `Processing`, `Delivered`, `Shipping`, `Shipped`, `Cancelled`, `PENDING`.
- Nên thống nhất một bộ enum server-side và map/alias nếu cần.

### 6.4 Giỏ hàng

- Giỏ gắn với **user đã đăng nhập** (theo token).
- `PUT /cart` có thể ít được gọi từ UI hiện tại nhưng **đã có trong client** — implement để replace toàn bộ giỏ khi cần.

---

## 7. Phạm vi ngoài contract hiện tại

Các phần sau **chưa** có trong `src/services/backend.ts` — không bắt buộc cho MVP storefront, nhưng sản phẩm đầy đủ có thể cần sau:

- CRUD sản phẩm / upload ảnh **admin** (UI nhiều chỗ vẫn mock).
- Voucher / thanh toán cổng thật.
- `PATCH /profile` hoặc upload avatar (profile hiện mix API + local).

Khi thêm endpoint mới, cập nhật **`backend.ts`** + **`types/api.ts`** phía frontend và đồng bộ tài liệu này.

---

## 8. Thứ tự triển khai gợi ý

1. `GET /health` + CORS + JSON middleware.  
2. `GET /categories`, `GET /products`, `GET /products/:id`, `GET /products/featured`.  
3. `POST /auth/register`, `POST /auth/login` + JWT.  
4. `GET /profile`, `POST /auth/change-password`.  
5. Cart: `GET/POST/PATCH/DELETE` + `PUT /cart`.  
6. `POST /orders`, `GET /orders`, `GET /orders/:id` với kiểm tra ownership.  
7. `POST /products/:id/fetch-specs` (nếu có pipeline enrich specs).

---

## 9. Kiểm tra khớp với frontend

Sau khi backend chạy:

1. Đặt `.env` frontend: `VITE_API_URL=http://<host>:<port>/api`.  
2. Chạy `npm run dev` (port 3000).  
3. Kiểm tra: đăng ký/đăng nhập, danh mục/sản phẩm, giỏ (khi login), đặt hàng, lịch sử đơn.

**File tham chiếu nhanh trong monorepo frontend:**

- `src/services/backend.ts` — danh sách hàm ↔ endpoint  
- `src/types/api.ts` — DTO  
- `src/services/api.ts` — Bearer, base URL, parse lỗi  

---

*Tài liệu này phục vụ implementation backend; khi đổi contract trong code frontend, hãy cập nhật file này cùng lúc.*
