import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Các role trong hệ thống:
 * - USER:  người dùng thường.
 * - ADMIN: quản trị viên, toàn quyền.
 * - DEMO:  tài khoản demo công khai cho nhà tuyển dụng — xem được mọi thứ (kể cả trang admin)
 *          nhưng không được ghi bất kỳ dữ liệu dùng chung nào.
 */
export type AppRole = "USER" | "ADMIN" | "DEMO";

export type AuthErrorCode = "UNAUTHORIZED" | "FORBIDDEN" | "DEMO_READ_ONLY";

export class AuthError extends Error {
  constructor(
    public status: 401 | 403,
    public code: AuthErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

const DEMO_READ_ONLY = () =>
  new AuthError(403, "DEMO_READ_ONLY", "Demo account is read-only");

/**
 * Đọc role hiện tại từ DB.
 * Không tin role trong JWT: JWT giữ role lúc đăng nhập cho tới khi hết hạn,
 * nên người vừa bị hạ quyền vẫn còn quyền nếu chỉ kiểm tra session.
 */
async function loadRole(userId: string): Promise<AppRole | null> {
  const [row] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!row) return null;
  return (row.role as AppRole | null) ?? "USER";
}

/** Bắt buộc đăng nhập. Không truy vấn DB — dùng cho thao tác cá nhân, ít rủi ro. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new AuthError(401, "UNAUTHORIZED", "Unauthorized");
  return session.user;
}

/** Bắt buộc đăng nhập + role đọc từ DB (user đã bị xoá → 401). */
async function requireUserWithRole() {
  const user = await requireUser();
  const role = await loadRole(user.id);
  if (!role) throw new AuthError(401, "UNAUTHORIZED", "Unauthorized");
  return { ...user, role };
}

/** Bắt buộc đăng nhập và được phép ghi dữ liệu dùng chung (chặn tài khoản DEMO). */
export async function requireWriter() {
  const user = await requireUserWithRole();
  if (user.role === "DEMO") throw DEMO_READ_ONLY();
  return user;
}

/** Bắt buộc quyền ADMIN (thao tác ghi trong khu vực quản trị). */
export async function requireAdmin() {
  const user = await requireUserWithRole();
  if (user.role === "DEMO") throw DEMO_READ_ONLY();
  if (user.role !== "ADMIN") throw new AuthError(403, "FORBIDDEN", "Forbidden");
  return user;
}

/** Được xem khu vực quản trị: ADMIN hoặc DEMO (chỉ đọc). */
export async function requireAdminViewer() {
  const user = await requireUserWithRole();
  if (user.role !== "ADMIN" && user.role !== "DEMO") {
    throw new AuthError(403, "FORBIDDEN", "Forbidden");
  }
  return user;
}

/** Như requireAdminViewer nhưng trả null thay vì throw — dùng trong layout/page để redirect. */
export async function getAdminViewer() {
  try {
    return await requireAdminViewer();
  } catch (error) {
    if (error instanceof AuthError) return null;
    throw error;
  }
}
