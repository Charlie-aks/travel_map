<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Phan Thiet Travel Map ("The Coastal Edit")

Bản đồ du lịch Phan Thiết: người dùng khám phá địa điểm trên bản đồ, đóng góp địa điểm (admin duyệt), viết review, lưu địa điểm, chat với trợ lý AI. Giao diện mặc định tiếng Việt, có tiếng Anh. Deploy trên Vercel.

## Stack

Next.js 16.2 (App Router, `src/app`, Turbopack) · React 19.2 · TypeScript 5 · Tailwind CSS v4 + shadcn (style `base-nova` trên `@base-ui/react`) · framer-motion · Zustand · NextAuth v5 beta (JWT; Google + Credentials/bcrypt) · Drizzle ORM 0.45 + PostgreSQL (`pg`) · React Leaflet + clustering · AI SDK v6 + Gemini · Vercel Blob · Recharts.

## Lệnh

```bash
npm run dev                 # dev server
npm run build               # build production
npx tsc --noEmit -p .       # type-check (baseline: 0 lỗi — giữ nguyên)
npx eslint <files>          # lint file đã sửa (repo còn ~68 lỗi lint cũ)
node .claude/skills/verify/scripts/security-scan.mjs [files]   # quét bảo mật tĩnh
npx drizzle-kit generate --name <x>   # sinh migration (không chạm DB)
```

Chưa có test framework. Biến môi trường trong `.env.local` (không commit, không in giá trị ra output).

## Cấu trúc

- `src/app/` — trang và `api/**/route.ts`; `admin/` là CMS (layout redirect người không phải ADMIN).
- `src/features/<domain>/` — component theo nghiệp vụ; `src/components/ui/` — primitive shadcn; `src/components/layout/` — Navbar, CommandMenu.
- `src/store/` — Zustand store; `src/i18n/locales/{vi,en}.ts` — chuỗi giao diện.
- `src/db/schema.ts` — schema Drizzle; `src/auth.ts` — cấu hình NextAuth; `src/lib/actions/` — server action.
- `src/constants/mock-data.ts` — type `Location`/`Review` dùng chung (lịch sử) + một số dữ liệu mock còn sót.

## Quy ước bắt buộc

- **Mỗi API route ghi dữ liệu và mỗi server action tự kiểm tra quyền** (`requireUser`/`requireAdmin` trong `src/lib/auth-guard.ts`). Layout/page redirect không bảo vệ route hay action.
- Validate input bằng zod; không spread body vào insert/update; không nhận `role`/`status`/`authorId` từ client.
- Không trả cột `password` của bảng `user` — luôn chỉ định `columns` khi nạp user/relation `author`.
- Không trả `error.message`/stack ra client.
- Mọi chuỗi giao diện qua i18n, thêm vào cả `vi.ts` và `en.ts`. Màu tự đặt có biến thể `dark:`.
- Thay đổi DB qua migration (`drizzle-kit generate` → đọc SQL → người dùng đồng ý → `migrate`). Không `push` lên DB có dữ liệu thật. Không chạy các script ở gốc repo (`delete-users.ts`, `tmp-users.ts`, `check-db.js`, `test_db.ts`).

## Kế hoạch & tiến độ

`ROADMAP.md` là nguồn sự thật về giai đoạn hiện tại, việc đã xong và các quyết định đã chốt. Đọc nó trước khi bắt đầu làm; sau mỗi nhóm việc, đánh dấu checklist, thêm dòng vào mục "Nhật ký" và ghi quyết định mới (nếu có) — cập nhật trong cùng commit với code.

## Skill & agent của project

Skill (`.claude/skills/`) — nạp khi làm loại việc tương ứng:
- `api-route` — viết/sửa route handler an toàn (auth, zod, chọn cột, lỗi, upload, chatbot).
- `server-action` — viết/sửa server action an toàn.
- `db-change` — thay đổi schema & migration, baseline lần đầu.
- `verify` — kiểm tra trước khi báo xong (tsc, eslint, security scan, build, chạy thử).

Agent (`.claude/agents/`):
- `security-reviewer` — review bảo mật chỉ đọc, dùng sau khi sửa code nhạy cảm hoặc trước khi merge/deploy.
- `next-docs-researcher` — tra tài liệu Next 16 đi kèm package, dùng khi không chắc về API Next.js.
- `ui-feature-builder` — xây UI theo quy ước Coastal Modern / i18n / dark mode.
- `db-architect` — thiết kế schema, index, tối ưu truy vấn; sinh migration nhưng không chạm DB.

## Vấn đề đã biết (tính đến 2026-11)

Lỗ hổng chưa sửa: server action admin thiếu kiểm tra quyền; tài khoản admin mặc định bị công khai (README + trang login); `/api/upload` và `/api/chat` không yêu cầu đăng nhập; `POST /api/locations` cho khách vô danh; một số route trả password hash qua relation `author`; review không giới hạn rating; NextAuth `debug: true`; `next`/`@auth/core` có CVE critical (cần nâng cấp). Nợ kỹ thuật: XP/badge chỉ ở localStorage; collections còn mock; chưa có migration/index/enum; chưa có test. Chạy `security-scan.mjs` để xem danh sách hiện tại.
