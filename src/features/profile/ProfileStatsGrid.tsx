"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { useTranslation } from "@/i18n/useTranslation";
import { Heart, MessageSquare, Image as ImageIcon, MapPin, Gauge } from "lucide-react";
import { motion } from "framer-motion";

export function ProfileStatsGrid() {
  const { profile } = useProfileStore();
  const { t } = useTranslation();

  const stats = [
    { 
      id: 'saved', 
      icon: <Heart className="w-5 h-5 shrink-0" />, 
      value: "142", 
      label: t.profile.placesSaved, 
      color: "bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 border-rose-100/50 dark:border-rose-800/50" 
    },
    { 
      id: 'contributions', 
      icon: <MapPin className="w-5 h-5 shrink-0" />, 
      value: profile.stats.spots, 
      label: t.profile.contributions, 
      color: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-800/50" 
    },
    { 
      id: 'reviews', 
      icon: <MessageSquare className="w-5 h-5 shrink-0" />, 
      value: profile.stats.reviews, 
      label: t.profile.reviews, 
      color: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-blue-100/50 dark:border-blue-800/50" 
    },
    { 
      id: 'miles', 
      icon: <Gauge className="w-5 h-5 shrink-0" />, 
      value: profile.stats.milesTraveled.toLocaleString('en-US'), 
      label: t.profile.milesTraveled, 
      color: "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-800/50" 
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`relative overflow-hidden p-6 rounded-[2rem] border shadow-[0_10px_40px_rgba(0,0,0,0.03)] dark:shadow-none transition-all ${stat.color} hover:scale-[1.02] active:scale-95 cursor-default`}
        >
          {/* Subtle Decorative Icon */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none -mr-4 -mb-4">
             <div className="scale-150 transform -rotate-12 transition-transform duration-500 hover:rotate-0">
               {stat.icon}
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left transition-colors">
            <div className="mb-4 p-3 rounded-2xl bg-white dark:bg-slate-950 shadow-sm transition-colors ring-1 ring-black/5 dark:ring-white/5">
              {stat.icon}
            </div>
            <div className="text-3xl font-black mb-1 transition-colors tracking-tight">{stat.value}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 font-sans">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
