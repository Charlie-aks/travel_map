"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { useTranslation } from "@/i18n/useTranslation";
import { MessageSquare, Image as ImageIcon, MapPin, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

export function AchievementStats() {
  const { profile } = useProfileStore();
  const { t } = useTranslation();

  const stats = [
    { 
      id: 'reviews', 
      icon: <MessageSquare className="w-5 h-5" />, 
      value: profile.stats.reviews, 
      label: t.profile.reviews, 
      color: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-blue-100/50 dark:border-blue-800/50" 
    },
    { 
      id: 'photos', 
      icon: <ImageIcon className="w-5 h-5" />, 
      value: profile.stats.photos, 
      label: t.profile.photosShared, 
      color: "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-800/50" 
    },
    { 
      id: 'spots', 
      icon: <MapPin className="w-5 h-5" />, 
      value: profile.stats.spots, 
      label: t.profile.spotsAdded, 
      color: "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-800/50" 
    },
    { 
      id: 'helpful', 
      icon: <ThumbsUp className="w-5 h-5" />, 
      value: profile.stats.helpfulVotes, 
      label: t.profile.helpfulVotes, 
      color: "bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 border-rose-100/50 dark:border-rose-800/50" 
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`relative overflow-hidden p-6 rounded-3xl border shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all ${stat.color}`}
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 p-3 rounded-2xl bg-white dark:bg-slate-950 shadow-sm transition-colors">
              {stat.icon}
            </div>
            <div className="text-3xl font-black mb-1 transition-colors">{stat.value.toLocaleString()}</div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] opacity-60 font-sans">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
