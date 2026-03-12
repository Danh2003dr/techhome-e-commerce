# Quy tắc Đóng góp Code (Contributing Guidelines)

## 1. Cấu trúc Nhánh (Branching Strategy)

Nhóm chúng ta tuân thủ mô hình **Git Flow đơn giản hóa**:

### Các nhánh chính:

- **`main`**: Chỉ chứa code đã ổn định, sẵn sàng deploy. **Không bao giờ commit trực tiếp lên đây.**

- **`develop`**: Nhánh tích hợp code từ tất cả các thành viên. Code ở đây phải chạy được (không lỗi build).

- **`feature/[tên-tính-năng]`**: Nhánh để phát triển chức năng mới. Tách ra từ `develop`.

  **Ví dụ:** 
  - `feature/login-page`
  - `feature/cart-api`
  - `feature/product-compare`

- **`hotfix/[tên-lỗi]`**: Dùng để sửa lỗi gấp trên nhánh `main`.

## 2. Quy tắc đặt tên Commit (Commit Message)

Sử dụng chuẩn **Conventional Commits** để sau này dễ tra cứu:

### Cấu trúc: `<type>: <description>`

### Các loại commit:

- **`feat`**: Khi thêm tính năng mới
  
  Ví dụ: `feat: add product compare logic`

- **`fix`**: Khi sửa lỗi
  
  Ví dụ: `fix: resolve crash on checkout step 2`

- **`docs`**: Thay đổi tài liệu, comment
  
  Ví dụ: `docs: update API readme`

- **`style`**: Thay đổi giao diện, định dạng code nhưng không đổi logic
  
  Ví dụ: `style: format bootstrap grid for mobile`

- **`refactor`**: Sửa code nhưng không đổi chức năng
  
  Ví dụ: `refactor: clean up layered architecture in Nodejs`

### Quy tắc bổ sung:

- Mô tả ngắn gọn, rõ ràng
- Sử dụng tiếng Anh cho commit message
- Không viết hoa chữ cái đầu (trừ tên riêng)
- Không kết thúc bằng dấu chấm

