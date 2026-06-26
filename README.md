# 💰 QLTC - Personal Expense Management Platform (Quản lý Thu Chi)

Hệ thống quản lý tài chính cá nhân toàn diện được xây dựng theo phong cách giao diện chuyên nghiệp, chi tiết của **MISA Money Keeper** và tích hợp các tính năng lập kế hoạch ngân sách thông minh của **Money Lover**.

## 🚀 Tính năng nổi bật (MVP)
- **Quản lý Tài khoản/Ví tiền:** Quản lý nhiều nguồn tiền cùng lúc (Tiền mặt, Tài khoản ngân hàng, Ví điện tử, Sổ tiết kiệm).
- **Ghi chép giao dịch thông minh:** Phân loại rõ ràng Thu (Income), Chi (Expense), Chuyển khoản nội bộ (Transfer) giữa các ví.
- **Phân loại danh mục tài chính:** Hệ thống danh mục đa tầng (ăn uống, đi lại, lương, đầu tư, v.v.) trực quan.
- **Lập ngân sách chi tiêu:** Thiết lập hạn mức chi tiêu cho từng danh mục và nhận cảnh báo khi chi tiêu vượt quá 90%.
- **Báo cáo & Biểu đồ phân tích:** Biểu đồ cơ cấu chi tiêu (Pie Chart) và so sánh thu chi (Bar Chart) trực quan kiểu MISA.

## 🛠️ Ngăn xếp công nghệ
- **Backend:** Java 21, Spring Boot 3.3.0, Spring Data JPA, Spring Security (JWT), Flyway Migration, MySQL 8.0.
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Recharts.

## 📦 Hướng dẫn cài đặt & Khởi chạy

### 1. Khởi chạy Cơ sở dữ liệu (Docker)
Tại thư mục gốc dự án, khởi chạy container MySQL:
```bash
docker-compose up -d
```
Cơ sở dữ liệu sẽ chạy trên cổng **3308** để tránh xung đột với các dịch vụ khác.

### 2. Khởi chạy Backend (Spring Boot)
Di chuyển vào thư mục backend và chạy ứng dụng:
```bash
cd qltc-backend
./mvnw spring-boot:run
```
Backend sẽ lắng nghe tại cổng **8081**.

### 3. Khởi chạy Frontend (React + Vite)
Di chuyển vào thư mục frontend, cài đặt thư viện và chạy:
```bash
cd qltc-frontend
npm install
npm run dev
```
Frontend sẽ chạy tại địa chỉ `http://localhost:5173`.