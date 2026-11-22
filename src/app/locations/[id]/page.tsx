import { Metadata } from 'next';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { Sidebar } from "@/features/locations/Sidebar";
import Map from "@/features/map-view/Map";
import { LocationInitializer } from './LocationInitializer';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  // Chỉ địa điểm đã duyệt mới có metadata (tránh lộ tiêu đề/mô tả bản chưa duyệt qua thẻ meta)
  const locationResult = await db
    .select({ title: locations.title, description: locations.description, imageUrl: locations.imageUrl })
    .from(locations)
    .where(and(eq(locations.id, resolvedParams.id), eq(locations.status, 'APPROVED')))
    .limit(1);
  const location = locationResult[0];

  if (!location) {
    return {
      title: 'Location Not Found',
    };
  }

  return {
    title: `${location.title} - Phan Thiet Travel Map`,
    description: location.description || 'Discover this amazing place in Phan Thiet.',
    openGraph: {
      title: location.title,
      description: location.description || 'Discover this amazing place in Phan Thiet.',
      images: location.imageUrl ? [{ url: location.imageUrl }] : [],
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <main className="flex flex-1 w-full overflow-hidden bg-white relative">
      <LocationInitializer id={resolvedParams.id} />
      <Sidebar />
      <div className="flex-1 relative h-full">
        <Map />
      </div>
    </main>
  );
}
