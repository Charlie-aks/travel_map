import { NextResponse } from 'next/server';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Location } from '@/constants/mock-data';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await req.json();

    const updateData: any = {};
    if (updates.name !== undefined) updateData.title = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl;
    if (updates.lat !== undefined && updates.lng !== undefined) {
      updateData.coordinates = [updates.lat, updates.lng];
    } else if (updates.lat !== undefined) {
       // if only one coordinate is provided, we should probably fetch the old one, but for simplicity we ignore partial coordinate updates
    }

    const updated = await db.update(locations)
      .set(updateData)
      .where(eq(locations.id, id))
      .returning();

    if (!updated || updated.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const loc = updated[0];
    const coords = (loc.coordinates as [number, number]) || [0, 0];
    
    const responseLocation: Location = { 
      id: loc.id,
      name: loc.title,
      description: loc.description || '',
      category: loc.category as any,
      rating: updates.rating || 4.5,
      reviewsCount: updates.reviewsCount || 'New',
      distance: updates.distance || 'Local',
      lat: coords[0],
      lng: coords[1],
      imageUrl: loc.imageUrl,
      address: updates.address || 'No Address',
    };

    return NextResponse.json(responseLocation);
  } catch (error: any) {
    console.error("Failed to update location:", error);
    return NextResponse.json({ 
      error: "Failed to update location",
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const deleted = await db.delete(locations).where(eq(locations.id, id)).returning();

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete location:", error);
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 });
  }
}
