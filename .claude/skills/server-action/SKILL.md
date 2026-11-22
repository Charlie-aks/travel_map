---
name: server-action
description: Cách viết và sửa Server Action ("use server") an toàn trong project Phan Thiet Travel Map (Next.js 16) — tự kiểm tra đăng nhập/quyền ADMIN bên trong từng action, validate tham số bằng zod, chỉ trả dữ liệu UI cần, revalidatePath, gọi action từ client component. Dùng skill này mỗi khi tạo hoặc sửa file có "use server", sửa src/lib/actions/*, thêm nút duyệt/xoá/ẩn trong trang admin, dùng form action hoặc useActionState, hoặc khi người dùng nói "server action", "action", "mutation", "duyệt địa điểm", "xoá review" — kể cả khi trang đó đã được bảo vệ bằng layout.
---

# Server Action

Server Action trông như một hàm gọi nội bộ, nhưng Next.js biến mỗi hàm export trong file `"use server"` thành **một endpoint POST công khai**. Tài liệu Next 16 (`01-app/02-guides/data-security.md`) nói rõ: kiểm tra quyền ở page/layout **không** áp dụng cho action — action là một lối vào riêng và phải tự xác minh người gọi.

Đây chính là lỗ hổng project từng có: `src/lib/actions/admin.ts` có `approveLocationAction`, `deleteLocationAction`, `deleteReviewAction`... không kiểm tra quyền, trong khi chỉ `src/app/admin/layout.tsx` redirect người không phải admin. Ai có action ID đều xoá được dữ liệu.

## Quy tắc

1. **Mỗi action export tự gọi `requireAdmin()` hoặc `requireUser()`** ở dòng đầu tiên. Helper nằm ở `src/lib/auth-guard.ts`; nếu chưa có, tạo theo mẫu trong `.claude/skills/api-route/SKILL.md` (mục "Helper dùng chung"). `requireAdmin()` đọc role từ DB nên admin bị hạ quyền mất quyền ngay.
2. **Coi tham số là input không tin cậy.** Kể cả khi kiểu TypeScript là `string`, client có thể gửi bất cứ thứ gì. Parse bằng zod.
3. **Phân quyền theo tài nguyên** (chống IDOR) khi action dành cho user thường: kiểm tra `authorId === user.id` trước khi sửa/xoá.
4. **Không nhận trạng thái hiện tại từ client để quyết định.** Ví dụ `toggleReviewStatusAction(id, currentStatus)` tin `currentStatus` do client gửi — hãy đọc trạng thái từ DB rồi đảo.
5. **Chỉ trả cái UI cần.** Giá trị trả về được serialize gửi xuống client. Trả `{ success: true }` hoặc `{ error: string }`, không trả nguyên bản ghi DB (nhất là bản ghi có join user).
6. **Lỗi không lộ chi tiết.** Log ở server, trả thông báo chung. Lỗi phân quyền trả thông báo rõ ràng (`"Forbidden"`) để UI hiển thị.
7. **Revalidate** các đường dẫn hiển thị dữ liệu vừa đổi (`/admin/...`, `/`, `/locations/[id]`...).
8. Không định nghĩa action inline trong component nếu nó đóng (closure) qua dữ liệu nhạy cảm — biến bị đóng sẽ được mã hoá gửi qua client. Đặt action trong `src/lib/actions/<domain>.ts`.

## Mẫu

```ts
// src/lib/actions/admin.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { AuthError, requireAdmin } from "@/lib/auth-guard";

type ActionResult = { success: true } | { error: string };

const idSchema = z.string().min(1).max(100);

/** Gom xử lý lỗi để mọi action trả cùng một dạng. */
function toActionError(error: unknown, context: string): ActionResult {
  if (error instanceof AuthError) return { error: error.message };
  if (error instanceof z.ZodError) return { error: "Invalid input" };
  console.error(`[${context}]`, error);
  return { error: "Something went wrong" };
}

export async function toggleReviewStatusAction(rawId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = idSchema.parse(rawId);

    // Đọc trạng thái thật từ DB thay vì tin tham số client gửi lên
    const [review] = await db
      .select({ status: reviews.status })
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);
    if (!review) return { error: "Review not found" };

    const next = review.status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED";
    await db.update(reviews).set({ status: next }).where(eq(reviews.id, id));

    revalidatePath("/admin/reports");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return toActionError(error, "toggleReviewStatusAction");
  }
}
```

**Trong repo đã có** `toActionError` và type `ActionResult` ở `src/lib/action-error.ts` (file thường, **không** có `"use server"` — mọi hàm export trong file `"use server"` đều thành endpoint, kể cả helper). Import từ đó thay vì định nghĩa lại như mẫu trên. Xem `src/lib/actions/admin.ts` làm ví dụ thật. Tài khoản `DEMO` bị `requireAdmin()`/`requireWriter()` từ chối với `code: "DEMO_READ_ONLY"` — UI admin hiển thị qua `actionErrorMessage(result.code)`.

## Gọi từ client component

```tsx
"use client";
import { useTransition } from "react";
import { toggleReviewStatusAction } from "@/lib/actions/admin";

export function ToggleButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await toggleReviewStatusAction(id);
          if ("error" in result) alert(result.error); // hoặc toast của project
        })
      }
    >
      {pending ? "..." : "Ẩn/Hiện"}
    </button>
  );
}
```

Luôn xử lý nhánh `error` — action trả lỗi chứ không throw, nên bỏ qua kết quả nghĩa là UI im lặng khi thất bại. Chuỗi hiển thị cho người dùng lấy từ i18n (`src/i18n/locales/vi.ts` + `en.ts`).

## Chọn Server Action hay API Route?

- **Server Action**: mutation gọi từ UI của chính app (form, nút admin). Có sẵn bảo vệ CSRF (so Origin/Host).
- **API Route**: cần gọi từ ngoài app, cần GET có cache, upload file, streaming (chatbot), hoặc client đang dùng `fetch` qua Zustand store (phần lớn code user-facing hiện tại). Xem skill `api-route`.

Không cần chuyển đổi qua lại hàng loạt; theo cách mà khu vực code đó đang dùng.

## Xong rồi thì

Chạy skill `verify`. `security-scan.mjs` sẽ báo `server-action-missing-auth` nếu còn action nào thiếu kiểm tra quyền.
