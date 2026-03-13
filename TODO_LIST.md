# 📋 Danh Sách Công Việc Cần Làm - TechHome E-Commerce

Tài liệu này liệt kê chi tiết tất cả các công việc cần thực hiện và những phần chưa hoàn thiện trong dự án, dựa trên `FRONTEND_REQUIREMENTS.md`.

---

## 🎯 TỔNG QUAN

### ✅ Đã Hoàn Thành (Cơ Bản)
- ✅ React + TypeScript setup
- ✅ Vite build tool
- ✅ React Router DOM routing
- ✅ Cấu trúc thư mục cơ bản
- ✅ UI pages: Home, Product Listing, Product Detail, Cart, Compare
- ✅ User pages: Profile, Orders, Addresses, Wishlist, Warranty
- ✅ Auth pages: Login, SignUp, ForgotPassword (UI only)
- ✅ Basic API service structure (`src/services/api.ts`)

### ⚠️ Cần Điều Chỉnh
- ⚠️ **CSS Framework**: Đang dùng Tailwind CSS, yêu cầu Bootstrap (cần quyết định)

### ❌ Chưa Có / Chưa Hoàn Thiện
- ❌ **100%** Admin Dashboard
- ❌ **100%** Checkout 3 bước
- ❌ **100%** API Integration
- ❌ **100%** JWT Authentication
- ❌ **100%** Lazy Loading & Performance
- ❌ **100%** Reviews System
- ❌ **100%** So sánh sản phẩm (chọn 4 sản phẩm)
- ❌ **100%** Bộ lọc đầy đủ (Battery, Screen Type)

---

## 📦 PHẦN 1: PHÂN HỆ KHÁCH HÀNG (CLIENT SIDE)

### 1.1. Danh Sách Sản Phẩm - Bộ Lọc

**File hiện tại**: `src/pages/store/ProductListingPage.tsx`

**Trạng thái**: ⚠️ **Thiếu 2 bộ lọc**

**Cần bổ sung**:
- ❌ **Dung lượng pin (Battery Capacity)**
  - Thêm filter section "Battery Capacity"
  - Options: 3000mAh, 4000mAh, 5000mAh, 6000mAh+
  - Tích hợp vào logic filter hiện tại

- ❌ **Loại màn hình (Screen Type)**
  - Thêm filter section "Screen Type"
  - Options: LCD, OLED, AMOLED, IPS, Retina
  - Tích hợp vào logic filter hiện tại

**Files cần chỉnh sửa**:
- `src/pages/store/ProductListingPage.tsx`
- `src/pages/store/SearchResults.tsx`

**Ưu tiên**: 🔴 **CAO** (Phase 1)

---

### 1.2. So Sánh Sản Phẩm

**File hiện tại**: `src/pages/store/ComparePage.tsx`

**Trạng thái**: ⚠️ **Chưa hoàn thiện**

**Vấn đề hiện tại**:
- ❌ Hardcode 3 sản phẩm (cần cho phép chọn tối đa 4)
- ❌ Hardcode thông số kỹ thuật (cần lấy từ Database/API)
- ❌ Không có chức năng chọn sản phẩm để so sánh từ danh sách

**Cần bổ sung**:
1. **Component chọn sản phẩm**:
   - Modal/Dropdown để chọn sản phẩm từ danh sách
   - Cho phép chọn tối đa 4 sản phẩm
   - Hiển thị thông báo khi đạt giới hạn
   - Nút "Remove" để xóa sản phẩm khỏi danh sách so sánh

2. **Truy xuất thông số từ API**:
   - Thay thế `COMPARE_SECTIONS` hardcode
   - Lấy specs từ API endpoint `/api/products/:id/specs`
   - Xử lý loading state

3. **Lưu trữ state so sánh**:
   - Context/Store để lưu danh sách sản phẩm đang so sánh
   - Persist vào localStorage
   - Nút "Add to Compare" trên ProductCard

**Files cần tạo/chỉnh sửa**:
- `src/pages/store/ComparePage.tsx` (refactor)
- `src/components/store/ProductSelector.tsx` (mới)
- `src/components/store/CompareProductCard.tsx` (mới)
- `src/context/CompareContext.tsx` (mới)
- `src/services/productsApi.ts` (thêm method getProductSpecs)

**Ưu tiên**: 🔴 **CAO** (Phase 1)

---

### 1.3. Trang Chi Tiết Sản Phẩm - Reviews System

**File hiện tại**: `src/pages/store/ProductDetail.tsx`

**Trạng thái**: ⚠️ **Thiếu Reviews System**

**Vấn đề hiện tại**:
- ✅ Hiển thị rating sao (đã có)
- ✅ Hiển thị review score (đã có)
- ❌ **Chưa có form gửi đánh giá mới**
- ❌ **Chưa có API để lấy reviews từ backend**
- ❌ **Chưa có pagination cho reviews**

**Cần bổ sung**:

1. **ReviewsForm Component**:
   - Form nhập đánh giá:
     - Rating (1-5 sao)
     - Tiêu đề review
     - Nội dung review
     - Upload hình ảnh (optional)
   - Validation
   - Submit lên API

2. **ReviewsList Component**:
   - Hiển thị danh sách reviews với pagination
   - Filter theo rating (1-5 sao)
   - Sort (newest, oldest, highest rating, lowest rating)
   - Hiển thị "Verified Buyer" badge

3. **API Integration**:
   - `GET /api/products/:id/reviews` (với pagination)
   - `POST /api/products/:id/reviews` (tạo review mới)
   - `PUT /api/products/:id/reviews/:reviewId` (chỉnh sửa review của mình)
   - `DELETE /api/products/:id/reviews/:reviewId` (xóa review của mình)

**Files cần tạo/chỉnh sửa**:
- `src/pages/store/ProductDetail.tsx` (thêm reviews section)
- `src/components/store/ReviewsForm.tsx` (mới)
- `src/components/store/ReviewsList.tsx` (mới)
- `src/components/store/ReviewCard.tsx` (mới)
- `src/services/productsApi.ts` (thêm review methods)

**Ưu tiên**: 🔴 **CAO** (Phase 1)

---

### 1.4. Quy Trình Mua Hàng (Checkout) - 3 Bước

**File hiện tại**: `src/pages/checkout/CartPage.tsx`

**Trạng thái**: ❌ **Chưa có Checkout 3 bước**

**Vấn đề hiện tại**:
- ✅ Cart page đã có (hiển thị giỏ hàng)
- ✅ Nút "Proceed to Checkout" đã có
- ❌ **Chưa có trang Checkout 3 bước**

**Cần xây dựng mới**:

#### **Bước 1: Thông tin Người nhận & Địa chỉ**

**Yêu cầu**:
- Form nhập thông tin người nhận:
  - Họ tên
  - Số điện thoại
  - Email
- Chọn loại địa chỉ:
  - ✅ Nhà riêng (Home)
  - ✅ Văn phòng (Office)
- Quản lý địa chỉ đã lưu:
  - Dropdown/Radio để chọn địa chỉ đã lưu
  - Nút "Add New Address"
  - Tích hợp với `/addresses` page

**Files cần tạo**:
- `src/pages/checkout/CheckoutPage.tsx` (main container)
- `src/components/checkout/CheckoutStep1.tsx` (Shipping Info)
- `src/components/checkout/CheckoutStepper.tsx` (Progress indicator)

#### **Bước 2: Phương thức Vận chuyển**

**Yêu cầu**:
- Chọn một trong các phương thức:
  - ✅ Miễn phí (Free) - 5-7 ngày
  - ✅ Tiêu chuẩn (Standard) - 3-5 ngày - $10
  - ✅ Hỏa tốc (Express) - 1-2 ngày - $25
- Hiển thị thời gian giao hàng ước tính
- Hiển thị phí vận chuyển
- Cập nhật tổng tiền real-time

**Files cần tạo**:
- `src/components/checkout/CheckoutStep2.tsx` (Shipping Method)

#### **Bước 3: Thanh toán**

**Yêu cầu**:
- Áp dụng mã giảm giá (Coupon code):
  - Input field
  - Nút "Apply"
  - Hiển thị discount amount
  - Validation
- Form nhập thông tin thẻ tín dụng:
  - Số thẻ (16 số, format: XXXX XXXX XXXX XXXX)
  - Tên chủ thẻ
  - Ngày hết hạn (MM/YY)
  - CVV (3 số)
  - Validation
- Xác nhận đơn hàng:
  - Review order summary
  - Nút "Place Order"
  - Loading state
  - Error handling
- Chuyển đến trang Order Confirmation sau khi thành công

**Files cần tạo**:
- `src/components/checkout/CheckoutStep3.tsx` (Payment)
- `src/components/checkout/CouponInput.tsx` (mới)
- `src/components/checkout/CreditCardForm.tsx` (mới)
- `src/utils/creditCardValidator.ts` (mới)

**State Management**:
- Sử dụng Context hoặc Zustand để quản lý checkout state
- Lưu thông tin qua các bước

**Files cần tạo**:
- `src/context/CheckoutContext.tsx` (mới)
- `src/hooks/useCheckout.ts` (mới)

**API Integration**:
- `POST /api/orders` (tạo đơn hàng)
- `POST /api/coupons/validate` (validate coupon code)
- `POST /api/payments/process` (xử lý thanh toán)

**Ưu tiên**: 🔴 **RẤT CAO** (Phase 1 - Ưu tiên số 1)

---

## 👨‍💼 PHẦN 2: PHÂN HỆ QUẢN TRỊ (ADMIN SIDE)

**Trạng thái**: ❌ **Chưa có gì - Cần xây dựng hoàn toàn mới**

### 2.1. UI Framework - DashStack

**Yêu cầu**:
- ❌ Tìm hiểu và tích hợp DashStack UI components
- ❌ Setup Admin Layout với sidebar navigation
- ❌ Responsive design cho admin panel

**Files cần tạo**:
- `src/pages/admin/AdminLayout.tsx` (main layout)
- `src/components/admin/AdminSidebar.tsx` (mới)
- `src/components/admin/AdminHeader.tsx` (mới)

**Ưu tiên**: 🟡 **TRUNG BÌNH** (Phase 3)

---

### 2.2. Quản lý Sản Phẩm (CRUD)

**Yêu cầu**:

#### **Product List Page**
- ❌ Hiển thị danh sách sản phẩm dạng table
- ❌ Pagination
- ❌ Search/Filter
- ❌ Nút "Add New Product"
- ❌ Nút "Edit" và "Delete" cho mỗi sản phẩm

#### **Product Form Page**
- ❌ Form thêm/sửa sản phẩm:
  - Tên sản phẩm
  - Mô tả
  - Giá
  - Giá cũ (optional)
  - Danh mục
  - Thương hiệu
  - SKU
  - Trạng thái (In Stock/Out of Stock)
  - Tags
- ❌ Upload hình ảnh:
  - Multiple images
  - Preview
  - Drag & drop
  - Upload lên server
- ❌ Quản lý thông số kỹ thuật động:
  - Key-Value pairs
  - Add/Remove specs
  - Phục vụ chức năng so sánh

**Files cần tạo**:
- `src/pages/admin/products/ProductListPage.tsx` (mới)
- `src/pages/admin/products/ProductFormPage.tsx` (mới)
- `src/pages/admin/products/ProductImageUpload.tsx` (mới)
- `src/pages/admin/products/ProductSpecsManager.tsx` (mới)
- `src/components/admin/ProductTable.tsx` (mới)
- `src/services/adminApi.ts` (mới)

**API Endpoints cần**:
- `GET /api/admin/products` (list)
- `GET /api/admin/products/:id` (detail)
- `POST /api/admin/products` (create)
- `PUT /api/admin/products/:id` (update)
- `DELETE /api/admin/products/:id` (delete)
- `POST /api/admin/products/:id/images` (upload images)

**Ưu tiên**: 🟡 **TRUNG BÌNH** (Phase 3)

---

### 2.3. Quản lý Đơn hàng

**Yêu cầu**:

#### **Order List Page**
- ❌ Hiển thị danh sách đơn hàng
- ❌ Filter theo trạng thái
- ❌ Search theo order ID, customer name
- ❌ Socket.io integration:
  - Nhận thông báo real-time khi có đơn hàng mới
  - Không cần reload trang
  - Badge hiển thị số đơn hàng mới

#### **Order Detail Page**
- ❌ Hiển thị chi tiết đơn hàng
- ❌ Chuyển đổi trạng thái đơn hàng:
  - Đang xử lý (Processing)
  - Đang vận chuyển (Shipping)
  - Hoàn thành (Completed)
  - Từ chối (Rejected)
- ❌ Xuất hóa đơn PDF:
  - Nút "Download Invoice"
  - Nút "Print Invoice"
  - Tự động sinh PDF với thông tin đơn hàng

**Files cần tạo**:
- `src/pages/admin/orders/OrderListPage.tsx` (mới)
- `src/pages/admin/orders/OrderDetailPage.tsx` (mới)
- `src/components/admin/OrderStatusBadge.tsx` (mới)
- `src/components/admin/OrderStatusChanger.tsx` (mới)
- `src/components/admin/OrderTable.tsx` (mới)
- `src/utils/generateInvoicePDF.ts` (mới)
- `src/hooks/useSocketOrders.ts` (mới - Socket.io hook)
- `src/services/adminApi.ts` (thêm order methods)

**Dependencies cần cài**:
- `socket.io-client` (Socket.io client)
- `jspdf` hoặc `react-pdf` (PDF generation)

**API Endpoints cần**:
- `GET /api/admin/orders` (list)
- `GET /api/admin/orders/:id` (detail)
- `PUT /api/admin/orders/:id/status` (update status)

**Socket Events**:
- `new-order` (server emit khi có đơn hàng mới)

**Ưu tiên**: 🟡 **TRUNG BÌNH** (Phase 3)

---

### 2.4. Cấu hình SEO

**Yêu cầu**:
- ❌ Form cấu hình SEO:
  - Title
  - Description
  - Meta tags (keywords, og:title, og:description, etc.)
  - Preview SEO

**Files cần tạo**:
- `src/pages/admin/seo/SEOSettingsPage.tsx` (mới)
- `src/components/admin/SEOPreview.tsx` (mới)

**API Endpoints cần**:
- `GET /api/admin/seo`
- `PUT /api/admin/seo`

**Ưu tiên**: 🟢 **THẤP** (Phase 3)

---

### 2.5. Tiện ích Nội bộ (Static UI)

**Yêu cầu**: Chỉ cần UI tĩnh, không cần backend

#### **Inbox Page**
- ❌ Giao diện hộp thư
- ❌ List emails/messages
- ❌ Compose message (UI only)

#### **Calendar Page**
- ❌ Giao diện lịch
- ❌ Hiển thị events (hardcode)
- ❌ Month/Week/Day view

#### **To-Do List Page**
- ❌ Danh sách công việc
- ❌ Add/Edit/Delete tasks (local state only)
- ❌ Mark as complete

**Files cần tạo**:
- `src/pages/admin/inbox/InboxPage.tsx` (mới)
- `src/pages/admin/calendar/CalendarPage.tsx` (mới)
- `src/pages/admin/todo/TodoListPage.tsx` (mới)

**Dependencies có thể cần**:
- `react-big-calendar` hoặc `fullcalendar` (cho calendar)

**Ưu tiên**: 🟢 **THẤP** (Phase 3)

---

## 🔐 PHẦN 3: BẢO MẬT VÀ XÁC THỰC

**Trạng thái**: ❌ **Chưa có JWT Authentication**

### 3.1. JWT Authentication

**File hiện tại**: `src/routes/PrivateRoute.tsx` (hardcode `isAuthenticated = true`)

**Cần xây dựng**:

1. **Auth Service**:
   - Login với JWT token
   - Lưu trữ token (localStorage/sessionStorage)
   - Refresh token mechanism
   - Logout (clear token)

2. **Auth Context**:
   - Global auth state
   - User info
   - Login/Logout functions
   - Check authentication status

3. **Protected Routes**:
   - Tích hợp JWT vào PrivateRoute
   - Redirect to login nếu chưa authenticated
   - Preserve redirect URL sau khi login

4. **API Interceptors**:
   - Tự động thêm Authorization header
   - Handle 401 (unauthorized) - redirect to login
   - Refresh token khi token hết hạn

**Files cần tạo/chỉnh sửa**:
- `src/services/auth.ts` (mới - JWT service)
- `src/services/authApi.ts` (mới - API calls)
- `src/context/AuthContext.tsx` (mới)
- `src/hooks/useAuth.ts` (mới)
- `src/routes/PrivateRoute.tsx` (tích hợp JWT)
- `src/services/api.ts` (thêm interceptors)

**API Endpoints cần**:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh` (refresh token)
- `POST /api/auth/logout`
- `GET /api/auth/me` (get current user)

**Ưu tiên**: 🔴 **RẤT CAO** (Phase 2)

---

### 3.2. Password Validation

**Yêu cầu**:
- ⚠️ Frontend chỉ cần validate password strength
- ❌ Thêm password strength indicator
- ❌ Validation rules:
  - Minimum 8 characters
  - At least 1 uppercase
  - At least 1 lowercase
  - At least 1 number
  - At least 1 special character

**Files cần tạo**:
- `src/utils/passwordValidator.ts` (mới)
- `src/components/auth/PasswordStrengthIndicator.tsx` (mới)

**Files cần chỉnh sửa**:
- `src/pages/auth/SignUpPage.tsx`
- `src/pages/auth/ForgotPasswordPage.tsx`

**Ưu tiên**: 🟡 **TRUNG BÌNH** (Phase 2)

---

## ⚡ PHẦN 4: TỐI ƯU HÓA PERFORMANCE

**Trạng thái**: ❌ **Chưa có Lazy Loading**

### 4.1. Lazy Loading

**Yêu cầu**:
- ❌ **React.lazy()** cho routes
- ❌ **Image lazy loading** (loading="lazy")
- ❌ **Code splitting** với Vite
- ❌ **Mục tiêu**: Thời gian tải trang < 2 giây

**Files cần chỉnh sửa**:
- `src/routes/AppRoutes.tsx` (lazy load routes)
- `src/features/products/components/ProductCard.tsx` (lazy load images)
- `vite.config.ts` (code splitting config)

**Ví dụ**:
```typescript
// AppRoutes.tsx
const ProductDetail = React.lazy(() => import('@/pages/store/ProductDetail'));
const CartPage = React.lazy(() => import('@/pages/checkout/CartPage'));
// ... wrap với Suspense
```

**Ưu tiên**: 🟡 **TRUNG BÌNH** (Phase 2)

---

### 4.2. Image Optimization

**Yêu cầu**:
- ❌ Responsive images (srcset)
- ❌ WebP format support
- ❌ Image compression
- ❌ Placeholder images (blur-up)

**Files cần chỉnh sửa**:
- `src/features/products/components/ProductCard.tsx`
- `src/pages/store/ProductDetail.tsx`
- Tất cả components hiển thị images

**Dependencies có thể cần**:
- `react-image` hoặc `next/image` pattern
- Image optimization service

**Ưu tiên**: 🟢 **THẤP** (Phase 2)

---

## 🔌 PHẦN 5: TÍCH HỢP API

**Trạng thái**: ❌ **Chưa có RESTful API Integration**

### 5.1. RESTful API Client

**File hiện tại**: `src/services/api.ts` (chỉ có basic functions)

**Cần mở rộng**:

1. **Axios Setup** (hoặc giữ Fetch):
   - Base URL configuration
   - Request/Response interceptors
   - Error handling
   - Timeout configuration
   - Retry logic

2. **API Services**:
   - Products API
   - Orders API
   - Auth API
   - Admin API
   - Reviews API

3. **Error Handling**:
   - Centralized error handler
   - Error types
   - User-friendly error messages
   - Toast notifications

**Files cần tạo/chỉnh sửa**:
- `src/services/api.ts` (mở rộng với interceptors)
- `src/services/productsApi.ts` (mới)
- `src/services/ordersApi.ts` (mới)
- `src/services/authApi.ts` (mới)
- `src/services/adminApi.ts` (mới)
- `src/services/reviewsApi.ts` (mới)
- `src/utils/apiErrorHandler.ts` (mới)
- `src/types/api.ts` (mới - API types)

**Dependencies cần cài**:
- `axios` (nếu chuyển từ Fetch sang Axios)

**Ưu tiên**: 🔴 **RẤT CAO** (Phase 2)

---

### 5.2. State Management

**Trạng thái**: ❌ **Chưa có State Management**

**Yêu cầu**:
- Context API hoặc Redux/Zustand cho:
  - Cart state
  - Auth state
  - Products state
  - Orders state
  - Compare state
  - Checkout state

**Files cần tạo**:
- `src/context/CartContext.tsx` (mới)
- `src/context/AuthContext.tsx` (mới - đã liệt kê ở phần Auth)
- `src/context/CompareContext.tsx` (mới - đã liệt kê ở phần Compare)
- `src/context/CheckoutContext.tsx` (mới - đã liệt kê ở phần Checkout)
- `src/store/productsStore.ts` (mới - nếu dùng Zustand)
- `src/store/ordersStore.ts` (mới - nếu dùng Zustand)

**Dependencies có thể cần**:
- `zustand` (nếu chọn Zustand)
- `@reduxjs/toolkit` + `react-redux` (nếu chọn Redux)

**Ưu tiên**: 🔴 **CAO** (Phase 2)

---

### 5.3. Replace Hardcoded Data

**File hiện tại**: `src/data/index.ts` (hardcoded data)

**Yêu cầu**:
- ❌ Thay thế tất cả hardcoded data bằng API calls
- ❌ Loading states
- ❌ Error states
- ❌ Empty states

**Files cần chỉnh sửa**:
- Tất cả pages đang import từ `@/data`
- Thay thế bằng API calls từ services

**Ưu tiên**: 🔴 **CAO** (Phase 2)

---

## 📊 TỔNG KẾT THEO ĐỘ ƯU TIÊN

### 🔴 Phase 1: Client Side Essentials (Ưu tiên cao nhất)

1. ✅ **Checkout 3 bước** (Shipping → Shipping Method → Payment)
2. ✅ **Bộ lọc sản phẩm** (thêm Battery, Screen Type)
3. ✅ **Reviews system** trên ProductDetail
4. ✅ **So sánh sản phẩm** (cho phép chọn 4 sản phẩm)

**Thời gian ước tính**: 2-3 tuần

---

### 🔴 Phase 2: API Integration & Auth (Ưu tiên cao)

1. ✅ **RESTful API client setup** (Axios/Fetch với interceptors)
2. ✅ **JWT Authentication** (login, protected routes, refresh token)
3. ✅ **State Management** (Context/Zustand cho Cart, Auth, Products)
4. ✅ **Replace hardcoded data** với API calls
5. ✅ **Lazy Loading** (routes, images)
6. ✅ **Password validation** (strength indicator)

**Thời gian ước tính**: 2-3 tuần

---

### 🟡 Phase 3: Admin Dashboard & Performance (Ưu tiên trung bình)

1. ✅ **Admin Dashboard** (toàn bộ)
   - Admin Layout với DashStack UI
   - Quản lý Sản phẩm (CRUD)
   - Quản lý Đơn hàng (với Socket.io)
   - SEO Settings
   - Inbox, Calendar, To-Do (static UI)
2. ✅ **Image Optimization** (WebP, srcset, compression)
3. ✅ **Socket.io integration** cho Admin orders

**Thời gian ước tính**: 3-4 tuần

---

## 📝 GHI CHÚ QUAN TRỌNG

1. **CSS Framework**: 
   - Hiện tại: Tailwind CSS
   - Yêu cầu: Bootstrap
   - **Cần quyết định**: Giữ Tailwind hay chuyển sang Bootstrap?

2. **Data Source**:
   - Tất cả data hiện tại đang hardcode trong `src/data/index.ts`
   - Cần chuyển sang API calls trong Phase 2

3. **Dependencies cần cài thêm**:
   - `axios` (cho API client)
   - `socket.io-client` (cho real-time orders)
   - `jspdf` hoặc `react-pdf` (cho PDF generation)
   - `zustand` hoặc `@reduxjs/toolkit` (cho state management)
   - `react-big-calendar` (cho admin calendar - optional)

4. **Environment Variables**:
   - Cần setup `.env` file với:
     - `VITE_API_URL` (backend API URL)
     - `VITE_SOCKET_URL` (Socket.io server URL)
     - `VITE_JWT_SECRET` (nếu cần - thường ở backend)

---

## ✅ CHECKLIST TỔNG QUAN

### Client Side
- [ ] Bộ lọc sản phẩm đầy đủ (Battery, Screen Type)
- [ ] So sánh sản phẩm (chọn 4 sản phẩm, API integration)
- [ ] Reviews system (form, list, pagination)
- [ ] Checkout 3 bước (Shipping → Shipping Method → Payment)

### Admin Side
- [ ] Admin Layout với DashStack UI
- [ ] Quản lý Sản phẩm (CRUD, Image Upload, Specs Manager)
- [ ] Quản lý Đơn hàng (List, Detail, Status Change, PDF Invoice)
- [ ] Socket.io integration (real-time orders)
- [ ] SEO Settings
- [ ] Inbox, Calendar, To-Do (static UI)

### Authentication & Security
- [ ] JWT Authentication (login, protected routes, refresh token)
- [ ] Password validation (strength indicator)
- [ ] API interceptors (auto add token, handle 401)

### API Integration
- [ ] RESTful API client (Axios/Fetch với interceptors)
- [ ] Products API
- [ ] Orders API
- [ ] Auth API
- [ ] Admin API
- [ ] Reviews API
- [ ] Replace hardcoded data với API calls

### Performance
- [ ] Lazy Loading (routes, images)
- [ ] Code splitting với Vite
- [ ] Image optimization (WebP, srcset)
- [ ] State Management (Context/Zustand)

---

**Ngày tạo**: 2024
**Phiên bản**: 1.0
**Dựa trên**: `FRONTEND_REQUIREMENTS.md`

