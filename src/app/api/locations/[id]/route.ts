import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { Location } from '@/constants/mock-data';
import { auth } from '@/auth';
import { AuthError, requireAdminViewer, requireWriter } from '@/lib/auth-guard';
import { handleRouteError } from '@/lib/route-error';
import { updateLocationSchema } from '@/lib/validations/location';

type Ctx = { params: Promise<{ id: string }> };
const idSchema = z.string().min(1).max(100);

type LocationRow = typeof locations.$inferSelect;

function toLocationDto(loc: LocationRow): Location {
  const coords = (loc.coordinates as [number, number]) || [0, 0];
  return {
    id: loc.id,
    name: loc.title,
    description: loc.description || '',
    category: loc.category as Location['category'],
    rating: 0,          // rating thật được tính ở GET /api/locations (sẽ gom lại ở giai đoạn 2)
    reviewsCount: 'New',
    distance: 'Local',
    lat: coords[0],
    lng: coords[1],
    imageUrl: loc.imageUrl,
    address: loc.address || '',
    bestTiming: loc.bestTiming || '',
    price: loc.price || '',
    contact: loc.contact || '',
    status: (loc.status as Location['status']) || 'PENDING',
  };
}

const notFound = () => NextResponse.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404 });

/** Người ngoài chỉ xem được địa điểm đã duyệt; chủ sở hữu và ADMIN/DEMO xem được cả bản chưa duyệt. */
async function canViewUnapproved(loc: LocationRow): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;
  if (loc.authorId === session.user.id) return true;
  try {
    await requireAdminViewer();
    return true;
  } catch (error) {
    if (error instanceof AuthError) return false;
    throw error;
  }
}

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const id = idSchema.parse((await params).id);
    const [loc] = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
    if (!loc) return notFound();
    if (loc.status !== 'APPROVED' && !(await canViewUnapproved(loc))) return notFound();

    return NextResponse.json(toLocationDto(loc));
  } catch (error) {
    return handleRouteError(error, 'GET /api/locations/[id]');
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    const user = await requireWriter();
    const id = idSchema.parse((await params).id);

    const [existing] = await db
      .select({ authorId: locations.authorId, status: locations.status })
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1);
    if (!existing) return notFound();

    const isOwner = existing.authorId === user.id;
    const isAdmin = user.role === 'ADMIN';
    // User thường chỉ sửa được địa điểm của mình khi còn PENDING; ADMIN sửa được tất cả.
    if (!isAdmin && (!isOwner || existing.status !== 'PENDING')) {
      return NextResponse.json(
        { error: 'You can only edit your own pending locations.', code: 'FORBIDDEN' },
        { status: 403 },
      );
    }

    const input = updateLocationSchema.parse(await req.json());

    // Whitelist: chỉ các field cho phép; status/authorId không bao giờ đổi qua route này.
    const updateData: Partial<typeof locations.$inferInsert> = {};
    if (input.name !== undefined) updateData.title = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
    if (input.address !== undefined) updateData.address = input.address;
    if (input.bestTiming !== undefined) updateData.bestTiming = input.bestTiming;
    if (input.price !== undefined) updateData.price = input.price;
    if (input.contact !== undefined) updateData.contact = input.contact;
    if (input.lat !== undefined && input.lng !== undefined) updateData.coordinates = [input.lat, input.lng];

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nothing to update', code: 'INVALID_INPUT' }, { status: 400 });
    }

    // Điều kiện quyền nằm ngay trong câu UPDATE (không chỉ ở bước kiểm tra phía trên):
    // tránh trường hợp địa điểm vừa được duyệt giữa lúc kiểm tra và lúc ghi.
    const where = isAdmin
      ? eq(locations.id, id)
      : and(eq(locations.id, id), eq(locations.authorId, user.id), eq(locations.status, 'PENDING'));
    const [updated] = await db.update(locations).set(updateData).where(where).returning();
    if (!updated) {
      return NextResponse.json(
        { error: 'You can only edit your own pending locations.', code: 'FORBIDDEN' },
        { status: 403 },
      );
    }

    return NextResponse.json(toLocationDto(updated));
  } catch (error) {
    return handleRouteError(error, 'PUT /api/locations/[id]');
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const user = await requireWriter();
    const id = idSchema.parse((await params).id);

    const [existing] = await db
      .select({ authorId: locations.authorId })
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1);
    if (!existing) return notFound();

    if (user.role !== 'ADMIN' && existing.authorId !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this location.', code: 'FORBIDDEN' },
        { status: 403 },
      );
    }

    await db.delete(locations).where(eq(locations.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error, 'DELETE /api/locations/[id]');
  }
}
