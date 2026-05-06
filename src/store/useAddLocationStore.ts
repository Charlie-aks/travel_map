import { create } from 'zustand';
import { Category } from '../constants/mock-data';

interface AddLocationFormState {
  name: string;
  category: Category;
  address: string;
  description: string;
  bestTiming?: string;
  price?: string;
  contact?: string;
  lat: number;
  lng: number;
  imageUrl: string;
  editingId: string | null;
  updateField: (field: keyof AddLocationFormState, value: any) => void;
  loadLocation: (loc: any) => void;
  reset: () => void;
}

export const useAddLocationStore = create<AddLocationFormState>((set) => ({
  name: '',
  category: 'All',
  address: '',
  description: '',
  bestTiming: '',
  price: '',
  contact: '',
  lat: 10.9333,
  lng: 108.1000,
  imageUrl: '',
  editingId: null,
  updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
  loadLocation: (loc) => set({
    name: loc.name,
    address: loc.address,
    category: loc.category,
    description: loc.description,
    bestTiming: loc.bestTiming || '',
    price: loc.price || '',
    contact: loc.contact || '',
    imageUrl: loc.imageUrl,
    lat: loc.lat,
    lng: loc.lng,
    editingId: loc.id,
  }),
  reset: () => set({
    name: '',
    category: 'All',
    address: '',
    description: '',
    bestTiming: '',
    price: '',
    contact: '',
    lat: 10.9333,
    lng: 108.1000,
    imageUrl: '',
    editingId: null,
  }),
}));
