import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { requireWriter } from '@/lib/auth-guard';
import { handleRouteError } from '@/lib/route-error';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// Chỉ nhận ảnh raster. KHÔNG nhận SVG (có thể chứa script).
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

/** Kiểm tra chữ ký file (magic bytes) khớp với MIME khai báo — MIME do client gửi nên không tin được. */
function matchesSignature(bytes: Uint8Array, mime: string): boolean {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  switch (mime) {
    case 'image/jpeg':
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case 'image/png':
      return bytes[0] === 0x89 && ascii(1, 4) === 'PNG';
    case 'image/webp':
      return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
    case 'image/avif':
      return ascii(4, 8) === 'ftyp' && ['avif', 'avis', 'mif1', 'msf1'].includes(ascii(8, 12));
    default:
      return false;
  }
}

const badRequest = (error: string) =>
  NextResponse.json({ error, code: 'INVALID_INPUT' }, { status: 400 });

export async function POST(request: Request) {
  try {
    await requireWriter();

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return badRequest('No file provided');

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) return badRequest('Only JPEG, PNG, WebP or AVIF images are allowed');
    if (file.size === 0 || file.size > MAX_BYTES) return badRequest('Image must be smaller than 5 MB');

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!matchesSignature(buffer.subarray(0, 16), file.type)) {
      return badRequest('File content does not match its image type');
    }

    // Tên file do server sinh — không dùng file.name (tránh path traversal / tên độc hại)
    const filename = `${crypto.randomUUID()}.${ext}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`locations/${filename}`, buffer, {
        access: 'public',
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    }

    // Fallback cho môi trường dev: ghi vào public/uploads
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    return handleRouteError(error, 'POST /api/upload');
  }
}
