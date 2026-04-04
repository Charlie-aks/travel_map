import { create } from 'zustand';
import { Category, Location, mockLocations } from '../constants/mock-data';

interface LocationState {
  selectedLocation: Location | null;
  activeCategory: Category;
  searchQuery: string;
  locations: Location[];
  setSelectedLocation: (location: Location | null) => void;
  setActiveCategory: (category: Category) => void;
  setSearchQuery: (query: string) => void;
  filteredLocations: () => Location[];
}

export const useLocationStore = create<LocationState>((set, get) => ({
  selectedLocation: null,
  activeCategory: 'All',
  searchQuery: '',
  locations: mockLocations,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
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
  }
}));
