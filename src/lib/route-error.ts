import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthError } from "@/lib/auth-guard";

/** Chuyển mọi lỗi thành response an toàn. Chi tiết lỗi chỉ ghi log ở server. */
export function handleRouteError(error: unknown, context: string) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  }
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Invalid input", code: "INVALID_INPUT", fields: z.flattenError(error).fieldErrors },
      { status: 400 },
    );
  }
  if (error instanceof SyntaxError) {
    // req.json() với body không phải JSON hợp lệ
    return NextResponse.json({ error: "Invalid JSON body", code: "INVALID_INPUT" }, { status: 400 });
  }
  console.error(`[${context}]`, error);
  return NextResponse.json({ error: "Internal Server Error", code: "INTERNAL" }, { status: 500 });
}
