# Yêu Cầu Frontend - Cyber Store / TechHome E-Commerce

Tài liệu này liệt kê các yêu cầu frontend được lọc từ mô tả dự án Cyber Store và áp dụng cho dự án TechHome E-Commerce.

---

## 📋 Mục Lục

1. [Kiến trúc và Công nghệ](#kiến-trúc-và-công-nghệ)
2. [Phân hệ Khách hàng (Client Side)](#phân-hệ-khách-hàng-client-side)
3. [Phân hệ Quản trị (Admin Side)](#phân-hệ-quản-trị-admin-side)
4. [Bảo mật và Xác thực](#bảo-mật-và-xác-thực)
5. [Tối ưu hóa Performance](#tối-ưu-hóa-performance)
6. [Tích hợp API](#tích-hợp-api)
7. [Tổng kết - Checklist](#tổng-kết---checklist)

---

## 🏗️ Kiến trúc và Công nghệ

### ✅ Đã có
- ✅ React JS + TypeScript
- ✅ Vite (build tool)
- ✅ React Router DOM (routing)

### ⚠️ Cần điều chỉnh
- ⚠️ **Bootstrap**: Yêu cầu sử dụng Bootstrap, nhưng hiện tại đang dùng **Tailwind CSS**
  - **Quyết định**: Giữ Tailwind CSS (hiện đại hơn) hoặc chuyển sang Bootstrap theo yêu cầu
  - **Gợi ý**: Có thể kết hợp cả hai nếu cần

### ❌ Chưa có
- ❌ **Lazy Loading**: Tối ưu thời gian tải trang < 2 giây
- ❌ **RESTful API Integration**: Kết nối với Backend
- ❌ **JWT Authentication**: Xác thực người dùng

---

## 🛒 Phân hệ Khách hàng (Client Side)

### 1. Danh sách Sản phẩm

#### ✅ Đã có
- ✅ Hiển thị dạng Grid
- ✅ Hình ảnh sản phẩm
- ✅ Thông tin cơ bản (tên, giá)

#### ❌ Cần bổ sung
- ❌ **Bộ lọc chi tiết**:
  - ✅ Thương hiệu (Brand) - Đã có cơ bản
  - ✅ Loại sản phẩm (Product Type) - Đã có
  - ❌ **Dung lượng pin (Battery Capacity)** - Chưa có
  - ❌ **Loại màn hình (Screen Type)** - Chưa có

**File cần chỉnh sửa**: 
- `src/pages/store/ProductListingPage.tsx`
- `src/pages/store/SearchResults.tsx`

---

### 2. So sánh Sản phẩm

#### ✅ Đã có
- ✅ Trang Compare (`/compare`)
- ✅ Hiển thị bảng so sánh thông số kỹ thuật
- ✅ Highlight differences

#### ❌ Cần bổ sung
- ❌ **Chọn tối đa 4 sản phẩm** (hiện tại hardcode 3 sản phẩm)
- ❌ **Truy xuất thông số từ Database** (hiện tại hardcode)
- ❌ **Chức năng chọn sản phẩm để so sánh** từ danh sách

**File cần chỉnh sửa**:
- `src/pages/store/ComparePage.tsx`
- Cần thêm: Component chọn sản phẩm để so sánh

---

### 3. Trang Chi tiết Sản phẩm

#### ✅ Đã có
- ✅ Hiển thị thông số kỹ thuật (Specifications)
- ✅ Gallery hình ảnh
- ✅ Thông tin cơ bản (giá, mô tả)
- ✅ Rating sao (hiển thị)

#### ❌ Cần bổ sung
- ❌ **Reviews System**: 
  - Xem đánh giá của người dùng khác
  - Form gửi đánh giá mới
  - Xếp hạng sao (1-5 sao)
  - Hiển thị danh sách reviews với pagination

**File cần chỉnh sửa**:
- `src/pages/store/ProductDetail.tsx`
- Cần thêm: Component Reviews/ReviewsForm

---

### 4. Quy trình Mua hàng (Checkout) - 3 Bước

#### ✅ Đã có
- ✅ Trang Cart (`/cart`)
- ✅ Order Summary
- ✅ Nút "Proceed to Checkout"

#### ❌ Cần xây dựng mới - Quy trình 3 bước

**Bước 1: Thông tin Người nhận & Địa chỉ**
- Form nhập thông tin người nhận
- Chọn loại địa chỉ:
  - ✅ Nhà riêng (Home)
  - ✅ Văn phòng (Office)
- Quản lý địa chỉ đã lưu (có sẵn ở `/addresses`)

**Bước 2: Phương thức Vận chuyển**
- Chọn một trong các phương thức:
  - ✅ Miễn phí (Free)
  - ✅ Tiêu chuẩn (Standard)
  - ✅ Hỏa tốc (Express)
- Hiển thị thời gian giao hàng ước tính
- Hiển thị phí vận chuyển

**Bước 3: Thanh toán**
- Áp dụng mã giảm giá (Coupon code)
- Form nhập thông tin thẻ tín dụng:
  - Số thẻ
  - Tên chủ thẻ
  - Ngày hết hạn
  - CVV
- Xác nhận đơn hàng
- Chuyển đến trang Order Confirmation

**Files cần tạo**:
- `src/pages/checkout/CheckoutPage.tsx` (Multi-step form)
- `src/components/checkout/CheckoutStep1.tsx` (Shipping Info)
- `src/components/checkout/CheckoutStep2.tsx` (Shipping Method)
- `src/components/checkout/CheckoutStep3.tsx` (Payment)
- `src/components/checkout/CheckoutStepper.tsx` (Progress indicator)

---

## 👨‍💼 Phân hệ Quản trị (Admin Side)

### ❌ Cần xây dựng hoàn toàn mới

#### 1. UI Framework
- ❌ **DashStack UI**: Sử dụng bộ UI DashStack thống nhất
- Cần tìm hiểu và tích hợp DashStack components

#### 2. Quản lý Sản phẩm
- ❌ **CRUD Sản phẩm**:
  - Thêm sản phẩm mới
  - Sửa thông tin sản phẩm
  - Xóa sản phẩm
  - Upload hình ảnh lên server
- ❌ **Thông số kỹ thuật động**:
  - Thiết lập Key-Value pairs cho từng loại sản phẩm
  - Phục vụ chức năng so sánh phía khách hàng

**Files cần tạo**:
- `src/pages/admin/AdminLayout.tsx`
- `src/pages/admin/products/ProductListPage.tsx`
- `src/pages/admin/products/ProductFormPage.tsx`
- `src/pages/admin/products/ProductImageUpload.tsx`
- `src/pages/admin/products/ProductSpecsManager.tsx`

#### 3. Quản lý Đơn hàng
- ❌ **Socket.io Integration**:
  - Nhận thông báo real-time khi có đơn hàng mới
  - Không cần reload trang
- ❌ **Chuyển đổi trạng thái đơn hàng**:
  - Đang xử lý (Processing)
  - Đang vận chuyển (Shipping)
  - Hoàn thành (Completed)
  - Từ chối (Rejected)
- ❌ **Xuất hóa đơn PDF**:
  - Tự động sinh hóa đơn
  - Nút download/print PDF

**Files cần tạo**:
- `src/pages/admin/orders/OrderListPage.tsx`
- `src/pages/admin/orders/OrderDetailPage.tsx`
- `src/components/admin/OrderStatusBadge.tsx`
- `src/components/admin/OrderStatusChanger.tsx`
- `src/utils/generateInvoicePDF.ts`
- `src/hooks/useSocketOrders.ts` (Socket.io hook)

#### 4. Cấu hình SEO
- ❌ **SEO Settings**:
  - Title
  - Description
  - Meta tags

**Files cần tạo**:
- `src/pages/admin/seo/SEOSettingsPage.tsx`

#### 5. Tiện ích Nội bộ (Static UI)
- ❌ **Inbox**: Giao diện hộp thư (tĩnh)
- ❌ **Calendar**: Giao diện lịch (tĩnh)
- ❌ **To-Do List**: Danh sách công việc (tĩnh)

**Files cần tạo**:
- `src/pages/admin/inbox/InboxPage.tsx`
- `src/pages/admin/calendar/CalendarPage.tsx`
- `src/pages/admin/todo/TodoListPage.tsx`

---

## 🔐 Bảo mật và Xác thực

### ❌ Chưa có

#### 1. JWT Authentication
- ❌ Login với JWT token
- ❌ Lưu trữ token (localStorage/sessionStorage)
- ❌ Refresh token mechanism
- ❌ Protected routes (PrivateRoute đã có nhưng chưa tích hợp JWT)

**Files cần chỉnh sửa/tạo**:
- `src/routes/PrivateRoute.tsx` (tích hợp JWT)
- `src/services/auth.ts` (JWT service)
- `src/hooks/useAuth.ts` (Auth hook)
- `src/context/AuthContext.tsx` (Auth context)

#### 2. SSL/TLS
- ⚠️ Cấu hình ở server level (không phải frontend)
- ✅ Đảm bảo HTTPS trong production

#### 3. Password Encryption
- ⚠️ BCrypt ở Backend (không phải frontend)
- ✅ Frontend chỉ cần validate password strength

---

## ⚡ Tối ưu hóa Performance

### ❌ Chưa có

#### 1. Lazy Loading
- ❌ **React.lazy()** cho routes
- ❌ **Image lazy loading** (loading="lazy")
- ❌ **Code splitting** với Vite
- ❌ **Mục tiêu**: Thời gian tải trang < 2 giây

**Files cần chỉnh sửa**:
- `src/routes/AppRoutes.tsx` (lazy load routes)
- `src/components/ProductCard.tsx` (lazy load images)
- `vite.config.ts` (code splitting config)

#### 2. Image Optimization
- ❌ Responsive images (srcset)
- ❌ WebP format support
- ❌ Image compression

---

## 🔌 Tích hợp API

### ❌ Chưa có

#### 1. RESTful API Client
- ❌ Axios/Fetch service layer
- ❌ API endpoints configuration
- ❌ Error handling
- ❌ Request/Response interceptors

**Files cần tạo**:
- `src/services/api.ts` (đã có nhưng cần mở rộng)
- `src/services/productsApi.ts`
- `src/services/ordersApi.ts`
- `src/services/authApi.ts`
- `src/services/adminApi.ts`
- `src/utils/apiErrorHandler.ts`

#### 2. State Management
- ❌ Context API hoặc Redux/Zustand cho:
  - Cart state
  - Auth state
  - Products state
  - Orders state

**Files cần tạo**:
- `src/context/CartContext.tsx`
- `src/context/AuthContext.tsx`
- `src/store/productsStore.ts` (nếu dùng Zustand)

---

## 📊 Tổng kết - Checklist

### ✅ Đã hoàn thành
- [x] React + TypeScript setup
- [x] Routing structure
- [x] Basic product listing (Grid)
- [x] Product detail page
- [x] Compare page (UI)
- [x] Cart page
- [x] User profile pages
- [x] Authentication pages (UI)

### 🔄 Cần cải thiện
- [ ] Bộ lọc sản phẩm (thêm Battery, Screen Type)
- [ ] So sánh sản phẩm (cho phép chọn 4 sản phẩm)
- [ ] Reviews system trên ProductDetail

### 🆕 Cần xây dựng mới
- [ ] Checkout 3 bước (Shipping → Shipping Method → Payment)
- [ ] Admin Dashboard (toàn bộ)
- [ ] JWT Authentication
- [ ] RESTful API Integration
- [ ] Lazy Loading & Performance optimization
- [ ] Socket.io cho Admin orders

### 📝 Ghi chú
- Dự án hiện tại đang dùng **Tailwind CSS** thay vì **Bootstrap** như yêu cầu
- Cần quyết định: Giữ Tailwind hay chuyển sang Bootstrap
- Tất cả data hiện tại đang hardcode trong `src/data/index.ts`, cần chuyển sang API calls

---

## 🎯 Ưu tiên thực hiện

### Phase 1: Client Side Essentials
1. Checkout 3 bước
2. Bộ lọc sản phẩm đầy đủ
3. Reviews system
4. So sánh sản phẩm (chọn 4 sản phẩm)

### Phase 2: API Integration
1. RESTful API client setup
2. JWT Authentication
3. Replace hardcoded data với API calls

### Phase 3: Performance & Admin
1. Lazy Loading
2. Admin Dashboard
3. Socket.io integration

---

**Ngày tạo**: 2024
**Phiên bản**: 1.0

