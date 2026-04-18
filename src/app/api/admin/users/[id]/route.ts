import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    // Must be admin
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Prevent self-deletion
    if (session.user.id === id) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    await db.delete(users).where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const { role } = await req.json();

    // Must be admin
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Optional: Prevent self-role-change if you want to ensure at least one admin exists
    // (Though simple check might not be enough for full safety)
    if (session.user.id === id && role !== "ADMIN") {
      return NextResponse.json({ error: "You cannot demote yourself." }, { status: 400 });
    }

    await db.update(users)
      .set({ role })
      .where(eq(users.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to update user role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
