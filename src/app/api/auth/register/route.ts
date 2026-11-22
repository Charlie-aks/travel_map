import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { handleRouteError } from '@/lib/route-error';

// Route công khai có chủ đích (đăng ký tài khoản mới).
const registerSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(100, 'Name is too long.'),
  email: z.email('Please enter a valid email address.').trim().max(254),
  // bcrypt chỉ dùng 72 byte đầu → giới hạn trên để tránh mật khẩu bị cắt ngầm
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(72, 'Password must be at most 72 characters.'),
});

export async function POST(req: Request) {
  try {
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input', code: 'INVALID_INPUT' },
        { status: 400 },
      );
    }
    const { name, email, password } = parsed.data;

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email is already registered', code: 'CONFLICT' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // role luôn là mặc định (USER) — không nhận từ body
    await db.insert(users).values({ name, email, password: hashedPassword });

    return NextResponse.json({ success: true, message: 'Account created successfully' }, { status: 201 });
  } catch (error) {
    // Hai request đăng ký cùng email chạy song song → vi phạm unique constraint
    if (typeof error === 'object' && error !== null && (error as { code?: string }).code === '23505') {
      return NextResponse.json({ error: 'Email is already registered', code: 'CONFLICT' }, { status: 409 });
    }
    return handleRouteError(error, 'POST /api/auth/register');
  }
}
