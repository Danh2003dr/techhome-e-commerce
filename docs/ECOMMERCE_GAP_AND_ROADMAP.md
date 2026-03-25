# TechHome — Các mặt nghiệp vụ, UX và tính năng còn thiếu

> Tài liệu chỉ tập trung **nghiệp vụ**, **trải nghiệm người dùng (UX)** và **tính năng** so với TMĐT điện thoại / phụ kiện thực tế (ví dụ Thế Giới Di Động, FPT Shop, Shopee).  
> Không đi sâu kiến trúc kỹ thuật, bảo mật hay hạ tầng.

---

## 1. Dự án đã phủ được gì (tóm tắt)

| Kênh | Đã có trên UI / luồng cơ bản |
|------|------------------------------|
| **Khách (store)** | Trang chủ, tìm kiếm, chi tiết sản phẩm, danh mục/deals, giỏ, checkout nhiều bước, đăng nhập/đăng ký, lịch sử đơn, chi tiết đơn, profile, địa chỉ, wishlist, trang bảo hành (khung) |
| **Quản trị (admin)** | Dashboard, danh sách/chỉnh sản phẩm, tồn kho, đơn hàng, hóa đơn, cài SEO, lịch (calendar) |

**Hạn chế mang tính sản phẩm:** nhiều màn admin dựa dữ liệu mock/local; menu có mục (Inbox, To-Do) chưa khớp route; thanh toán trên UI mới ở mức demo so với chuẩn cổng thật.

---

## 2. Thiếu gì — theo trục Nghiệp vụ / UX / Tính năng

### 2.1 Nghiệp vụ (luồng kinh doanh end-to-end)

| Hạng mục | Thiếu hoặc yếu so với TMĐT thực tế |
|----------|-----------------------------------|
| **Giá & khuyến mãi** | Chương trình giảm giá theo sản phẩm/khung giờ, combo, voucher có điều kiện, giới hạn lượt/người, xếp chồng ưu đãi |
| **Tồn kho & biến thể** | Một SKU theo màu/bộ nhớ/cấu hình; trừ tồn đồng bộ đa kênh; cảnh báo hết hàng/đặt trước |
| **Thanh toán** | COD, chuyển khoản, ví (MoMo, ZaloPay, VNPay), thẻ qua cổng; đối soát trạng thái thanh toán với đơn hàng |
| **Vận chuyển** | Phí ship theo vùng/cân nặng, đơn vị vận chuyển, mã vận đơn, SLA giao hàng |
| **Đơn hàng sau bán** | Đổi/trả có quy trình, hoàn tiền, hủy đơn theo trạng thái, khiếu nại/CS gắn đơn |
| **Bảo hành & RMA** | Kích hoạt bảo hành điện tử, serial/IMEI, đổi bảo hành — đặc thù mảng điện thoại |
| **Pháp lý & niềm tin** | Điều khoản mua bán, chính sách đổi trả/tra góp hiển thị rõ và nhất quán trên luồng mua |

---

### 2.2 Trải nghiệm người dùng (UX)

| Hạng mục | Thiếu hoặc yếu so với TMĐT thực tế |
|----------|-----------------------------------|
| **Tìm & lọc** | Lọc đa tiêu chí (hãng, RAM, ROM, chip, màn hình, 5G, pin, khoảng giá), sắp xếp thông minh, so sánh sản phẩm cạnh nhau |
| **Chi tiết sản phẩm** | Review có ảnh/video, điểm đánh giá, Q&A, “thường mua cùng”, chính sách rõ (đổi trả, bảo hành) ngay tại trang |
| **Niềm tin & hỗ trợ** | Hotline/chat, cửa hàng gần bạn, badge uy tín, thông báo flash sale có thời gian đếm ngược |
| **Giỏ & thanh toán** | Ước tính phí ship sớm, chọn khung giờ giao, lưu nhiều địa chỉ mặc định rõ ràng, tóm tắt đơn dễ đọc |
| **Sau mua** | Timeline trạng thái đơn (chuẩn TMĐT), tra cứu vận đơn, thông báo qua email/SMS/app |
| **Cá nhân hóa** | Gợi ý theo lịch sử xem/mua, “mua lại”, section dành cho bạn |
| **Khả năng tiếp cận & đa ngôn ngữ** | Chuẩn hóa a11y, i18n nếu mở rộng thị trường |

---

### 2.3 Tính năng (product features)

| Nhóm | Thiếu hoặc yếu so với TMĐT thực tế |
|------|-----------------------------------|
| **Marketing** | Flash sale slot, mã giảm giá, banner theo chiến dịch, landing theo chương trình |
| **Khách hàng thân thiết** | Điểm tích lũy, hạng thành viên, ưu đãi theo cấp |
| **Nội dung** | Blog/tin công nghệ, video mở hộp (gắn sản phẩm), FAQ có cấu trúc |
| **Admin / vận hành** | Phân quyền vai trò (kho, CS, kế toán), quản lý khuyến mãi, kho nhập/xuất, báo cáo bán — vượt mức “biểu đồ demo” |
| **Đa kênh** | Đồng bộ giá/tồn nếu sau này bán thêm kênh (marketplace, cửa hàng) |

---

## 3. Bảng tổng hợp nhanh (thiếu chủ yếu ở đâu)

| Trục | Mức độ “khoảng trống” so TMĐT lớn (gợi ý tương đối) |
|------|-----------------------------------------------------|
| **Nghiệp vụ** | Cao — khuyến mãi đa tầng, thanh toán/vận chuyển thật, đổi trả, bảo hành điện thoại |
| **UX** | Trung bình–cao — lọc/so sánh, review/Q&A, theo dõi đơn, hỗ trợ & niềm tin |
| **Tính năng** | Trung bình — loyalty, marketing nâng cao, CMS phong phú, admin vận hành sâu |

---

## 4. Gợi ý bổ sung tính năng theo hướng “gần TMĐT thật” (ưu tiên sản phẩm)

1. **Voucher / mã giảm giá** + hiển thị điều kiện trên giỏ và checkout.  
2. **Theo dõi đơn:** trạng thái chuẩn + mã vận đơn (khi có đơn vị vận chuyển).  
3. **Thanh toán:** tích hợp ít nhất một cổng hoặc COD có quy trình xác nhận.  
4. **Đánh giá sản phẩm** + (tuỳ scope) hỏi đáp.  
5. **Lọc & so sánh** sản phẩm điện thoại theo thông số.  
6. **Gợi ý:** “Cùng mua”, “Xem gần đây”, trending.  
7. **Admin:** quản voucher, khuyến mãi, và phân quyền cơ bản — khớp nghiệp vụ phía khách.

---

*Tài liệu có thể cập nhật khi phạm vi sản phẩm thay đổi.*
