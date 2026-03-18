# Hướng Dẫn Quản Lý Tasks Trello từ Cursor

## 📋 Tổng Quan

Bạn đã kết nối thành công với Trello board **"Web bán điện thoại"**. Bây giờ bạn có thể quản lý tất cả tasks, cards, và comments trực tiếp từ Cursor IDE thông qua chat với AI.

## 🎯 Các Lệnh Phổ Biến

### 1. Xem Thông Tin

#### Xem tất cả boards:
```
"Liệt kê tất cả Trello boards của tôi"
```

#### Xem các lists trong board:
```
"Hiển thị tất cả lists trong board 'Web bán điện thoại'"
```

#### Xem cards trong một list cụ thể:
```
"Hiển thị tất cả cards trong list 'To Do' của board 'Web bán điện thoại'"
```

#### Xem cards trong toàn bộ board:
```
"Hiển thị tất cả cards đang mở trong board 'Web bán điện thoại'"
```

#### Xem chi tiết một card:
```
"Hiển thị chi tiết card 'Setup Project'"
```

### 2. Tạo Mới

#### Tạo card mới:
```
"Tạo một card mới tên 'Fix login bug' trong list 'To Do' của board 'Web bán điện thoại'"
```

#### Tạo card với mô tả:
```
"Tạo card 'Implement search feature' trong list 'Sprint Backlog' với mô tả 'Thêm tính năng tìm kiếm sản phẩm theo tên và thương hiệu'"
```

#### Tạo card với due date:
```
"Tạo card 'Code review' trong list 'Doing' với hạn chót là ngày mai"
```

#### Tạo list mới:
```
"Tạo một list mới tên 'Testing' trong board 'Web bán điện thoại'"
```

### 3. Cập Nhật

#### Cập nhật tên card:
```
"Đổi tên card 'Setup Project' thành 'Setup Development Environment'"
```

#### Cập nhật mô tả:
```
"Cập nhật mô tả card 'Setup Project' với nội dung 'Cài đặt Node.js, MySQL, và các dependencies cần thiết'"
```

#### Thêm due date:
```
"Thêm hạn chót ngày 20/03/2025 cho card 'Develop Home Page'"
```

#### Di chuyển card giữa lists:
```
"Di chuyển card 'Setup Project' từ list 'Doing' sang list 'Done'"
```

#### Thêm labels:
```
"Thêm label 'urgent' vào card 'Fix login bug'"
```

### 4. Quản Lý Members

#### Gán member vào card:
```
"Gán member [tên người dùng] vào card 'Develop Home Page'"
```

#### Xem members của card:
```
"Hiển thị tất cả members được gán vào card 'Setup Project'"
```

### 5. Comments

#### Thêm comment:
```
"Thêm comment 'Đã hoàn thành phần authentication' vào card 'Create Auth API'"
```

#### Xem comments:
```
"Hiển thị tất cả comments của card 'Setup Project'"
```

### 6. Archive & Delete

#### Archive card:
```
"Archive card 'Old Task'"
```

#### Xóa card đã archive:
```
"Xóa vĩnh viễn card đã archive có ID [card_id]"
```

## 📊 Tình Trạng Hiện Tại của Board "Web bán điện thoại"

### Danh Sách Lists:
1. **Backlog** - 4 cards
2. **Sprint Backlog** - 4 cards  
3. **Sprint 2 Backlog** - 5 cards
4. **To Do** - 0 cards
5. **Doing** - 1 card
6. **Done** - 0 cards
7. **Hướng dẫn** - 2 cards

### Tổng Quan Tasks:

#### Backlog (4 tasks):
- Phân tích yêu cầu hệ thống
- Thiết kế kiến trúc hệ thống
- Thiết kế UI/UX
- Thiết kế Database

#### Sprint Backlog (4 tasks):
- Develop Home Page
- Develop Product List Page
- Develop Cart Page
- System Integration
- System Testing

#### Sprint 2 Backlog (5 tasks):
- Create Product API
- Create Auth API
- API Integration
- Create Cart API
- Create Order API

#### Doing (1 task):
- Setup Project

#### Hướng dẫn (2 cards):
- QUY TẮC QUẢN LÝ MÃ NGUỒN (GIT WORKFLOW)
- TỔNG QUAN DỰ ÁN CYBER STORE

## 🚀 Workflow Quản Lý Tasks Từ Cursor

### Quy Trình Hàng Ngày:

1. **Bắt đầu ngày làm việc:**
   ```
   "Hiển thị tất cả cards trong list 'To Do' của board 'Web bán điện thoại'"
   ```

2. **Bắt đầu làm task:**
   ```
   "Di chuyển card 'Develop Home Page' từ 'To Do' sang 'Doing'"
   ```

3. **Cập nhật tiến độ:**
   ```
   "Thêm comment 'Đã hoàn thành 50% layout' vào card 'Develop Home Page'"
   ```

4. **Hoàn thành task:**
   ```
   "Di chuyển card 'Develop Home Page' từ 'Doing' sang 'Done'"
   ```

5. **Tạo task mới khi phát hiện bug:**
   ```
   "Tạo card 'Fix responsive issue on mobile' trong list 'To Do' với mô tả 'Menu không hiển thị đúng trên màn hình nhỏ hơn 768px'"
   ```

## 💡 Tips & Best Practices

### 1. Đặt tên card rõ ràng:
- ✅ Tốt: "Develop Home Page with product slider"
- ❌ Không tốt: "Home page"

### 2. Sử dụng mô tả chi tiết:
- Luôn thêm mô tả cho card để team hiểu rõ yêu cầu
- Có thể dùng markdown trong mô tả

### 3. Gán labels phù hợp:
- Sử dụng labels để phân loại: `frontend`, `backend`, `bug`, `urgent`, etc.

### 4. Cập nhật due date:
- Luôn set due date cho các tasks quan trọng
- Review due date định kỳ

### 5. Sử dụng comments để tracking:
- Comment mỗi khi có tiến độ
- Comment khi gặp vấn đề cần hỗ trợ

## 🔍 Tìm Kiếm & Lọc

### Tìm card theo tên:
```
"Tìm card có tên chứa 'API' trong board 'Web bán điện thoại'"
```

### Xem cards có due date sắp đến:
```
"Hiển thị tất cả cards có due date trong 7 ngày tới"
```

### Xem cards của một member:
```
"Hiển thị tất cả cards được gán cho [tên member]"
```

## 📝 Ví Dụ Workflow Hoàn Chỉnh

### Scenario: Bắt đầu làm task mới

1. **Xem tasks cần làm:**
   ```
   "Hiển thị cards trong list 'Sprint Backlog'"
   ```

2. **Chọn task và di chuyển:**
   ```
   "Di chuyển card 'Develop Home Page' từ 'Sprint Backlog' sang 'Doing'"
   ```

3. **Bắt đầu làm và cập nhật:**
   ```
   "Thêm comment 'Bắt đầu implement layout header và footer' vào card 'Develop Home Page'"
   ```

4. **Hoàn thành và chuyển:**
   ```
   "Di chuyển card 'Develop Home Page' từ 'Doing' sang 'Done'"
   ```

5. **Tạo task tiếp theo:**
   ```
   "Tạo card 'Add product slider to home page' trong list 'Sprint Backlog'"
   ```

## 🛠️ Xử Lý Lỗi Thường Gặp

### Card không tìm thấy:
- Kiểm tra chính tả tên card
- Đảm bảo card chưa bị archive
- Thử tìm bằng ID card

### Không thể di chuyển card:
- Kiểm tra tên list có đúng không
- Đảm bảo list tồn tại trong board

### Không thể gán member:
- Kiểm tra tên member có đúng không
- Đảm bảo member đã được thêm vào board

## 📚 Tài Liệu Tham Khảo

- [Trello API Documentation](https://developer.atlassian.com/cloud/trello/)
- [Composio MCP Documentation](https://docs.composio.dev/)
- File `TRELLO_SETUP.md` để xem hướng dẫn kết nối

## 🎯 Quick Reference

### Các lệnh nhanh thường dùng:

```
"Hiển thị tất cả cards trong list 'Doing'"
"Tạo card 'Task name' trong list 'To Do'"
"Di chuyển card 'Task name' sang list 'Done'"
"Thêm comment 'Progress update' vào card 'Task name'"
"Cập nhật mô tả card 'Task name' với nội dung '...'"
"Thêm hạn chót ngày mai cho card 'Task name'"
```

---

**Lưu ý:** Tất cả các lệnh trên đều có thể sử dụng bằng tiếng Việt hoặc tiếng Anh. AI trong Cursor sẽ tự động hiểu và thực hiện.

