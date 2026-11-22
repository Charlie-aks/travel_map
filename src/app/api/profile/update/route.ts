import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireWriter } from "@/lib/auth-guard";
import { handleRouteError } from "@/lib/route-error";

const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export async function PUT(req: Request) {
  try {
    // requireWriter: tài khoản DEMO dùng chung nên không được đổi tên
    const user = await requireWriter();
    const { name } = updateProfileSchema.parse(await req.json());

    await db.update(users).set({ name }).where(eq(users.id, user.id));

    return NextResponse.json({ success: true, name });
  } catch (error) {
    return handleRouteError(error, "PUT /api/profile/update");
  }
}
