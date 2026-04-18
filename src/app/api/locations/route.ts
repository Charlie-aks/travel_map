import { NextResponse } from 'next/server';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { Location } from '@/constants/mock-data';
import { auth } from '@/auth';

import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allLocations = await db.query.locations.findMany({
      where: eq(locations.status, 'APPROVED'),
      with: {
        reviews: {
          where: (reviews, { eq }) => eq(reviews.status, 'PUBLISHED'),
          with: {
            author: true
          }
        }
      }
    });
    
    // Map DB schema to UI expected mock-data schema to prevent breaking changes
    const mappedLocations = allLocations.map(loc => {
      const coords = (loc.coordinates as [number, number]) || [0, 0];
      
      // Calculate real rating and reviewsCount
      const reviewList = loc.reviews || [];
      const rating = reviewList.length > 0 
        ? Number((reviewList.reduce((acc, r) => acc + r.rating, 0) / reviewList.length).toFixed(1))
        : 5.0; // Default rating if no reviews
      
      const reviewsCount = reviewList.length > 0 ? `${reviewList.length}` : 'New';

      return {
        id: loc.id,
        name: loc.title,
        description: loc.description || '',
        category: loc.category as any,
        rating,
        reviewsCount,
        distance: 'Local',
        lat: coords[0] || 0,
        lng: coords[1] || 0,
        imageUrl: loc.imageUrl,
        address: 'No Address',
        reviews: reviewList.map(r => ({
          id: r.id,
          userName: r.isAnonymous ? "Người dùng ẩn danh" : (r.author?.name || "Khách du lịch"),
          rating: r.rating,
          comment: r.content || "",
          date: r.createdAt?.toISOString() || new Date().toISOString(),
          avatarUrl: r.isAnonymous ? undefined : (r.author?.image || undefined)
        }))
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
