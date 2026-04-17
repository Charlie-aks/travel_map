import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized. Please log in to post a review." }, { status: 401 });
    }

    const { locationId, rating, content, isAnonymous } = await req.json();

    if (!locationId || !rating) {
      return NextResponse.json({ error: "Missing required fields: locationId and rating." }, { status: 400 });
    }

    const newReview = await db.insert(reviews).values({
      locationId,
      authorId: session.user.id,
      rating: Math.round(rating),
      content: content || "",
      isAnonymous: isAnonymous || false,
      status: "PUBLISHED", // Default to published as discussed
    }).returning();

    // Revalidate paths to show new review
    revalidatePath("/");
    revalidatePath(`/admin/reports`);

    return NextResponse.json(newReview[0]);
  } catch (error: any) {
    console.error("Failed to post review:", error);
    return NextResponse.json({ error: "Failed to post review", details: error.message }, { status: 500 });
  }
}
