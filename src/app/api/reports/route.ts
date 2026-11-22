import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { locations, reports, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireWriter } from "@/lib/auth-guard";
import { handleRouteError } from "@/lib/route-error";

const createReportSchema = z.object({
  targetId: z.string().min(1).max(100),
  targetType: z.enum(["REVIEW", "LOCATION"]),
  reason: z.string().trim().min(1).max(1000),
});

export async function POST(req: Request) {
  try {
    const user = await requireWriter();
    const input = createReportSchema.parse(await req.json());

    // Đối tượng bị báo cáo phải tồn tại — tránh rác trong hàng chờ kiểm duyệt
    const target =
      input.targetType === "REVIEW"
        ? await db.select({ id: reviews.id }).from(reviews).where(eq(reviews.id, input.targetId)).limit(1)
        : await db.select({ id: locations.id }).from(locations).where(eq(locations.id, input.targetId)).limit(1);
    if (target.length === 0) {
      return NextResponse.json({ error: "Target not found", code: "NOT_FOUND" }, { status: 404 });
    }

    await db.insert(reports).values({
      reporterId: user.id,
      targetId: input.targetId,
      targetType: input.targetType,
      reason: input.reason,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "POST /api/reports");
  }
}
