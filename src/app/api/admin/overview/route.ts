import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, locations, reviews, savedLocations, reports } from "@/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";

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
    const [pendingReportsCount] = await db.select({ value: count() }).from(reports).where(eq(reports.status, "PENDING"));

    // 2. Fetch Recent Activities
    const recentReviews = await db.query.reviews.findMany({
      limit: 5,
      orderBy: [desc(reviews.createdAt)],
      with: { author: true, location: true },
    });

    const recentLocations = await db.query.locations.findMany({
      limit: 5,
      orderBy: [desc(locations.createdAt)],
      with: { author: true },
    });

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

    // 3. Contribution Heatmap (Group locations by category)
    const categoryStats = await db.select({
      category: locations.category,
      count: count()
    }).from(locations).groupBy(locations.category);
    
    // 4. Visitor Trends (Group locations/reviews creation by month/day - simplified as daily location+review creation)
    // For a real app, this would query a pageview log. We'll use creation dates here.
    const trends = await db.execute(sql`
      WITH dates AS (
        SELECT generate_series(
          current_date - interval '6 days',
          current_date,
          '1 day'::interval
        )::date as date
      ),
      locs AS (
        SELECT date_trunc('day', "createdAt")::date as date, count(*) as count
        FROM "location"
        WHERE "createdAt" >= current_date - interval '6 days'
        GROUP BY 1
      ),
      revs AS (
        SELECT date_trunc('day', "createdAt")::date as date, count(*) as count
        FROM "review"
        WHERE "createdAt" >= current_date - interval '6 days'
        GROUP BY 1
      )
      SELECT 
        to_char(dates.date, 'Mon DD') as name,
        COALESCE(locs.count, 0) as locations,
        COALESCE(revs.count, 0) as reviews
      FROM dates
      LEFT JOIN locs ON dates.date = locs.date
      LEFT JOIN revs ON dates.date = revs.date
      ORDER BY dates.date
    `);

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers.value,
        totalLocations: totalLocations.value,
        totalSaves: totalSaves.value,
        pendingReports: pendingLocationsCount.value + pendingReportsCount.value
      },
      activities,
      heatmap: categoryStats,
      trends: trends.rows
    });
  } catch (error) {
    console.error("Failed to fetch admin overview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
