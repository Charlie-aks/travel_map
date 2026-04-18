import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, locations } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Search Locations
    const foundLocations = await db.query.locations.findMany({
      where: ilike(locations.title, `%${query}%`),
      limit: 5,
    });

    // Search Users
    const foundUsers = await db.query.users.findMany({
      where: or(
        ilike(users.name, `%${query}%`),
        ilike(users.email, `%${query}%`)
      ),
      limit: 5,
    });

    // Format results
    const results = [
      ...foundLocations.map(l => ({
        id: l.id,
        title: l.title,
        type: 'LOCATION',
        subtitle: l.category,
        image: l.imageUrl,
        href: `/admin/locations?search=${encodeURIComponent(l.title)}` // Link to locations page with search
      })),
      ...foundUsers.map(u => ({
        id: u.id,
        title: u.name || "Unknown User",
        type: 'USER',
        subtitle: u.email,
        image: u.image,
        href: `/admin/users?search=${encodeURIComponent(u.email || "")}` // Link to users page with search
      }))
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Admin search error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
