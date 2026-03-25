# ADMIN IMPLEMENTATION SPEC (Template for Design-to-Code)

> Mục tiêu: dùng để “đóng gói” scope Figma admin + map sang các file admin trong repo + quy định cách wire token/RBAC ngay từ đầu.
> Repo stack: React + TypeScript + Vite + React Router (HashRouter) + Tailwind.

---

## 1) Thông tin chung

### 1.1 Link Figma
- Figma admin kit: https://www.figma.com/design/LqE34pymkTaB2cMOZcqLZe/DashStack---Free-Admin-Dashboard-UI-Kit---Admin---Dashboard-Ui-Kit---Admin-Dashboard--Community-?node-id=0-1

### 1.2 Những frame/page cần lấy (do bạn điền theo kit)
- Dashboard frame:
- Products list frame:
- Product create/edit form frame:
- Orders list frame:
- Order status changer/popup frame:
- Order detail/invoice frame:
- SEO settings frame:
- Inbox frame:
- Calendar frame:
- To-do frame:

> Nếu bạn không chắc frame nào, cứ ghi “tạm theo screenshot/section có tiêu đề X” rồi mình sẽ đề xuất node cần trích tiếp.

---

## 2) Scope Admin trong repo (TO-BE)

### 2.1 Routes admin (HashRouter)
Dùng prefix: `/admin/...`
- `/admin` -> Admin Dashboard (placeholder UI)
- `/admin/products` -> `ProductListPage`
- `/admin/products/new` -> `ProductFormPage` (create)
- `/admin/products/:id` -> `ProductFormPage` (edit)
- `/admin/orders` -> `OrderListPage`
- `/admin/orders/:orderId` -> `OrderDetailPage`
- `/admin/seo` -> `SEOSettingsPage`
- `/admin/inbox` -> `InboxPage`
- `/admin/calendar` -> `CalendarPage`
- `/admin/todo` -> `TodoListPage`

### 2.2 Files cần tạo (theo FRONTEND_REQUIREMENTS.md)
- `src/pages/admin/AdminLayout.tsx`
- `src/pages/admin/products/ProductListPage.tsx`
- `src/pages/admin/products/ProductFormPage.tsx`
- `src/pages/admin/products/ProductImageUpload.tsx`
- `src/pages/admin/products/ProductSpecsManager.tsx`
- `src/pages/admin/orders/OrderListPage.tsx`
- `src/pages/admin/orders/OrderDetailPage.tsx`
- `src/components/admin/OrderStatusBadge.tsx`
- `src/components/admin/OrderStatusChanger.tsx`
- `src/utils/generateInvoicePDF.ts`
- `src/hooks/useSocketOrders.ts`
- `src/pages/admin/seo/SEOSettingsPage.tsx`
- `src/pages/admin/inbox/InboxPage.tsx`
- `src/pages/admin/calendar/CalendarPage.tsx`
- `src/pages/admin/todo/TodoListPage.tsx`

---

## 3) Map từ Figma → UI phần cần dùng (không lấy template nặng)

### 3.1 Shell layout
Trích trong Figma:
- Sidebar menu kit (light)
- Topbar kit
- Khối nền/content area

Map sang:
- `AdminLayout.tsx`

Checklist UI tối thiểu:
- Active menu highlight theo route
- Content area render trang bên trong
- Basic padding/spacing như Figma

### 3.2 Products
Tối thiểu cần UI:
- Table list: Image / Product Name / Price / Category / Piece / Available Color / Action
- Form page:
  - Inputs (name/price/category/stock/featured placeholder)
  - Image upload block
  - Specs editor UI (key-value pairs)

Map sang:
- `ProductListPage.tsx`
- `ProductFormPage.tsx`
- `ProductImageUpload.tsx`
- `ProductSpecsManager.tsx`

### 3.3 Orders
Tối thiểu cần UI:
- Orders list: filters (Order Type/Order Status/Date placeholder), status badges
- Status changer popup/modal: “Select Order Status”
- Order detail:
  - Invoice block (Invoice To/From, dates)
  - Line items list
  - Total summary
  - Print/Download button UI

Map sang:
- `OrderListPage.tsx`
- `OrderDetailPage.tsx`
- `OrderStatusBadge.tsx`
- `OrderStatusChanger.tsx`
- `generateInvoicePDF.ts` (placeholder output)

### 3.4 SEO
Tối thiểu cần UI:
- Inputs: SEO Title / SEO Description / SEO Keywords
- Upload/logo preview (placeholder)

Map sang:
- `SEOSettingsPage.tsx`

### 3.5 Inbox / Calendar / To-do
Chỉ cần UI theo Figma:
- Layout split panel (nếu có)
- List item styling
- Buttons placeholder

Map sang:
- `InboxPage.tsx`
- `CalendarPage.tsx`
- `TodoListPage.tsx`

---

## 4) Wire Token + RBAC ngay từ đầu

### 4.1 Repo hiện trạng
- Token lưu localStorage key: `techhome_token`
- `AuthContext` hiện có: `isAuthenticated` (nhưng chưa có role)
- `PrivateRoute.tsx` đang stub `isAuthenticated = true`

### 4.2 Yêu cầu về JWT role claim (bạn điền)
- Token backend là JWT dạng: có 3 phần `header.payload.signature`? (yes/no)
- Role claim key (có thể là 1 trong các dạng):
  - `role`
  - `roles`
  - `isAdmin`
  - `admin`

Ví dụ điền:
- claim key: `role`
- admin value: `admin`

### 4.3 RBAC rule
- Route `/admin/*` cần: authenticated + role = admin
- Nếu không hợp lệ: redirect `/login` hoặc hiển thị `/unauthorized` (chọn cái nào?)

---

## 5) Data strategy (để UI chạy sớm)
- Giai đoạn 1: hardcode mock data để UI giống Figma
- Sau đó: thay bằng API call (products/orders/auth/admin APIs) khi backend sẵn

Các chỗ placeholder phải ghi rõ:
- orders[] mock
- product form initial values
- invoiceData mock

---

## 6) Acceptance checklist (UI/logic)
- Sidebar/topbar hiển thị đúng template kit
- Navigation highlight đúng route
- Products list render được, bấm Edit mở form
- Specs editor thêm/xóa rows hoạt động
- Orders list render badge status đúng
- Status changer popup mở/đóng + cập nhật UI status (mock)
- Order detail có invoice layout + nút Print/Download (placeholder)
- SEO/Inbo x/Calendar/To-do có layout đúng Figma (đủ dùng)

---

## 7) Testing
- `npm run dev` không lỗi compile
- Kiểm tra đường dẫn admin bằng cách vào:
  - `/admin/products`
  - `/admin/orders/1`
- Kiểm tra refresh trang giữ auth state

---

## 8) Bạn cần trả lời (để mình chốt scope lần cuối)
1) Figma frame cho “Product form/specs” là frame nào?
2) Figma frame cho “Order detail/invoice” là frame nào?
3) JWT role claim key trong token của bạn là gì?
4) Bạn muốn auth fail redirect `/login` hay `/unauthorized`?