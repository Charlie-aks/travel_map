import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { requireAdminViewer } from "@/lib/auth-guard";
import { handleRouteError } from "@/lib/route-error";
import { publicUserColumns } from "@/lib/privacy";

const querySchema = z.object({
  category: z.string().max(50).default("ALL"),
  status: z.string().max(20).default("ALL"),
});

export async function GET(req: Request) {
  try {
    await requireAdminViewer();

    const { searchParams } = new URL(req.url);
    const { category, status } = querySchema.parse({
      category: searchParams.get("category") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });

    const filters = [];
    if (category !== "ALL") filters.push(eq(locations.category, category));
    if (status !== "ALL") filters.push(eq(locations.status, status));

    const allLocations = await db.query.locations.findMany({
      where: filters.length > 0 ? and(...filters) : undefined,
      with: { author: { columns: publicUserColumns } },
      orderBy: [desc(locations.createdAt)],
    });

    return NextResponse.json(allLocations);
  } catch (error) {
    return handleRouteError(error, "GET /api/admin/locations");
  }
}
