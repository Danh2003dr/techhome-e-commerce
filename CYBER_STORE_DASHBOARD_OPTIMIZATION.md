# CYBER STORE — Admin Dashboard Menu Optimization

Tài liệu mô tả thay đổi theo yêu cầu: **an toàn**, **không phá code**, **không đổi API**, **mọi luồng truy cập được giữ**.

---

## 1. Danh sách thay đổi

| Loại | Nội dung |
|------|----------|
| **Menu giữ** | Dashboard, Products, Orders, SEO, Logout |
| **Menu rename** | `Order Lists` → **Orders** (label sidebar) |
| **Menu ẩn (chỉ UI)** | Favorites, Product Stock (mục riêng), Invoice (mục riêng), Pricing, Contact, UI Elements, Team, Table |
| **Menu gộp logic UX** | **Stock** → vào tab trong khu vực Products |
| **Invoice** | Không còn mục sidebar; truy cập từ bảng Orders + Order Detail + route cũ vẫn hoạt động |
| **Optional giữ** | Inbox, Calendar, To-Do (nhóm **More**) |

---

## 2. Access Flow

### Invoice

| Truy cập | Cách vào |
|----------|-----------|
| Từ **Order list** | Cột **Action**: **View** → `/admin/orders/:id`; **View Invoice** → `/admin/orders/invoice?orderId=...`; **Download PDF** → cùng URL + `autoprint=1` (mở hộp thoại in) |
| Từ **Order detail** | `Generate Invoice` → `/admin/orders/invoice?orderId=...`; `Download PDF` → navigate + `autoprint=1` |
| Trực tiếp | URL cũ **`/admin/orders/invoice`** vẫn hoạt động (sidebar không hiện nhưng gõ URL / bookmark được) |

### Product Stock

| Truy cập | Cách vào |
|----------|-----------|
| Tab **Stock** | Trên `Products`, `Product Stock`, `New/Edit Product`: tab **All Products** ↔ **Stock** → `/admin/products/stock` |
| Route cũ | **`/admin/products/stock`** không đổi — chỉ bỏ menu sidebar |

### Menu đã ẩn (Favorites, Pricing, …)

- **Không xóa route** trong `AppRoutes` (nếu sau này có thêm route).
- Các URL như `/admin/favorites` trước đây **không có route** trong project thì vẫn vậy; không phát sinh crash mới.

---

## 3. Code thay đổi (file liên quan)

| File | Thay đổi |
|------|----------|
| `src/components/admin/AdminSidebar.tsx` | Cấu hình menu mới; highlight Orders/Products/Invoice-in-orders |
| `src/components/admin/AdminProductsTabs.tsx` | **Mới** — tab All Products / Stock |
| `src/pages/admin/products/ProductListPage.tsx` | Import `AdminProductsTabs` |
| `src/pages/admin/products/ProductStockPage.tsx` | Import `AdminProductsTabs` |
| `src/pages/admin/products/ProductFormPage.tsx` | Import `AdminProductsTabs` |
| `src/pages/admin/orders/components/OrderTable.tsx` | Cột Action + View / View Invoice / Download PDF |
| `src/pages/admin/orders/OrderDetailPage.tsx` | Generate Invoice + Download PDF |
| `src/pages/admin/orders/InvoicePage.tsx` | `orderId` + `autoprint` từ query; link Back to Orders |
| `src/routes/AppRoutes.tsx` | Đặt **`/admin/orders/invoice` trước** `/admin/orders/:orderId` để route invoice không bị nuốt bởi `orderId=invoice` |

---

## 4. Kiểm tra an toàn

- `npm run build` — **thành công**
- Không đổi API / backend
- Không đổi tên component đang export (chỉ thêm `AdminProductsTabs`)
- Route invoice được sửa thứ tự để **đúng hành vi** (bugfix nhỏ, không phá URL)

---

## 5. Menu chuẩn cuối (sidebar)

1. Dashboard  
2. Products  
3. Orders  
4. SEO  
5. **More:** Inbox · Calendar · To-Do  
6. Logout  

---

## Lưu ý

- **Download PDF** hiện dùng **in trình duyệt** (`window.print`) — phù hợp mock; khi có API PDF thật chỉ cần thay handler.
- **Inbox / Calendar / To-Do**: nếu chưa khai báo route trong `AppRoutes`, click có thể về **404** — cần bổ sung page placeholder khi team sẵn sàng (ngoài phạm vi đợt này nếu chưa có route).
