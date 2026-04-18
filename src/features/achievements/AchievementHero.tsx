"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function AchievementHero() {
  const { profile } = useProfileStore();
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const xpPercentage = (profile.level.xp / profile.level.maxXp) * 100;
  
  const levelTitle = t.profile.levels[profile.level.titleKey as keyof typeof t.profile.levels] || profile.level.titleKey;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800 mb-10 overflow-hidden transition-colors"
    >
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 dark:bg-blue-900/10 rounded-full -mr-20 -mt-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50/50 dark:bg-amber-900/10 rounded-full -ml-20 -mb-20 blur-3xl" />

      <div className="relative flex flex-col md:flex-row items-center gap-10">
        {/* Avatar & Level Badge */}
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -bottom-2 -right-2 w-12 h-12 md:w-16 md:h-16 bg-[#0077b6] dark:bg-[#38bdf8] rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg transition-colors"
          >
            <span className="text-white dark:text-slate-950 font-black text-xl md:text-2xl">{profile.level.current}</span>
          </motion.div>
        </div>

        {/* Info & XP Bar */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight transition-colors mb-2">
              {profile.fullName}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-5 py-1.5 bg-[#f1f5cd] dark:bg-[#2a2d10] text-[#6d7e00] dark:text-[#a5b630] rounded-full text-xs font-black uppercase tracking-wider transition-colors shadow-sm">
                {levelTitle}
              </span>
              <span className="px-5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs font-bold transition-colors">
                {t.profile.exploring}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.profile.xpLabel}</span>
              <span className="text-sm font-black text-[#0077b6] dark:text-[#38bdf8] transition-colors">
                {isMounted ? profile.level.xp.toLocaleString() : profile.level.xp} <span className="text-slate-300 dark:text-slate-600 font-bold">/ {isMounted ? profile.level.maxXp.toLocaleString() : profile.level.maxXp}</span>
              </span>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 transition-colors">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-linear-to-r from-[#0077b6] to-[#00b4d8] dark:from-[#38bdf8] dark:to-[#7dd3fc] rounded-full shadow-[0_0_20px_rgba(0,119,182,0.4)]"
              />
            </div>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
              {t.profile.pointsUntil} Level {profile.level.current + 1}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
