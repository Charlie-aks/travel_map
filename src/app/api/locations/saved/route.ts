import { NextResponse } from 'next/server';
import { db } from '@/db';
import { savedLocations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await db
      .select({ locationId: savedLocations.locationId })
      .from(savedLocations)
      .where(eq(savedLocations.userId, session.user.id));

    const savedIds = saved.map(s => s.locationId);
    return NextResponse.json(savedIds);
  } catch (error: any) {
    console.error("Error fetching saved locations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { locationId } = await req.json();
    if (!locationId) {
      return NextResponse.json({ error: "Location ID is required" }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if already saved
    const existing = await db
      .select()
      .from(savedLocations)
      .where(and(
        eq(savedLocations.userId, userId),
        eq(savedLocations.locationId, locationId)
      ))
      .limit(1);

    if (existing.length > 0) {
      // Unsave
      await db
        .delete(savedLocations)
        .where(and(
          eq(savedLocations.userId, userId),
          eq(savedLocations.locationId, locationId)
        ));
      return NextResponse.json({ saved: false });
    } else {
      // Save
      await db
        .insert(savedLocations)
        .values({
          userId,
          locationId
        });
      return NextResponse.json({ saved: true });
    }
  } catch (error: any) {
    console.error("Error toggling saved location:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
