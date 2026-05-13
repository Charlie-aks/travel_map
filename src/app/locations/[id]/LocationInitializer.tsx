"use client";

import { useEffect, useRef } from "react";
import { useLocationStore } from "@/store/useLocationStore";

export function LocationInitializer({ id }: { id: string }) {
  const { setSelectedLocation, setDetailModalOpen, locations, fetchLocations } = useLocationStore();
  const initialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      if (initialized.current) return;
      
      let currentLocations = useLocationStore.getState().locations;
      
      if (currentLocations.length === 0) {
        await fetchLocations();
        currentLocations = useLocationStore.getState().locations;
      }
      
      const loc = currentLocations.find((l) => l.id === id);
      if (loc) {
        setSelectedLocation(loc);
        setDetailModalOpen(true);
        initialized.current = true;
      }
    };
    
    init();
  }, [id, setSelectedLocation, setDetailModalOpen, fetchLocations]);

  return null;
}
