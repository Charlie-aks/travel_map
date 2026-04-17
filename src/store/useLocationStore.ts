import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, Location, Review } from '../constants/mock-data';
import { parseReviewsCount, formatReviewsCount } from '../lib/utils';
import { useProfileStore } from './useProfileStore';

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
  addReview: (locationId: string, review: Omit<Review, 'id' | 'date'>) => Promise<void>;
  
  savedLocationIds: string[];
  fetchSavedLocations: () => Promise<void>;
  toggleSaveLocation: (id: string) => Promise<void>;
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
          // Không thêm trực tiếp `newLocation` vào state.locations nữa vì cần đợi Admin duyệt
          set({ isLoading: false });
          
          // Achievements
          const profileState = useProfileStore.getState();
          profileState.incrementStat('spots', 1);
          profileState.incrementBadgeProgress('builder', 1);
          profileState.incrementBadgeProgress('guide', 1);
          profileState.addXp(50);
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

      addReview: async (locationId, reviewData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              locationId,
              rating: reviewData.rating,
              content: reviewData.comment,
              isAnonymous: (reviewData as any).isAnonymous || false,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to post review');
          }

          // Force re-fetch locations to get updated ratings and reviews
          const { fetchLocations } = get();
          await fetchLocations();

          // Update selectedLocation to reflect new reviews/rating in Modal
          const freshLocations = get().locations;
          const updatedLoc = freshLocations.find(l => l.id === locationId);
          if (updatedLoc) {
            set({ selectedLocation: updatedLoc });
          }

          // Achievements
          const profileState = useProfileStore.getState();
          profileState.incrementStat('reviews', 1);
          profileState.incrementBadgeProgress('explorer', 1);
          profileState.addXp(20);
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          alert(error.message);
        }
      },

      savedLocationIds: [], 
      fetchSavedLocations: async () => {
        try {
          const res = await fetch('/api/locations/saved');
          
          if (res.status === 401) {
            useProfileStore.getState().logout();
            set({ savedLocationIds: [] });
            return;
          }

          if (res.ok) {
            const data = await res.json();
            set({ savedLocationIds: data });
          }
        } catch (error) {
          console.error("Error fetching saved locations:", error);
        }
      },
      toggleSaveLocation: async (id) => {
        const authStore = useProfileStore.getState();
        if (!authStore.isAuthenticated) {
          alert('Vui lòng đăng nhập để lưu địa điểm!');
          return;
        }

        try {
          const res = await fetch('/api/locations/saved', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locationId: id })
          });

          if (res.status === 401) {
            useProfileStore.getState().logout();
            set({ savedLocationIds: [] });
            alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để lưu địa điểm!');
            return;
          }

          if (res.ok) {
            const data = await res.json();
            set((state) => ({
              savedLocationIds: data.saved 
                ? [...state.savedLocationIds, id]
                : state.savedLocationIds.filter(savedId => savedId !== id)
            }));

            if (data.saved) {
              const profileState = useProfileStore.getState();
              profileState.incrementBadgeProgress('explorer', 1);
              profileState.addXp(5);
            }
          }
        } catch (error) {
          console.error("Error toggling saved location:", error);
        }
      },
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
