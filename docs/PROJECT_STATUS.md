# Tình trạng dự án hiện tại — TechHome E-Commerce

> Workspace: `E:\webbandienthoai\techhome-e-commerce`  
> Cập nhật theo codebase + tài liệu nội bộ trong repo.

## 1) Snapshot kỹ thuật

- **Stack**: React + TypeScript + Vite
- **Routing**: React Router DOM
- **Node/NPM (máy hiện tại)**: Node `v22.15.0`, npm `10.9.2`
- **Git (tại thời điểm tạo báo cáo)**
  - **Branch làm việc**: `feature/client`
  - **Working tree**: có các file `.md` chưa track (docs nội bộ):
    - `PROGRESS_REPORT.md`
    - `PROJECT_STATUS.md`
    - `STATUS_VS_MAIN_DETAILED.md`
    - `TRELLO_OPTIMIZATION_PLAN.md`
    - `TRELLO_SETUP.md`
    - `TRELLO_TASK_MANAGEMENT.md`

## 2) Kiến trúc thư mục (hiện có)

- `src/components/` — layout (Header/Footer/MainLayout/Sidebar), checkout components, account components, UI primitives (Button/Input)
- `src/pages/` — store pages (Home, ProductListing, ProductDetail, SearchResults, category pages), checkout pages (Cart/Checkout/OrderConfirmation), auth pages (Login/SignUp/Forgot), account pages
- `src/routes/` — `AppRoutes.tsx`, `PrivateRoute.tsx`
- `src/services/` — `api.ts` (client fetch cơ bản)
- `src/data/` — dữ liệu mock/hardcode (đang được import ở nhiều pages, ví dụ HomePage)

## 3) Những phần đã “xong tốt” (theo code + báo cáo)

Từ `PROGRESS_REPORT.md` và cấu trúc code hiện tại:

- **HomePage layout**: khối intro + featured tabs + sections (UI ổn)
- **ProductCard / Product grid**: UI gần hoàn thiện (hiệu ứng, badge, link sang detail)
- **Routing**: đã refactor để pages dùng `MainLayout` nhất quán (Header/Footer dùng chung cho nhóm routes chính)

## 4) Những phần đang “stub / chưa hoàn thiện”

### 4.1 Auth / Protected routes

- `src/routes/PrivateRoute.tsx` hiện **hardcode** `isAuthenticated = true`
  - Chưa có AuthContext / token storage / refresh token / redirect sau login.

### 4.2 API integration

- `src/services/api.ts` hiện là **fetch wrapper tối thiểu** (GET/POST), chưa có:
  - interceptors (auth header, handle 401)
  - error normalization
  - timeout/retry
  - services tách theo domain (products/orders/auth/admin…)
- Dữ liệu UI hiện vẫn **phụ thuộc mock**:
  - Ví dụ một số trang vẫn import mock từ `@/data` (HomePage ưu tiên API featured khi có `VITE_API_URL`).

### 4.3 Checkout / Cart logic

- UI có nhiều phần, nhưng **logic add-to-cart/update/remove** và state management vẫn là phần cần làm tiếp (theo `PROGRESS_REPORT.md`).

### 4.4 Admin

- Chưa có phân hệ admin theo yêu cầu (theo `FRONTEND_REQUIREMENTS.md` / `TODO_LIST.md`).

### 4.5 Performance

- Chưa có lazy loading routes/images, code-splitting theo mục tiêu performance (theo `FRONTEND_REQUIREMENTS.md`).

## 5) Lưu ý quan trọng / rủi ro hiện tại

- **README.md hiện không phản ánh dự án TechHome** (đang là template “AI Studio / GEMINI_API_KEY”).
- `vite.config.ts` đang define `process.env.GEMINI_API_KEY` / `API_KEY` — không liên quan trực tiếp tới e-commerce flow hiện tại.
- Một số route/category trong HomePage trỏ tới path có thể **chưa tồn tại route** (ví dụ `/category/cooling`, `/category/smart-home`) → cần rà soát để tránh 404.

## 6) Ưu tiên tiếp theo (khuyến nghị ngắn)

Dựa trên `TODO_LIST.md` + `FRONTEND_REQUIREMENTS.md` + tình trạng code:

1. **Chuẩn hóa data flow**: thay `@/data` bằng API (tạo `productsApi`, `ordersApi`, `authApi`), thêm loading/error states.
2. **Auth thật**: AuthContext + lưu token + cập nhật `PrivateRoute`.
3. **Cart/Checkout state**: tách CartContext (hoặc Zustand) + handlers add/update/remove + persist localStorage.
4. **Performance**: lazy load routes, lazy load images, tối ưu bundle.
5. **Admin**: xây phần admin theo phase riêng sau khi client flow ổn định.

## 7) Tài liệu nội bộ liên quan trong repo

- `PROGRESS_REPORT.md` — báo cáo tiến độ theo Trello cards
- `FRONTEND_REQUIREMENTS.md` — checklist yêu cầu frontend
- `IMPLEMENTATION_PROMPT.md` — hướng dẫn thực hiện thay đổi theo thứ tự ưu tiên
- `REFACTOR_COMPLETE_SUMMARY.md` — tóm tắt refactor routes/layout đã làm


