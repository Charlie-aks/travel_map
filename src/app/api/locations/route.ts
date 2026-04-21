import { NextResponse } from 'next/server';
import { db } from '@/db';
import { locations, reviews } from '@/db/schema';
import { Location } from '@/constants/mock-data';
import { auth } from '@/auth';

import { eq, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const results = await db.select({
      id: locations.id,
      name: locations.title,
      description: locations.description,
      category: locations.category,
      coordinates: locations.coordinates,
      imageUrl: locations.imageUrl,
      avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 5.0)`,
      reviewsCount: sql<number>`COUNT(${reviews.id})`
    })
    .from(locations)
    .leftJoin(
      reviews,
      sql`${locations.id} = ${reviews.locationId} AND ${reviews.status} = 'PUBLISHED'`
    )
    .where(eq(locations.status, 'APPROVED'))
    .groupBy(locations.id);
    
    // Map DB schema to UI expected mock-data schema to prevent breaking changes
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
        address: 'No Address',
        reviews: [] // Empty by default, fetched lazily in Detail View
      };
    });

    return NextResponse.json(mappedLocations);
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const data = await req.json();

    // Map UI data back to DB schema
    const newLocationData = {
      title: data.name || 'New Location',
      coordinates: [data.lat || 0, data.lng || 0],
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      category: data.category || 'All',
      authorId: session?.user?.id || null,
      status: 'PENDING',
    };

    const inserted = await db.insert(locations).values(newLocationData).returning();

    if (!inserted || inserted.length === 0) {
      throw new Error("Failed to insert");
    }

    const loc = inserted[0];
    const coords = (loc.coordinates as [number, number]) || [0, 0];
    
    const responseLocation: Location = { 
      id: loc.id,
      name: loc.title,
      description: loc.description || '',
      category: loc.category as any,
      rating: data.rating || 5.0,
      reviewsCount: data.reviewsCount || 'New',
      distance: data.distance || 'Just added',
      lat: coords[0],
      lng: coords[1],
      imageUrl: loc.imageUrl,
      address: data.address || 'No Address',
    };
    
    return NextResponse.json(responseLocation, { status: 201 });
  } catch (error) {
    console.error("Failed to create location:", error);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
