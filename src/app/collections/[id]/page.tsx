"use client";

import { useLocationStore } from "@/store/useLocationStore";
import { mockCollections } from "@/constants/mock-data";
import { LocationCard } from "@/features/locations/LocationCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const collectionId = resolvedParams.id;
  const { locations } = useLocationStore();
  
  const collection = mockCollections.find(c => c.id === collectionId);
  
  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center p-24 w-full flex-1">
        <h2 className="text-2xl font-bold mb-4">Collection not found</h2>
        <Link href="/collections" className="text-[#0077b6] underline">Back to collections</Link>
      </div>
    );
  }

  const collectionLocations = locations.filter(loc => collection.locationIds.includes(loc.id));

  return (
    <main className="flex-1 w-full bg-[#f8fafc] overflow-y-auto custom-scrollbar relative">
      {/* Hero Banner */}
      <div className="relative h-[30vh] min-h-[250px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={collection.imageUrl} 
          alt={collection.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 px-6 md:px-12 lg:px-24 xl:px-48 flex flex-col justify-end pb-12">
          <Link href="/collections" className="text-white/80 hover:text-white flex items-center gap-2 mb-6 transition-colors w-fit">
            <ArrowLeft className="w-5 h-5" /> Back to Collections
          </Link>
          <div className="flex justify-start mb-4">
            <span className="bg-[#b5651d] text-white text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-sm shadow-sm opacity-90">
              {collection.tag}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">{collection.title}</h1>
        </div>
      </div>

      {/* Grid of locations */}
      <div className="px-6 md:px-12 lg:px-24 xl:px-48 py-12 max-w-[1400px] mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Featured Spots ({collectionLocations.length})</h2>
        </div>
        
        {collectionLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collectionLocations.map(loc => (
              <LocationCard key={loc.id} location={loc} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <p className="text-lg text-slate-500">No spots available in this collection yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
