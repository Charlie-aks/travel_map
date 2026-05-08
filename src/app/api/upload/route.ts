import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    // If Vercel Blob is configured (usually in production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(filename, file, {
        access: 'public',
      });
      return NextResponse.json({ url: blob.url });
    } 
    // Fallback: Local upload for development environment
    else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Ensure public/uploads directory exists
      const uploadDir = join(process.cwd(), 'public/uploads');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      
      return NextResponse.json({ url: `/uploads/${filename}` });
    }
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
