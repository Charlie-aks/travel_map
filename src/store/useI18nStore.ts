import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface I18nState {
  language: 'en' | 'vi';
  setLanguage: (lang: 'en' | 'vi') => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: 'vi', // Defaulting to Vietnamese
      setLanguage: (language) => set({ language }),
    }),
    { name: 'i18n-storage' }
  )
);
