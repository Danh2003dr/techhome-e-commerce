# So sánh tình trạng dự án hiện tại với `main` (chi tiết)

> Workspace: `E:\webbandienthoai\techhome-e-commerce`  
> Mục tiêu: trả lời “dự án hiện tại so với `main` đang như thế nào” một cách **có số liệu + liệt kê thay đổi**.

## 1) Kết luận nhanh (theo mục tiêu: giữ `feature/client`, lấy thêm thay đổi từ `main`)

- **Nhánh bạn đang làm việc**: `feature/client` (local + tracking `origin/feature/client`)
- **`feature/client` so với `main`**: **`feature/client` đang _behind_ `main` 4 commits** → `main` có 4 commit cần “đem về” `feature/client`.
- **Working tree (trên `feature/client`)**: hiện có các file `.md` chưa track (docs):
  - `PROGRESS_REPORT.md`
  - `PROJECT_STATUS.md`
  - `STATUS_VS_MAIN_DETAILED.md`
  - `TRELLO_OPTIMIZATION_PLAN.md`
  - `TRELLO_SETUP.md`
  - `TRELLO_TASK_MANAGEMENT.md`

## 2) `main` đã thay đổi gì so với `feature/client`? (những thứ cần mang vào `feature/client`)

Repo có cả `feature/client` (local) và `origin/feature/client` (remote).

### 2.1 Ahead/Behind (commit-level)

Theo kết quả `git rev-list --left-right --count "feature/client...main"`:

- Kết quả: `0    4`
  - **0** commit chỉ có ở `feature/client` (không có ở `main`)
  - **4** commit chỉ có ở `main` (không có ở `feature/client`)
→ **`feature/client` đang behind `main` 4 commits**.

> Lưu ý: đây là “khoảng cách commit”, không phải số file.

### 2.2 Danh sách commit trên `main` mà `feature/client` chưa có

Theo `git log "feature/client..main"`:

- `d7922f3` `chore: cập nhật .gitignore, README và thêm tài liệu docs`
- `13049c4` `feat(frontend): giao diện tiếng Việt, lịch sử đơn hàng API, hồ sơ & đổi mật khẩu`
- `834692f` `docs: remove temporary refactoring summary files`
- `69f4935` `Merge pull request #1 from Danh2003dr/feature/client`

> Đây là **4 commit “đầu vào”** bạn cần review để quyết định: merge/rebase hay cherry-pick từng phần.

### 2.3 File-level diff (main → feature/client)

Theo `git diff --name-status "feature/client..main"` (so sánh tree `feature/client` → `main`), các thay đổi chính trên `main` gồm:

- **Files được thêm trên `main`** (feature chưa có) — bạn sẽ nhận được nếu merge/rebase:
  - `.env.example`
  - `docs/BACKEND_VS_FRONTEND.md`
  - `docs/DE_XUAT_HOAN_THIEN_NGUOI_DUNG.md`
  - `src/context/AuthContext.tsx`
  - `src/context/AvatarContext.tsx`
  - `src/context/CartContext.tsx`
  - `src/context/WishlistContext.tsx`
  - `src/hooks/useProductApi.ts`
  - `src/services/backend.ts`
  - `src/services/productMappers.ts`
  - `src/types/api.ts`

- **Files bị xóa trên `main`** (feature đang có) — merge/rebase có thể làm “mất” các docs này nếu bạn không giữ:
  - `ADDRESS_ROUTE_FIX_SUMMARY.md`
  - `DATA_UI_ANALYSIS.md`
  - `DEALS_OUTLET_MERGE_SUMMARY.md`
  - `DECISION_ANALYSIS.md`
  - `DROPDOWN_MENU_IMPLEMENTATION.md`
  - `HOMEPAGE_PRODUCT_CLICK_FIX.md`
  - `IRRELEVANT_CONTENT_ANALYSIS.md`
  - `NAVIGATION_FIX_SUMMARY.md`
  - `PRODUCT_DETAIL_UNIFICATION_SUMMARY.md`
  - `REFACTOR_COMPLETE_SUMMARY.md`
  - `REFACTOR_SUMMARY.md`
  - `REFACTOR_SUMMARY_ROUTES.md`
  - `TODO_LIST.md`
  - `UI_DUPLICATE_ANALYSIS.md`
  - `UI_UX_ANALYSIS.md`

- **Files được sửa trên `main`** (cần review xung đột khi mang vào feature):
  - `README.md`, `.gitignore`, `index.html`, `src/App.tsx`
  - `src/components/layout/*`, `src/pages/store/*`, `src/pages/account/*`, `src/pages/auth/*`, `src/pages/checkout/*`
  - `src/services/api.ts`, `src/features/products/components/ProductCard.tsx`, `src/data/index.ts`, `src/types/index.ts`

> Nếu bạn muốn “mang vào feature/client nhưng vẫn giữ docs”, có 2 cách phổ biến:
> - Merge/rebase để lấy code, sau đó **git restore** các file docs bạn muốn giữ (hoặc cherry-pick chọn lọc).
> - Cherry-pick commit `13049c4` (code) + `d7922f3` (README/.gitignore/docs) theo nhu cầu.

## 3) Gợi ý cách “đưa main vào feature/client” mà vẫn giữ phần chính của feature

Vì `feature/client` đang behind `main` 4 commits, nên để “lên kịp main” thường có 2 hướng:

- **Rebase**: đưa commit của feature lên trên `main` (lịch sử gọn; hay dùng nếu feature chưa share rộng).
- **Merge main → feature/client**: dễ hiểu, ít “động” lịch sử hơn (tạo merge commit).

Rủi ro xung đột cao nhất nằm ở các nhóm file (vì cả hai nhánh đều chạm):

- **Routes/Layout**: `src/App.tsx`, `src/components/layout/*`
- **Store pages**: `src/pages/store/*`
- **Account/Auth/Checkout pages**: `src/pages/account/*`, `src/pages/auth/*`, `src/pages/checkout/*`
- **Services/Types/Context**: `src/services/*`, `src/types/*`, `src/context/*`

## 4) File báo cáo liên quan trong repo

- `PROJECT_STATUS.md` — tổng quan tình trạng dự án
- `PROGRESS_REPORT.md` — tiến độ theo Trello cards
- `FRONTEND_REQUIREMENTS.md` — checklist yêu cầu frontend


