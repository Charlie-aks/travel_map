import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth-guard";
import { handleRouteError } from "@/lib/route-error";

type Ctx = { params: Promise<{ id: string }> };

const idSchema = z.string().min(1).max(100);
// DEMO không gán được qua API — tài khoản demo được thiết lập riêng.
const patchSchema = z.object({ role: z.enum(["USER", "ADMIN"]) });

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const admin = await requireAdmin();
    const id = idSchema.parse((await params).id);

    if (admin.id === id) {
      return NextResponse.json(
        { error: "You cannot delete your own account.", code: "FORBIDDEN" },
        { status: 400 },
      );
    }

    const deleted = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    if (deleted.length === 0) {
      return NextResponse.json({ error: "User not found", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, "DELETE /api/admin/users/[id]");
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const admin = await requireAdmin();
    const id = idSchema.parse((await params).id);
    const { role } = patchSchema.parse(await req.json());

    if (admin.id === id && role !== "ADMIN") {
      return NextResponse.json(
        { error: "You cannot demote yourself.", code: "FORBIDDEN" },
        { status: 400 },
      );
    }

    const updated = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning({ id: users.id });
    if (updated.length === 0) {
      return NextResponse.json({ error: "User not found", code: "NOT_FOUND" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, "PATCH /api/admin/users/[id]");
  }
}
