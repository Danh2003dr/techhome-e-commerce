# Đề xuất hoàn thiện phần người dùng (User-facing)

Tài liệu này liệt kê các cải tiến đề xuất để hoàn thiện trải nghiệm phía người dùng (khách hàng) trên TechHome E-Commerce.

---

## 1. Giỏ hàng & Thanh toán

### 1.1 Trang giỏ hàng trống (Cart empty state)
- **Hiện tại:** Khi `items.length === 0` vẫn hiển thị layout bảng trống + sidebar.
- **Đề xuất:** Hiển thị block "Giỏ hàng trống" với icon, text khuyến khích và nút **Tiếp tục mua sắm** → `/` hoặc `/search`. Chỉ hiển thị Order Summary + Proceed to Checkout khi có ít nhất 1 sản phẩm.

### 1.2 Xóa giỏ hàng sau khi đặt hàng thành công (mock flow)
- **Hiện tại:** Khi không dùng API (`!isApiConfigured()` hoặc chưa đăng nhập), sau khi Place Order chỉ `navigate('/order-confirmation')`, giỏ hàng không được xóa.
- **Đề xuất:** Trên trang Order Confirmation (hoặc ngay trong CheckoutStep3 sau khi navigate), gọi `clearCart()` hoặc tương đương khi đặt hàng thành công (mock) để giỏ hàng trống sau khi hoàn tất.

### 1.3 Fallback ảnh sản phẩm trong giỏ hàng
- **Hiện tại:** `<img src={item.image} />` không có `onError` → ảnh lỗi sẽ broken.
- **Đề xuất:** Thêm `onError` và placeholder (giống các product card) cho ảnh từng dòng trong Cart.

### 1.4 Thông báo khi thêm vào giỏ (Toast / Snackbar)
- **Hiện tại:** Chỉ ProductDetail có state "Added to cart" hiển thị trên trang. Các trang khác (HomePage, ProductListing, MobileCategory, ProductCard) không có feedback rõ ràng.
- **Đề xuất:** Thêm Toast/Snackbar toàn cục (ví dụ: "Đã thêm [Tên SP] vào giỏ") khi gọi `addItem` thành công. Có thể dùng context + component nhỏ, hoặc thư viện nhẹ (react-hot-toast, notistack, hoặc tự viết).

---

## 2. Điều hướng & Header

### 2.1 Link Wishlist trên Header
- **Hiện tại:** Header có Profile, Orders, Cart; chưa có link Wishlist.
- **Đề xuất:** Thêm link **Wishlist** (icon `favorite_border`) tới `/wishlist`, đặt cạnh Orders hoặc Cart. Nếu có API đếm số wishlist có thể hiển thị badge tương tự giỏ hàng.

### 2.2 Breadcrumb nhất quán
- **Hiện tại:** Một số trang có Breadcrumb (ProductDetail, Profile, OrderDetails…), một số không (Cart, Checkout, SearchResults).
- **Đề xuất:** Thêm Breadcrumb cho Cart (`Home > Giỏ hàng`), Checkout (`Home > Giỏ hàng > Thanh toán`), SearchResults (`Home > Tìm kiếm` hoặc theo category) để người dùng dễ định hướng.

---

## 3. Tìm kiếm & Danh mục

### 3.1 Trang SearchResults
- **Hiện tại:** Có empty state "Sorry we couldn't find that item" và Popular Products. Nút "Browse Categories" đang link về `/`.
- **Đề xuất:**  
  - Giữ Popular Products khi không có kết quả.  
  - "Browse Categories" có thể link tới `/search` (hiển thị tất cả) hoặc `/category/mobile` tùy thiết kế.  
  - Chuẩn hóa tiếng Việt (nếu toàn site dùng VND): "Không tìm thấy sản phẩm", "Xem tất cả danh mục", v.v.

### 3.2 Lọc / Sắp xếp trên SearchResults
- **Hiện tại:** Có `sort=newest` qua URL; chưa có UI chọn sort (Giá tăng/giảm, Mới nhất, Bán chạy) trên giao diện.
- **Đề xuất:** Thêm dropdown hoặc tabs "Sắp xếp theo: Mới nhất | Giá thấp đến cao | Giá cao đến thấp | Bán chạy" và đồng bộ với query `?sort=...`.

---

## 4. Footer & Nội dung tĩnh

### 4.1 Footer – VND và tiếng Việt
- **Hiện tại:** "Free Shipping over $35" và một số text tiếng Anh.
- **Đề xuất:** Đổi thành phù hợp thị trường VND, ví dụ: "Miễn phí vận chuyển đơn từ 500.000 ₫" (hoặc mức bạn chọn). Có thể bổ sung "Đổi trả 30 ngày", "Bảo hành chính hãng" nếu phù hợp.

### 4.2 Link footer
- **Hiện tại:** Các link Help Center, Returns, Shipping… đều `href="#"`.
- **Đề xuất:** Tạo các route hoặc trang đơn giản (Help, Chính sách đổi trả, Vận chuyển) và trỏ link tới đó; hoặc tạm trỏ tới `/profile` / section tương ứng nếu chưa có trang riêng.

---

## 5. Tài khoản & Địa chỉ

### 5.1 Địa chỉ mặc định – Việt Nam
- **Hiện tại:** SavedAddressesPage dùng `country: 'United States'`, form có state, zipCode.
- **Đề xuất:** Hỗ trợ Việt Nam: country mặc định "Vietnam", đổi label "State" → "Tỉnh/Thành phố", "Zip" → "Mã bưu điện" (hoặc bỏ nếu không dùng). Format số điện thoại VN (10 số) khi validate.

### 5.2 Bảo vệ route tài khoản
- **Hiện tại:** ProfilePage đã redirect về `/login` khi chưa đăng nhập. Cần kiểm tra Orders, OrderDetails, Addresses, Wishlist có cùng logic (chỉ cho user đã login).
- **Đề xuất:** Đảm bảo tất cả trang account đều redirect về `/login` nếu chưa đăng nhập; có thể gom vào một wrapper component hoặc route guard.

---

## 6. UX & Kỹ thuật

### 6.1 Loading & Skeleton
- **Hiện tại:** Một số trang có "Loading..." (ProductDetail, …).
- **Đề xuất:** Thêm skeleton cho danh sách sản phẩm (HomePage, SearchResults, ProductListing) khi đang gọi API để tránh layout nhảy và cảm giác nhanh hơn.

### 6.2 Xử lý lỗi toàn cục
- **Hiện tại:** Chưa thấy Error Boundary.
- **Đề xuất:** Thêm React Error Boundary bọc MainLayout (hoặc toàn App): khi lỗi render hiển thị trang "Đã xảy ra lỗi" + nút reload / về trang chủ.

### 6.3 Focus & Accessibility
- **Đề xuất:** Sau khi thêm vào giỏ (toast), giữ focus hợp lý; modal (địa chỉ, thanh toán) trap focus và đóng bằng Esc; form có label rõ ràng. Có thể thêm "Skip to main content" link trên Header.

### 6.4 Responsive
- **Đề xuất:** Kiểm tra Cart, Checkout, Form địa chỉ trên mobile (input size, nút bấm, bảng đơn hàng có scroll ngang hoặc stack dọc).

---

## 7. Thứ tự ưu tiên gợi ý

| Ưu tiên | Hạng mục | Lý do |
|--------|----------|--------|
| Cao | Cart empty state | Trải nghiệm cơ bản khi giỏ trống |
| Cao | Clear cart sau đặt hàng (mock) | Tránh nhầm lẫn sau khi hoàn tất đơn |
| Cao | Toast "Đã thêm vào giỏ" | Feedback rõ ràng cho hành động quan trọng |
| Trung bình | Link Wishlist trên Header | Dễ tiếp cận wishlist |
| Trung bình | Breadcrumb Cart / Checkout / Search | Điều hướng rõ ràng |
| Trung bình | Fallback ảnh trong Cart | Nhất quán với product cards |
| Trung bình | Footer VND + tiếng Việt | Đồng bộ với hiển thị giá VND |
| Thấp | Sort UI trên SearchResults | Tăng khả năng tìm kiếm |
| Thấp | Địa chỉ Vietnam, validation | Phù hợp thị trường VN |
| Thấp | Skeleton loading, Error Boundary | Polish và ổn định |

---

Bạn có thể chọn theo từng nhóm (ví dụ: chỉ làm 3 mục cao ưu tiên) hoặc làm lần lượt theo bảng trên. Nếu cần, tôi có thể bắt đầu implement từng mục cụ thể trong code.
