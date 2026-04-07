import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';
import { Location } from '@/constants/mock-data';

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency
  return NextResponse.json(mockDb);
}

export async function POST(req: Request) {
  const data = await req.json();

  // Validate incoming type roughly
  const newLocation: Location = { 
    ...data, 
    id: Math.random().toString(36).substr(2, 9),
    rating: data.rating || 5.0,
    reviewsCount: data.reviewsCount || 'New',
    distance: data.distance || 'Just added',
  };
  
  mockDb.unshift(newLocation);
  
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency
  return NextResponse.json(newLocation, { status: 201 });
}
