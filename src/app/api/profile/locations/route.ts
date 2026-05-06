import { NextResponse } from 'next/server';
import { db } from '@/db';
import { locations, reviews } from '@/db/schema';
import { auth } from '@/auth';
import { eq, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const results = await db.select({
      id: locations.id,
      name: locations.title,
      description: locations.description,
      category: locations.category,
      coordinates: locations.coordinates,
      imageUrl: locations.imageUrl,
      address: locations.address,
      bestTiming: locations.bestTiming,
      price: locations.price,
      contact: locations.contact,
      status: locations.status,
      avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      reviewsCount: sql<number>`COUNT(${reviews.id})`
    })
    .from(locations)
    .leftJoin(
      reviews,
      sql`${locations.id} = ${reviews.locationId} AND ${reviews.status} = 'PUBLISHED'`
    )
    .where(eq(locations.authorId, userId))
    .groupBy(locations.id);
    
    // Map DB schema to UI expected mock-data schema
    const mappedLocations = results.map(loc => {
      const coords = (loc.coordinates as [number, number]) || [0, 0];
      
      const rating = Number(loc.avgRating).toFixed(1);
      const reviewsCountStr = Number(loc.reviewsCount) > 0 ? `${loc.reviewsCount}` : 'New';

      return {
        id: loc.id,
        name: loc.name,
        description: loc.description || '',
        category: loc.category as any,
        rating: Number(rating),
        reviewsCount: reviewsCountStr,
        distance: 'Local',
        lat: coords[0] || 0,
        lng: coords[1] || 0,
        imageUrl: loc.imageUrl,
        address: loc.address || 'No Address',
        bestTiming: loc.bestTiming || '',
        price: loc.price || '',
        contact: loc.contact || '',
        reviews: [],
        status: (loc.status as any) || 'PENDING'
      };
    });

    return NextResponse.json(mappedLocations);
  } catch (error) {
    console.error("Failed to fetch profile locations:", error);
    return NextResponse.json({ error: "Failed to fetch profile locations" }, { status: 500 });
  }
}
