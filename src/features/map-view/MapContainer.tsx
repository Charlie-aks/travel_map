"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLocationStore } from "@/store/useLocationStore";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createCustomIcon = (isSelected: boolean) => {
  const iconHtml = ReactDOMServer.renderToString(
    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-transform duration-300 ${isSelected ? 'bg-primary scale-125 z-50 ring-4 ring-primary/30' : 'bg-white text-primary hover:scale-110'}`}>
      <MapPin className={`w-5 h-5 ${isSelected ? 'text-primary-foreground' : 'text-primary'}`} fill={isSelected ? 'currentColor' : 'none'} />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-leaflet-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

import { useState } from "react";

function RoutingControl() {
  const map = useMap();
  const routingDestination = useLocationStore((state) => state.routingDestination);
  const setRoutingDestination = useLocationStore((state) => state.setRoutingDestination);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!routingDestination) {
      setRoutePath([]);
      return;
    }

    const start = [10.9333, 108.1000] as [number, number]; // Phan Thiet Central
    const end = [routingDestination.lat, routingDestination.lng] as [number, number];

    const fetchRoute = async () => {
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`);
        const data = await res.json();
        
        if (data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates;
          const path = coords.map((c: any) => [c[1], c[0]]); // GeoJSON is [lng, lat], Leaflet is [lat, lng]
          setRoutePath(path);
          
          const bounds = L.latLngBounds([start, end]);
          map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    };

    fetchRoute();
  }, [routingDestination, map]);

  if (!routingDestination || routePath.length === 0) return null;

  return (
    <>
      <Polyline positions={routePath} color="#1e40af" weight={6} opacity={0.8} dashArray="10, 10" />
      
      {/* Start Point Marker */}
      <Marker position={[10.9333, 108.1000]} icon={L.divIcon({
        html: `<div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md"></div>`,
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })} />
    </>
  );
}

function MapViewUpdater() {
  const map = useMap();
  const selectedLocation = useLocationStore((state) => state.selectedLocation);

  useEffect(() => {
    // Only fly to selectedLocation if not routing
    const routingDestination = useLocationStore.getState().routingDestination;
    if (selectedLocation && !routingDestination) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selectedLocation, map]);

  return null;
}

import { useTranslation } from "@/i18n/useTranslation";

export default function CustomMapContainer() {
  const { locations, selectedLocation, setSelectedLocation, routingDestination, setRoutingDestination } = useLocationStore();
  const { t } = useTranslation();
  const center: L.LatLngExpression = [10.9333, 108.1000]; // Phan Thiet Central

  return (
    <div className="w-full h-full relative z-0">
      {routingDestination && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-1000">
          <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-full shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
            <div className="flex flex-col items-start mr-4 max-w-[150px] md:max-w-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1 transition-colors">{t.map.routingTo}</span>
              <span className="text-sm font-bold text-primary whitespace-nowrap overflow-hidden text-ellipsis w-full transition-colors">{routingDestination.name}</span>
            </div>
            <button 
              onClick={() => setRoutingDestination(null)}
              className="bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-destructive px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
            >
              {t.map.cancel}
            </button>
          </div>
        </div>
      )}

      <MapContainer 
        center={center} 
        zoom={12} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => {
          const isSelected = selectedLocation?.id === location.id;
          
          return (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={createCustomIcon(isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(location);
                },
              }}
            >
              <Popup className="rounded-xl overflow-hidden shadow-xl border-0 p-0 m-0">
                <div className="w-48">
                  <div className="h-24 w-full bg-slate-200 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={location.imageUrl} alt={location.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 bg-white">
                    <h3 className="font-semibold text-sm mb-1">{location.name}</h3>
                    <div className="flex items-center text-xs text-slate-500 mb-2">
                       <span className="text-yellow-500 mr-1">★</span> {location.rating}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{location.description}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <RoutingControl />
        <MapViewUpdater />
      </MapContainer>
    </div>
  );
}
