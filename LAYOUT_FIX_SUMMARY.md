# Tóm Tắt Sửa Lỗi Layout Duplicate Header

## 🔴 Vấn Đề Đã Phát Hiện

**Header bị hiển thị 2 lần** trên trang Checkout (và có thể các trang khác):
- `CheckoutPage` tự render Header riêng
- Đồng thời được wrap trong `AppContent` component (có Header)
- → Dẫn đến duplicate header

## ✅ Giải Pháp Đã Thực Hiện

### 1. Tạo MainLayout Component
**File mới**: `src/components/layout/MainLayout.tsx`

```tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
```

**Lợi ích:**
- Tách biệt layout logic
- Sử dụng `<Outlet />` để render child routes
- Đảm bảo chỉ có 1 instance của Header/Footer

---

### 2. Refactor AppRoutes.tsx

**Trước:**
- `AppContent` component wrap một số routes với Header/Footer
- Một số routes tự render Header/Footer riêng
- → Gây duplicate

**Sau:**
- Sử dụng `MainLayout` với `<Outlet />` cho routes cần Header/Footer
- Routes không cần MainLayout (auth pages, account pages) render riêng
- Cấu trúc rõ ràng và nhất quán

**Routes với MainLayout:**
- `/` (HomePage)
- `/search` (SearchResults)
- `/product/:id` (ProductDetail)
- `/cart` (CartPage)
- `/checkout` (CheckoutPage) ✅ **Đã sửa**
- `/deals` (ProductListingPage)
- `/category/mobile` (MobileCategoryPage) ✅ **Đã sửa**
- `/category/accessories` (AccessoriesCategoryPage) ✅ **Đã sửa**
- `/category/audio` (AudioCategoryPage) ✅ **Đã sửa**

**Routes không có MainLayout:**
- `/profile` (ProfilePage) - dùng AccountHeader
- `/orders` (OrderHistoryPage) - dùng AccountHeader
- `/order/:orderId` (OrderDetailsPage) - dùng AccountHeader
- `/warranty` (WarrantyPage) - dùng AccountHeader
- `/addresses` (SavedAddressesPage) - dùng AccountHeader
- `/wishlist` (WishlistPage) - dùng AccountHeader
- `/login`, `/signup`, `/forgot-password` - auth pages không cần Header
- `/order-confirmation` - có nav riêng

---

### 3. Xóa Header/Footer Khỏi Các Pages

#### CheckoutPage.tsx ✅
**Trước:**
```tsx
<div className="min-h-screen flex flex-col">
  <Header />  // ❌ Duplicate
  <main>...</main>
  <Footer />  // ❌ Duplicate
</div>
```

**Sau:**
```tsx
<div className="container mx-auto px-4 py-12">
  {/* Chỉ render content, Header/Footer từ MainLayout */}
</div>
```

#### ProductListingPage.tsx ✅
**Trước:**
```tsx
<div className="... min-h-screen flex flex-col">
  <Header />  // ❌ Duplicate
  <main>...</main>
  <Footer />  // ❌ Duplicate
</div>
```

**Sau:**
```tsx
<div className="max-w-7xl mx-auto px-4 py-8 w-full">
  {/* Chỉ render content */}
</div>
```

#### AccessoriesCategoryPage.tsx ✅
**Trước:**
```tsx
<div className="... min-h-screen flex flex-col">
  <Header />  // ❌ Duplicate
  <main>...</main>
  <Footer />  // ❌ Duplicate
</div>
```

**Sau:**
```tsx
<div className="container mx-auto px-4 py-6">
  {/* Chỉ render content */}
</div>
```

#### AudioCategoryPage.tsx ✅
**Trước:**
```tsx
<div className="... min-h-screen flex flex-col">
  <Header />  // ❌ Duplicate
  <main>...</main>
  <Footer />  // ❌ Duplicate
</div>
```

**Sau:**
```tsx
<div className="container mx-auto px-4 py-6">
  {/* Chỉ render content */}
</div>
```

#### MobileCategoryPage.tsx ✅
**Trước:**
```tsx
<div className="... min-h-screen">
  <header>...</header>  // ❌ Hardcoded header, duplicate
  <main>...</main>
  <footer>...</footer>  // ❌ Hardcoded footer, duplicate
</div>
```

**Sau:**
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  {/* Chỉ render content */}
</div>
```

---

## 📊 Thống Kê

### Files Đã Tạo
1. ✅ `src/components/layout/MainLayout.tsx` - Layout component mới

### Files Đã Sửa
1. ✅ `src/routes/AppRoutes.tsx` - Refactor để dùng MainLayout
2. ✅ `src/pages/checkout/CheckoutPage.tsx` - Xóa Header/Footer
3. ✅ `src/pages/store/ProductListingPage.tsx` - Xóa Header/Footer
4. ✅ `src/pages/store/AccessoriesCategoryPage.tsx` - Xóa Header/Footer
5. ✅ `src/pages/store/AudioCategoryPage.tsx` - Xóa Header/Footer
6. ✅ `src/pages/store/MobileCategoryPage.tsx` - Xóa Header/Footer

### Code Đã Xóa
- **~150 dòng code** Header/Footer duplicate
- **~70 dòng code** hardcoded header/footer từ MobileCategoryPage

---

## ✅ Kết Quả

### Trước Khi Sửa
- ❌ Header hiển thị 2 lần trên `/checkout`
- ❌ Header hiển thị 2 lần trên `/category/*` pages
- ❌ Logic routing phức tạp và khó maintain
- ❌ Code trùng lặp nhiều

### Sau Khi Sửa
- ✅ Header chỉ hiển thị 1 lần trên tất cả pages
- ✅ Layout structure rõ ràng và nhất quán
- ✅ Dễ maintain (chỉ cần sửa MainLayout)
- ✅ Code sạch hơn, không còn duplicate

---

## 🎯 Cấu Trúc Routing Mới

```
AppRoutes
├── MainLayout (Header + Footer)
│   ├── / → HomePage
│   ├── /search → SearchResults
│   ├── /product/:id → ProductDetail
│   ├── /cart → CartPage
│   ├── /checkout → CheckoutPage ✅
│   ├── /deals → ProductListingPage
│   ├── /category/mobile → MobileCategoryPage ✅
│   ├── /category/accessories → AccessoriesCategoryPage ✅
│   └── /category/audio → AudioCategoryPage ✅
│
└── Routes không có MainLayout
    ├── /profile → ProfilePage (AccountHeader)
    ├── /orders → OrderHistoryPage (AccountHeader)
    ├── /order/:orderId → OrderDetailsPage (AccountHeader)
    ├── /warranty → WarrantyPage (AccountHeader)
    ├── /addresses → SavedAddressesPage (AccountHeader)
    ├── /wishlist → WishlistPage (AccountHeader)
    ├── /login → LoginPage (no header)
    ├── /signup → SignUpPage (no header)
    ├── /forgot-password → ForgotPasswordPage (no header)
    └── /order-confirmation → OrderConfirmationPage (custom nav)
```

---

## 🔍 Kiểm Tra

### Checklist
- [x] MainLayout component đã được tạo
- [x] AppRoutes đã được refactor
- [x] CheckoutPage đã xóa Header/Footer
- [x] ProductListingPage đã xóa Header/Footer
- [x] AccessoriesCategoryPage đã xóa Header/Footer
- [x] AudioCategoryPage đã xóa Header/Footer
- [x] MobileCategoryPage đã xóa Header/Footer
- [x] ProfilePage không nằm trong MainLayout (dùng AccountHeader)
- [x] Không có linter errors
- [x] Routes hoạt động đúng

---

## 📝 Lưu Ý

### Pages Dùng AccountHeader (Không Nằm Trong MainLayout)
- `ProfilePage` - `/profile`
- `OrderHistoryPage` - `/orders`
- `OrderDetailsPage` - `/order/:orderId`
- `WarrantyPage` - `/warranty`
- `SavedAddressesPage` - `/addresses`
- `WishlistPage` - `/wishlist`

Các pages này có layout riêng với `AccountHeader` và `AccountFooter`, nên không nằm trong `MainLayout`.

### Pages Không Có Header (Auth Pages)
- `LoginPage` - `/login`
- `SignUpPage` - `/signup`
- `ForgotPasswordPage` - `/forgot-password`

Các pages này có design riêng, không cần Header/Footer chung.

---

**Tổng kết:** Đã sửa thành công lỗi duplicate header. Tất cả routes giờ đây có cấu trúc layout rõ ràng và nhất quán! 🎉

