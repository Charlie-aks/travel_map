"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAddLocationStore } from "@/store/useAddLocationStore";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";

const customIcon = L.divIcon({
  html: ReactDOMServer.renderToString(
    <div className="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg bg-blue-600 scale-125 z-50 transition-transform">
      <MapPin className="w-5 h-5 text-white" fill="#2563eb" />
    </div>
  ),
  className: "custom-leaflet-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function MapClickHandler() {
  const updateField = useAddLocationStore((state) => state.updateField);
  
  useMapEvents({
    click(e) {
      updateField('lat', e.latlng.lat);
      updateField('lng', e.latlng.lng);
    },
  });

  return null;
}

export default function InteractiveMapPicker() {
  const { lat, lng } = useAddLocationStore();
  const position: L.LatLngExpression = [lat, lng];

  return (
    <div className="w-full h-[200px] rounded-xl overflow-hidden relative z-0 border border-slate-200">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon} />
        <MapClickHandler />
      </MapContainer>
      
      {/* Overlay coordinates */}
      <div className="absolute bottom-3 left-4 bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-md backdrop-blur-sm z-[400] flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
        Lat: {lat.toFixed(4)}° N, Lng: {lng.toFixed(4)}° E
      </div>
      <div className="absolute bottom-3 right-4 bg-transparent text-blue-600 text-[10px] font-bold uppercase tracking-wider z-[400]">
        CLICK TO SET PIN
      </div>
    </div>
  );
}
