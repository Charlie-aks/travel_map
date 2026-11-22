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
- [x] Cài `zod` (4.6.7) làm dependency trực tiếp
- [x] `src/lib/auth-guard.ts`: `requireUser`, `requireWriter` (chặn DEMO), `requireAdmin`, `requireAdminViewer` (ADMIN hoặc DEMO) — đọc role từ DB, không tin JWT
- [x] `src/lib/route-error.ts` (API route) và `src/lib/action-error.ts` (server action): chuẩn hoá lỗi, trả `code` (`UNAUTHORIZED`, `FORBIDDEN`, `DEMO_READ_ONLY`, `INVALID_INPUT`, `NOT_FOUND`, `INTERNAL`), không lộ chi tiết
- [x] `src/lib/privacy.ts`: `maskEmail`, `publicUserColumns`

### 0.2 Khu vực admin
- [x] Server action trong `src/lib/actions/admin.ts` tự kiểm tra quyền ADMIN, validate id, đọc trạng thái review từ DB (không tin tham số client)
- [x] `/api/admin/*`: GET cho ADMIN + DEMO, ghi chỉ ADMIN; chỉ chọn cột cần thiết (không còn `password`); PATCH role chỉ nhận `USER`/`ADMIN`
- [x] DEMO xem danh sách user thấy email đã che; tìm kiếm user chỉ theo tên (chống dò email)
- [x] Trang reports (server component) chỉ nạp cột user công khai
- [x] Layout admin cho phép DEMO (role đọc từ DB), hiện banner "chế độ demo — chỉ xem"
- [x] UI admin hiển thị thông báo khi thao tác bị từ chối (`src/app/admin/components/action-feedback.ts`); trang users có bộ lọc DEMO

### 0.3 API công khai
- [x] `POST /api/locations`: bắt buộc đăng nhập (chặn DEMO), validate bằng schema dùng chung `src/lib/validations/location.ts` (category enum, toạ độ hợp lệ, URL ảnh chỉ https hoặc đường dẫn nội bộ); `authorId`/`status` do server gán
- [x] `PUT/DELETE /api/locations/[id]`: role đọc từ DB, validate + whitelist field; GET chỉ trả bản chưa duyệt cho chủ sở hữu hoặc ADMIN/DEMO; metadata trang địa điểm chỉ cho bản đã duyệt
- [x] `POST /api/reviews`: rating số nguyên 1–5, nội dung ≤ 2000 ký tự, chỉ cho địa điểm đã duyệt
- [x] `POST /api/reports`: `targetType` ∈ REVIEW/LOCATION, lý do ≤ 1000 ký tự, đối tượng phải tồn tại
- [x] `/api/upload`: bắt buộc đăng nhập (chặn DEMO), chỉ jpeg/png/webp/avif, tối đa 5 MB, kiểm tra magic bytes, tên file do server sinh
- [x] `/api/chat`: bắt buộc đăng nhập (DEMO được dùng), tối đa 30 tin, tin người dùng ≤ 1000 ký tự, không nhận role `system` từ client, bỏ log body và stack trace; UI hiện lời mời đăng nhập
- [x] `/api/auth/register`: validate tên, email, mật khẩu 8–72 ký tự, xử lý trùng email đồng thời; `/api/profile/update`: tên 1–100 ký tự, chặn DEMO đổi tên
- [x] `GET /api/locations/[id]/reviews` chỉ nạp tên + ảnh tác giả
- [x] Không còn route nào trả `error.message`/stack ra client
- [x] Client hiển thị lỗi theo `code` qua i18n (`src/i18n/apiError.ts`); form thêm địa điểm không còn báo "thành công" khi API từ chối

### 0.4 Cấu hình auth & tài khoản demo
- [x] NextAuth: `debug` chỉ bật ở development; tắt tự gộp tài khoản theo email (trang login hiện thông báo khi bị từ chối)
- [x] Trang login: gợi ý tài khoản demo lấy từ `NEXT_PUBLIC_DEMO_EMAIL` / `NEXT_PUBLIC_DEMO_PASSWORD`, ghi rõ "chỉ xem", có nút điền nhanh; bỏ thông tin điền cứng
- [x] README: bảng phân quyền USER/DEMO/ADMIN, hướng dẫn thiết lập tài khoản; thêm `.env.example`
- [x] Script `scripts/setup-accounts.ts` (mặc định chạy thử, `--yes` mới ghi)
- [ ] ⚠️ **Bạn cần làm** (mình chưa chạy vì ghi vào DB):
  1. Xác nhận `DATABASE_URL` trong `.env.local` là DB nào (dev hay production)
  2. `npx tsx scripts/setup-accounts.ts demo admin@gmail.com` → kiểm tra → thêm `--yes`
  3. `npx tsx scripts/setup-accounts.ts admin <email-riêng-của-bạn> "<Tên>"` → kiểm tra → thêm `--yes` → lưu mật khẩu được in ra
  4. Trên Vercel: đặt `NEXT_PUBLIC_DEMO_EMAIL=admin@gmail.com`, `NEXT_PUBLIC_DEMO_PASSWORD=1234` (tài khoản này giờ chỉ xem) rồi deploy lại
  5. Thứ tự quan trọng: chỉ hiện gợi ý demo **sau khi** bước 2 đã chạy

### 0.5 Nâng cấp dependency
- [ ] `next` + `eslint-config-next` + `@next/third-parties` → 16.4.x (vá CVE critical)
- [ ] `next-auth` → 5.0.0-beta mới nhất (vá `@auth/core`)
- [ ] `npm audit fix` (không `--force`), build lại

### 0.6 Dọn repo
- [ ] Xoá script tạm: `delete-users.ts`, `tmp-users.ts`, `check-db.js`, `test_db.ts`, `tsc.log`, `tsc_output.txt`, file upload thử trong `public/uploads/`
- [ ] Gộp `implementation_plan.md.resolved` vào file này rồi xoá
- [x] Thêm `.env.example` (và bỏ chặn nó trong `.gitignore`)

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

- **2026-11-22** — Xong phần code của 0.4: cấu hình NextAuth an toàn, trang login dùng tài khoản demo từ biến môi trường, README + `.env.example`, script thiết lập tài khoản. **security-scan toàn bộ `src/`: 0 phát hiện** (ban đầu 22 HIGH / 7 MEDIUM). Còn chờ bạn chạy script trên DB (xem 0.4).

- **2026-11-22** — Xong 0.3: khoá và validate toàn bộ API công khai (locations, reviews, reports, upload, chat, register, profile), thông báo lỗi i18n phía client, chatbot yêu cầu đăng nhập. Kiểm tra: tsc 0 lỗi · security-scan sạch trên 20 file đã sửa (sửa script bỏ qua comment ở quy tắc upload) · lỗi lint còn lại đều có sẵn từ trước.

- **2026-11-22** — Xong 0.1 + 0.2: helper phân quyền (role từ DB, role DEMO chỉ xem), sửa server action admin và toàn bộ `/api/admin/*`, che email cho DEMO, banner demo. Kiểm tra: tsc 0 lỗi · security-scan sạch trên 17 file đã sửa · lỗi lint còn lại đều có sẵn từ trước. Chưa chạy thử thực tế (cần DB + tài khoản DEMO — xem 0.4).

- **2026-11-22** — Đánh giá project; tạo skill (`api-route`, `server-action`, `db-change`, `verify`), agent (`security-reviewer`, `next-docs-researcher`, `ui-feature-builder`, `db-architect`), bổ sung `AGENTS.md`, tạo roadmap này. Baseline: tsc 0 lỗi · ESLint 68 lỗi/93 cảnh báo · security-scan 22 HIGH/7 MEDIUM · npm audit 34 lỗ hổng (5 critical).
