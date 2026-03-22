# 📊 So Sánh Design Figma vs Dự Án Hiện Tại

**Figma File**: [E-Store - Mobile/web - Community](https://www.figma.com/design/OE9qIgYV31JUo50brjBxXI/E-Store---Mobile-web--Community-?node-id=0-1&t=9gm0oUU0gdPCxkmd-0)

**Ngày phân tích**: 2024

---

## 🎯 TỔNG QUAN

Design Figma có **7 pages chính**:
1. **Home** - Trang chủ
2. **Products Page** - Danh sách sản phẩm với filters
3. **Product Details Page** - Chi tiết sản phẩm
4. **Shopping Cart** - Giỏ hàng
5. **Checkout Step 1** - Địa chỉ giao hàng
6. **Checkout Step 2** - Phương thức vận chuyển
7. **Checkout Step 3** - Thanh toán

---

## 📄 PHÂN TÍCH TỪNG PAGE

### 1. 🏠 HOME PAGE

#### ✅ Đã có trong dự án
- Header với logo, search, navigation, icons (Favorites, Cart, User)
- Hero banner section
- Category section ("Browse By Category")
- Products grid
- Footer

#### ❌ Thiếu / Cần cải thiện

**1.1. Header Structure**
- **Figma**: Header đơn giản hơn, không có top bar với "Find a Store", "TechHome Plus"
- **Hiện tại**: Có top bar với nhiều links
- **Cần**: Đơn giản hóa header theo Figma (chỉ giữ logo, search, nav, icons)

**1.2. Hero Banner**
- **Figma**: Banner lớn với iPhone 14 Pro, text "Pro.Beyond." và "IPhone 14 Pro"
- **Hiện tại**: Có 2 banners side-by-side
- **Cần**: Thay đổi thành 1 banner lớn như Figma

**1.3. Smaller Banners Section**
- **Figma**: Có section "Smaller Banners" với:
  - Left: PlayStation 5 (wide), AirPods Max, Vision Pro (squares)
  - Right: MacBook Air (big banner)
- **Hiện tại**: Có 2 banners nhưng layout khác
- **Cần**: Tạo lại layout theo Figma (3 columns: wide + 2 squares, 1 big banner)

**1.4. Category Section**
- **Figma**: 6 categories với icons tròn: Phones, Smart Watches, Cameras, Headphones, Computers, Gaming
- **Hiện tại**: Có categories nhưng có thể khác
- **Cần**: Đảm bảo có đủ 6 categories với icons tròn

**1.5. Products Section**
- **Figma**: Có tabs "New Arrival", "Bestseller", "Featured Products"
- **Hiện tại**: Chỉ có "Trending Now"
- **Cần**: Thêm tabs để filter products

**1.6. Discount Products Section**
- **Figma**: Có section "Discounts up to -50%"
- **Hiện tại**: Chưa có
- **Cần**: Thêm section này

**1.7. Banner 2 Section**
- **Figma**: Có "Big Summer Sale" banner
- **Hiện tại**: Có "TechHome Plus Members" section nhưng khác
- **Cần**: Thêm hoặc cập nhật banner section

**Files cần chỉnh sửa**:
- `src/pages/store/HomePage.tsx`
- `src/components/layout/Header.tsx` (đơn giản hóa)

---

### 2. 📦 PRODUCTS PAGE (Product Listing)

#### ✅ Đã có trong dự án
- Header
- Sidebar filters
- Products grid
- Pagination
- Footer

#### ❌ Thiếu / Cần cải thiện

**2.1. Breadcrumbs**
- **Figma**: Có breadcrumbs "Home > Catalog > Smartphones"
- **Hiện tại**: Chưa có breadcrumbs
- **Cần**: Thêm breadcrumbs component

**2.2. Filters Sidebar - Đầy đủ hơn**
- **Figma** có các filters:
  - ✅ Brand (đã có)
  - ❌ **Battery capacity** (chưa có - đã liệt kê trong TODO)
  - ❌ **Screen type** (chưa có - đã liệt kê trong TODO)
  - ❌ **Screen diagonal** (chưa có)
  - ❌ **Protection class** (chưa có)
  - ❌ **Built-in memory** (chưa có)
- **Hiện tại**: Chỉ có Brand, Price Range, Processor, Connectivity, Power Rating
- **Cần**: Thêm tất cả filters từ Figma

**2.3. Filter UI**
- **Figma**: Mỗi filter có:
  - Title với expand/collapse icon
  - Search field (cho Brand)
  - Checkbox list
- **Hiện tại**: Có expand/collapse nhưng chưa có search field cho Brand
- **Cần**: Thêm search field trong Brand filter

**2.4. Top Part**
- **Figma**: Có "Selected Products: 85" và Dropdown sort
- **Hiện tại**: Có sort dropdown nhưng chưa có "Selected Products" count
- **Cần**: Thêm product count display

**2.5. Products Grid**
- **Figma**: 3 columns, mỗi product card có:
  - Image
  - Product name
  - Price
  - Rating stars
  - "Add to Cart" button
- **Hiện tại**: Có tương tự nhưng có thể khác về styling
- **Cần**: Đảm bảo styling giống Figma

**Files cần chỉnh sửa**:
- `src/pages/store/ProductListingPage.tsx`
- `src/components/store/Breadcrumbs.tsx` (mới)
- `src/components/store/ProductFilters.tsx` (mở rộng)

---

### 3. 🔍 PRODUCT DETAILS PAGE

#### ✅ Đã có trong dự án
- Header
- Product images gallery
- Product info (name, price, rating)
- Color selection
- Storage options
- Add to Cart button
- Specifications table
- Reviews section
- Related products
- Footer

#### ❌ Thiếu / Cần cải thiện

**3.1. Breadcrumbs**
- **Figma**: "Home > Catalog > Smartphones > Apple > iPhone 14 Pro Max"
- **Hiện tại**: Có breadcrumbs nhưng có thể khác
- **Cần**: Đảm bảo breadcrumbs đầy đủ như Figma

**3.2. Product Images**
- **Figma**: 
  - Left: Thumbnail images (vertical)
  - Right: Main image lớn
- **Hiện tại**: Có tương tự
- **Cần**: Kiểm tra layout và sizing

**3.3. Product Info Section**
- **Figma** có:
  - Title: "Apple iPhone 14 Pro Max"
  - Price: "$1399" với old price "$1499" (strikethrough)
  - Color selection với circles
  - Storage tabs: 128GB, 256GB, 512GB, 1TB
  - Details grid: Screen size, CPU, Number of Cores, Main camera, Front-camera, Battery capacity
  - Description text
  - Buttons: "Add to Wishlist", "Add to Card"
  - Icons: Free Delivery, In Stock, Guaranteed
- **Hiện tại**: Có tương tự nhưng có thể khác về layout
- **Cần**: Đảm bảo layout giống Figma

**3.4. Details Section**
- **Figma**: Có section "Details" với:
  - Screen section (diagonal, resolution, refresh rate, pixel density, screen type, additionally)
  - CPU section (CPU, Number of cores)
  - "View More" button
- **Hiện tại**: Có specifications table nhưng có thể khác format
- **Cần**: Format lại theo Figma (grouped by category)

**3.5. Reviews Section**
- **Figma** có:
  - Title "Reviews"
  - Overall Rating với:
    - Rating số (4.8)
    - Star distribution bars (Excellent, Good, Average, Below Average, Poor)
  - Search field để filter reviews
  - List reviews với:
    - User avatar
    - Name + date
    - Star rating
    - Review text
    - Review images (optional)
  - "View More" button
- **Hiện tại**: Có reviews nhưng có thể thiếu:
  - Star distribution bars
  - Search field
  - Review images
- **Cần**: Bổ sung đầy đủ theo Figma

**3.6. Related Products**
- **Figma**: Section "Related Products" với 4 products
- **Hiện tại**: Có "Complete Your Setup" section
- **Cần**: Đổi tên và đảm bảo có 4 products

**Files cần chỉnh sửa**:
- `src/pages/store/ProductDetail.tsx`
- `src/components/store/ProductReviews.tsx` (mở rộng)
- `src/components/store/StarDistribution.tsx` (mới)

---

### 4. 🛒 SHOPPING CART PAGE

#### ✅ Đã có trong dự án
- Header
- Cart items list
- Order summary
- Footer

#### ❌ Thiếu / Cần cải thiện

**4.1. Layout**
- **Figma**: 
  - Left: "Shopping Cart" title + Products list
  - Right: "Order Summary" với:
    - Coupon code field
    - Shipping address field
    - Prices (Subtotal, Estimated Tax, Estimated shipping & Handling, Total)
    - "Proceed to Checkout" button
- **Hiện tại**: Có tương tự nhưng có thể khác về styling
- **Cần**: Đảm bảo layout và styling giống Figma

**4.2. Cart Product Card**
- **Figma**: Mỗi product có:
  - Image
  - Product name
  - Price
  - Quantity selector
  - Remove button
- **Hiện tại**: Có tương tự
- **Cần**: Kiểm tra styling

**4.3. Order Summary**
- **Figma**: Có coupon code field và shipping address field
- **Hiện tại**: Chưa có coupon code field
- **Cần**: Thêm coupon code input

**Files cần chỉnh sửa**:
- `src/pages/checkout/CartPage.tsx`
- `src/components/checkout/CouponInput.tsx` (mới)

---

### 5. ✅ CHECKOUT STEP 1: SHIPPING ADDRESS

#### ❌ Chưa có trong dự án

**5.1. Header**
- **Figma**: Header giống các pages khác

**5.2. Steps Indicator**
- **Figma**: Có "Steps" section với:
  - Step 1: Address (icon Location) - Active
  - Step 2: Shipping (icon Shipping)
  - Step 3: Payment (icon Payment)
- **Cần**: Tạo Steps component

**5.3. Content**
- **Figma**: 
  - Title: "Shipping Method"
  - Radio group với saved addresses:
    - Address card với:
      - Radio button
      - Address name (e.g., "2118 Thornridge")
      - Tag (Home/Office)
      - Full address text
      - Contact phone
      - Edit + Delete icons
    - "Add New Line" button
  - Buttons: "Back", "Continue"
- **Cần**: Tạo hoàn toàn mới

**Files cần tạo**:
- `src/pages/checkout/CheckoutPage.tsx` (main container)
- `src/components/checkout/CheckoutStepper.tsx` (steps indicator)
- `src/components/checkout/CheckoutStep1.tsx` (shipping address)
- `src/components/checkout/AddressCard.tsx` (address card component)

---

### 6. ✅ CHECKOUT STEP 2: SHIPPING METHOD

#### ❌ Chưa có trong dự án

**6.1. Steps Indicator**
- **Figma**: Step 2 (Shipping) active

**6.2. Content**
- **Figma**:
  - Title: "Shipping Method"
  - Radio group với shipping methods:
    - Method card với:
      - Radio button
      - Method name (e.g., "Free")
      - Price (e.g., "$29")
      - Expires date (optional)
  - Buttons: "Back", "Continue"
- **Cần**: Tạo hoàn toàn mới

**Files cần tạo**:
- `src/components/checkout/CheckoutStep2.tsx` (shipping method)
- `src/components/checkout/ShippingMethodCard.tsx` (method card component)

---

### 7. ✅ CHECKOUT STEP 3: PAYMENT

#### ❌ Chưa có trong dự án

**7.1. Steps Indicator**
- **Figma**: Step 3 (Payment) active

**7.2. Layout**
- **Figma**: 2 columns
  - Left: "Summary" với:
    - Selected Products list
    - Shipment Info (Address, Shipment method)
    - Price Info (Subtotal, Estimated Tax, Estimated shipping & Handling, Total)
  - Right: "Payment Details" với:
    - Title: "Payment"
    - Tabs: "Credit Card" (selected), "PayPal", "PayPal Credit"
    - Credit card image preview
    - Form fields:
      - Card number
      - Card holder name
      - Expiration date + CVV (2 fields side by side)
    - Checkbox field (terms & conditions)
    - Buttons: "Back", "Place Order"

**7.3. Payment Form**
- **Figma**: 
  - Credit card visual preview
  - Form fields với styling đẹp
  - Validation
- **Cần**: Tạo hoàn toàn mới

**Files cần tạo**:
- `src/components/checkout/CheckoutStep3.tsx` (payment)
- `src/components/checkout/CreditCardForm.tsx` (credit card form)
- `src/components/checkout/CreditCardPreview.tsx` (card preview)
- `src/components/checkout/PaymentTabs.tsx` (payment method tabs)
- `src/components/checkout/CheckoutSummary.tsx` (order summary sidebar)

---

## 🎨 DESIGN SYSTEM & STYLING

### Colors
- **Figma**: Chủ yếu white background, black text, purple/blue accents
- **Hiện tại**: Dùng Tailwind với primary color #007bff (blue)
- **Cần**: Kiểm tra và điều chỉnh colors theo Figma

### Typography
- **Figma**: Font clean, modern
- **Hiện tại**: Dùng Inter font
- **Cần**: Đảm bảo font sizes và weights giống Figma

### Spacing & Layout
- **Figma**: 
  - Container width: 1120px (content), 1440px (full width)
  - Padding: 160px left/right cho main content
- **Hiện tại**: Dùng container mx-auto
- **Cần**: Đảm bảo spacing giống Figma

### Components
- **Figma**: Có các components:
  - Buttons (primary, secondary)
  - Input fields
  - Radio buttons
  - Checkboxes
  - Product cards
  - Icons (Material Icons)
- **Hiện tại**: Có tương tự
- **Cần**: Đảm bảo styling giống Figma

---

## 📋 CHECKLIST CẦN LÀM

### Phase 1: Cải thiện Pages hiện có

#### Home Page
- [ ] Đơn giản hóa Header (bỏ top bar)
- [ ] Thay đổi Hero banner thành 1 banner lớn
- [ ] Tạo lại Smaller Banners section (3 columns layout)
- [ ] Thêm tabs cho Products section (New Arrival, Bestseller, Featured)
- [ ] Thêm "Discounts up to -50%" section
- [ ] Thêm "Big Summer Sale" banner

#### Products Page
- [ ] Thêm Breadcrumbs component
- [ ] Thêm filters: Battery capacity, Screen type, Screen diagonal, Protection class, Built-in memory
- [ ] Thêm search field trong Brand filter
- [ ] Thêm "Selected Products" count
- [ ] Điều chỉnh Product card styling

#### Product Details Page
- [ ] Cải thiện Breadcrumbs (đầy đủ hơn)
- [ ] Thêm Details section với grouped specs (Screen, CPU)
- [ ] Cải thiện Reviews section:
  - [ ] Thêm Star distribution bars
  - [ ] Thêm search field
  - [ ] Thêm review images support
- [ ] Đổi "Complete Your Setup" thành "Related Products"

#### Cart Page
- [ ] Thêm Coupon code input
- [ ] Điều chỉnh styling theo Figma

### Phase 2: Tạo Checkout 3 bước (MỚI HOÀN TOÀN)

#### Checkout Infrastructure
- [ ] Tạo `CheckoutPage.tsx` (main container với multi-step)
- [ ] Tạo `CheckoutStepper.tsx` (steps indicator)
- [ ] Tạo `CheckoutContext.tsx` (state management)

#### Step 1: Shipping Address
- [ ] Tạo `CheckoutStep1.tsx`
- [ ] Tạo `AddressCard.tsx` component
- [ ] Tích hợp với saved addresses từ `/addresses`

#### Step 2: Shipping Method
- [ ] Tạo `CheckoutStep2.tsx`
- [ ] Tạo `ShippingMethodCard.tsx` component
- [ ] Hiển thị shipping options: Free, Standard, Express

#### Step 3: Payment
- [ ] Tạo `CheckoutStep3.tsx`
- [ ] Tạo `CreditCardForm.tsx`
- [ ] Tạo `CreditCardPreview.tsx`
- [ ] Tạo `PaymentTabs.tsx` (Credit Card, PayPal, PayPal Credit)
- [ ] Tạo `CheckoutSummary.tsx` (order summary sidebar)
- [ ] Validation cho credit card form

### Phase 3: Design System

- [ ] Extract colors từ Figma
- [ ] Điều chỉnh typography
- [ ] Điều chỉnh spacing/layout
- [ ] Tạo component library theo Figma

---

## 🚀 ƯU TIÊN THỰC HIỆN

### 🔴 Ưu tiên cao (Phase 1)
1. **Checkout 3 bước** - Chưa có, cần làm ngay
2. **Bổ sung filters** - Battery, Screen type, etc.
3. **Cải thiện Reviews** - Star distribution, search, images

### 🟡 Ưu tiên trung bình (Phase 2)
1. **Cải thiện Home Page** - Layout banners, tabs
2. **Breadcrumbs** - Thêm vào tất cả pages
3. **Design System** - Colors, typography, spacing

### 🟢 Ưu tiên thấp (Phase 3)
1. **Styling refinements** - Điều chỉnh chi tiết
2. **Animations** - Thêm transitions
3. **Responsive** - Đảm bảo mobile-friendly

---

## 📝 GHI CHÚ

1. **Figma Design** là desktop-first, cần đảm bảo responsive
2. **Icons**: Figma dùng custom icons, hiện tại dùng Material Icons - có thể cần thay đổi
3. **Images**: Cần assets từ Figma hoặc tìm images tương tự
4. **Colors**: Cần extract exact colors từ Figma
5. **Spacing**: Cần đo chính xác spacing từ Figma

---

**Ngày tạo**: 2024
**Phiên bản**: 1.0

