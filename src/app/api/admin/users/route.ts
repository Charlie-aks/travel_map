import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    // Auth check: Only admins can view user list
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const allUsers = await db.query.users.findMany({
      where: role && role !== "ALL" ? eq(users.role, role) : undefined,
      orderBy: [desc(users.createdAt)],
    });

    return NextResponse.json(allUsers);
  } catch (error: any) {
    console.error("Failed to fetch admin users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
