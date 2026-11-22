import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, locations } from "@/db/schema";
import { ilike, or } from "drizzle-orm";
import { requireAdminViewer } from "@/lib/auth-guard";
import { handleRouteError } from "@/lib/route-error";
import { maskEmail } from "@/lib/privacy";

export async function GET(req: Request) {
  try {
    const viewer = await requireAdminViewer();
    const isDemo = viewer.role === "DEMO";

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2 || query.length > 100) {
      return NextResponse.json({ results: [] });
    }

    const foundLocations = await db.query.locations.findMany({
      columns: { id: true, title: true, category: true, imageUrl: true },
      where: ilike(locations.title, `%${query}%`),
      limit: 5,
    });

    // Tài khoản DEMO chỉ tìm theo tên — tìm theo email sẽ cho phép dò email người dùng thật.
    const foundUsers = await db.query.users.findMany({
      columns: { id: true, name: true, email: true, image: true },
      where: isDemo
        ? ilike(users.name, `%${query}%`)
        : or(ilike(users.name, `%${query}%`), ilike(users.email, `%${query}%`)),
      limit: 5,
    });

    const results = [
      ...foundLocations.map((l) => ({
        id: l.id,
        title: l.title,
        type: "LOCATION",
        subtitle: l.category,
        image: l.imageUrl,
        href: `/admin/locations?search=${encodeURIComponent(l.title)}`,
      })),
      ...foundUsers.map((u) => ({
        id: u.id,
        title: u.name || "Unknown User",
        type: "USER",
        subtitle: isDemo ? maskEmail(u.email) : u.email,
        image: u.image,
        href: `/admin/users?search=${encodeURIComponent((isDemo ? u.name : u.email) || "")}`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    return handleRouteError(error, "GET /api/admin/search");
  }
}
