TechHome E‑commerce
Dự án gồm frontend (React/Vite) và backend (API) trong cùng một repo.

Cấu trúc
Thư mục	Mô tả
Gốc (./)	Frontend: React, Vite, TypeScript. Chạy tại http://localhost:3000.
backend/	Backend API (ví dụ Spring Boot). Chạy tại http://localhost:8080. Đặt code backend vào đây.
Chạy dự án
1. Frontend
Yêu cầu: Node.js

npm install
npm run dev
Mở trình duyệt tại http://localhost:3000. Có thể cấu hình API qua file .env (xem .env.example).

2. Backend
Vào thư mục backend/ và chạy backend (Maven/Gradle/…). Ví dụ với Spring Boot:

cd backend
mvn spring-boot:run
API base URL: http://localhost:8080/api. Frontend mặc định gọi URL này; cần bật CORS cho origin http://localhost:3000 (và 3001 nếu dùng).

Chạy đồng thời
Terminal 1: cd backend && mvn spring-boot:run
Terminal 2: npm run dev
Xem thêm backend/README.md để biết cách đặt code backend vào repo.
