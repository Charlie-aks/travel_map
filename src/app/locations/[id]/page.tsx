import { Metadata } from 'next';
import { db } from '@/db';
import { locations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Sidebar } from "@/features/locations/Sidebar";
import Map from "@/features/map-view/Map";
import { LocationInitializer } from './LocationInitializer';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const locationResult = await db.select().from(locations).where(eq(locations.id, resolvedParams.id));
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
