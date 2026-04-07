"use client";

import { useI18nStore } from '@/store/useI18nStore';
import { en } from './locales/en';
import { vi } from './locales/vi';

export const useTranslation = () => {
  const language = useI18nStore((state) => state.language);
  const t = language === 'en' ? en : vi;
  return { t, language };
};
