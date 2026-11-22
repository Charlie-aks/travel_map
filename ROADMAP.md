# Roadmap nâng cấp — Phan Thiet Travel Map

Kế hoạch và tiến độ nâng cấp project sau thời gian tạm dừng. File này là nguồn sự thật về **đang làm gì, đã xong gì, đã quyết định gì** — cập nhật sau mỗi nhóm việc.

**Cập nhật lần cuối:** 2026-11-22 · **Giai đoạn hiện tại:** 0 — Bảo mật · **Nhánh:** `upgrade/phase-0-security`

Ký hiệu: `[x]` xong · `[~]` đang làm / làm một phần · `[ ]` chưa làm · ⚠️ cần bạn thao tác hoặc quyết định

---

## Tổng quan

| Giai đoạn | Mục tiêu | Trạng thái |
|---|---|---|
| 0. Bảo mật | Vá lỗ hổng có thể khai thác, nâng cấp bản vá CVE, dọn repo | 🟡 Đang làm |
| 1. Nền móng | Validate thống nhất, type từ schema, migration + index + enum, lint sạch, test | ⚪ Chưa bắt đầu |
| 2. Bỏ dữ liệu giả | Gamification, collections, rating, khoảng cách dùng dữ liệu thật | ⚪ Chưa bắt đầu |
| 3. Tính năng mới | Chỉ đường, lịch trình thông minh, gợi ý, chatbot có tool | ⚪ Chưa bắt đầu |
| 4. Nâng cấp lớn & SEO | AI SDK v7, framer-motion 14, ESLint 10; sitemap, robots, SSR nội dung, next/image | ⚪ Chưa bắt đầu |

---

## Quyết định đã chốt

| Ngày | Quyết định | Lý do |
|---|---|---|
| 2026-11-22 | Tài khoản demo cho nhà tuyển dụng thành **role `DEMO` chỉ xem**: xem được toàn bộ trang admin, mọi thao tác ghi bị server từ chối. Admin thật dùng thông tin đăng nhập riêng, không công khai. | Giữ trải nghiệm demo cho nhà tuyển dụng mà không để người lạ xoá dữ liệu. |
| 2026-11-22 | Chatbot AI **bắt buộc đăng nhập**, có giới hạn độ dài và số tin nhắn. | Mỗi request tốn quota Gemini. |
| 2026-11-22 | **Tắt** `allowDangerousEmailAccountLinking` (tự gộp tài khoản Google theo email). | Đăng ký không xác minh email nên có thể bị chiếm tài khoản trước. |
| 2026-11-22 | Làm trên nhánh riêng, **commit sau mỗi nhóm việc**, cập nhật file này cùng commit. | Dễ review và hoàn tác. |

---

## Giai đoạn 0 — Bảo mật

### 0.1 Nền tảng phân quyền
- [ ] Cài `zod` làm dependency trực tiếp
- [ ] `src/lib/auth-guard.ts`: `requireUser`, `requireWriter` (chặn DEMO), `requireAdmin`, `requireAdminViewer` (ADMIN hoặc DEMO) — đọc role từ DB, không tin JWT
- [ ] `src/lib/route-error.ts`: chuẩn hoá response lỗi, không lộ chi tiết

### 0.2 Khu vực admin
- [ ] Server action trong `src/lib/actions/admin.ts` tự kiểm tra quyền ADMIN, validate id, đọc trạng thái từ DB
- [ ] `/api/admin/*`: GET cho ADMIN + DEMO, ghi chỉ ADMIN; không trả cột `password`
- [ ] Trang admin (server component) chỉ nạp các cột user cần thiết
- [ ] Layout admin cho phép DEMO, hiện banner "chế độ demo — chỉ xem"
- [ ] UI admin hiển thị lỗi khi thao tác bị từ chối

### 0.3 API công khai
- [ ] `POST /api/locations`: bắt buộc đăng nhập, validate
- [ ] `PUT/DELETE /api/locations/[id]`: validate; GET không lộ địa điểm chưa duyệt cho người ngoài
- [ ] `POST /api/reviews`: rating 1–5, chỉ cho địa điểm đã duyệt
- [ ] `POST /api/reports`: validate `targetType`, `reason`
- [ ] `/api/upload`: bắt buộc đăng nhập, chỉ ảnh jpeg/png/webp/avif, tối đa 5 MB, tự sinh tên file
- [ ] `/api/chat`: bắt buộc đăng nhập, giới hạn tin nhắn, bỏ log body và stack trace; UI mời đăng nhập
- [ ] `/api/auth/register`, `/api/profile/update`: validate email, độ dài mật khẩu/tên
- [ ] Không còn route nào trả `error.message`/stack ra client

### 0.4 Cấu hình auth & tài khoản demo
- [ ] NextAuth: `debug` chỉ bật ở development; tắt tự gộp tài khoản theo email
- [ ] Trang login: gợi ý tài khoản demo lấy từ biến môi trường, ghi rõ "chỉ xem"; bỏ mật khẩu điền cứng
- [ ] README: bỏ thông tin admin, mô tả tài khoản demo
- [ ] ⚠️ Đổi role tài khoản demo sang `DEMO` và tạo tài khoản admin thật (cần bạn xác nhận DB trước khi chạy)

### 0.5 Nâng cấp dependency
- [ ] `next` + `eslint-config-next` + `@next/third-parties` → 16.4.x (vá CVE critical)
- [ ] `next-auth` → 5.0.0-beta mới nhất (vá `@auth/core`)
- [ ] `npm audit fix` (không `--force`), build lại

### 0.6 Dọn repo
- [ ] Xoá script tạm: `delete-users.ts`, `tmp-users.ts`, `check-db.js`, `test_db.ts`, `tsc.log`, `tsc_output.txt`, file upload thử trong `public/uploads/`
- [ ] Gộp `implementation_plan.md.resolved` vào file này rồi xoá
- [ ] Thêm `.env.example`

---

## Giai đoạn 1 — Nền móng

- [ ] Schema zod dùng chung client/server trong `src/lib/validations/`
- [ ] Type `Location`/`Review` suy ra từ schema Drizzle, thay cho `src/constants/mock-data.ts`; gom hàm map DB → DTO
- [ ] Baseline migration (DB hiện tạo bằng `push`) — theo skill `db-change`
- [ ] Enum cho `status`/`role`/`category`/`targetType`; index cho foreign key; `onDelete` hợp lý
- [ ] Sửa hết lỗi ESLint (68 lỗi, 93 cảnh báo lúc bắt đầu)
- [ ] Thiết lập test (Vitest) + test cho API quan trọng (phân quyền 401/403)
- [ ] Phân trang cho danh sách admin (users, locations, reports)
- [ ] Rate limit cho chat/upload (cần chọn dịch vụ, vd. Upstash) ⚠️

## Giai đoạn 2 — Bỏ dữ liệu giả

- [ ] XP, level, badge lưu trong DB thay vì localStorage
- [ ] Collections thật (bảng collection, thêm/bớt địa điểm), bỏ `mockCollections`
- [ ] Rating hiển thị đúng khi chưa có review (không mặc định 5.0); `GET /api/locations/[id]` tính rating thật
- [ ] Khoảng cách thật từ vị trí người dùng (thay `distance: 'Local'`)
- [ ] Trang achievements dùng dữ liệu thật
- [ ] Trang settings: các tuỳ chọn còn là giao diện giả lập

## Giai đoạn 3 — Tính năng mới

- [ ] Chỉ đường trong app (OSRM / Mapbox Directions) từ `routingDestination`
- [ ] Lịch trình thông minh từ địa điểm đã lưu (sắp theo khoảng cách/giờ)
- [ ] Gợi ý địa điểm theo sở thích (vd. lưu nhiều bãi biển → gợi ý bãi biển chưa lưu)
- [ ] Chatbot có tool: lưu địa điểm, tìm theo vị trí; không nhét toàn bộ địa điểm vào prompt
- [ ] Thống kê lượt truy cập thật cho biểu đồ admin

## Giai đoạn 4 — Nâng cấp lớn & SEO

- [ ] AI SDK v6 → v7, `@ai-sdk/*` v4
- [ ] framer-motion 12 → 14, ESLint 9 → 10, TypeScript 7 (đánh giá)
- [ ] `sitemap.ts`, `robots.ts`; `lang="vi"`; bỏ GA ID mặc định giả
- [ ] Trang địa điểm render nội dung ở server (SEO), JSON-LD
- [ ] Chuyển `<img>` sang `next/image` + `images.remotePatterns`

---

## Nhật ký

Mới nhất ở trên. Mỗi dòng: ngày · việc đã làm · commit.

- **2026-11-22** — Đánh giá project; tạo skill (`api-route`, `server-action`, `db-change`, `verify`), agent (`security-reviewer`, `next-docs-researcher`, `ui-feature-builder`, `db-architect`), bổ sung `AGENTS.md`, tạo roadmap này. Baseline: tsc 0 lỗi · ESLint 68 lỗi/93 cảnh báo · security-scan 22 HIGH/7 MEDIUM · npm audit 34 lỗ hổng (5 critical).
