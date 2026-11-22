---
name: verify
description: Kiểm tra thay đổi trước khi báo "xong" trong project Phan Thiet Travel Map — chạy TypeScript (tsc), ESLint trên file đã sửa, quét bảo mật (thiếu auth, lộ password hash, upload không giới hạn, server action không kiểm tra quyền) và next build khi cần. Dùng skill này mỗi khi vừa sửa code xong và chuẩn bị báo kết quả, trước khi commit/tạo PR, hoặc khi người dùng hỏi "chạy được chưa", "kiểm tra lại", "check lỗi", "verify", "test thử", "đã ổn chưa" — kể cả khi họ không nói rõ là cần kiểm tra.
---

# Verify — kiểm tra trước khi báo xong

Mục tiêu: chỉ nói "đã xong" khi có bằng chứng. Báo cáo trung thực cả phần chưa đạt — người dùng cần biết chính xác trạng thái để quyết định, một báo cáo "mọi thứ ổn" sai còn tệ hơn báo cáo có lỗi.

## Bối cảnh project (baseline tại thời điểm tạo skill)

- `tsc --noEmit`: **0 lỗi** → phải giữ nguyên 0.
- ESLint toàn repo: **68 lỗi, 93 cảnh báo** có sẵn (chủ yếu `no-explicit-any`, `react-hooks/set-state-in-effect`). Vì vậy không đòi lint sạch toàn repo, mà đòi **không thêm lỗi mới ở file mình đã chạm vào** (và tiện tay sửa lỗi cũ trong vùng code mình viết lại).
- Chưa có test framework (không có `npm test`). Nếu sau này thêm Vitest/Playwright, bổ sung bước chạy test vào đây.
- Lệnh `npm run lint` chạy `eslint` không tham số; dùng `npx eslint <files>` để giới hạn phạm vi.

## Quy trình

### 1. Xác định phạm vi thay đổi

```bash
git status --short
git diff --name-only HEAD          # file đã sửa (đã/ chưa stage)
git ls-files --others --exclude-standard   # file mới chưa track
```

Gom thành danh sách file `.ts/.tsx` trong `src/` để dùng cho các bước sau.

### 2. TypeScript — bắt buộc

```bash
npx tsc --noEmit -p .
```

Phải ra 0 lỗi. Nếu có lỗi ở file mình không đụng tới, kiểm tra xem có phải do thay đổi type dùng chung (schema, `Location` trong `src/constants/mock-data.ts`, `src/types/next-auth.d.ts`) gây ra không — thường là có.

### 3. ESLint — trên file đã sửa

```bash
npx eslint <danh sách file đã sửa>
```

So với trạng thái trước khi sửa (`git stash` không cần thiết — chỉ cần xem lỗi có nằm ở dòng mình viết không). Lỗi mới do mình gây ra phải sửa. Không thêm `eslint-disable` để lách, trừ trường hợp có lý do rõ ràng và ghi chú lý do ngay cạnh.

### 4. Quét bảo mật — bắt buộc khi đụng tới API route, server action, auth, query DB

```bash
node .claude/skills/verify/scripts/security-scan.mjs <file đã sửa...>   # chỉ file của mình
node .claude/skills/verify/scripts/security-scan.mjs                    # toàn bộ src/ (xem bức tranh chung)
```

Script phát hiện bằng heuristic: route ghi dữ liệu thiếu auth hoặc gọi `auth()` mà không chặn, `/api/admin/*` thiếu kiểm tra ADMIN, server action không kiểm tra quyền, `author: true`/`reporter: true` (nạp cả password hash), `db.query.users.find*` thiếu `columns`, trả `stack`/`error.message` ra client, upload không giới hạn size/type, credential hardcode, `debug: true` trong NextAuth.

- Phát hiện **HIGH trong file mình sửa** → sửa trước khi báo xong.
- Phát hiện ở file khác → liệt kê là "vấn đề có sẵn", không tự ý sửa ngoài phạm vi trừ khi được yêu cầu.
- Script có thể báo nhầm: đọc code để xác nhận. Nếu đúng là báo nhầm, nói rõ vì sao trong báo cáo.
- Script **không** bắt được lỗi logic phân quyền (IDOR — user A sửa dữ liệu của user B), thiếu validate giá trị (vd. rating ngoài 1–5). Với thay đổi liên quan quyền, tự đọc lại hoặc nhờ agent `security-reviewer`.

### 5. `next build` — khi thay đổi có rủi ro build

Chạy `npm run build` khi thay đổi đụng tới: `next.config.ts`, `src/proxy.ts`, layout/page (ranh giới server/client, `"use client"`), route segment config, `generateMetadata`/`sitemap`/`robots`, nâng cấp package, hoặc trước khi commit một loạt thay đổi lớn.

Build đọc `.env.local`; nếu lỗi do thiếu biến môi trường hay không kết nối được DB, báo rõ đó là lỗi môi trường chứ không phải lỗi code. Không in giá trị biến môi trường ra output.

### 6. Kiểm tra thực tế (khi thay đổi có hành vi người dùng nhìn thấy)

Type-check không chứng minh tính năng chạy đúng. Với thay đổi UI hoặc API, chạy `npm run dev` và thử luồng thật (gọi API bằng `curl`, mở trang). Nếu có skill `run` thì dùng nó. Nếu không thể chạy thử (thiếu DB, thiếu key), nói rõ là **chưa kiểm tra thực tế**.

Với API cần đăng nhập: thử cả trường hợp **chưa đăng nhập** (phải nhận 401) và **sai quyền** (phải nhận 403) — đây là chỗ project này từng có lỗ hổng.

## Mẫu báo cáo

```
## Kết quả kiểm tra
- TypeScript: ✅ 0 lỗi
- ESLint (N file đã sửa): ✅ không có lỗi mới  |  ⚠️ còn X lỗi cũ ở dòng không đụng tới
- Security scan (file đã sửa): ✅ sạch  |  ❌ <rule> tại file:line — <đã sửa / lý do>
- Build: ✅ thành công  |  ⏭️ bỏ qua (thay đổi không đụng tới build)  |  ❌ <lỗi>
- Chạy thử: ✅ <đã thử gì, kết quả>  |  ⏭️ chưa chạy thử vì <lý do>

Vấn đề có sẵn (ngoài phạm vi): ...
```

Giữ ngắn gọn. Mỗi dòng ❌ hoặc ⏭️ phải có lý do.
