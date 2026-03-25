# 🧾 DASHBOARD FEATURE VALIDATION REPORT

## 1. Tổng quan

- Độ khớp menu với requirement ở mức **trung bình**: có đủ nhiều mục cốt lõi cho admin, nhưng có khá nhiều mục ngoài scope.
- Menu hiện tại đang bị **dư chức năng** so với phạm vi đồ án Cyber Store.
- Requirement gốc chỉ yêu cầu rõ cho admin: `Dashboard layout`, `Orders`, `Product management`, `SEO`, và 3 màn UI (`Inbox`, `Calendar`, `To-do`), plus `Logout`.

---

## 2. Bảng đối chiếu

| Menu | Status | Mapping Requirement | Nhận xét |
| ------------- | ------ | ----------------------------------- | ---------------- |
| Dashboard | ✅ | Admin Dashboard: Layout DashStack | Đúng yêu cầu |
| Products | ✅ | Product Management (Admin): xem/thêm/sửa/xóa/upload/specs/SEO | Đúng nhóm chức năng chính |
| Favorites | ❌ | Không có trong admin requirement | Ngoài scope admin dashboard |
| Inbox | ✅ | Admin Dashboard: Inbox (UI) | Đúng yêu cầu (UI-only) |
| Order Lists | ❗ | Order (Admin): xem danh sách/lọc/cập nhật trạng thái | Có nhưng tên chưa chuẩn, nên là `Orders` |
| Product Stock | ⚠️ | Liên quan Product Management | Không tách riêng trong requirement, có thể gộp vào `Products` |
| Pricing | ❌ | Không đề cập trong requirement | Ngoài scope |
| Calendar | ✅ | Admin Dashboard: Calendar (UI) | Đúng yêu cầu (UI-only) |
| To-Do | ✅ | Admin Dashboard: To-do list (UI) | Đúng yêu cầu (UI-only) |
| Contact | ❌ | Không có trong requirement | Ngoài scope |
| Invoice | ❗ | Order (Admin): Xuất hóa đơn PDF | Có liên quan, nhưng requirement là chức năng trong orders, không bắt buộc là menu độc lập |
| UI Elements | ❌ | Không có trong requirement | Dev/demo menu, ngoài scope |
| Team | ❌ | Không có trong requirement | Ngoài scope |
| Table | ❌ | Không có trong requirement | Ngoài scope |
| SEO | ✅ | Product Management (Admin): Cấu hình SEO | Đúng yêu cầu |
| Logout | ✅ | Authentication: Logout | Đúng yêu cầu |

---

## 3. Nhóm nên GIỮ (Core Features)

- `Dashboard`
- `Products`
- `Order Lists` (đổi tên thành `Orders`)
- `SEO`
- `Logout`
- `Invoice` (nên đặt trong `Orders` thay vì menu top-level riêng)

---

## 4. Nhóm nên GIỮ nếu cần (Optional / UI only)

- `Inbox`
- `Calendar`
- `To-Do`

---

## 5. Nhóm nên LOẠI BỎ (Out of scope)

- `Favorites`
- `Pricing`
- `Contact`
- `UI Elements`
- `Team`
- `Table`

---

## 6. Nhóm cần GỘP / ĐỔI TÊN

- `Order Lists` → **`Orders`** (đồng nhất terminology requirement)
- `Product Stock` → gộp vào **`Products`** (tab/filter nội bộ)
- `Invoice` → không cần menu riêng; đặt thành action trong **`Orders`/Order Detail**

---

## 7. Kết luận

- Tỷ lệ menu **phù hợp trực tiếp requirement (✅)**: **9/16 = 56.25%**
- Tỷ lệ menu **có liên quan tổng thể (✅ + ⚠️ + ❗)**: **12/16 = 75%**
- Dashboard hiện tại có dấu hiệu **over-engineering nhẹ đến trung bình** do nhiều mục ngoài scope đồ án.
- Đề xuất menu chuẩn cuối cùng (theo scope requirement):
  - `Dashboard`
  - `Products`
  - `Orders`
  - `SEO`
  - `Inbox` (UI)
  - `Calendar` (UI)
  - `To-Do` (UI)
  - `Logout`
