# Admin Routes (TechHome E-Commerce)

Tài liệu này liệt kê chính xác các URL (frontend routes) để truy cập Admin Dashboard và các màn quản lý liên quan trong project.

---

## 1) Nguon khai bao routing (frontend)

- Routing được khai bao trong: `src/routes/AppRoutes.tsx`
- Giao dien shell/menu Admin nằm trong: `src/pages/admin/AdminLayout.tsx`
- Toan bo nhom routes Admin duoc boc boi bo bao ve: `src/routes/PrivateRoute.tsx`
- App su dung `HashRouter`, vi vay URL thuc te co dang: `/#/...`

---

## 2) Cach truy cap URL (vi HashRouter)

Vi project dung `HashRouter`, tat ca route se nam sau phan hash (#).

Vi du (server dev):
- `http://localhost:<port>/#/admin`
- `http://localhost:<port>/#/admin/products`
- `http://localhost:<port>/#/admin/orders/123`

Neu ban deploy, chi can thay `localhost:<port>` bang domain/port cua ban, con phan `/#/...` giu nguyen.

---

## 3) Route Admin tong hop

Danh sach duoc khai bao boi `AppRoutes.tsx` voi prefix `/admin`:

| Nhom trang | Route (frontend) | Component (UI) |
|---|---|---|
| Dashboard | `/admin` | `src/pages/admin/AdminDashboardPage.tsx` |
| Products - list | `/admin/products` | `src/pages/admin/products/ProductListPage.tsx` |
| Products - create | `/admin/products/new` | `src/pages/admin/products/ProductFormPage.tsx` |
| Products - edit | `/admin/products/:id` | `src/pages/admin/products/ProductFormPage.tsx` |
| Orders - list | `/admin/orders` | `src/pages/admin/orders/OrderListPage.tsx` |
| Orders - dash variant | `/admin/orders/dash/:variantId` | `src/pages/admin/orders/OrderListsVariantPage.tsx` |
| Orders - detail | `/admin/orders/:orderId` | `src/pages/admin/orders/OrderDetailPage.tsx` |
| Orders - invoice | `/admin/orders/:orderId/invoice` | `src/pages/admin/orders/InvoicePage.tsx` |
| SEO settings | `/admin/seo` | `src/pages/admin/seo/SEOSettingsPage.tsx` |
| Inbox - list | `/admin/inbox` | `src/pages/admin/inbox/InboxPage.tsx` |
| Inbox - thread | `/admin/inbox/:threadId` | `src/pages/admin/inbox/InboxThreadPage.tsx` |
| Inbox - dash variant | `/admin/inbox/dash/:variantId` | `src/pages/admin/inbox/InboxListVariantPage.tsx` |
| Calendar | `/admin/calendar` | `src/pages/admin/calendar/CalendarPage.tsx` |
| Calendar - new event | `/admin/calendar/new` | `src/pages/admin/calendar/CalendarEventFormPage.tsx` |
| To-Do - list | `/admin/todo` | `src/pages/admin/todo/TodoListPage.tsx` |
| To-Do - add task | `/admin/todo/new` | `src/pages/admin/todo/TodoAddPage.tsx` |

---

## 4) Tham so tren route (route params)

Trong cac route Admin co tham so:

- `:id` (products): `src/pages/admin/products/ProductFormPage.tsx`
- `:orderId` (orders): `src/pages/admin/orders/OrderDetailPage.tsx`, `src/pages/admin/orders/InvoicePage.tsx`
- `:variantId` (dash list): `src/pages/admin/orders/OrderListsVariantPage.tsx`, `src/pages/admin/inbox/InboxListVariantPage.tsx`
- `:threadId` (inbox): `src/pages/admin/inbox/InboxThreadPage.tsx`

---

## 5) Menu Sidebar cua Admin (duong dan nhanh)

Danh sach menu duoc dinh nghia trong `src/pages/admin/AdminLayout.tsx` (coreNav + pageNav).

Core:
- `Dashboard` -> `/admin`
- `Products` -> `/admin/products`
- `Order Lists` -> `/admin/orders`
- `Inbox` -> `/admin/inbox`
- `Calendar` -> `/admin/calendar`
- `To-Do` -> `/admin/todo`

Pages:
- `Settings / SEO` -> `/admin/seo`
- `Add Product` -> `/admin/products/new`

---

## 6) Bao ve truy cap (/admin) - PrivateRoute

Trong `src/routes/AppRoutes.tsx`:
- Tuyen `/admin/*` duoc boc trong `PrivateRoute`

Trong `src/routes/PrivateRoute.tsx`:
- Dang co stub: `const isAuthenticated = true` (chua thuc hien check token/role)
- Neu sau nay ban thay `isAuthenticated` phu hop voi auth thuc te, route `/admin/*` se phai thoa man dieu kien authentication (va sau do co the bo sung role/RBAC neu muon).

---

## 7) Kiem tra nhanh (smoke test) cac route Admin

1. Chay dev server (`npm run dev`).
2. Mo 3 route co tham so de kiem tra match:
   - `/#/admin`
   - `/#/admin/products`
   - `/#/admin/orders/1`
   - (neu can) `/#/admin/orders/1/invoice`

Neu tat ca deu render dung trang, viec match route cua React Router la OK.

---

## 8) Backend API cho Admin (trang thai hien tai)

Qua ra soat nhanh trong repo hien tai:
- Frontend `src/pages/admin/*` hien dang chu yeu la placeholder UI
- Chua thay ro rang UI Admin goi truc tiep cac endpoint backend admin (vi chua co “admin runtime” day du)

Backend endpoint tong quan hien co trong `src/services/backend.ts` (base `/api/...`), nhung noi dung admin/public mapping chua duoc doc ro tu cac trang Admin.

Neu ban muon, toi co the tiep tuc map: `Trang Admin` -> `endpoint /api/...` tu phan API da co.

