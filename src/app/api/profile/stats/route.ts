import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { reviews, locations, savedLocations } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { handleRouteError } from "@/lib/route-error";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Count Reviews
    const [reviewCountResult] = await db
      .select({ value: count() })
      .from(reviews)
      .where(eq(reviews.authorId, userId));

    // Count Locations Added
    const [locationCountResult] = await db
      .select({ value: count() })
      .from(locations)
      .where(eq(locations.authorId, userId));

    // Count Saved Locations (Bonus, although not requested specifically, it's good to have)
    const [savedCountResult] = await db
      .select({ value: count() })
      .from(savedLocations)
      .where(eq(savedLocations.userId, userId));

    return NextResponse.json({
      reviews: reviewCountResult.value,
      spots: locationCountResult.value,
      saved: savedCountResult.value,
    });
  } catch (error) {
    return handleRouteError(error, "GET /api/profile/stats");
  }
}
