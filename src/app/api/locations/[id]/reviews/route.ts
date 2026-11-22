import { NextResponse } from 'next/server';
import { db } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { locations, reviews } from '@/db/schema';
import { handleRouteError } from '@/lib/route-error';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;

    // Chỉ trả review của địa điểm đã duyệt (đồng bộ với GET /api/locations/[id])
    const [loc] = await db
      .select({ status: locations.status })
      .from(locations)
      .where(eq(locations.id, resolvedParams.id))
      .limit(1);
    if (!loc || loc.status !== 'APPROVED') return NextResponse.json([]);

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
