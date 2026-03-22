# Admin Template Alignment (Source of Truth)

Tài liệu này tổng hợp và chuẩn hóa toàn bộ các màn hình admin template đã được cung cấp (theo nhãn `Dashboard #ID`) và đối chiếu với yêu cầu trong `FRONTEND_REQUIREMENTS.md`.

Mục tiêu: dùng làm chuẩn bám sát khi triển khai Admin Side cho TechHome E-Commerce.

---

## 1) Bối cảnh và phạm vi

- Dự án hiện **chưa có admin runtime** trong `src`.
- Yêu cầu admin trong `FRONTEND_REQUIREMENTS.md` là: xây mới Admin với phong cách DashStack.
- Bộ ảnh template đã cung cấp là nguồn tham chiếu UI chính, gồm các màn:
  - `#1-#25`, `#30-#38` (đã phân tích trong các vòng trao đổi).

---

## 2) Tóm tắt yêu cầu Admin từ dự án

Theo `FRONTEND_REQUIREMENTS.md`, các hạng mục bắt buộc cho Admin:

1. **DashStack UI framework** (layout/sidebar/topbar thống nhất)
2. **Quản lý sản phẩm**
   - CRUD sản phẩm
   - Upload ảnh
   - Thông số kỹ thuật động (key-value)
3. **Quản lý đơn hàng**
   - Danh sách/chi tiết đơn
   - Chuyển trạng thái (Processing/Shipping/Completed/Rejected)
   - Socket.io realtime đơn hàng mới
   - Xuất hóa đơn PDF
4. **SEO settings**
5. **Tiện ích nội bộ static UI**
   - Inbox
   - Calendar
   - To-Do

---

## 3) Inventory template đã tiếp nhận

### 3.1 Dashboard + topbar states

- `Dashboard #1`: KPI cards + line chart + deals table
- `Dashboard #2`: Revenue analytics + blocks tổng hợp
- `Dashboard #32`: profile menu dropdown open
- `Dashboard #33`: language selector open
- `Dashboard #34`: notification panel open

### 3.2 Product-related

- `Dashboard #3`: Products grid
- `Dashboard #4`: Favorites grid
- `Dashboard #16`: Product Stock table

### 3.3 Inbox-related

- `Dashboard #5`, `#6`, `#7`: Inbox list states
- `Dashboard #8`: Inbox conversation/detail state

### 3.4 Order-related

- `Dashboard #9`: Order list base
- `Dashboard #10`: Date picker open
- `Dashboard #11`: Date applied state
- `Dashboard #12`: Order Type filter modal (default)
- `Dashboard #13`: Order Type filter modal (selected)
- `Dashboard #14`: Order Status filter modal (default)
- `Dashboard #15`: Order Status filter modal (selected)
- `Dashboard #22`: Invoice page

### 3.5 Calendar / Todo

- `Dashboard #18`: Calendar base
- `Dashboard #19`: Calendar event detail open
- `Dashboard #35`: Add New Event form
- `Dashboard #20`: To-Do list
- `Dashboard #38`: Add New To-Do state

### 3.6 Contact / Team / Settings / Utility

- `Dashboard #21`: Contact list
- `Dashboard #30`: Add New Contact (empty)
- `Dashboard #31`: Add New Contact (filled)
- `Dashboard #24`: Team list
- `Dashboard #36`: Add Team Member form
- `Dashboard #37`: General Settings (bao gồm SEO fields)
- `Dashboard #23`: UI Elements (chart showcase)
- `Dashboard #25`: Generic table page
- `Dashboard #17`: Pricing page

---

## 4) Mức độ phù hợp với yêu cầu dự án

## 4.1 Phù hợp trực tiếp (ưu tiên tái sử dụng)

1. **Admin shell + dashboard**
   - Dùng `#1` hoặc `#2` làm nền
   - Tận dụng `#32/#33/#34` cho topbar interactions
2. **Inbox (static UI)**
   - Dùng `#5-#8`
3. **Calendar (static UI)**
   - Dùng `#18/#19` (+ `#35` nếu cần màn thêm event)
4. **To-Do (static UI)**
   - Dùng `#20/#38`
5. **Orders UI base**
   - Dùng `#9-#15` cho table/filter states
6. **SEO settings**
   - Dùng `#37` (map fields Title/Description/Keywords)

## 4.2 Phù hợp một phần (cần bổ sung nghiệp vụ)

1. **Products**
   - Reuse được `#3`, `#16` cho list/stock
   - Cần thêm form chuẩn cho create/edit + upload + specs key-value động
2. **Orders**
   - Reuse được state list/filter từ `#9-#15` và UI invoice từ `#22`
   - Cần bổ sung:
     - `OrderDetailPage` đúng nghiệp vụ
     - status transition logic
     - socket realtime
     - PDF generation

## 4.3 Ngoài phạm vi bắt buộc hiện tại (optional/reference)

- `#17` Pricing
- `#21/#30/#31` Contact
- `#24/#36` Team
- `#23` UI Elements
- `#25` Generic Table
- `#4` Favorites

---

## 5) Route mapping đề xuất (theo yêu cầu dự án)

Lưu ý: app dùng `HashRouter`, URL thực tế dạng `#/admin/...`.

### Core routes

- `/admin` -> dùng UI `#1` (hoặc `#2`)
- `/admin/products` -> nền từ `#3` + table từ `#16`
- `/admin/products/new` -> form custom (tham chiếu cấu trúc form từ `#30/#31/#36/#35`)
- `/admin/products/:id` -> form edit tương tự `/new`

### Orders routes

- `/admin/orders` -> `#9` (base), `#10-#15` (filter states)
- `/admin/orders/:orderId` -> chi tiết đơn + có thể tham chiếu style từ `#22`
- `/admin/orders/:orderId/invoice` -> `#22` (invoice view)

### SEO + Internal utility routes

- `/admin/seo` -> `#37` (SEO fields)
- `/admin/inbox` -> `#5/#6/#7`, detail state `#8`
- `/admin/calendar` -> `#18/#19`, create event state `#35`
- `/admin/todo` -> `#20/#38`

---

## 6) Gaps bắt buộc phải làm ngoài template

Template chỉ giải quyết phần nhìn. Các phần dưới đây phải implement theo code:

1. **RBAC + Protected admin routes**
2. **API integration**
   - products/orders/admin services
3. **Upload ảnh sản phẩm**
4. **Product specs manager động (key-value)**
5. **Order status workflow chuẩn**
6. **Socket.io realtime orders**
7. **Generate/print invoice PDF**
8. **Kết nối dữ liệu thật thay cho mock/static**

---

## 7) Danh sách trang nên triển khai trước

### Phase A (khớp yêu cầu cốt lõi)

1. `AdminLayout` + `/admin` dashboard
2. Products: list + create/edit cơ bản
3. Orders: list + status update + detail
4. SEO settings
5. Inbox/Calendar/Todo static

### Phase B (nghiệp vụ nâng cao)

1. Product image upload hoàn chỉnh
2. Specs manager key-value
3. Invoice PDF
4. Socket realtime orders

### Phase C (optional)

1. Contact / Team
2. Pricing / UI Elements / Generic Table

---

## 8) Quy ước sử dụng tài liệu này

- Khi chọn màn để implement, luôn ghi rõ:
  - Route đích
  - Dashboard ID tham chiếu
  - Thành phần nào giữ nguyên
  - Thành phần nào tùy biến theo nghiệp vụ TechHome
- Không triển khai các trang optional trước khi hoàn thành các hạng mục bắt buộc tại Section 2.

---

## 9) Kết luận ngắn

Bộ template hiện tại bao phủ tốt phần lớn UI admin yêu cầu. Có thể tái sử dụng trực tiếp cho khung dashboard, orders list/filter, inbox, calendar, todo, SEO settings. Phần còn thiếu chủ yếu là logic nghiệp vụ và các màn form chuyên biệt cho Product CRUD theo đúng yêu cầu dự án.

