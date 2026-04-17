"use server";

import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function approveLocationAction(id: string) {
  try {
    await db.update(locations).set({ status: 'APPROVED' }).where(eq(locations.id, id));
    revalidatePath("/admin/locations");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error approving location:", error);
    return { error: "Failed to approve location" };
  }
}

export async function deleteLocationAction(id: string) {
  try {
    await db.delete(locations).where(eq(locations.id, id));
    revalidatePath("/admin/locations");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting location:", error);
    return { error: "Failed to delete location" };
  }
}
