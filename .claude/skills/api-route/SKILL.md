---
name: api-route
description: Cách viết và sửa API Route Handler (src/app/api/**/route.ts) an toàn trong project Phan Thiet Travel Map (Next.js 16 + NextAuth v5 + Drizzle) — kiểm tra đăng nhập và phân quyền (chống IDOR), validate input bằng zod, chỉ chọn cột cần thiết để không lộ password hash, xử lý lỗi thống nhất, upload file an toàn. Dùng skill này mỗi khi tạo endpoint mới, sửa route.ts, thêm GET/POST/PUT/PATCH/DELETE, sửa lỗi 401/403/500, thêm validate, hoặc khi người dùng nói "API", "endpoint", "route", "backend", "fetch dữ liệu từ server" — kể cả khi chỉ sửa một dòng trong route có sẵn.
---

# API Route Handler

Mọi file `route.ts` là một endpoint công khai trên Internet. Bất kỳ ai cũng gọi được bằng `curl`, bỏ qua hoàn toàn UI — nên không thể dựa vào việc "nút này chỉ hiện với admin". Mỗi handler tự chịu trách nhiệm: **ai được gọi → input có hợp lệ không → trả về những gì**.

Trước khi dùng API Next.js mà bạn không chắc, đọc tài liệu đúng phiên bản trong `node_modules/next/dist/docs/` (route handler: `01-app/01-getting-started/15-route-handlers.md`, `01-app/03-api-reference/03-file-conventions/route.md`) hoặc nhờ agent `next-docs-researcher`.

## Các điểm của Next 16 cần nhớ

- `params` là **Promise**: `{ params }: { params: Promise<{ id: string }> }` rồi `const { id } = await params`. Có thể dùng helper toàn cục `RouteContext<'/api/locations/[id]'>` (cần `next dev`/`next build` đã sinh type).
- Route Handler **không cache mặc định**; `export const dynamic = 'force-dynamic'` là thừa với handler mới (code cũ còn để, không cần xoá vội).
- `middleware.ts` đã đổi tên thành `proxy.ts`. Proxy chỉ dùng cho kiểm tra lạc quan/redirect, **không** thay thế kiểm tra quyền trong từng handler.

## Helper dùng chung

Hai file dưới đây là nền tảng cho mọi route và server action. Nếu chưa tồn tại trong repo, tạo chúng trước (đúng nội dung này, chỉnh nếu cần) rồi mới viết route.

### `src/lib/auth-guard.ts`

```ts
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export class AuthError extends Error {
  constructor(public status: 401 | 403, message: string) {
    super(message);
  }
}

/** Bắt buộc đăng nhập. Trả về user trong session. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new AuthError(401, "Unauthorized");
  return session.user;
}

/**
 * Bắt buộc quyền ADMIN.
 * Đọc role từ DB thay vì tin role trong JWT: JWT giữ role cũ cho tới khi hết hạn,
 * nên một admin vừa bị hạ quyền vẫn còn quyền nếu chỉ kiểm tra session.
 */
export async function requireAdmin() {
  const user = await requireUser();
  const [row] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);
  if (row?.role !== "ADMIN") throw new AuthError(403, "Forbidden");
  return user;
}
```

### `src/lib/route-error.ts`

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "@/lib/auth-guard";

/** Chuyển mọi lỗi thành response an toàn. Chi tiết lỗi chỉ ghi log ở server. */
export function handleRouteError(error: unknown, context: string) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Invalid input", fields: z.flattenError(error).fieldErrors },
      { status: 400 },
    );
  }
  console.error(`[${context}]`, error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
```

`zod` hiện chỉ có trong node_modules như dependency gián tiếp (bản 4.3.6, có lỗ hổng đã biết). Nếu `package.json` chưa liệt kê `zod`, cài trực tiếp: `npm install zod@^4` (zod 4: dùng `z.flattenError(err)`, không dùng `err.flatten()` đã deprecated).

## Mẫu route

```ts
// src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { locations, reviews } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth-guard";
import { handleRouteError } from "@/lib/route-error";

const createReviewSchema = z.object({
  locationId: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().max(2000).default(""),
  isAnonymous: z.boolean().default(false),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();                              // 1. Ai gọi?
    const input = createReviewSchema.parse(await req.json());      // 2. Input hợp lệ?

    // 3. Tài nguyên có tồn tại và được phép thao tác không?
    const [loc] = await db
      .select({ id: locations.id })
      .from(locations)
      .where(and(eq(locations.id, input.locationId), eq(locations.status, "APPROVED")))
      .limit(1);
    if (!loc) return NextResponse.json({ error: "Location not found" }, { status: 404 });

    const [created] = await db
      .insert(reviews)
      .values({ ...input, authorId: user.id, status: "PUBLISHED" })
      .returning({ id: reviews.id, rating: reviews.rating, createdAt: reviews.createdAt });

    return NextResponse.json(created, { status: 201 });          // 4. Chỉ trả cái UI cần
  } catch (error) {
    return handleRouteError(error, "POST /api/reviews");
  }
}
```

## Checklist cho mỗi handler

**1. Xác thực & phân quyền**
- Handler ghi dữ liệu (POST/PUT/PATCH/DELETE) → `requireUser()` hoặc `requireAdmin()`. Ngoại lệ có chủ đích: `/api/auth/register`, `/api/auth/[...nextauth]`.
- Mọi handler dưới `/api/admin/*` → `requireAdmin()`, kể cả GET.
- Đừng viết `authorId: session?.user?.id || null` — đó là cho phép khách vô danh ghi dữ liệu.
- **Chống IDOR**: khi thao tác trên tài nguyên theo `id`, kiểm tra quyền sở hữu (`existing.authorId === user.id`) hoặc admin. Không bao giờ lấy `authorId`/`userId`/`role`/`status` từ body — luôn lấy từ session hoặc gán cứng ở server.
- GET công khai chỉ trả dữ liệu đã duyệt (`status = 'APPROVED'`, review `PUBLISHED`), trừ khi người gọi là chủ sở hữu hoặc admin.

**2. Validate input**
- Parse body/query/params bằng zod. Không spread `req.json()` thẳng vào `db.insert/update`.
- Giới hạn độ dài chuỗi, khoảng số (rating 1–5, lat −90..90, lng −180..180), enum cho `category`/`status`/`targetType`.
- Schema dùng chung với form phía client đặt ở `src/lib/validations/<domain>.ts` để client và server cùng một luật.
- Update một phần: dùng `schema.partial()` và chỉ map các field cho phép (whitelist), không nhận field lạ.

**3. Dữ liệu trả về**
- Bảng `user` có cột `password`. **Không** dùng `with: { author: true }` hay `db.query.users.findMany()` không có `columns` — sẽ gửi password hash xuống trình duyệt. Viết:
  ```ts
  with: { author: { columns: { id: true, name: true, image: true } } }
  db.query.users.findMany({ columns: { id: true, name: true, email: true, image: true, role: true, createdAt: true } })
  ```
- `email` của người khác chỉ trả cho admin. Review ẩn danh (`isAnonymous`) không trả tên/ảnh/ID tác giả.
- Danh sách có thể dài (users, locations, reviews ở admin) → thêm phân trang (`limit` + `offset` hoặc cursor), giới hạn `limit` tối đa.

**4. Lỗi**
- Mọi handler bọc `try/catch` và trả qua `handleRouteError`. Không trả `error.message`, `stack`, `String(error)` ra client; không `console.log` nguyên request body.
- Mã trạng thái: 400 input sai · 401 chưa đăng nhập · 403 sai quyền · 404 không có · 409 trùng · 201 tạo mới.

**5. Sau khi ghi dữ liệu**
- Nếu trang server component hiển thị dữ liệu này, gọi `revalidatePath(...)` tương ứng.

## Trường hợp đặc biệt

### Upload file (`/api/upload`)
- `requireUser()` trước tiên.
- Whitelist MIME: `image/jpeg`, `image/png`, `image/webp`, `image/avif`. **Không** cho `image/svg+xml` (SVG chứa được script).
- Giới hạn kích thước (vd. 5 MB) bằng `file.size` trước khi đọc buffer.
- Tự sinh tên file: `${crypto.randomUUID()}.${extTừMime}` — không dùng `file.name` (nguy cơ path traversal khi ghi đĩa local).
- Production dùng Vercel Blob (`BLOB_READ_WRITE_TOKEN`); nhánh ghi `public/uploads` chỉ dành cho dev.

### Chatbot (`/api/chat`, AI SDK v6 + Gemini)
- Mỗi request tốn tiền thật → tối thiểu `requireUser()`; giới hạn số message và độ dài nội dung bằng zod.
- Chưa có hạ tầng rate limit (không có Redis/Upstash). Nếu cần, đề xuất với người dùng trước khi thêm dịch vụ ngoài.
- Không log body, không trả stack trace.

### Response dạng `Location`
Type `Location` hiện nằm trong `src/constants/mock-data.ts` và nhiều route lặp lại đoạn map DB → `Location`. Khi sửa các route này, ưu tiên gom về một hàm map dùng chung thay vì sao chép thêm; không bịa số liệu (rating mặc định 5.0, `distance: 'Local'`) cho dữ liệu mới.

## Xong rồi thì

Chạy skill `verify` (tsc + eslint + `security-scan.mjs` trên file đã sửa), và thử bằng `curl` cả trường hợp chưa đăng nhập → 401, sai quyền → 403, input sai → 400.
