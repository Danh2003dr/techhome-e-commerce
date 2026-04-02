# ❌ Danh Sách Loại Bỏ - TechHome E-Commerce

**Mục đích**: Liệt kê cụ thể những gì cần **LOẠI BỎ** từ dự án hiện tại để phù hợp với:
- ✅ `FRONTEND_REQUIREMENTS.md`
- ✅ `FIGMA_COMPARISON.md`

**Ngày tạo**: 2024

---

## 🎯 NGUYÊN TẮC LOẠI BỎ

1. **Không có trong Figma Design** → Loại bỏ hoặc di chuyển
2. **Không phù hợp Requirements** → Loại bỏ hoặc thay thế
3. **Hardcoded data** → Loại bỏ sau khi có API (giữ tạm để dev)
4. **Code không sử dụng** → Loại bỏ để clean code

---

## ❌ PHẦN 1: UI ELEMENTS - LOẠI BỎ HOÀN TOÀN

### 1.1. Top Bar trong Header

**File**: `src/components/layout/Header.tsx`

**Lines cần xóa**: `19-37`

**Code cần loại bỏ**:
```tsx
<div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2">
  <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
    <div className="flex gap-6">
      <a href="#" className="hover:text-primary transition-colors">Find a Store</a>
      <a href="#" className="hover:text-primary transition-colors">TechHome Plus</a>
      <a href="#" className="hover:text-primary transition-colors">Support</a>
    </div>
    <div className="flex gap-6">
      <span className="flex items-center gap-1">
        <span className="material-icons text-sm">local_shipping</span>
        Free Shipping over $35
      </span>
      <span className="flex items-center gap-1">
        <span className="material-icons text-sm">verified</span>
        Price Match Guarantee
      </span>
    </div>
  </div>
</div>
```

**Lý do loại bỏ**:
- ❌ **Không có trong Figma Design** - Figma chỉ có header đơn giản
- ❌ **Không phù hợp Requirements** - Requirements không yêu cầu top bar này
- ✅ **UX tốt hơn** - Header sạch sẽ, tập trung vào navigation
- ✅ **Mobile-friendly** - Tiết kiệm không gian trên mobile

**Action**: 
- ✅ **Xóa code** (lines 19-37)
- ✅ **Di chuyển thông tin** vào Footer (nếu cần thiết)

**Impact**: 
- ✅ **Tích cực**: UI giống Figma, sạch sẽ hơn
- ⚠️ **Cần xử lý**: Thông tin "Free Shipping", "Price Match" có thể đưa vào Footer

---

## ⚠️ PHẦN 2: CODE CẦN THAY ĐỔI (KHÔNG PHẢI LOẠI BỎ HOÀN TOÀN)

### 2.1. "Trending Now" Section Title

**File**: `src/pages/store/HomePage.tsx`

**Lines**: `175-190`

**Code hiện tại**:
```tsx
<h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Trending Now</h3>
```

**Lý do thay đổi**:
- ⚠️ **Figma có tabs** - "New Arrival", "Bestseller", "Featured Products"
- ⚠️ **Requirements không yêu cầu** - Nhưng Figma design có tabs

**Action**: 
- ⚠️ **Thay đổi**: Thêm tabs "New Arrival", "Bestseller", "Featured Products"
- ✅ **Giữ**: Section này (chỉ thay đổi title và thêm tabs)

---

### 2.2. "Complete Your Setup" Section

**File**: `src/pages/store/ProductDetail.tsx`

**Lý do thay đổi**:
- ⚠️ **Figma có "Related Products"** - Tên khác
- ✅ **Giữ chức năng** - Chỉ đổi tên

**Action**: 
- ⚠️ **Đổi tên**: "Complete Your Setup" → "Related Products"
- ✅ **Giữ**: Chức năng hiển thị related products

---

## 🔄 PHẦN 3: HARDCODED DATA - LOẠI BỎ SAU KHI CÓ API

### 3.1. Import từ `@/data` - Tất cả files

**Files cần thay đổi** (18 files):
```
src/routes/AppRoutes.tsx
src/pages/store/SmartHomeCategoryPage.tsx
src/pages/store/ProductListingPage.tsx
src/pages/store/ProductDetail.tsx
src/pages/store/SearchResults.tsx
src/pages/store/MobileCategoryPage.tsx
src/pages/store/HomePage.tsx
src/pages/store/CoolingCategoryPage.tsx
src/pages/store/AudioCategoryPage.tsx
src/pages/store/AccessoriesCategoryPage.tsx
src/pages/checkout/CartPage.tsx
src/pages/checkout/OrderConfirmationPage.tsx
src/pages/account/WishlistPage.tsx
src/pages/account/SavedAddressesPage.tsx
src/pages/account/WarrantyPage.tsx
src/pages/account/OrderDetailsPage.tsx
src/pages/account/OrderHistoryPage.tsx
src/pages/account/ProfilePage.tsx
src/components/layout/Sidebar.tsx
src/components/layout/Header.tsx
```

**Code cần thay đổi**:
```tsx
// ❌ LOẠI BỎ (sau khi có API)
import { cartItems } from '@/data';
import { categories, trendingProducts } from '@/data';
import { listingProducts } from '@/data';
// ... tất cả imports từ @/data

// ✅ THAY THẾ BẰNG
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { productsApi } from '@/services/productsApi';
```

**Lý do loại bỏ**:
- ❌ **Requirements yêu cầu API Integration** - "Replace hardcoded data với API calls"
- ❌ **Không phù hợp production** - Hardcoded data không scale được
- ✅ **Cần API calls** - Tất cả data phải từ backend

**Action**: 
- ⚠️ **Giữ tạm** - Để development tiếp tục
- ✅ **Loại bỏ sau** - Khi đã có API integration (Phase 2)

**Timeline**: 
- **Phase 1**: Giữ tạm để dev
- **Phase 2**: Thay thế bằng API calls

---

### 3.2. File `src/data/index.ts`

**File**: `src/data/index.ts`

**Lý do loại bỏ**:
- ❌ **Hardcoded data** - Tất cả data trong file này là mock data
- ❌ **Requirements yêu cầu API** - "Replace hardcoded data với API calls"

**Action**: 
- ⚠️ **Giữ tạm** - Để development và testing
- ✅ **Loại bỏ sau** - Khi đã có API integration hoàn chỉnh
- ✅ **Có thể giữ** - Nếu cần mock data cho testing

**Timeline**: 
- **Phase 1**: Giữ để dev
- **Phase 2**: Thay thế bằng API
- **Optional**: Giữ lại cho testing nếu cần

---

## 🗑️ PHẦN 4: CODE KHÔNG SỬ DỤNG (CẦN KIỂM TRA)

### 4.1. Unused Imports

**Cần kiểm tra**: Tất cả files có imports không sử dụng

**Action**: 
- ✅ **Sử dụng linter** - ESLint sẽ tự động phát hiện
- ✅ **Clean up** - Xóa unused imports

---

### 4.2. Unused Components

**Cần kiểm tra**: Components không được sử dụng ở đâu

**Action**: 
- ✅ **Search codebase** - Tìm components không được import
- ✅ **Xóa nếu không cần** - Hoặc giữ lại nếu sẽ dùng sau

---

## 📋 CHECKLIST LOẠI BỎ

### ✅ Phase 1: UI Elements (Ưu tiên cao - Làm ngay)

- [ ] **Loại bỏ Top Bar** trong Header (`src/components/layout/Header.tsx` lines 19-37)
  - [ ] Xóa code top bar
  - [ ] Di chuyển thông tin vào Footer (nếu cần)
  - [ ] Test header sau khi xóa

### ⚠️ Phase 2: Thay Đổi (Ưu tiên trung bình)

- [ ] **Thay đổi "Trending Now"** → Tabs ("New Arrival", "Bestseller", "Featured")
  - [ ] Thêm tabs component
  - [ ] Thay đổi title
  - [ ] Test tabs functionality

- [ ] **Đổi tên "Complete Your Setup"** → "Related Products"
  - [ ] Tìm và thay đổi text
  - [ ] Test Product Detail page

### 🔄 Phase 3: Hardcoded Data (Sau khi có API)

- [ ] **Thay thế imports từ `@/data`** (18 files)
  - [ ] Tạo API services
  - [ ] Tạo Context/Hooks
  - [ ] Thay thế từng file một
  - [ ] Test từng file sau khi thay

- [ ] **Loại bỏ hoặc giữ `src/data/index.ts`**
  - [ ] Quyết định: Giữ cho testing hay xóa hoàn toàn
  - [ ] Nếu giữ: Đánh dấu là mock data
  - [ ] Nếu xóa: Đảm bảo không còn references

### 🧹 Phase 4: Clean Up (Ưu tiên thấp)

- [ ] **Xóa unused imports**
  - [ ] Chạy ESLint
  - [ ] Fix warnings

- [ ] **Xóa unused components**
  - [ ] Search codebase
  - [ ] Xóa hoặc giữ lại

---

## 🎯 TÓM TẮT: NHỮNG GÌ CẦN LOẠI BỎ

### ❌ LOẠI BỎ HOÀN TOÀN (Ngay lập tức)

1. **Top Bar trong Header** - Lines 19-37 trong `Header.tsx`
   - Lý do: Không có trong Figma, không phù hợp Requirements
   - Impact: UI sạch hơn, giống Figma

### ⚠️ THAY ĐỔI (Không phải loại bỏ hoàn toàn)

1. **"Trending Now"** → Thêm tabs ("New Arrival", "Bestseller", "Featured")
2. **"Complete Your Setup"** → "Related Products"

### 🔄 LOẠI BỎ SAU (Khi có API)

1. **Tất cả imports từ `@/data`** - 18 files
2. **File `src/data/index.ts`** - Hoặc giữ lại cho testing

### 🧹 CLEAN UP

1. **Unused imports**
2. **Unused components**

---

## 📝 GHI CHÚ QUAN TRỌNG

### 1. Top Bar - Thông tin Marketing

**Quyết định**: Loại bỏ Top Bar, nhưng thông tin có thể đưa vào:
- ✅ **Footer** - "Free Shipping over $35", "Price Match Guarantee"
- ✅ **Khối intro / thông báo** trên trang chủ hoặc sticky — tùy thiết kế
- ✅ **Sticky notification** - Optional, nếu cần highlight

**Không mất thông tin**, chỉ di chuyển vị trí.

---

### 2. Hardcoded Data

**Quyết định**: 
- ⚠️ **Giữ tạm** - Để development tiếp tục
- ✅ **Loại bỏ sau** - Khi đã có API (Phase 2)
- ✅ **Có thể giữ** - Nếu cần mock data cho testing

**Không loại bỏ ngay**, chỉ loại bỏ sau khi có API.

---

### 3. Layout Changes

**Quyết định**: 
- ❌ **Loại bỏ** layout cũ
- ✅ **Thay thế** bằng layout mới (theo Figma)

**Không phải loại bỏ hoàn toàn**, mà thay thế bằng cái tốt hơn.

---

## 🚀 KHUYẾN NGHỊ THỰC HIỆN

### Bước 1: Loại Bỏ UI Elements (Ngay)

1. ✅ Loại bỏ Top Bar trong Header

### Bước 2: Thay Đổi Text/Labels (Sau Bước 1)

1. ✅ Thêm tabs cho Products section
2. ✅ Đổi tên "Complete Your Setup" → "Related Products"

### Bước 3: API Integration (Phase 2)

1. ✅ Tạo API services
2. ✅ Thay thế hardcoded data
3. ✅ Loại bỏ hoặc giữ `src/data/index.ts`

### Bước 4: Clean Up (Cuối cùng)

1. ✅ Xóa unused imports
2. ✅ Xóa unused components

---

## ✅ KẾT LUẬN

### Những gì CẦN LOẠI BỎ NGAY:

1. ❌ **Top Bar** trong Header (lines 19-37)

### Những gì CẦN THAY ĐỔI:

1. ⚠️ **"Trending Now"** → Tabs
2. ⚠️ **"Complete Your Setup"** → "Related Products"

### Những gì LOẠI BỎ SAU:

1. 🔄 **Hardcoded data** (sau khi có API)
2. 🔄 **File `src/data/index.ts`** (hoặc giữ cho testing)

---

**Ngày tạo**: 2024
**Phiên bản**: 1.0
**Trạng thái**: ✅ Sẵn sàng thực hiện

