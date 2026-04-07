"use client";

import dynamic from "next/dynamic";

const MapPicker = dynamic(
  () => import("./InteractiveMapPicker"),
  { 
    ssr: false, 
    loading: () => <div className="w-full h-[200px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">Loading Map...</div> 
  }
);

export default function MapPickerDynamic() {
  return <MapPicker />;
}
