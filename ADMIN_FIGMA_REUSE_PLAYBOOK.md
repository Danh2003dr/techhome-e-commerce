# ADMIN Figma Reuse Playbook (Lightweight Extraction)

> Muc tieu: ban chi lay dung phan can dung tu template Figma admin (tranh "nhung" ca bo template nang), va map vao dung cau truc admin du an `techhome-e-commerce`.

---

## 1) Doc quick: Du an dang dung gi?

Du an (frontend) trong `FRONTEND_REQUIREMENTS.md`:
- React + TypeScript
- Vite
- React Router DOM
- Tailwind CSS (hien tai). Neu Figma dung he UI khac (vd DashStack UI) thi chi lay pattern va style can thiet.

Admin (TO-BE) can tao (tham chieu):
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

## 2) Nguyen tac: Lay "phan phu hop", khong lay "phan nang"

Template admin thuong co:
- Shell/layout (sidebar + topbar + breadcrumb + content area)
- Navigation/menu
- Component dung chung (button/input/table/badge/modal)
- Page-specific sections (orders table, product form, status changer...)

Rule de trich:
1. Lay *shell* dung nhat (sidebar/topbar) va thay hang loat trang ben trong vao `AdminLayout`.
2. Lay *component dung chung* theo nhu cau (vd OrderStatusBadge, OrderStatusChanger).
3. Lay *UI page* theo tung trang can lam; page nao khong co trong TO-BE thi de sau (Inbox/Calendar/To-do co the lam sau).
4. Neu Figma co nhieu layer "decor" (texture, animation, extra widgets) thi khong trich; chi trich layout, spacing, typography, color, state chinh.

---

## 3) Ban (nguoi truyen Figma) can cung cap gi de minh lam nhanh

Vui long cung cap theo mau o muc 4. Nhan 1 lan du lieu ro rang se giam nhieu vong hoi.

### 3.1 Can trich "Frame/Screen" nao?
Chon trong Figma cac frame/page co lien quan den admin:
- Dashboard (neu co)
- Products list
- Product create/edit form
- Orders list
- Order detail (neu co)
- SEO settings
- Inbox (neu co)
- Calendar (neu co)
- To-do (neu co)

Neu template qua nang, ban chi can:
- Shell (sidebar + header)
- Products list + Product form
- Orders list + Order detail
Con cac trang khac lam sau.

### 3.2 Can trich "Component" nao?
I. Dung chung:
- Button (primary/secondary)
- Input/select
- Table row/header
- Badge
- Modal/drawer (neu co)
II. Rieng cho admin:
- OrderStatusBadge
- OrderStatusChanger (neu co UI thay trang thai)
- Image uploader (product image upload)
- Specs editor (key-value / dynamic fields)
- Invoice action (download/print) (neu Figma co)

### 3.3 Can nho: Interaction state
Figma thuong co state:
- hover/focus/active/disabled
- trang thai badge (Processing/Shipping/Completed/Rejected)
- row action / pagination
Ban danh dau gi o frame/page can "state" nao minh phai lam.

---

## 4) Mau thong tin de dien (ban vui long fill)

### 4.1 Thong tin Figma
- Link Figma: `...`
- Ten file Figma: `...`
- Node/page root (neu biet): `...`

### 4.2 Frame can lay (dien ten y nhu trong Figma)
| Page/Frame (Figma name) | Muc dich | Trang TO-BE (map) | Ghi chu (trich gi) |
|---|---|---|---|
| ... | ... | AdminLayout | Shell/sidebar/topbar |
| ... | ... | ProductListPage | Table + filters (neu co) |
| ... | ... | ProductFormPage | Form fields + submit |
| ... | ... | OrderListPage | Orders table + status |
| ... | ... | OrderDetailPage | Detail sections + status changer |

### 4.3 Tokens/Style (neu ban da co, hoac cho minh extract)
- Primary color (Figma): `...`
- Background (page): `...`
- Text color (default): `...`
- Border radius (chips/cards): `...`
- Shadow (card/modal): `...`
- Font (neu biet): `...`

### 4.4 Assets
- Icon set trong Figma: (material/feather/custom?) `...`
- Co cung cap SVG/PNG? `co/khong`
- Image sample (logo/product) cho minh dung trong mock: `...`

### 4.5 Uu tien trien khai
Ban chon 1 trong 3 option:
- Option A (thanh fast): Shell + Products + Orders
- Option B (day du TO-BE): Shell + Products + Orders + SEO + Inbox/Calendar/To-do
- Option C (design system first): Extract tokens/components truoc, sau do page

---

## 5) MAP sang code: co san file nao, minh se tao file nao

### 5.1 AdminLayout (Shell)
`src/pages/admin/AdminLayout.tsx`
- Input: (optional) nav data, current active route
- Layout:
  - Sidebar (menu)
  - Topbar (user actions neu co)
  - Content area (Outlet/children)
- Ki thuat:
  - Tranh code nhe: dung Tailwind classes direct.
  - Khong nhung widget “non-admin” cua template.

### 5.2 Products
1. `ProductListPage.tsx`
   - UI can: table, columns, actions (edit/delete), pagination (neu Figma co)
2. `ProductFormPage.tsx`
   - UI can: form fields + submit + validation placeholders
3. `ProductImageUpload.tsx`
   - UI can: upload area, preview thumbnails, remove
4. `ProductSpecsManager.tsx`
   - UI can: dynamic key-value pairs theo product type (hoac form key set)

### 5.3 Orders
1. `OrderListPage.tsx`
   - UI can: table orders + search/filter (neu co)
2. `OrderDetailPage.tsx`
   - UI can: detail sections + order items + status change action
3. `OrderStatusBadge.tsx`
   - Mapping status -> badge style (mau + text)
4. `OrderStatusChanger.tsx`
   - UI can: dropdown/select/chips de chuyen trang thai
5. `useSocketOrders.ts`
   - UI refresh realtime khi co order new/changed
6. `generateInvoicePDF.ts`
   - UI action: download/print (noi dung PDF se do backend/data cung cap)

### 5.4 SEO + static pages
- `SEOSettingsPage.tsx`: form title/description/meta preview (neu Figma co)
- Inbox/Calendar/Todo: UI tĩnh theo Figma (lam sau neu option A)

---

## 6) Checklist trich design (de khong bi “nang”)

### 6.1 Shell
- [ ] Sidebar menu: danh sach item + icon + active state
- [ ] Topbar: title/breadcrumb/user avatar (neu co)
- [ ] Content padding/margin va max-width (theo Figma)
- [ ] Background color/gradient (neu co) - chi lay 1 version don gian

### 6.2 Table
- [ ] Column definitions: name/orderId/customer/status/total/date (map vao data sau)
- [ ] Header row style
- [ ] Row hover style
- [ ] Empty state (neu Figma co)
- [ ] Pagination/rows count (neu Figma co)

### 6.3 Form
- [ ] Text inputs: label, placeholder, focus ring
- [ ] Selects/radios/checkbox: style + spacing
- [ ] Buttons: primary/secondary/ghost/disabled
- [ ] Validation (neu Figma co) => lam placeholder state (chua can backend)

### 6.4 Status badge/changer
- [ ] Badge style cho: Processing/Shipping/Completed/Rejected
- [ ] Changer style: dropdown/chips + confirm (neu Figma co)

---

## 7) Cach minh se lam (tuong ung quy trinh giao vien)

Buoc 1: Ban gui link + frame/page name + trang TO-BE map (muc 4)
Buoc 2: Minh xac dinh "shell + component" dung nhat, loai bo decoration thua
Buoc 3: Tao file AdminLayout + nav structure (placeholder data)
Buoc 4: Tiep theo tao Product pages (list/form/specs + upload UI)
Buoc 5: Sau do Order pages (list/detail + badge/changer + invoice button UI)
Buoc 6: Cuoi cung: SEO + Inbox/Calendar/To-do theo option duoc chon

---

## 8) Template giao tiep (ban chi can copy/paste khi nhan ket qua)

Figma link: `...`
Frame/page:
- AdminLayout frame: `...`
- Products list frame: `...`
- Product form frame: `...`
- Orders list frame: `...`
- Order detail frame: `...`

Trang TO-BE map:
- ProductListPage: `...`
- ProductFormPage: `...`
- OrderListPage: `...`
- OrderDetailPage: `...`

Uu tien: Option A/B/C

Tokens (neu co): primary=`...`, bg=`...`, font=`...`

Assets (neu co): icon set=`...`

