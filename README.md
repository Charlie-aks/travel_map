# The Coastal Edit: Phan Thiet Travel Map 🌊

Một ứng dụng hướng dẫn du lịch kỹ thuật số cao cấp và tương tác, giúp khám phá và quản lý các địa điểm tốt nhất tại Phan Thiết, Việt Nam. Được xây dựng với các công nghệ web hiện đại nhằm mang lại trải nghiệm người dùng mượt mà và chuyên nghiệp.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-yellow.svg)

## 📖 Tầm nhìn & Phạm vi

Mục tiêu của dự án này là tạo ra một công cụ bản đồ đẹp mắt và có tính tương tác cao, vượt xa các danh sách Google Maps thông thường. Dự án tập trung vào:
1. **Trải nghiệm được tuyển chọn**: Các địa điểm do cộng đồng đóng góp nhưng được quản trị viên kiểm duyệt.
2. **Thiết kế Coastal Modern**: Ngôn ngữ thiết kế thống nhất với màu xanh đại dương sâu thẳm, các điểm nhấn rực rỡ, hiệu ứng glassmorphism và các chuyển động mượt mà.
3. **Kỹ thuật xuất sắc**: Sử dụng các công nghệ tiên tiến nhất (React 19, Server Actions, Drizzle ORM).

## ✨ Các tính năng chính

- **Bản đồ tương tác**: Xây dựng trên nền tảng React Leaflet với các đánh dấu (markers) hoạt hình tùy chỉnh và khả năng vẽ lộ trình.
- **Bảng lệnh (Command Palette - `CMD+K`)**: Tìm kiếm nhanh toàn cầu để điều hướng nhanh chóng trong ứng dụng—một tiêu chuẩn trong các công cụ chuyên nghiệp.
- **Hệ thống quản lý kiểm duyệt (CMS)**: Bảng điều khiển dành riêng cho Admin để xem xét, phê duyệt và phân tích các đóng góp từ cộng đồng.
- **Phân tích thời gian thực**: Trực quan hóa dữ liệu khách truy cập và đóng góp thông qua Recharts.

## 🏗️ Kiến trúc

Ứng dụng tuân theo kiến trúc Next.js full-stack hiện đại, tận dụng Server Actions cho các thay đổi dữ liệu và Server Components để lấy dữ liệu.

```mermaid
graph TD
    Client[Giao diện người dùng / React 19] -->|Server Actions| SA[Next.js Server Actions]
    Client -->|API Routes| API[Next.js App Router]
    
    SA --> Drizzle[Drizzle ORM]
    API --> Drizzle
    
    Drizzle --> DB[(Cơ sở dữ liệu PostgreSQL)]
    
    subgraph Lớp UI
        Framer[Framer Motion]
        CMDK[Bảng lệnh]
        Leaflet[React Leaflet]
    end
    
    Client -.-> Lớp UI
```

## 🛠️ Công nghệ sử dụng

- **Next.js 16 (App Router)**: Cung cấp các chiến lược kết xuất tối ưu (RSC, SSR), giảm tải JavaScript cho client.
- **React 19**: Sử dụng những tính năng mới nhất của React để xử lý kết xuất đồng thời và hành động tốt hơn.
- **Drizzle ORM**: Tương tác cơ sở dữ liệu an toàn về kiểu dữ liệu (type-safe) với việc tạo mã SQL nhanh chóng.
- **Framer Motion**: Mang lại cảm giác "cao cấp" thông qua các hiệu ứng hoạt hình dựa trên vật lý.
- **Tailwind CSS v4 & Shadcn UI**: Thiết kế nhanh chóng với hệ thống design system dựa trên token có khả năng tùy biến cao.

## 🚀 Bắt đầu

### Yêu cầu hệ thống

Đảm bảo bạn đã cài đặt Node.js phiên bản 20 trở lên.

### Thiết lập

1. Clone repository này.
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Thiết lập biến môi trường (`.env.local`):
   ```env
   DATABASE_URL="postgresql://user:password@host:port/db"
   ```
4. Chạy migration cơ sở dữ liệu:
   ```bash
   npx drizzle-kit push
   ```
5. Chạy máy chủ phát triển:
   ```bash
   npm run dev
   ```

Mở [http://localhost:3000](http://localhost:3000) và nhấn `CMD/CTRL + K` để bắt đầu khám phá!

## 💡 Hướng dẫn sử dụng

1. **Khám phá bản đồ**: Sử dụng bản đồ tương tác để xem các địa điểm du lịch, ẩm thực và giải trí tại Phan Thiết.
2. **Tìm kiếm nhanh**: Nhấn `Ctrl + K` (hoặc `Cmd + K` trên Mac) để mở thanh tìm kiếm nhanh, cho phép bạn di chuyển đến bất kỳ trang nào hoặc tìm kiếm địa điểm ngay lập tức.
3. **Thêm địa điểm**: Đăng nhập và sử dụng menu "Thêm địa điểm" để đóng góp những địa danh mới mà bạn biết.
4. **Quản lý bộ sưu tập**: Lưu lại các địa điểm yêu thích vào bộ sưu tập cá nhân của bạn.
5. **Xem thành tích**: Tham gia đóng góp để nhận được các danh hiệu và thành tích trong hệ thống.

## 🔑 Tài khoản Admin

Để truy cập vào bảng điều khiển quản trị (Admin Dashboard) tại `/admin`, bạn có thể sử dụng tài khoản sau:

- **Email**: `admin@gmail.com`
- **Mật khẩu**: `1234`

*Lưu ý: Tài khoản này được sử dụng để kiểm duyệt các địa điểm mới và xem báo cáo phân tích của hệ thống.*

---
*Phát triển với niềm đam mê mã nguồn sạch và giao diện đẹp mắt.*

