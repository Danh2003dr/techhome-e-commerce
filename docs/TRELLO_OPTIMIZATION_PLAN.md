# Kế Hoạch Tối Ưu Hóa Trello Board cho Frontend Development

## 📊 Phân Tích Hiện Trạng

### Cards Frontend Hiện Tại (Cần Chia Nhỏ):
1. **Develop Home Page** - Quá lớn, cần chia thành 5-6 sub-tasks
2. **Develop Product List Page** - Quá lớn, cần chia thành 4-5 sub-tasks  
3. **Develop Cart Page** - Quá lớn, cần chia thành 3-4 sub-tasks

### API Cards (Để tham khảo):
- Create Product API → Endpoints: GET /api/products, GET /api/products/:id
- Create Auth API → Endpoints: POST /api/auth/register, POST /api/auth/login
- Create Cart API → Endpoints: POST /api/cart, GET /api/cart, PUT /api/cart/:id, DELETE /api/cart/:id
- Create Order API → Endpoints: POST /api/orders, GET /api/orders/:userId

---

## 🎯 Kế Hoạch Hành Động

### BƯỚC 1: Tạo Các Lists Mới

#### 1. [FE] Backlog
- Chứa tất cả các tính năng Frontend cần làm
- Vị trí: Sau list "Hướng dẫn"

#### 2. [FE] In Progress  
- Card đang được code
- Vị trí: Sau [FE] Backlog

#### 3. [FE] Review
- Card đã xong, cần AI kiểm tra code
- Vị trí: Sau [FE] In Progress

#### 4. [BE] Reference
- Chứa các cards API/Database để đối chiếu
- Vị trí: Sau [FE] Review

---

### BƯỚC 2: Chia Nhỏ Card "Develop Home Page"

**Card gốc:** Develop Home Page (ID: 69b01b2fdb40d33b04e33431)

**Chia thành các sub-tasks:**

1. **UI: Header & Navigation Component**
   - Tạo Header component với logo, menu navigation
   - Responsive mobile menu
   - Search bar integration
   - User authentication status display

2. **UI: Hero Banner Component**
   - Banner slider/carousel
   - Responsive images
   - Call-to-action buttons

3. **Feature: Product Card Component**
   - Reusable ProductCard component
   - Display: image, name, price, rating
   - Add to cart button
   - Link to product detail

4. **Feature: Featured Products Section**
   - Fetch products from API
   - Display grid layout
   - Filter by featured flag
   - Lazy loading implementation

5. **State: Home Page Layout & Routing**
   - Create Home page route
   - Layout structure
   - Integrate all components
   - Error handling & loading states

---

### BƯỚC 3: Chia Nhỏ Card "Develop Product List Page"

**Card gốc:** Develop Product List Page (ID: 69b01b5c1edee1f1ab28e742)

**Chia thành các sub-tasks:**

1. **UI: Product Filter Component**
   - Filter by Brand (Thương hiệu)
   - Filter by Category (Loại sản phẩm)
   - Filter by Battery Capacity (Dung lượng pin)
   - Filter by Screen Type (Loại màn hình)
   - Clear filters button

2. **Feature: Product Grid Component**
   - Grid layout responsive
   - ProductCard component reuse
   - Empty state handling

3. **Feature: Product Search Component**
   - Search input with debounce
   - Search by product name
   - Highlight search results

4. **State: Pagination Component**
   - Page navigation
   - Items per page selector
   - Total count display
   - URL query params integration

5. **State: Product List Page Integration**
   - Connect to Product API
   - Combine filters + search + pagination
   - Loading & error states
   - Route: /products

---

### BƯỚC 4: Chia Nhỏ Card "Develop Cart Page"

**Card gốc:** Develop Cart Page (ID: 69b01c1059ebb356216f7bec)

**Chia thành các sub-tasks:**

1. **UI: Cart Item Component**
   - Display product image, name, price
   - Quantity selector (+/-)
   - Remove item button
   - Subtotal calculation

2. **State: Cart Management with Context/Redux**
   - Create CartContext hoặc Redux store
   - Actions: addItem, removeItem, updateQuantity, clearCart
   - Persist cart to localStorage
   - Sync with Cart API

3. **Feature: Cart Summary Component**
   - Calculate total price
   - Display item count
   - Shipping cost calculation
   - Proceed to checkout button

4. **State: Cart Page Integration**
   - Connect to Cart API
   - Handle empty cart state
   - Loading states
   - Route: /cart

---

### BƯỚC 5: Làm Giàu Description cho Mỗi Card

Mỗi card sẽ có description bao gồm:

```markdown
## 📦 Components Cần Tạo
- Component1
- Component2
- ...

## 🔌 API Endpoints Liên Quan
- GET /api/products
- POST /api/cart
- ...

## ✅ Checklist Chi Tiết
- [ ] Task 1
- [ ] Task 2
- ...
```

---

## 📋 Danh Sách Cards Sẽ Tạo

### Từ "Develop Home Page" → 5 cards mới:
1. UI: Header & Navigation Component
2. UI: Hero Banner Component  
3. Feature: Product Card Component
4. Feature: Featured Products Section
5. State: Home Page Layout & Routing

### Từ "Develop Product List Page" → 5 cards mới:
6. UI: Product Filter Component
7. Feature: Product Grid Component
8. Feature: Product Search Component
9. State: Pagination Component
10. State: Product List Page Integration

### Từ "Develop Cart Page" → 4 cards mới:
11. UI: Cart Item Component
12. State: Cart Management with Context/Redux
13. Feature: Cart Summary Component
14. State: Cart Page Integration

### Di chuyển API cards vào [BE] Reference:
15. Create Product API → [BE] Reference
16. Create Auth API → [BE] Reference
17. Create Cart API → [BE] Reference
18. Create Order API → [BE] Reference

---

## 🎨 Cấu Trúc Lists Sau Khi Tối Ưu

1. Backlog (giữ nguyên)
2. Sprint Backlog (giữ nguyên)
3. Sprint 2 Backlog (giữ nguyên)
4. To Do (giữ nguyên)
5. Doing (giữ nguyên)
6. Done (giữ nguyên)
7. Hướng dẫn (giữ nguyên)
8. **[FE] Backlog** ← MỚI
9. **[FE] In Progress** ← MỚI
10. **[FE] Review** ← MỚI
11. **[BE] Reference** ← MỚI

---

## ⚡ Thứ Tự Thực Hiện

1. ✅ Tạo 4 lists mới
2. ✅ Tạo 14 cards Frontend mới (với description đầy đủ)
3. ✅ Di chuyển 3 cards lớn cũ vào [BE] Reference (archive)
4. ✅ Di chuyển 4 API cards vào [BE] Reference
5. ✅ Đặt tất cả cards Frontend mới vào [FE] Backlog

---

## 📝 Lưu Ý

- Tất cả cards Frontend sẽ có label "Frontend" (màu xanh)
- Cards API sẽ có label "Backend" (màu đỏ)
- Mỗi card sẽ có description chi tiết để AI có thể code ngay
- Checklist trong description sẽ được tạo tự động

