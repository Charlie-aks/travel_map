import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, locations, reviews, savedLocations } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 1. Fetch Stats
    const [totalUsers] = await db.select({ value: count() }).from(users);
    const [totalLocations] = await db.select({ value: count() }).from(locations).where(eq(locations.status, "APPROVED"));
    const [totalSaves] = await db.select({ value: count() }).from(savedLocations);
    const [pendingLocationsCount] = await db.select({ value: count() }).from(locations).where(eq(locations.status, "PENDING"));

    // 2. Fetch Recent Activities
    // Latest reviews
    const recentReviews = await db.query.reviews.findMany({
      limit: 5,
      orderBy: [desc(reviews.createdAt)],
      with: {
        author: true,
        location: true,
      },
    });

    // Latest locations
    const recentLocations = await db.query.locations.findMany({
      limit: 5,
      orderBy: [desc(locations.createdAt)],
      with: {
        author: true,
      },
    });

    // Combine and format activities
    const activities = [
      ...recentReviews.map(r => ({
        id: `review-${r.id}`,
        type: 'REVIEW',
        userName: r.author?.name || "Người dùng",
        userImage: r.author?.image,
        targetName: r.location?.title || "Địa điểm",
        time: r.createdAt,
        rating: r.rating
      })),
      ...recentLocations.map(l => ({
        id: `location-${l.id}`,
        type: 'LOCATION',
        userName: l.author?.name || "Người dùng",
        userImage: l.author?.image,
        targetName: l.title,
        time: l.createdAt
      }))
    ].sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime())
    .slice(0, 5);

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers.value,
        totalLocations: totalLocations.value,
        totalSaves: totalSaves.value,
        pendingReports: pendingLocationsCount.value
      },
      activities
    });
  } catch (error) {
    console.error("Failed to fetch admin overview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
