import { NextResponse } from 'next/server';
import { db } from '@/db';
import { locations, reviews } from '@/db/schema';
import { Location } from '@/constants/mock-data';
import { requireWriter } from '@/lib/auth-guard';
import { handleRouteError } from '@/lib/route-error';
import { createLocationSchema } from '@/lib/validations/location';

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
      address: locations.address,
      bestTiming: locations.bestTiming,
      price: locations.price,
      contact: locations.contact,
      status: locations.status,
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
        category: loc.category as Location['category'],
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
        status: loc.status || 'APPROVED',
        reviews: [] // Empty by default, fetched lazily in Detail View
      };
    });

    return NextResponse.json(mappedLocations);
  } catch (error) {
    return handleRouteError(error, "GET /api/locations");
  }
}

/** Đóng góp địa điểm mới. Luôn vào trạng thái PENDING, chờ admin duyệt. */
export async function POST(req: Request) {
  try {
    const user = await requireWriter();
    const input = createLocationSchema.parse(await req.json());

    const [loc] = await db.insert(locations).values({
      title: input.name,
      coordinates: [input.lat, input.lng],
      description: input.description ?? '',
      imageUrl: input.imageUrl,
      category: input.category,
      address: input.address ?? '',
      bestTiming: input.bestTiming ?? '',
      price: input.price ?? '',
      contact: input.contact ?? '',
      authorId: user.id,   // luôn lấy từ session, không nhận từ body
      status: 'PENDING',   // luôn PENDING, không nhận từ body
    }).returning();

    const coords = loc.coordinates as [number, number];
    const responseLocation: Location = {
      id: loc.id,
      name: loc.title,
      description: loc.description || '',
      category: loc.category as Location['category'],
      rating: 0,
      reviewsCount: 'New',
      distance: 'Local',
      lat: coords[0],
      lng: coords[1],
      imageUrl: loc.imageUrl,
      address: loc.address || '',
      bestTiming: loc.bestTiming || '',
      price: loc.price || '',
      contact: loc.contact || '',
      status: 'PENDING',
    };

    return NextResponse.json(responseLocation, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "POST /api/locations");
  }
}
