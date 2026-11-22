import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { locations, reviews } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireWriter } from "@/lib/auth-guard";
import { handleRouteError } from "@/lib/route-error";

const createReviewSchema = z.object({
  locationId: z.string().min(1).max(100),
  rating: z.number().int().min(1).max(5),
  content: z.string().trim().max(2000).optional(),
  isAnonymous: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await requireWriter();
    const input = createReviewSchema.parse(await req.json());

    // Chỉ review được địa điểm đã duyệt
    const [loc] = await db
      .select({ id: locations.id })
      .from(locations)
      .where(and(eq(locations.id, input.locationId), eq(locations.status, "APPROVED")))
      .limit(1);
    if (!loc) {
      return NextResponse.json({ error: "Location not found", code: "NOT_FOUND" }, { status: 404 });
    }

    const returning = {
      id: reviews.id,
      locationId: reviews.locationId,
      rating: reviews.rating,
      content: reviews.content,
      isAnonymous: reviews.isAnonymous,
      createdAt: reviews.createdAt,
    };

    // Mỗi người một review cho mỗi địa điểm: viết lại thì cập nhật review cũ (chống thao túng rating).
    // TODO giai đoạn 1: thêm unique index (locationId, authorId) trong DB để chặn cả race condition.
    const [existing] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(and(eq(reviews.locationId, input.locationId), eq(reviews.authorId, user.id)))
      .orderBy(desc(reviews.createdAt))
      .limit(1);

    let saved;
    if (existing) {
      // Giữ nguyên status: review đã bị admin ẩn thì sửa lại cũng không tự hiện lại
      [saved] = await db
        .update(reviews)
        .set({
          rating: input.rating,
          content: input.content ?? "",
          isAnonymous: input.isAnonymous ?? false,
          createdAt: new Date(),
        })
        .where(eq(reviews.id, existing.id))
        .returning(returning);
    } else {
      [saved] = await db
        .insert(reviews)
        .values({
          locationId: input.locationId,
          authorId: user.id,
          rating: input.rating,
          content: input.content ?? "",
          isAnonymous: input.isAnonymous ?? false,
          status: "PUBLISHED",
        })
        .returning(returning);
    }

    revalidatePath("/");
    revalidatePath("/admin/reports");

    return NextResponse.json({ ...saved, updated: Boolean(existing) }, { status: existing ? 200 : 201 });
  } catch (error) {
    return handleRouteError(error, "POST /api/reviews");
  }
}
