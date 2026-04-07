import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, Location } from '../constants/mock-data';

interface LocationState {
  selectedLocation: Location | null;
  isDetailModalOpen: boolean;
  activeCategory: Category;
  searchQuery: string;
  locations: Location[];
  isLoading: boolean;
  error: string | null;
  
  setSelectedLocation: (location: Location | null) => void;
  setDetailModalOpen: (isOpen: boolean) => void;
  setActiveCategory: (category: Category) => void;
  setSearchQuery: (query: string) => void;
  filteredLocations: () => Location[];
  
  fetchLocations: () => Promise<void>;
  addLocation: (location: Omit<Location, 'id'> | Location) => Promise<void>;
  updateLocation: (id: string, updatedData: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  
  savedLocationIds: string[];
  toggleSaveLocation: (id: string) => void;
  routingDestination: Location | null;
  setRoutingDestination: (location: Location | null) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      selectedLocation: null,
      isDetailModalOpen: false,
      activeCategory: 'All',
      searchQuery: '',
      locations: [], // Start empty instead of mockLocations
      isLoading: false,
      error: null,
      
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      setDetailModalOpen: (isOpen) => set({ isDetailModalOpen: isOpen }),
      setActiveCategory: (category) => set({ activeCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      filteredLocations: () => {
        const { locations, activeCategory, searchQuery } = get();
        return locations.filter((loc) => {
          const matchesCategory = activeCategory === 'All' || loc.category === activeCategory;
          const matchesQuery = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               loc.description.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesQuery;
        });
      },

      fetchLocations: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/locations');
          if (!res.ok) throw new Error('Failed to fetch locations');
          const data = await res.json();
          set({ locations: data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      addLocation: async (location) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/locations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(location),
          });
          if (!res.ok) throw new Error('Failed to add location');
          const newLocation = await res.json();
          set((state) => ({ locations: [newLocation, ...state.locations], isLoading: false }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateLocation: async (id, updatedData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`/api/locations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
          });
          if (!res.ok) throw new Error('Failed to update location');
          const updatedLoc = await res.json();
          set((state) => ({
            locations: state.locations.map(loc => loc.id === id ? updatedLoc : loc),
            isLoading: false
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      deleteLocation: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`/api/locations/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete location');
          set((state) => ({
            locations: state.locations.filter(loc => loc.id !== id),
            selectedLocation: state.selectedLocation?.id === id ? null : state.selectedLocation,
            isLoading: false
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      savedLocationIds: ['1', '2', '3'], 
      toggleSaveLocation: (id) => set((state) => ({
        savedLocationIds: state.savedLocationIds.includes(id) 
          ? state.savedLocationIds.filter(savedId => savedId !== id)
          : [...state.savedLocationIds, id]
      })),
      routingDestination: null,
      setRoutingDestination: (location) => set({ routingDestination: location }),
    }),
    {
      name: 'phan-thiet-locations-storage',
      version: 1, // Add version to invalidate old cache containing the `locations` array
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // If migrating from version 0, we just want to keep the saved locations
          return {
            savedLocationIds: persistedState.savedLocationIds || ['1', '2', '3']
          };
        }
        return persistedState;
      },
      // We purposefully DO NOT partialize locations anymore so the API acts as source of truth.
      partialize: (state) => ({ 
        savedLocationIds: state.savedLocationIds 
      }), 
    }
  )
);
