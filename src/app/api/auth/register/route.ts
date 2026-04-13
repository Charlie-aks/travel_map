import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true, message: "Account created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
