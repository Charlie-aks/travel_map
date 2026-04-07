"use client";

import { useProfileStore, Badge } from "@/store/useProfileStore";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function BadgeGrid() {
  const { profile } = useProfileStore();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'exploration' | 'contribution' | 'special'>('all');

  const categories = [
    { id: 'all', label: t.map.categories.all },
    { id: 'exploration', label: t.profile.badges.seaLover.name.split(' ')[0] + " " + t.profile.badges.seaLover.name.split(' ')[1] }, // This is a bit hacky for "Exploration" vs badge name, but I will improve in locale
  ];

  // Let's refine categories
  const categoryLabels = {
    all: t.map.categories.all,
    exploration: t.profile.achievementBadges.split(' ')[0] + " " + t.navbar.explore,
    contribution: t.settingsSidebar.contributions,
    special: t.profile.achievementBadges.split(' ')[0] + " Biệt",
  };

  const filteredBadges = selectedCategory === 'all' 
    ? profile.badges 
    : profile.badges.filter(b => b.category === selectedCategory);

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight transition-colors">
          {t.profile.earnedBadges}
          <span className="ml-3 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-loose">
            {profile.badges.filter(b => b.unlocked).length} / {profile.badges.length}
          </span>
        </h3>
        
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl transition-colors">
          {Object.entries(categoryLabels).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id as any)}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider ${
                selectedCategory === id 
                  ? "bg-white dark:bg-slate-700 text-[#0077b6] dark:text-[#38bdf8] shadow-sm" 
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBadges.map((badge) => (
            <BadgeItem key={badge.id} badge={badge} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BadgeItem({ badge }: { badge: Badge }) {
  const { t } = useTranslation();
  const badgeInfo = t.profile.badges[badge.id as keyof typeof t.profile.badges];

  const categoryColors = {
    exploration: "bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    contribution: "bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    special: "bg-amber-100/50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group relative flex flex-col items-center p-6 rounded-3xl border transition-all ${
        badge.unlocked 
          ? "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.03)]" 
          : "bg-slate-50/50 dark:bg-slate-900/30 border-dashed border-slate-200 dark:border-slate-800 opacity-60"
      }`}
    >
      {/* Badge Icon Container */}
      <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 transition-all ${
        badge.unlocked 
          ? "bg-slate-100 dark:bg-slate-800 shadow-inner rotate-0 group-hover:rotate-12 group-hover:scale-110" 
          : "bg-slate-200/50 dark:bg-slate-800/50 grayscale"
      }`}>
        {badge.icon}
        {badge.unlocked && (
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-4 border-white dark:border-slate-900 shadow-md">
            <CheckCircle2 className="w-3 h-3" strokeWidth={4} />
          </div>
        )}
        {!badge.unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-6 h-6 text-slate-400 dark:text-slate-600 opacity-30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-center">
        <h4 className={`text-sm font-black mb-1 transition-colors ${badge.unlocked ? 'text-slate-800 dark:text-slate-50' : 'text-slate-500'}`}>
          {badgeInfo.name}
        </h4>
        <p className="text-[10px] leading-relaxed text-slate-400 dark:text-slate-500 font-bold px-2">
          {badgeInfo.desc}
        </p>
      </div>

      {/* Progress Bar (if locked) */}
      {!badge.unlocked && badge.target > 0 && (
        <div className="w-full mt-4 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden transition-colors">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(badge.progress / badge.target) * 100}%` }}
            className={`h-full ${categoryColors[badge.category].split(' ')[1]}`}
          />
        </div>
      )}

      {/* Unlocked Date */}
      {badge.unlocked && badge.unlockedAt && (
        <div className="mt-3 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-500/80">
          {t.profile.unlockedAt} {badge.unlockedAt}
        </div>
      )}

      {/* category tag */}
      <div className={`absolute top-3 left-3 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity ${categoryColors[badge.category]}`}>
        {badge.category}
      </div>
    </motion.div>
  );
}
