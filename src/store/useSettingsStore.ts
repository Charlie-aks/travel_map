import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MapStyle = 'streets' | 'satellite';
export type DistanceUnit = 'km' | 'miles';
export type PrivacySetting = 'public' | 'private';

interface SettingsState {
  mapStyle: MapStyle;
  distanceUnit: DistanceUnit;
  notifications: boolean;
  nearbySpots: boolean;
  privacy: PrivacySetting;
  
  setMapStyle: (style: MapStyle) => void;
  setDistanceUnit: (unit: DistanceUnit) => void;
  setNotifications: (enabled: boolean) => void;
  setNearbySpots: (enabled: boolean) => void;
  setPrivacy: (privacy: PrivacySetting) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      mapStyle: 'streets',
      distanceUnit: 'km',
      notifications: true,
      nearbySpots: true,
      privacy: 'public',
      
      setMapStyle: (style) => set({ mapStyle: style }),
      setDistanceUnit: (unit) => set({ distanceUnit: unit }),
      setNotifications: (enabled) => set({ notifications: enabled }),
      setNearbySpots: (enabled) => set({ nearbySpots: enabled }),
      setPrivacy: (privacy) => set({ privacy: privacy }),
    }),
    {
      name: 'travel-map-settings',
    }
  )
);
