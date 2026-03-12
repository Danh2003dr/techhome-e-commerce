# 🚀 PROMPT: Thực Hiện Thay Đổi Theo Thứ Tự Ưu Tiên

**Mục đích**: Hướng dẫn chi tiết để thực hiện các thay đổi từ `REMOVAL_CHECKLIST.md` một cách an toàn, đảm bảo tính logic và không làm lỗi dự án.

**Ngày tạo**: 2024

---

## 🎯 NGUYÊN TẮC THỰC HIỆN

1. **Tìm đúng code trước khi sửa** - Phải đọc và hiểu code hiện tại
2. **Kiểm tra dependencies** - Đảm bảo không phá vỡ imports hoặc logic
3. **Thay đổi từng bước** - Một thay đổi tại một thời điểm
4. **Test sau mỗi thay đổi** - Đảm bảo không có lỗi build
5. **Giữ nguyên logic** - Chỉ thay đổi UI/structure, không thay đổi business logic

---

## 📋 PHASE 1: LOẠI BỎ UI ELEMENTS (Ưu tiên cao nhất)

### Task 1.1: Loại Bỏ Top Bar trong Header

#### Bước 1: Tìm và Đọc File
```
File: src/components/layout/Header.tsx
```

**Yêu cầu**:
1. ✅ Đọc toàn bộ file `Header.tsx` để hiểu cấu trúc
2. ✅ Xác định chính xác lines 19-37 (top bar section)
3. ✅ Kiểm tra xem có code nào phụ thuộc vào top bar không
4. ✅ Kiểm tra imports và exports

#### Bước 2: Kiểm Tra Dependencies
**Tìm kiếm trong codebase**:
- Tìm tất cả files import `Header` component
- Tìm tất cả references đến top bar elements (nếu có)
- Kiểm tra xem có CSS/styling nào phụ thuộc vào top bar không

**Command để tìm**:
```bash
# Tìm files import Header
grep -r "from.*Header" src/
grep -r "import.*Header" src/

# Tìm references đến top bar (nếu có)
grep -r "Find a Store" src/
grep -r "TechHome Plus" src/
grep -r "Free Shipping" src/
```

#### Bước 3: Di Chuyển Thông Tin (Nếu Cần)
**File**: `src/components/layout/Footer.tsx`

**Yêu cầu**:
1. ✅ Đọc file Footer hiện tại
2. ✅ Thêm section mới cho thông tin marketing (nếu cần)
3. ✅ Đảm bảo styling nhất quán với Footer hiện tại

**Thông tin cần di chuyển**:
- "Free Shipping over $35"
- "Price Match Guarantee"
- "Find a Store" (có thể giữ trong navigation)
- "TechHome Plus" (có thể giữ trong navigation)
- "Support" (có thể giữ trong navigation)

#### Bước 4: Xóa Top Bar Code
**File**: `src/components/layout/Header.tsx`

**Code cần xóa** (lines 19-37):
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

**Yêu cầu**:
1. ✅ Xóa chính xác code trên (lines 19-37)
2. ✅ Đảm bảo không xóa nhầm code khác
3. ✅ Kiểm tra syntax sau khi xóa (đảm bảo JSX hợp lệ)
4. ✅ Đảm bảo `<header>` tag vẫn còn và đúng cấu trúc

#### Bước 5: Kiểm Tra và Test
**Yêu cầu**:
1. ✅ Kiểm tra linter errors: `read_lints` cho file `Header.tsx`
2. ✅ Kiểm tra build: Đảm bảo không có TypeScript errors
3. ✅ Kiểm tra visual: Header vẫn hiển thị đúng (chỉ thiếu top bar)
4. ✅ Kiểm tra responsive: Header vẫn responsive trên mobile

**Checklist**:
- [ ] File `Header.tsx` không có lỗi syntax
- [ ] File `Header.tsx` không có lỗi TypeScript
- [ ] Header vẫn render được
- [ ] Navigation vẫn hoạt động
- [ ] Search bar vẫn hoạt động
- [ ] Icons (Account, Orders, Cart) vẫn hoạt động

---

### Task 1.2: Thay Đổi Home Page Banner Layout

#### Bước 1: Tìm và Đọc File
```
File: src/pages/store/HomePage.tsx
```

**Yêu cầu**:
1. ✅ Đọc toàn bộ file `HomePage.tsx`
2. ✅ Xác định chính xác lines 92-141 (banner section)
3. ✅ Hiểu cấu trúc data: `banners` từ `@/data`
4. ✅ Kiểm tra imports và dependencies

#### Bước 2: Kiểm Tra Data Structure
**File**: `src/data/index.ts`

**Yêu cầu**:
1. ✅ Tìm và đọc `banners` data structure
2. ✅ Hiểu format của banner data (image, title, subtitle, link, linkText)
3. ✅ Xác định banner nào sẽ dùng cho hero banner
4. ✅ Xác định banners nào sẽ dùng cho smaller banners section

**Tìm kiếm**:
```bash
# Tìm banners data
grep -r "export.*banners" src/data/
grep -r "const banners" src/data/
```

#### Bước 3: Tạo Hero Banner Component (Mới)
**Yêu cầu**:
1. ✅ Tạo 1 hero banner lớn (full width hoặc container width)
2. ✅ Sử dụng banner đầu tiên từ `banners` array (hoặc banner phù hợp nhất)
3. ✅ Giữ nguyên styling và structure tương tự banner hiện tại
4. ✅ Đảm bảo responsive (mobile-friendly)

**Code structure mới**:
```tsx
{/* Hero Banner - Full Width */}
<section className="mb-12">
  <div className="relative group rounded-xl overflow-hidden bg-slate-200 h-[500px] md:h-[600px]">
    {/* Hero banner content */}
  </div>
</section>
```

#### Bước 4: Tạo Smaller Banners Section (Mới)
**Yêu cầu**:
1. ✅ Tạo layout 3 columns theo Figma:
   - Left: 1 banner wide (PlayStation 5 style)
   - Left: 2 banners square (AirPods Max, Vision Pro style)
   - Right: 1 banner big (MacBook Air style)
2. ✅ Sử dụng banners còn lại từ `banners` array
3. ✅ Đảm bảo responsive (grid layout)

**Code structure mới**:
```tsx
{/* Smaller Banners Section */}
<section className="mb-12">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Left: Wide banner */}
    <div className="md:col-span-2">
      {/* Wide banner */}
    </div>
    {/* Right: 2 square banners */}
    <div className="grid grid-cols-1 gap-4">
      {/* Square banner 1 */}
      {/* Square banner 2 */}
    </div>
    {/* Right: Big banner */}
    <div className="md:col-span-1">
      {/* Big banner */}
    </div>
  </div>
</section>
```

**Lưu ý**: Layout có thể cần điều chỉnh để phù hợp với số lượng banners có sẵn.

#### Bước 5: Xóa Code Cũ
**File**: `src/pages/store/HomePage.tsx`

**Code cần xóa** (lines 92-141):
```tsx
<section className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px] mb-12">
  <div className="relative group rounded-xl overflow-hidden bg-slate-200">
    {/* Left Banner */}
  </div>
  <div className="relative group rounded-xl overflow-hidden bg-slate-200">
    {/* Right Banner */}
  </div>
</section>
```

**Yêu cầu**:
1. ✅ Xóa chính xác code trên
2. ✅ Thay thế bằng code mới (hero banner + smaller banners)
3. ✅ Đảm bảo không xóa nhầm code khác
4. ✅ Kiểm tra syntax sau khi thay đổi

#### Bước 6: Kiểm Tra và Test
**Yêu cầu**:
1. ✅ Kiểm tra linter errors: `read_lints` cho file `HomePage.tsx`
2. ✅ Kiểm tra build: Đảm bảo không có TypeScript errors
3. ✅ Kiểm tra visual: Home page hiển thị đúng layout mới
4. ✅ Kiểm tra responsive: Layout responsive trên mobile
5. ✅ Kiểm tra data: Banners vẫn load đúng từ `@/data`

**Checklist**:
- [ ] File `HomePage.tsx` không có lỗi syntax
- [ ] File `HomePage.tsx` không có lỗi TypeScript
- [ ] Hero banner hiển thị đúng
- [ ] Smaller banners section hiển thị đúng
- [ ] Layout responsive trên mobile
- [ ] Tất cả banners vẫn clickable và link đúng

---

## 📋 PHASE 2: THAY ĐỔI TEXT/LABELS (Ưu tiên trung bình)

### Task 2.1: Thêm Tabs cho Products Section

#### Bước 1: Tìm và Đọc File
```
File: src/pages/store/HomePage.tsx
```

**Yêu cầu**:
1. ✅ Tìm section "Trending Now" (lines 175-190)
2. ✅ Hiểu cấu trúc hiện tại
3. ✅ Kiểm tra data: `trendingProducts` từ `@/data`

#### Bước 2: Tạo Tabs Component
**Yêu cầu**:
1. ✅ Tạo tabs: "New Arrival", "Bestseller", "Featured Products"
2. ✅ State management cho active tab
3. ✅ Filter products theo tab (tạm thời dùng `trendingProducts`, sau sẽ thay bằng API)
4. ✅ Styling theo Figma design

**Code structure**:
```tsx
const [activeTab, setActiveTab] = useState<'new' | 'bestseller' | 'featured'>('new');

// Tabs
<div className="flex gap-4 mb-8">
  <button onClick={() => setActiveTab('new')}>New Arrival</button>
  <button onClick={() => setActiveTab('bestseller')}>Bestseller</button>
  <button onClick={() => setActiveTab('featured')}>Featured Products</button>
</div>

// Products grid (filter theo activeTab)
```

#### Bước 3: Thay Đổi Title
**Yêu cầu**:
1. ✅ Thay "Trending Now" → Có thể giữ hoặc thay bằng "Featured Products" (default tab)
2. ✅ Hoặc ẩn title khi có tabs

#### Bước 4: Kiểm Tra và Test
**Checklist**:
- [ ] Tabs hiển thị đúng
- [ ] Tabs có thể click và switch
- [ ] Products filter theo tab (tạm thời)
- [ ] Styling đúng theo Figma

---

### Task 2.2: Đổi Tên "Complete Your Setup" → "Related Products"

#### Bước 1: Tìm và Đọc File
```
File: src/pages/store/ProductDetail.tsx
```

**Yêu cầu**:
1. ✅ Tìm text "Complete Your Setup" trong file
2. ✅ Xác định vị trí chính xác
3. ✅ Kiểm tra xem có nhiều nơi sử dụng không

**Tìm kiếm**:
```bash
grep -r "Complete Your Setup" src/
```

#### Bước 2: Thay Đổi Text
**Yêu cầu**:
1. ✅ Thay "Complete Your Setup" → "Related Products"
2. ✅ Đảm bảo chỉ thay đúng text, không thay đổi logic
3. ✅ Kiểm tra xem có nhiều nơi cần thay không

#### Bước 3: Kiểm Tra và Test
**Checklist**:
- [ ] Text đã được thay đổi
- [ ] Không có lỗi syntax
- [ ] Product Detail page vẫn hoạt động đúng

---

## 🔍 QUY TRÌNH KIỂM TRA SAU MỖI THAY ĐỔI

### Bước 1: Kiểm Tra Syntax
```bash
# Kiểm tra linter
read_lints [file_path]

# Kiểm tra TypeScript
# (Nếu có script)
npm run type-check
```

### Bước 2: Kiểm Tra Build
```bash
# Build project
npm run build

# Hoặc dev server
npm run dev
```

### Bước 3: Kiểm Tra Visual
1. ✅ Mở browser và kiểm tra UI
2. ✅ Kiểm tra responsive (mobile, tablet, desktop)
3. ✅ Kiểm tra dark mode (nếu có)
4. ✅ Kiểm tra tất cả interactions (click, hover, etc.)

### Bước 4: Kiểm Tra Logic
1. ✅ Đảm bảo không có logic bị phá vỡ
2. ✅ Đảm bảo data vẫn load đúng
3. ✅ Đảm bảo navigation vẫn hoạt động
4. ✅ Đảm bảo không có console errors

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Không Xóa Nhầm Code
- ✅ **Luôn đọc file trước khi sửa**
- ✅ **Xác định chính xác lines cần xóa**
- ✅ **Kiểm tra context xung quanh**

### 2. Giữ Nguyên Logic
- ✅ **Chỉ thay đổi UI/structure**
- ✅ **Không thay đổi business logic**
- ✅ **Không thay đổi data structure**

### 3. Đảm Bảo Dependencies
- ✅ **Kiểm tra imports trước khi xóa**
- ✅ **Kiểm tra exports trước khi sửa**
- ✅ **Kiểm tra props/state trước khi thay đổi**

### 4. Test Sau Mỗi Thay Đổi
- ✅ **Không làm nhiều thay đổi cùng lúc**
- ✅ **Test sau mỗi thay đổi**
- ✅ **Commit sau mỗi thay đổi thành công**

---

## 📝 TEMPLATE CHO MỖI TASK

### Template Structure:
```
## Task X.X: [Tên Task]

### Bước 1: Tìm và Đọc File
- File: [path]
- Yêu cầu: [checklist]

### Bước 2: Kiểm Tra Dependencies
- Tìm kiếm: [commands]
- Yêu cầu: [checklist]

### Bước 3: Thực Hiện Thay Đổi
- Code cần xóa: [code]
- Code mới: [code]
- Yêu cầu: [checklist]

### Bước 4: Kiểm Tra và Test
- Checklist: [items]
```

---

## 🎯 THỨ TỰ THỰC HIỆN

### Phase 1: UI Elements (Ngay)
1. ✅ Task 1.1: Loại bỏ Top Bar trong Header
2. ✅ Task 1.2: Thay đổi Home Page banner layout

### Phase 2: Text/Labels (Sau Phase 1)
1. ✅ Task 2.1: Thêm tabs cho Products section
2. ✅ Task 2.2: Đổi tên "Complete Your Setup" → "Related Products"

### Phase 3: Hardcoded Data (Sau khi có API)
1. ⏳ Thay thế imports từ `@/data`
2. ⏳ Loại bỏ hoặc giữ `src/data/index.ts`

---

## ✅ CHECKLIST TỔNG QUAN

### Trước Khi Bắt Đầu
- [ ] Đã đọc `REMOVAL_CHECKLIST.md`
- [ ] Đã đọc `FIGMA_COMPARISON.md`
- [ ] Đã đọc `FRONTEND_REQUIREMENTS.md`
- [ ] Đã hiểu cấu trúc dự án

### Trong Khi Thực Hiện
- [ ] Đọc file trước khi sửa
- [ ] Kiểm tra dependencies
- [ ] Thực hiện thay đổi từng bước
- [ ] Test sau mỗi thay đổi

### Sau Khi Hoàn Thành
- [ ] Tất cả linter errors đã được fix
- [ ] Build thành công
- [ ] UI hiển thị đúng
- [ ] Logic vẫn hoạt động
- [ ] Responsive vẫn hoạt động

---

**Ngày tạo**: 2024
**Phiên bản**: 1.0
**Trạng thái**: ✅ Sẵn sàng sử dụng

