import { NextResponse } from 'next/server';
import { db } from '@/db';
import { reviews, locations, users } from '@/db/schema';
import { auth } from '@/auth';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch reviews by the user along with location and author info
    const results = await db.select({
      id: reviews.id,
      locationId: reviews.locationId,
      authorId: reviews.authorId,
      rating: reviews.rating,
      comment: reviews.content,
      date: reviews.createdAt,
      status: reviews.status,
      isAnonymous: reviews.isAnonymous,
      // Location details
      locationName: locations.title,
      bgImage: locations.imageUrl,
      // User details
      userName: users.name,
      userAvatar: users.image,
    })
    .from(reviews)
    .innerJoin(locations, eq(reviews.locationId, locations.id))
    .innerJoin(users, eq(reviews.authorId, users.id))
    .where(eq(reviews.authorId, userId))
    .orderBy(desc(reviews.createdAt));
    
    // Format to match mock-data format
    const formattedReviews = results.map(rev => ({
      id: rev.id,
      locationId: rev.locationId,
      userId: rev.authorId,
      userName: rev.isAnonymous ? "Khách du lịch ẩn danh" : (rev.userName || "User"),
      userAvatar: rev.isAnonymous ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150" : (rev.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"),
      rating: rev.rating,
      comment: rev.comment || '',
      date: rev.date ? rev.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      locationName: rev.locationName,
      bgImage: rev.bgImage,
      status: rev.status,
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error("Failed to fetch profile reviews:", error);
    return NextResponse.json({ error: "Failed to fetch profile reviews" }, { status: 500 });
  }
}
