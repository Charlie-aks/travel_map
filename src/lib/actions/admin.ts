"use server";

import { db } from "@/db";
import { locations, reviews } from "@/db/schema";
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

export async function toggleReviewStatusAction(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED';
    await db.update(reviews).set({ status: newStatus }).where(eq(reviews.id, id));
    revalidatePath("/admin/reports");
    revalidatePath("/"); // in case dashboard or locations use reviews
    return { success: true };
  } catch (error) {
    console.error("Error toggling review status:", error);
    return { error: "Failed to update review status" };
  }
}

export async function deleteReviewAction(id: string) {
  try {
    await db.delete(reviews).where(eq(reviews.id, id));
    revalidatePath("/admin/reports");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { error: "Failed to delete review" };
  }
}
