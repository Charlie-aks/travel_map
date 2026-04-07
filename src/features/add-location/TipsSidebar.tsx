"use client";

import { useAddLocationStore } from "@/store/useAddLocationStore";
import { GripHorizontal, MapPin, Edit3, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";

export default function TipsSidebar() {
  const { name, category, imageUrl, editingId } = useAddLocationStore();
  const { t } = useTranslation();

  return (
    <div className="w-full md:w-[320px] lg:w-[380px] shrink-0 sticky top-24 pt-6 md:pt-0">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#0077b6] dark:text-[#38bdf8] tracking-tight leading-tight mb-4 transition-colors">
          {editingId ? t.addLocation.sidebarEdit : t.addLocation.sidebarAddNew}<br />{t.addLocation.sidebarSpot}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed transition-colors">
          {t.addLocation.helpTravelers}
        </p>
      </div>

      {/* Quick Tips */}
      <div className="bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-8 transition-colors">
        <h3 className="font-bold text-[#0077b6] dark:text-[#38bdf8] mb-5 transition-colors">{t.addLocation.quickTips}</h3>
        <div className="space-y-5">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded shrink-0 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center transition-colors">
              <ImageIcon className="w-4 h-4" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug transition-colors">{t.addLocation.qualityDesc}</p>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded shrink-0 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center transition-colors">
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug transition-colors">{t.addLocation.accuracyDesc}</p>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded shrink-0 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center transition-colors">
              <Edit3 className="w-4 h-4" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug transition-colors">{t.addLocation.describeDesc}</p>
          </div>
        </div>
      </div>

      {/* Reactive Preview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[85%] mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform -rotate-2 transition-all"
      >
        <div className="relative h-32 bg-slate-200 dark:bg-slate-800 transition-colors">
           {imageUrl ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 transition-colors">
               <ImageIcon className="w-8 h-8 opacity-50" />
             </div>
           )}
           <div className="absolute top-2 left-2 bg-slate-900/80 dark:bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm transition-colors">
             {t.addLocation.preview}
           </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 transition-colors">
          <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-full mb-2 transition-colors">
            {name && <span className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 -mt-1 block bg-white dark:bg-slate-900 transition-colors">{name}</span>}
          </div>
          <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors">
            {category !== 'All' && <span className="text-xs font-semibold text-[#0077b6] dark:text-[#38bdf8] -mt-1 block bg-white dark:bg-slate-900 transition-colors">{category}</span>}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
