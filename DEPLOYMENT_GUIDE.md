# Hướng Dẫn Triển Khai Website Lên GitHub & Vercel Database

Dự án **Thi Ca Lan Đình** đã được cấu hình sẵn sàng 100% để triển khai Frontend lên **GitHub** và Backend + Database lên **Vercel**.

---

## 🌟 PHẦN 1: ĐƯA DỰ ÁN LÊN GITHUB

1. **Khởi tạo Git** (nếu chưa có):
   ```bash
   git init
   git add .
   git commit -m "Khoi tao du an Thi Ca Lan Dinh Fullstack"
   ```

2. **Tạo Repository trên GitHub**:
   - Truy cập [github.com/new](https://github.com/new) và tạo một repo mới (ví dụ: `web-thicalandinh`).

3. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/web-thicalandinh.git
   git branch -M main
   git push -u origin main
   ```

---

## 🌟 PHẦN 2: TRIỂN KHAI DATABASE & API LÊN VERCEL (HOÀN TOÀN MIỄN PHÍ)

1. **Đăng nhập Vercel**:
   - Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản **GitHub**.

2. **Import dự án từ GitHub**:
   - Nhấn **"Add New..."** -> **"Project"** -> Chọn repository `web-thicalandinh`.
   - Vercel sẽ tự động nhận diện Vite/React và các Serverless Functions trong thư mục `api/`.

3. **Tạo Database Vercel Postgres (Miễn phí)**:
   - Trong bảng điều khiển Project trên Vercel, chuyển sang tab **Storage**.
   - Chọn **"Create Database"** -> Chọn **"Postgres"** (Neon).
   - Nhấn **"Create"** và liên kết database với dự án của bạn (Connect Project).
   - Vercel sẽ tự động gán biến môi trường `POSTGRES_URL` vào dự án!

4. **Thêm biến môi trường Mật khẩu Quản trị (Environment Variables)**:
   - Vào **Settings** -> **Environment Variables**.
   - Thêm biến:
     - Key: `ADMIN_PASSWORD`
     - Value: `thicalandinh2026` (hoặc mật khẩu tùy ý của bạn).

5. **Nhấn Deploy**:
   - Vercel sẽ tự động khởi tạo các bảng CSDL (`poems`, `stories`, `scholars`, `library`) và nạp dữ liệu mẫu ban đầu!

---

## 🌟 PHẦN 3: SỬ DỤNG TRANG QUẢN TRỊ ĐĂNG BÀI

- Truy cập vào đường dẫn website + `/admin` (ví dụ: `https://thicalandinh.vercel.app/#/admin`).
- Nhập mật khẩu quản trị (`thicalandinh2026`).
- Bạn có thể thoải mái:
  - ✍️ **Đăng bài thơ mới**: Soạn từng câu thơ, nguyên tác chữ Hán, bản dịch, chú giải và tải ảnh bìa.
  - 📖 **Đăng bài viết cổ tích & điển cố**: Soạn thảo các đoạn văn, bài học nhân sinh.
  - 🏛️ **Thêm danh nhân & tư liệu thư viện**.
