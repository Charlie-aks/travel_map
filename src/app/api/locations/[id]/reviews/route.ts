import { NextResponse } from 'next/server';
import { db } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { reviews } from '@/db/schema';
import { handleRouteError } from '@/lib/route-error';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const locationReviews = await db.query.reviews.findMany({
      where: (reviews, { eq, and }) => and(
        eq(reviews.locationId, resolvedParams.id),
        eq(reviews.status, 'PUBLISHED')
      ),
      with: {
        author: { columns: { name: true, image: true } }
      },
      orderBy: [desc(reviews.createdAt)]
    });

    // Map to UI mocked format
    const mappedReviews = locationReviews.map(r => ({
      id: r.id,
      userName: r.isAnonymous ? "Người dùng ẩn danh" : (r.author?.name || "Khách du lịch"),
      rating: r.rating,
      comment: r.content || "",
      date: r.createdAt?.toISOString() || new Date().toISOString(),
      avatarUrl: r.isAnonymous ? undefined : (r.author?.image || undefined)
    }));

    return NextResponse.json(mappedReviews);
  } catch (error) {
    return handleRouteError(error, "GET /api/locations/[id]/reviews");
  }
}
