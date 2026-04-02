# Neo triển khai Frontend — TMĐT TechHome

Tài liệu này tóm tắt **trạng thái đã rà soát** (UI/UX + hooks/JSX) và **thứ tự ưu tiên** để agent/dev bám khi sửa code. Cập nhật khi hoàn thành từng mục.

**Stack ghi chú:** Mã nguồn dùng **TypeScript + TSX**; khi refactor vẫn ưu tiên **logic rõ trong component + hooks**, tránh logic nặng trong JSX.

---

## 1. Bảng trạng thái nhanh (đã xác nhận trong code)

| Hạng mục | Trạng thái | File / vị trí chính |
|----------|------------|---------------------|
| Admin stock form (modal) | Có mock: tên, category select cố định, giá, tồn, màu preset, **1 ảnh** | `src/pages/admin/products/ProductStockModal.tsx`, `productStockMock.ts` |
| Variant / SKU / giá sale | **Chưa** | — |
| Upload nhiều ảnh sản phẩm | **Chưa** (ProductForm: dropzone disabled) | `ProductFormPage.tsx` |
| Thêm nhanh danh mục / “Khác” | **Chưa** | `ProductStockModal.tsx` |
| Validation giá/tồn âm | Có (submit + `min` input) | `ProductStockModal.tsx` |
| Validation có message lỗi UX | **Hạn chế** (thường return im lặng) | Cùng file |
| Voucher builder (%, tiền, date, max uses) | **Chưa** — chỉ lịch event mock | `src/pages/admin/calendar/EventModal.tsx`, `calendarTypes.ts` |
| Flash sale countdown / time slot | **Chưa** UI countdown; chỉ `timeLabel` string | `EventModal`, `CalendarPage` |
| Blog CMS admin | **Chưa** — SEO page placeholder | `src/pages/admin/seo/SEOSettingsPage.tsx` |
| Lịch sử đơn hàng — timeline | **Không** — dạng thẻ | `OrderHistoryPage.tsx` |
| Chi tiết đơn — stepper | Có (mock 4 bước; API map ~2 bước) | `OrderDetailsPage.tsx`, `data/index.ts` |
| Review đọc + sao (mock) | Có | `ProductDetail.tsx`, `getProductDetailExtras` |
| Review gửi + chọn sao + ảnh/review | **Chưa** | — |
| API client | `fetch` + `ApiError` + Bearer | `src/services/api.ts` |
| Xử lý lỗi tập trung 401/403/500 + toast | **Chưa** đủ — nhiều chỗ catch rỗng | `api.ts`, các page gọi API |
| Phân quyền UI admin theo role | **Chưa** — route admin không guard | `AppRoutes.tsx`, `AuthContext` |
| Phân trang admin product list | **Có** (mock) | `ProductListPage.tsx` |
| Phân trang admin orders | **Có** (mock) | `OrderListPage.tsx` |
| Phân trang listing storefront | **UI** có, **slice** chưa gắn state trang | `ProductListingPage.tsx` |
| Phân trang order history | **UI** giả; **không** slice theo `page` | `OrderHistoryPage.tsx` |
| Giỏ — mã giảm giá | UI + `couponCode` context; **chưa** áp dụng thật | `CartPage.tsx`, `CheckoutContext.tsx` |
| Checkout — lỗi đặt hàng | Inline `orderError`; 401 có message | `CheckoutStep3.tsx` |

---

## 2. Thứ tự ưu tiên gợi ý (bám theo khi có thời gian)

1. **Bảo vệ `/admin`** + role (backend trả `role` / claim trong JWT) + ẩn nút theo quyền.
2. **Chuẩn hóa lỗi API:** wrapper hoặc React Query + toast/alert; không `setX([])` im lặng khi lỗi (ít nhất message + retry).
3. **Storefront:** sửa `ProductListingPage` — `page` state + `slice`; tương tự `OrderHistoryPage` nếu API trả danh sách dài.
4. **Sản phẩm admin:** mở `ProductForm` / stock — multi-image, giá sale, variants/SKU khi contract API sẵn.
5. **Khuyến mãi:** mở rộng `EventModal` hoặc module mới (voucher fields + validate) + countdown component cho PDP/Home nếu có `endAt`.
6. **CMS:** trang cấu hình blog / nội dung (sau khi có API).

---

## 3. Quy ước khi sửa (để diff sạch)

- Chỉ đụng file **cần thiết** cho task; không refactor rộng không liên quan.
- Giữ pattern hiện có: Tailwind, `formatVND`, `ApiError`, cấu trúc `services/backend.ts` nếu thêm endpoint.
- Form: ưu tiên **hiển thị lỗi** dưới field hoặc vùng `role="alert"` thay vì `return` im lặng.
- Sau khi xong một mục trong mục 2, **cập nhật bảng mục 1** trong file này (hoặc ghi ngày + PR).

---

## 4. File tham chiếu nhanh

| Chủ đề | File |
|--------|------|
| Routes | `src/routes/AppRoutes.tsx` |
| API fetch | `src/services/api.ts`, `src/services/backend.ts` |
| Auth | `src/context/AuthContext.tsx` |
| Admin sản phẩm | `src/pages/admin/products/*` |
| Admin lịch / event | `src/pages/admin/CalendarPage.tsx`, `calendar/EventModal.tsx` |
| Tài khoản đơn hàng | `src/pages/account/OrderHistoryPage.tsx`, `OrderDetailsPage.tsx` |
| PDP | `src/pages/store/ProductDetail.tsx` |
| Checkout | `src/components/checkout/CheckoutStep3.tsx`, `src/pages/checkout/CartPage.tsx` |

---

## 5. Lịch sử cập nhật tài liệu

| Ngày | Nội dung |
|------|----------|
| 2025-03-25 | Tạo file — neo từ rà soát UI/UX & hooks |
