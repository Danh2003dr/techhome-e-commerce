# Phân Tích Giao Diện Trùng Lặp và Bất Hợp Lý

## 📋 Tổng Quan

Tài liệu này phân tích các phần giao diện trùng lặp, bất hợp lý hoặc cần được tối ưu trong dự án TechHome E-commerce.

---

## 🔴 VẤN ĐỀ NGHIÊM TRỌNG - CẦN XỬ LÝ NGAY

### 1. Header Trùng Lặp Nghiêm Trọng

**Vấn đề:**
- Có component `Header` trong `src/components/layout/Header.tsx` được dùng ở các pages chính
- Nhưng **6 account pages** đều có header riêng được hardcode trực tiếp:
  - `ProfilePage.tsx` (lines 22-70)
  - `OrderHistoryPage.tsx` (lines 42-86)
  - `WarrantyPage.tsx` (lines 22-62)
  - `SavedAddressesPage.tsx` (lines 162-202)
  - `WishlistPage.tsx` (lines 50-90)
  - `OrderDetailsPage.tsx` (lines 36-76)
- `ComparePage.tsx` cũng có header riêng (lines 70-97)

**Code trùng lặp:**
- Mỗi page có ~50-60 dòng code header giống nhau
- Tổng cộng: **~350-400 dòng code trùng lặp**

**Hậu quả:**
- Khó maintain: khi cần thay đổi header, phải sửa ở 7 nơi
- Inconsistent UI: các header có thể khác nhau nhỏ về styling
- Tăng bundle size không cần thiết

**Giải pháp:**
- Tạo component `AccountHeader` hoặc mở rộng `Header` component để hỗ trợ variant cho account pages
- Refactor tất cả account pages để dùng component chung

---

### 2. Footer Trùng Lặp Nghiêm Trọng

**Vấn đề:**
- Có component `Footer` trong `src/components/layout/Footer.tsx` được dùng ở các pages chính
- Nhưng **6 account pages** đều có footer riêng được hardcode:
  - `ProfilePage.tsx` (lines 232-280)
  - `OrderHistoryPage.tsx` (lines 265-313)
  - `WarrantyPage.tsx` (lines 187-235)
  - `SavedAddressesPage.tsx` (lines 540-588)
  - `WishlistPage.tsx` (lines 191-239)
  - `OrderDetailsPage.tsx` (lines 274-322)
- `ComparePage.tsx` cũng có footer riêng (lines 216-238)

**Code trùng lặp:**
- Mỗi page có ~50-60 dòng code footer giống nhau
- Tổng cộng: **~350-400 dòng code trùng lặp**

**Khác biệt:**
- Footer trong account pages có layout 4 cột với Newsletter
- Footer component chính có layout khác (2 cột + 2 cột)
- ComparePage có footer đơn giản hơn

**Giải pháp:**
- Tạo component `AccountFooter` hoặc mở rộng `Footer` component với props để customize
- Refactor tất cả account pages để dùng component chung

---

### 3. Sidebar Navigation Trùng Lặp

**Vấn đề:**
- Tất cả 6 account pages đều có sidebar navigation giống hệt nhau
- Code sidebar được duplicate ở mỗi page:
  - `ProfilePage.tsx` (lines 74-100)
  - `OrderHistoryPage.tsx` (lines 90-116)
  - `WarrantyPage.tsx` (lines 66-90)
  - `SavedAddressesPage.tsx` (lines 206-230)
  - `WishlistPage.tsx` (lines 93-117)
  - `OrderDetailsPage.tsx` (lines 80-104)

**Code trùng lặp:**
- Mỗi page có ~30-40 dòng code sidebar giống nhau
- Tổng cộng: **~200-240 dòng code trùng lặp**

**SIDEBAR_LINKS được định nghĩa lại ở mỗi page:**
```typescript
const SIDEBAR_LINKS = [
  { label: 'My Profile', icon: 'person', path: '/profile' },
  { label: 'Order History', icon: 'reorder', path: '/dashboard' },
  { label: 'Warranty Status', icon: 'verified_user', path: '/warranty' },
  { label: 'Saved Addresses', icon: 'location_on', path: '/addresses' },
  { label: 'Wishlist', icon: 'favorite', path: '/wishlist' },
];
```

**Giải pháp:**
- Tạo component `AccountSidebar` trong `src/components/account/AccountSidebar.tsx`
- Di chuyển SIDEBAR_LINKS vào file constants hoặc data
- Refactor tất cả account pages để dùng component chung

---

### 4. Breadcrumb Navigation Trùng Lặp

**Vấn đề:**
- Nhiều pages có breadcrumb navigation với code tương tự:
  - `ProfilePage.tsx` (lines 106-112)
  - `OrderHistoryPage.tsx` (lines 121-127)
  - `WarrantyPage.tsx` (lines 95-101)
  - `SavedAddressesPage.tsx` (lines 235-241)
  - `WishlistPage.tsx` (lines 122-128)
  - `OrderDetailsPage.tsx` (lines 109-117)

**Code trùng lặp:**
- Mỗi page có ~7-10 dòng code breadcrumb giống nhau
- Tổng cộng: **~50-60 dòng code trùng lặp**

**Giải pháp:**
- Tạo component `Breadcrumb` trong `src/components/common/Breadcrumb.tsx`
- Refactor các pages để dùng component chung

---

## 🟡 VẤN ĐỀ TRUNG BÌNH - NÊN XỬ LÝ

### 5. Profile Image URL Hardcode

**Vấn đề:**
- Profile image URL được hardcode ở nhiều nơi:
  - `OrderHistoryPage.tsx` (line 6-7)
  - `WarrantyPage.tsx` (line 5-6)
  - `SavedAddressesPage.tsx` (line 17-18)
  - `WishlistPage.tsx` (line 6-7)
  - `OrderDetailsPage.tsx` (line 5-6)
  - `ProfilePage.tsx` (line 58-59, 120-121)
  - `ComparePage.tsx` (line 4-5)

**Giải pháp:**
- Di chuyển vào constants hoặc user context
- Tạo helper function `getUserProfileImage()`

---

### 6. Cart Count Logic Trùng Lặp

**Vấn đề:**
- Logic tính cart count được lặp lại ở nhiều pages:
```typescript
const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
```
- Xuất hiện ở: Header, ProfilePage, OrderHistoryPage, WarrantyPage, SavedAddressesPage, WishlistPage, OrderDetailsPage

**Giải pháp:**
- Tạo custom hook `useCartCount()` hoặc dùng context
- Hoặc tính toán trong Header component và pass xuống

---

### 7. ComparePage Không Được Sử Dụng

**Vấn đề:**
- `ComparePage.tsx` đã bị remove route nhưng file vẫn tồn tại
- File có 244 dòng code với UI hoàn chỉnh
- Có header và footer riêng, không dùng component chung

**Giải pháp:**
- **Option 1:** Xóa file nếu không cần dùng
- **Option 2:** Giữ lại nhưng refactor để dùng Header/Footer components chung
- **Option 3:** Di chuyển vào folder `archive/` hoặc `deprecated/`

---

### 8. Footer Component vs Account Footer Khác Nhau

**Vấn đề:**
- `Footer.tsx` component có layout khác với footer trong account pages
- Account footer có 4 cột với Newsletter ở cột đầu
- Footer component có layout 2+2 cột với Newsletter ở cột đầu

**Giải pháp:**
- Thống nhất design: chọn 1 layout làm chuẩn
- Hoặc tạo variant props cho Footer component

---

## 🟢 VẤN ĐỀ NHỎ - CÓ THỂ CẢI THIỆN

### 9. Search Input Trùng Lặp

**Vấn đề:**
- Search input được duplicate ở Header component và các account pages
- Styling có thể khác nhau nhỏ

**Giải pháp:**
- Đảm bảo Header component được dùng ở tất cả pages
- Hoặc tạo component `SearchInput` riêng

---

### 10. Status Badge Component

**Vấn đề:**
- `StatusBadge` được định nghĩa trong `OrderHistoryPage.tsx` (lines 9-24)
- Có thể được dùng ở các pages khác nhưng chưa được extract

**Giải pháp:**
- Tạo component `StatusBadge` trong `src/components/common/StatusBadge.tsx`
- Export và dùng ở các pages cần thiết

---

## 📊 Thống Kê Code Trùng Lặp

| Vấn đề | Số Files | Dòng Code Trùng Lặp | Mức Độ |
|--------|---------|---------------------|--------|
| Header | 7 files | ~350-400 dòng | 🔴 Nghiêm trọng |
| Footer | 7 files | ~350-400 dòng | 🔴 Nghiêm trọng |
| Sidebar | 6 files | ~200-240 dòng | 🔴 Nghiêm trọng |
| Breadcrumb | 6 files | ~50-60 dòng | 🟡 Trung bình |
| Profile Image | 7 files | ~20-30 dòng | 🟡 Trung bình |
| Cart Count | 7 files | ~10-15 dòng | 🟡 Trung bình |

**Tổng cộng: ~980-1145 dòng code trùng lặp có thể được tối ưu**

---

## ✅ Khuyến Nghị Ưu Tiên

### Priority 1 (Cao) - Làm Ngay
1. ✅ Tạo `AccountSidebar` component và refactor 6 account pages
2. ✅ Tạo `AccountHeader` component hoặc mở rộng `Header` component
3. ✅ Tạo `AccountFooter` component hoặc mở rộng `Footer` component
4. ✅ Quyết định về `ComparePage.tsx` (xóa hoặc refactor)

### Priority 2 (Trung bình) - Làm Sau
5. ✅ Tạo `Breadcrumb` component
6. ✅ Extract profile image URL vào constants/context
7. ✅ Tạo `useCartCount` hook hoặc dùng context

### Priority 3 (Thấp) - Cải Thiện
8. ✅ Tạo `StatusBadge` component
9. ✅ Thống nhất Footer design
10. ✅ Tối ưu Search Input component

---

## 🎯 Lợi Ích Sau Khi Refactor

1. **Giảm Code Duplication:** ~1000 dòng code trùng lặp → ~200-300 dòng component
2. **Dễ Maintain:** Chỉ cần sửa 1 nơi thay vì 7 nơi
3. **Consistent UI:** Đảm bảo tất cả pages có UI giống nhau
4. **Giảm Bundle Size:** Code được tối ưu và tree-shake tốt hơn
5. **Dễ Test:** Components riêng biệt dễ test hơn
6. **Better DX:** Developer experience tốt hơn khi làm việc với codebase

---

## 📝 Ghi Chú

- Tất cả các vấn đề trên đều có thể được giải quyết mà không ảnh hưởng đến functionality hiện tại
- Nên refactor từng phần một, test kỹ sau mỗi thay đổi
- Có thể tạo branch riêng cho việc refactor này

