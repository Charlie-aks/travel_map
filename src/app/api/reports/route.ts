import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { reports } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetId, targetType, reason } = await req.json();

    if (!targetId || !targetType || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(reports).values({
      reporterId: session.user.id,
      targetId,
      targetType,
      reason,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error submitting report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
