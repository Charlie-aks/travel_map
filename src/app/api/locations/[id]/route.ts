import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await req.json();

  const idx = mockDb.findIndex(loc => loc.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  mockDb[idx] = { ...mockDb[idx], ...updates };

  await new Promise(resolve => setTimeout(resolve, 800));
  return NextResponse.json(mockDb[idx]);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const idx = mockDb.findIndex(loc => loc.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  mockDb.splice(idx, 1);

  await new Promise(resolve => setTimeout(resolve, 800));
  return NextResponse.json({ success: true });
}
