import { z } from "zod";
import { AuthError, type AuthErrorCode } from "@/lib/auth-guard";

export type ActionResult =
  | { success: true }
  | { error: string; code?: AuthErrorCode | "INVALID_INPUT" | "NOT_FOUND" | "INTERNAL" };

/**
 * Chuẩn hoá lỗi cho server action. File này KHÔNG có "use server":
 * mọi hàm export trong file "use server" đều trở thành endpoint công khai.
 */
export function toActionError(error: unknown, context: string): ActionResult {
  if (error instanceof AuthError) return { error: error.message, code: error.code };
  if (error instanceof z.ZodError) return { error: "Invalid input", code: "INVALID_INPUT" };
  console.error(`[${context}]`, error);
  return { error: "Something went wrong", code: "INTERNAL" };
}
