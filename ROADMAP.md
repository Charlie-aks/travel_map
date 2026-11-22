# Roadmap nâng cấp — Phan Thiet Travel Map

Kế hoạch và tiến độ nâng cấp project sau thời gian tạm dừng. File này là nguồn sự thật về **đang làm gì, đã xong gì, đã quyết định gì** — cập nhật sau mỗi nhóm việc.

**Cập nhật lần cuối:** 2026-11-22 · **Giai đoạn hiện tại:** 0 — Bảo mật (code xong, chờ bạn thiết lập tài khoản trên DB) · **Nhánh:** `upgrade/phase-0-security`

Ký hiệu: `[x]` xong · `[~]` đang làm / làm một phần · `[ ]` chưa làm · ⚠️ cần bạn thao tác hoặc quyết định

---

## Tổng quan

| Giai đoạn | Mục tiêu | Trạng thái |
|---|---|---|
| 0. Bảo mật | Vá lỗ hổng có thể khai thác, nâng cấp bản vá CVE, dọn repo | 🟢 Code xong · ⚠️ chờ thiết lập tài khoản (0.4) |
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
- [x] `next` + `eslint-config-next` + `@next/third-parties` 16.2.2 → 16.4.6 (vá CVE critical)
- [x] `next-auth` beta.30 → beta.32 (vá `@auth/core`)
- [x] `@vercel/blob` 2.3 → 2.9, `tsx` 4.21 → 4.23; `overrides.zod` ép mọi bản zod về 4.6.7; `shadcn` (CLI) chuyển sang devDependencies
- [x] `npm audit fix` (không `--force`). Kết quả: **production 0 lỗ hổng** (trước: 34, 5 critical). Còn 8 moderate trong công cụ dev (`drizzle-kit` → esbuild cũ, `shadcn` → minimatch), chưa có bản sửa cùng major — chấp nhận
- [x] `npm run build` thành công; chạy thử server production: mọi API ghi/admin trả 401 khi chưa đăng nhập, register trả 400 khi dữ liệu sai, `/admin` redirect về `/`

### 0.6 Dọn repo
- [x] Xoá script tạm: `delete-users.ts`, `tmp-users.ts`, `check-db.js`, `test_db.ts`, `tsc.log`, `tsc_output.txt` (còn trong lịch sử git)
- [x] Giữ `public/uploads/1778250396986-Baidaongdia.avif` vì có thể đang được địa điểm trong DB tham chiếu; thêm `/public/uploads/` vào `.gitignore` để ảnh upload local không bị commit nữa
- [x] Gộp `implementation_plan.md.resolved` vào file này (giai đoạn 2–4) rồi xoá
- [x] Cập nhật `AGENTS.md` và skill `api-route`/`server-action`/`db-change` theo helper mới
- [x] Thêm `.env.example` (và bỏ chặn nó trong `.gitignore`)

### 0.7 Sửa theo security review (agent `security-reviewer`, 2026-11-22)
Kết quả review: 2 HIGH · 3 MEDIUM · 4 LOW, cộng 2 lỗi chức năng.
- [x] **HIGH** — Chat: chỉ giữ part `text` khi dựng lại message (bỏ part file/reasoning/tool, vốn cho phép đẩy URL PDF/video hoặc nội dung lớn lên Gemini), chặn body > 200 KB, `maxOutputTokens: 800`, chỉ gửi 12 tin gần nhất (hết lỗi chat bị kẹt sau khoảng 15 lượt), tin cuối phải là của user
- [x] **HIGH** — `/admin/reports` tự kiểm tra quyền ngay trong page (layout không ngăn segment con xuất hiện trong RSC payload). Đã kiểm bằng request RSC tự dựng: 307, không có dữ liệu
- [x] **Quyết định:** tắt chatbot với tài khoản DEMO cho tới khi có rate limit; UI mời DEMO đăng ký tài khoản
- [x] MEDIUM — DEMO không còn thấy tác giả review ẩn danh (trang reports); dashboard luôn ẩn tác giả review ẩn danh
- [x] MEDIUM — **Quyết định:** mỗi người một review cho mỗi địa điểm, viết lại thì cập nhật (giữ nguyên status nếu đã bị admin ẩn; không cộng XP lần nữa). Ràng buộc unique trong DB để ở giai đoạn 1
- [x] MEDIUM — Upload: giới hạn 4 MB (dưới mức 4.5 MB Vercel chặn), từ chối sớm theo `Content-Length` trước khi đọc body; client kiểm kích thước trước khi gửi
- [x] LOW — Sửa địa điểm: điều kiện quyền (chủ sở hữu + PENDING) nằm ngay trong câu UPDATE (hết race condition)
- [x] LOW — `maskEmail` che cả tên miền (`***@***.vn`)
- [x] LOW — `/api/locations/saved` validate `locationId`. **Quyết định:** DEMO vẫn được lưu/bỏ lưu (chỉ ảnh hưởng danh sách của chính tài khoản demo)
- [x] Review của địa điểm chưa duyệt không còn trả qua `/api/locations/[id]/reviews`
- [x] Lỗi chức năng: modal chi tiết review ở trang reports không mở được (`searchParams` chưa `await`)
- [ ] Để giai đoạn sau: rate limit (chat, upload, review, đăng nhập/đăng ký); xác minh email; duyệt địa điểm theo đúng phiên bản admin đã xem (chống đổi nội dung lúc duyệt); luồng "yêu cầu sửa" tạo bản trùng và tiền tố có thể vượt 200 ký tự; chặn hai admin hạ quyền lẫn nhau dẫn tới không còn admin nào; `trustHost` khi self-host

---

## Giai đoạn 1 — Nền móng

- [ ] Schema zod dùng chung client/server trong `src/lib/validations/`
- [ ] Type `Location`/`Review` suy ra từ schema Drizzle, thay cho `src/constants/mock-data.ts`; gom hàm map DB → DTO
- [ ] Baseline migration (DB hiện tạo bằng `push`) — theo skill `db-change`
- [ ] Enum cho `status`/`role`/`category`/`targetType`; index cho foreign key; `onDelete` hợp lý
- [ ] Sửa hết lỗi ESLint (68 lỗi, 93 cảnh báo lúc bắt đầu)
- [ ] Thiết lập test (Vitest) + test cho API quan trọng (phân quyền 401/403)
- [ ] Phân trang cho danh sách admin (users, locations, reports)
- [ ] Rate limit cho chat/upload/review/đăng nhập/đăng ký (cần chọn dịch vụ, vd. Upstash) ⚠️ — sau đó cân nhắc mở lại chat cho DEMO với bucket riêng
- [ ] Unique index `review(locationId, authorId)` (cần gộp review trùng có sẵn trước)
- [ ] Duyệt địa điểm kèm phiên bản nội dung admin đã xem (cột `updatedAt`)
- [ ] Sửa luồng "yêu cầu sửa địa điểm" (hiện tạo bản ghi mới có tiền tố, duyệt xong thành bản trùng)
- [ ] Chuẩn hoá email (chữ thường) khi đăng ký và đăng nhập — cần xử lý dữ liệu cũ có chữ hoa
- [ ] README: thay hướng dẫn `drizzle-kit push` bằng `migrate` sau khi có baseline
- [ ] Test chạy thử với tài khoản DEMO thật: vào admin, thử duyệt/xoá → bị chặn, email bị che

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

- **2026-11-22** — Chạy agent `security-reviewer` trên toàn nhánh: 2 HIGH, 3 MEDIUM, 4 LOW. Xong 0.7, sửa toàn bộ HIGH/MEDIUM và phần lớn LOW (chi tiết ở 0.7). Kiểm tra: tsc 0 lỗi · security-scan sạch toàn `src/` · build OK · smoke test: chat/upload/saved trả 401 khi chưa đăng nhập, request RSC vào `/admin/reports` trả 307 không có dữ liệu.

- **2026-11-22** — Xong 0.6: dọn script tạm và file log, gộp kế hoạch cũ vào roadmap, cập nhật AGENTS.md + skill. **Giai đoạn 0 hoàn tất phần code.** Tổng kết: security-scan 22 HIGH → 0 · npm audit production 34 → 0 · tsc 0 lỗi · build OK. Việc còn lại: bạn chạy `scripts/setup-accounts.ts` và đặt biến môi trường demo trên Vercel (mục 0.4), sau đó review và merge nhánh.

- **2026-11-22** — Xong 0.5: nâng Next 16.4.6, next-auth beta.32 và các bản vá; npm audit production 0 lỗ hổng; build thành công; smoke test bằng curl trên server production xác nhận chặn quyền (11 endpoint → 401, validate register → 400).

- **2026-11-22** — Xong phần code của 0.4: cấu hình NextAuth an toàn, trang login dùng tài khoản demo từ biến môi trường, README + `.env.example`, script thiết lập tài khoản. **security-scan toàn bộ `src/`: 0 phát hiện** (ban đầu 22 HIGH / 7 MEDIUM). Còn chờ bạn chạy script trên DB (xem 0.4).

- **2026-11-22** — Xong 0.3: khoá và validate toàn bộ API công khai (locations, reviews, reports, upload, chat, register, profile), thông báo lỗi i18n phía client, chatbot yêu cầu đăng nhập. Kiểm tra: tsc 0 lỗi · security-scan sạch trên 20 file đã sửa (sửa script bỏ qua comment ở quy tắc upload) · lỗi lint còn lại đều có sẵn từ trước.

- **2026-11-22** — Xong 0.1 + 0.2: helper phân quyền (role từ DB, role DEMO chỉ xem), sửa server action admin và toàn bộ `/api/admin/*`, che email cho DEMO, banner demo. Kiểm tra: tsc 0 lỗi · security-scan sạch trên 17 file đã sửa · lỗi lint còn lại đều có sẵn từ trước. Chưa chạy thử thực tế (cần DB + tài khoản DEMO — xem 0.4).

- **2026-11-22** — Đánh giá project; tạo skill (`api-route`, `server-action`, `db-change`, `verify`), agent (`security-reviewer`, `next-docs-researcher`, `ui-feature-builder`, `db-architect`), bổ sung `AGENTS.md`, tạo roadmap này. Baseline: tsc 0 lỗi · ESLint 68 lỗi/93 cảnh báo · security-scan 22 HIGH/7 MEDIUM · npm audit 34 lỗ hổng (5 critical).
