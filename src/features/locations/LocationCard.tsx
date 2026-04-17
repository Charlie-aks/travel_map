"use client";

import { Location } from "@/constants/mock-data";
import { Heart, Star, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLocationStore } from "@/store/useLocationStore";
import { useTranslation } from "@/i18n/useTranslation";

interface LocationCardProps {
  location: Location;
  showDelete?: boolean;
}

import { coastalTheme, cn } from "@/components/ui/design-system";

export function LocationCard({ location, showDelete = false }: LocationCardProps) {
  const { selectedLocation, setSelectedLocation, setDetailModalOpen, deleteLocation, savedLocationIds, toggleSaveLocation } = useLocationStore();
  const isSelected = selectedLocation?.id === location.id;
  const isSaved = savedLocationIds?.includes(location.id) ?? false;
  const { t } = useTranslation();

  const handleOpenDetail = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    setSelectedLocation(location);
    setDetailModalOpen(true);
  };

  return (
    <motion.div
      variants={coastalTheme.animations.itemFadeUp}
      whileHover={{ y: -4 }}
      className="mb-6 w-full"
    >
      <div 
        className={cn(
          "rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300",
          isSelected 
            ? "ring-2 ring-primary shadow-xl" 
            : "border border-slate-100 dark:border-slate-800",
          coastalTheme.glassmorphism
        )}
        onClick={() => setSelectedLocation(location)}
      >
        {/* Location Image */}
        <div className="relative h-48 w-full overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={location.imageUrl} 
            alt={location.name} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          
          {/* Save/Heart Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleSaveLocation(location.id); }}
            className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/80 backdrop-blur text-red-500 p-2 rounded-full shadow-md z-10 hover:bg-white dark:hover:bg-slate-900 hover:scale-110 transition-all border border-transparent dark:border-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isSaved ? "text-red-500" : "text-slate-400 dark:text-slate-500"}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
        </div>
        
        {/* Content Section (Bottom) */}
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex justify-between items-start mb-2 gap-2">
              <h3 className="font-bold text-lg leading-tight text-slate-800 dark:text-slate-50 line-clamp-2 transition-colors">
                {location.name}
              </h3>
              <div className="flex items-center text-sm font-semibold text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded gap-1 shrink-0 transition-colors">
                <Star className="w-3 h-3 fill-orange-500 dark:fill-orange-400" />
                {location.rating}
              </div>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4 transition-colors">
              {location.description}
            </p>
          </div>
          {/* Action Button */}
        <div className="mt-5 flex items-center gap-2">
          <button 
            onClick={() => {
              setSelectedLocation(location);
              setDetailModalOpen(true);
            }}
            className="flex-1 bg-primary hover:opacity-90 text-primary-foreground py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            {t.locationCard.viewDetails}
          </button>
          
          {showDelete && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(t.locationCard.removeSpotConfirm)) {
                  deleteLocation(location.id);
                }
              }}
              className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-900/50 transition-colors shadow-sm"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        </div>
      </div>
    </motion.div>
  );
}
