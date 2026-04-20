import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const filters = [];
    if (category && category !== "ALL") {
      filters.push(eq(locations.category, category));
    }
    if (status && status !== "ALL") {
      filters.push(eq(locations.status, status));
    }

    const whereClause = filters.length > 0 
      ? (filters.length === 1 ? filters[0] : and(...filters)) 
      : undefined;

    const allLocations = await db.query.locations.findMany({
      where: whereClause,
      with: {
        author: true,
      },
      orderBy: [desc(locations.createdAt)],
    });

    return NextResponse.json(allLocations);
  } catch (error: any) {
    console.error("Failed to fetch admin locations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
