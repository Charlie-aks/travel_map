"use client";

import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("./MapContainer"),
  { 
    ssr: false, 
    loading: () => <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">Loading Map...</div> 
  }
);

export default function Map() {
  return <MapContainer />;
}
