import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { locations, reviews } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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

    const [created] = await db
      .insert(reviews)
      .values({
        locationId: input.locationId,
        authorId: user.id,
        rating: input.rating,
        content: input.content ?? "",
        isAnonymous: input.isAnonymous ?? false,
        status: "PUBLISHED",
      })
      .returning({
        id: reviews.id,
        locationId: reviews.locationId,
        rating: reviews.rating,
        content: reviews.content,
        isAnonymous: reviews.isAnonymous,
        createdAt: reviews.createdAt,
      });

    revalidatePath("/");
    revalidatePath("/admin/reports");

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "POST /api/reviews");
  }
}
