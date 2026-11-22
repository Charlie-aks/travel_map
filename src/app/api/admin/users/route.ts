import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAdminViewer } from "@/lib/auth-guard";
import { handleRouteError } from "@/lib/route-error";
import { maskEmail } from "@/lib/privacy";

const querySchema = z.object({
  role: z.enum(["ALL", "ADMIN", "USER", "DEMO"]).default("ALL"),
});

export async function GET(req: Request) {
  try {
    const viewer = await requireAdminViewer();
    const { searchParams } = new URL(req.url);
    const { role } = querySchema.parse({ role: searchParams.get("role") ?? undefined });

    const allUsers = await db.query.users.findMany({
      columns: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
      where: role !== "ALL" ? eq(users.role, role) : undefined,
      orderBy: [desc(users.createdAt)],
    });

    // Tài khoản DEMO là công khai → không để lộ email người dùng thật.
    const result =
      viewer.role === "DEMO" ? allUsers.map((u) => ({ ...u, email: maskEmail(u.email) })) : allUsers;

    return NextResponse.json(result);
  } catch (error) {
    return handleRouteError(error, "GET /api/admin/users");
  }
}
