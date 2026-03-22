# Hướng Dẫn Kết Nối Trello với Cursor IDE

## Tổng Quan

Bạn có thể kết nối Trello board của nhóm vào Cursor IDE thông qua **Trello MCP Server**. Điều này cho phép bạn quản lý tasks, cards, và comments trực tiếp từ Cursor.

## Các Bước Thiết Lập

### Bước 1: Chuẩn Bị

1. **Kiểm tra Node.js đã cài đặt:**
   ```bash
   node -v
   npm -v
   ```
   Nếu chưa có, tải và cài đặt từ [nodejs.org](https://nodejs.org/)

2. **Lấy Trello API Key và Token:**
   - Truy cập: https://trello.com/app-key
   - Copy **API Key** của bạn
   - Tạo **Token** tại: https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&name=Cursor%20MCP&key=YOUR_API_KEY
     (Thay `YOUR_API_KEY` bằng API Key của bạn)

### Bước 2: Cài Đặt Trello MCP Server

Có 2 phương pháp:

#### Phương Pháp 1: Sử dụng Composio (Khuyến nghị)

1. Truy cập: https://mcp.composio.dev/
2. Tìm kiếm "Trello" và chọn integration
3. Copy lệnh setup được hiển thị
4. Chạy lệnh trong terminal của Cursor:
   ```bash
   npx @composio/mcp@latest setup "trello" "" --client cursor
   ```
5. Nhập API Key và Token khi được yêu cầu

#### Phương Pháp 2: Cài Đặt Thủ Công

1. Cài đặt Trello MCP server:
   ```bash
   npm install -g @modelcontextprotocol/server-trello
   ```

### Bước 3: Cấu Hình trong Cursor

1. **Mở Cursor Settings:**
   - Nhấn `Ctrl + ,` (hoặc `Cmd + ,` trên Mac)
   - Hoặc vào `File` → `Preferences` → `Settings`

2. **Tìm MCP Settings:**
   - Tìm kiếm "MCP" trong thanh tìm kiếm settings
   - Hoặc vào `Features` → `MCP`

3. **Thêm MCP Server:**
   - Click **"Add new global MCP server"**
   - Thêm cấu hình sau:

   ```json
   {
     "mcpServers": {
       "trello": {
         "command": "npx",
         "args": [
           "-y",
           "@composio/mcp-server-trello"
         ],
         "env": {
           "TRELLO_API_KEY": "YOUR_API_KEY",
           "TRELLO_API_TOKEN": "YOUR_API_TOKEN"
         }
       }
     }
   }
   ```

   **Lưu ý:** Thay `YOUR_API_KEY` và `YOUR_API_TOKEN` bằng giá trị thực tế của bạn.

4. **Lưu và Khởi Động Lại Cursor:**
   - Lưu file cấu hình
   - Khởi động lại Cursor để áp dụng thay đổi

### Bước 4: Xác Minh Kết Nối

Sau khi khởi động lại Cursor, bạn có thể kiểm tra bằng cách:

1. Mở chat với AI trong Cursor
2. Thử các lệnh như:
   - "Liệt kê các boards Trello của tôi"
   - "Hiển thị các cards trong board [tên board]"
   - "Tạo một card mới trong list [tên list]"

## Các Tính Năng Có Thể Sử Dụng

Sau khi kết nối thành công, bạn có thể:

✅ **Đọc thông tin:**
- Xem danh sách boards, lists, và cards
- Đọc comments và attachments
- Xem labels, due dates, và members

✅ **Tạo mới:**
- Tạo cards mới
- Tạo lists mới
- Thêm comments vào cards

✅ **Cập nhật:**
- Cập nhật mô tả card
- Thay đổi due date
- Thêm/xóa labels
- Di chuyển cards giữa lists

✅ **Quản lý:**
- Gán/bỏ gán members
- Archive/unarchive cards
- Tìm kiếm cards

## Ví Dụ Sử Dụng

### Liệt kê boards:
```
"Hiển thị tất cả Trello boards của tôi"
```

### Tạo card mới:
```
"Tạo một card mới tên 'Fix login bug' trong list 'To Do' của board 'TechHome Project'"
```

### Cập nhật card:
```
"Cập nhật card 'Fix login bug' với mô tả 'Cần sửa lỗi đăng nhập khi nhập sai password'"
```

### Xem cards trong list:
```
"Hiển thị tất cả cards trong list 'In Progress' của board 'TechHome Project'"
```

## Xử Lý Lỗi

### Lỗi: "MCP server not found"
- Kiểm tra lại Node.js đã cài đặt đúng chưa
- Thử chạy lại lệnh cài đặt với `-y` flag

### Lỗi: "Authentication failed"
- Kiểm tra lại API Key và Token
- Đảm bảo token chưa hết hạn
- Tạo lại token nếu cần

### Lỗi: "Cannot connect to Trello"
- Kiểm tra kết nối internet
- Kiểm tra Trello API status: https://status.trello.com/

## Tài Liệu Tham Khảo

- [Trello API Documentation](https://developer.atlassian.com/cloud/trello/)
- [Composio MCP Documentation](https://docs.composio.dev/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## Lưu Ý Bảo Mật

⚠️ **QUAN TRỌNG:**
- Không commit API Key và Token vào Git
- Sử dụng environment variables hoặc Cursor's secure storage
- Token có quyền read/write, chỉ chia sẻ với người tin cậy
- Xem xét sử dụng token có expiration date cho môi trường production

## Hỗ Trợ

Nếu gặp vấn đề, bạn có thể:
1. Kiểm tra logs trong Cursor (View → Output → MCP)
2. Tham khảo tài liệu chính thức của Trello API
3. Kiểm tra issues trên GitHub của MCP server

