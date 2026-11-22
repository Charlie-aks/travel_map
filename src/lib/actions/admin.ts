"use server";

import { z } from "zod";
import { db } from "@/db";
import { locations, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { toActionError, type ActionResult } from "@/lib/action-error";

// Mỗi hàm export trong file này là một endpoint POST công khai:
// layout /admin KHÔNG bảo vệ chúng, nên mỗi action tự gọi requireAdmin().

const idSchema = z.string().min(1).max(100);
const EDIT_REQUEST_PREFIX = "[Yêu cầu sửa] ";

export async function approveLocationAction(rawId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = idSchema.parse(rawId);

    const [loc] = await db
      .select({ title: locations.title })
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1);
    if (!loc) return { error: "Location not found", code: "NOT_FOUND" };

    const title = loc.title.startsWith(EDIT_REQUEST_PREFIX)
      ? loc.title.slice(EDIT_REQUEST_PREFIX.length)
      : loc.title;
    await db.update(locations).set({ status: "APPROVED", title }).where(eq(locations.id, id));

    revalidatePath("/admin/locations");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return toActionError(error, "approveLocationAction");
  }
}

export async function deleteLocationAction(rawId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = idSchema.parse(rawId);

    const deleted = await db
      .delete(locations)
      .where(eq(locations.id, id))
      .returning({ id: locations.id });
    if (deleted.length === 0) return { error: "Location not found", code: "NOT_FOUND" };

    revalidatePath("/admin/locations");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return toActionError(error, "deleteLocationAction");
  }
}

/** Đảo trạng thái PUBLISHED ⇄ HIDDEN. Trạng thái hiện tại đọc từ DB, không nhận từ client. */
export async function toggleReviewStatusAction(rawId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = idSchema.parse(rawId);

    const [review] = await db
      .select({ status: reviews.status })
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);
    if (!review) return { error: "Review not found", code: "NOT_FOUND" };

    const nextStatus = review.status === "HIDDEN" ? "PUBLISHED" : "HIDDEN";
    await db.update(reviews).set({ status: nextStatus }).where(eq(reviews.id, id));

    revalidatePath("/admin/reports");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return toActionError(error, "toggleReviewStatusAction");
  }
}

export async function deleteReviewAction(rawId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = idSchema.parse(rawId);

    const deleted = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning({ id: reviews.id });
    if (deleted.length === 0) return { error: "Review not found", code: "NOT_FOUND" };

    revalidatePath("/admin/reports");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return toActionError(error, "deleteReviewAction");
  }
}
