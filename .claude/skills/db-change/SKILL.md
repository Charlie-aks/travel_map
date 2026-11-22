---
name: db-change
description: Quy trình thay đổi database an toàn cho project Phan Thiet Travel Map (Drizzle ORM 0.45 + drizzle-kit 0.31 + PostgreSQL) — sửa src/db/schema.ts, sinh migration bằng drizzle-kit generate, đọc và kiểm tra SQL, thiết lập baseline migration lần đầu (DB hiện được tạo bằng push), thêm enum/index/unique, backfill dữ liệu. Dùng skill này mỗi khi thêm/sửa/xoá bảng hoặc cột, thêm index, đổi kiểu dữ liệu, đổi status/role sang enum, chạy drizzle-kit, hoặc khi người dùng nói "schema", "migration", "database", "DB", "thêm cột", "thêm bảng", "drizzle" — kể cả thay đổi nhỏ như thêm một cột nullable.
---

# Thay đổi Database

Database là thứ khó hoàn tác nhất trong project: xoá nhầm cột là mất dữ liệu người dùng thật. Vì vậy quy trình này chậm có chủ đích — mỗi thay đổi đi qua file migration mà người đọc được trước khi chạy.

## Hiện trạng

- Schema: `src/db/schema.ts`. Kết nối: `src/db/index.ts` (node-postgres `Pool`).
- Config: `drizzle.config.ts` — đọc `DATABASE_URL` từ `.env.local`, `out: ./src/db/migrations`, `strict: true`, `verbose: true`.
- **Chưa có thư mục migration.** DB được tạo bằng `npx drizzle-kit push` (README hướng dẫn vậy). Push so sánh schema rồi sửa thẳng DB, không để lại lịch sử → không review được, không tái lập được trên môi trường khác.
- `.env.local` chỉ có một `DATABASE_URL` (Neon/Supabase). Không biết đó là DB dev hay production → **phải hỏi người dùng**.
- `status`, `role`, `category`, `targetType` đang là `text` tự do; chưa có index nào ngoài primary key.
- Bảng `user` có cột `password` (bcrypt hash) — xem skill `api-route` về việc không trả cột này ra client.

## Nguyên tắc an toàn

Các lệnh sau **kết nối và thay đổi DB**: `drizzle-kit migrate`, `push`, `drop`, `up`, và mọi script chạy `db.delete/update/insert`. Trước khi chạy bất kỳ lệnh nào trong số đó:

1. Hỏi người dùng `DATABASE_URL` hiện trỏ tới DB nào (dev/production) — **không** in giá trị biến ra output để tự xem.
2. Nói rõ lệnh sẽ làm gì (kèm SQL nếu có) và chờ người dùng đồng ý trong cuộc trò chuyện hiện tại. Đồng ý cho lần trước không áp dụng cho lần này.
3. Với production: khuyên tạo bản sao lưu trước (Neon: tạo branch; Supabase: backup).

Lệnh **không** chạm DB, chạy thoải mái: `drizzle-kit generate`, `drizzle-kit check`, đọc file trong `src/db/migrations/`.

`drizzle-kit pull`/`introspect` và `studio` chỉ đọc DB nhưng vẫn kết nối — vẫn hỏi người dùng trước.

Không dùng `push` nữa cho DB có dữ liệu thật. Nếu người dùng muốn push cho DB dev thử nghiệm, được, nhưng nhắc rằng nó lệch khỏi lịch sử migration.

## Thiết lập baseline (làm một lần, trước migration đầu tiên)

DB đã có bảng nhưng chưa có migration nào. Nếu chạy `generate` ngay, migration đầu tiên sẽ là `CREATE TABLE` cho mọi bảng và `migrate` sẽ lỗi vì bảng đã tồn tại. Cần đánh dấu "trạng thái hiện tại = migration 0000".

1. **Đảm bảo `schema.ts` khớp DB thật** trước khi chụp baseline. Hỏi người dùng có chắc DB đã push từ `schema.ts` hiện tại không. Nếu không chắc: chạy `npx drizzle-kit pull` (cần người dùng đồng ý — nó kết nối DB) rồi so sánh file schema được sinh trong `src/db/migrations/` với `src/db/schema.ts`; xử lý chênh lệch rồi xoá các file pull sinh ra.
2. **Sinh baseline**: `npx drizzle-kit generate --name baseline` → có `src/db/migrations/0000_baseline.sql` và `meta/_journal.json`, `meta/0000_snapshot.json`.
3. **Đánh dấu đã áp dụng trên DB đang tồn tại** (không chạy SQL baseline). Drizzle migrator lưu lịch sử ở bảng `drizzle.__drizzle_migrations (id serial, hash text, created_at bigint)` và chỉ chạy migration có `when` (trong `_journal.json`) lớn hơn `created_at` mới nhất trong bảng. Vì vậy cần chèn một dòng với `hash` = SHA-256 nội dung file `0000_baseline.sql` và `created_at` = giá trị `when` của entry 0000. Viết script nhỏ đọc hai giá trị đó và in ra câu SQL; đưa người dùng xem, rồi mới chạy (thử trên branch/bản sao trước).
4. Từ đây, DB mới (dev, CI) chỉ cần `npx drizzle-kit migrate` là tái tạo đầy đủ.

Commit thư mục `src/db/migrations/` (kể cả `meta/`) vào git.

## Quy trình cho mỗi thay đổi

1. **Sửa `src/db/schema.ts`.**
2. **Sinh migration:** `npx drizzle-kit generate --name <mo_ta_ngan>` (vd. `add_review_indexes`).
   - Nếu drizzle-kit hỏi tương tác "cột này được đổi tên hay tạo mới?", shell của agent không trả lời được. Dừng lại và nhờ người dùng chạy lệnh trong terminal của họ, hoặc tách thay đổi: thêm cột mới → backfill → xoá cột cũ ở migration sau.
3. **Đọc file SQL vừa sinh** và kiểm tra:
   - `DROP TABLE` / `DROP COLUMN` / đổi kiểu cột → mất dữ liệu? Báo người dùng rõ ràng.
   - Thêm `NOT NULL` vào bảng đã có dữ liệu mà không có `DEFAULT` → migrate sẽ lỗi. Thêm default, hoặc thêm cột nullable → backfill → set NOT NULL.
   - Đổi `text` sang enum → phải có `USING "col"::"enum_name"`; nếu thiếu thì thêm tay. Trước đó kiểm tra mọi giá trị đang có đều nằm trong enum (`SELECT DISTINCT status FROM location` — hỏi người dùng trước khi query).
   - `CREATE INDEX` trên bảng lớn khoá ghi; với dữ liệu hiện tại (nhỏ) chấp nhận được.
4. `npx drizzle-kit check` để kiểm tra tính nhất quán của lịch sử migration.
5. **Áp dụng** (sau khi người dùng đồng ý): `npx drizzle-kit migrate`.
6. **Cập nhật code**: route/action/type dùng cột đã đổi. Dùng type suy ra từ schema (`typeof locations.$inferSelect`, `$inferInsert`) thay vì tự khai báo lại.
7. Chạy skill `verify`.

Backfill hoặc migration dữ liệu: `npx drizzle-kit generate --custom --name backfill_<x>` tạo file SQL rỗng để tự viết, nằm trong cùng lịch sử.

## Quy ước schema

```ts
import { pgTable, pgEnum, text, timestamp, integer, index, uniqueIndex } from "drizzle-orm/pg-core";

export const locationStatus = pgEnum("location_status", ["PENDING", "APPROVED", "REJECTED"]);

export const reviews = pgTable(
  "review",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    locationId: text("locationId").notNull().references(() => locations.id, { onDelete: "cascade" }),
    authorId: text("authorId").notNull().references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    // ...
  },
  // Cú pháp mới: trả về MẢNG. Dạng object `(t) => ({ ... })` trong code cũ đã deprecated.
  (t) => [
    index("review_location_idx").on(t.locationId),
    index("review_author_idx").on(t.authorId),
  ],
);
```

- Tên bảng/cột giữ đúng kiểu hiện có (bảng số ít: `user`, `location`, `review`; cột camelCase trong ngoặc kép như `"authorId"`) để không phải đổi tên hàng loạt.
- ID: `text` + `crypto.randomUUID()` như hiện tại.
- **Mỗi foreign key cần index** (Postgres không tự tạo). Ứng viên hiện tại: `location.authorId`, `location.status`, `review.locationId`, `review.authorId`, `report.status`, `report.targetId`.
- Ràng buộc nghiệp vụ nằm ở DB khi có thể (CHECK rating 1–5, unique một review/user/địa điểm…). Nhưng đây là quyết định sản phẩm — hỏi người dùng trước khi thêm unique làm chặn hành vi hiện tại.
- Chú ý `onDelete`: `location.authorId`, `review.authorId`, `report.reporterId` hiện không có `onDelete` → xoá user sẽ lỗi nếu user đó có địa điểm/review. Khi đụng tới, hỏi người dùng muốn `cascade` (xoá theo) hay `set null` (giữ nội dung, ẩn tác giả).
- Enum Postgres thêm giá trị dễ, xoá/đổi tên giá trị khó → cân nhắc kỹ danh sách giá trị.

## Script một lần

Các file ở gốc repo như `delete-users.ts` (xoá **toàn bộ** user), `tmp-users.ts`, `check-db.js`, `test_db.ts` là script tạm, kết nối thẳng DB trong `.env.local`. Không chạy chúng. Script mới (seed, backfill) đặt trong `scripts/`, có tên mô tả rõ, in ra DB đích (host, không in mật khẩu) và yêu cầu xác nhận trước khi ghi.

Thiết kế bảng/quan hệ phức tạp hoặc cần tối ưu truy vấn: nhờ agent `db-architect`.
