"use client";

import { MessageSquare, Image as ImageIcon, MapPin, ThumbsUp } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useProfileStore } from "@/store/useProfileStore";
import { useEffect } from "react";

export function GlobalImpact() {
  const { t } = useTranslation();
  const { profile, fetchStats } = useProfileStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  const stats = [
    { icon: <MessageSquare className="w-5 h-5" />, value: profile.stats.reviews.toString(), label: t.profile.reviews, color: "text-[#0077b6]" },
    { icon: <ImageIcon className="w-5 h-5" />, value: "156", label: t.profile.photosShared, color: "text-amber-600" },
    { icon: <MapPin className="w-5 h-5" />, value: profile.stats.spots.toString(), label: t.profile.spotsAdded, color: "text-emerald-600" },
    { icon: <ThumbsUp className="w-5 h-5" />, value: "892", label: t.profile.helpfulVotes, color: "text-blue-600" },
  ];

  return (
    <div className="mb-10">
      <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-50 mb-6 tracking-tight transition-colors">{t.profile.globalImpact}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-all cursor-pointer">
            <div className={`mb-4 ${stat.color} dark:brightness-110`}>{stat.icon}</div>
            <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-50 mb-1 transition-colors">{stat.value}</div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AchievementBadges() {
  const { t } = useTranslation();

  const badges = [
    { name: t.profile.badges.seaLover.name, color: "bg-[#e5f0d3] dark:bg-[#e5f0d3]/10", iconColor: "text-[#8a9d18] dark:text-[#b5ce1f]", icon: "🏖️" },
    { name: t.profile.badges.duneClimber.name, color: "bg-[#ffe0cc] dark:bg-[#ffe0cc]/10", iconColor: "text-orange-500", icon: "🏜️" },
    { name: t.profile.badges.foodie.name, color: "bg-[#d6edff] dark:bg-[#d6edff]/10", iconColor: "text-[#0077b6] dark:text-[#38bdf8]", icon: "🍽️" },
    { name: t.profile.badges.islandHopper.name, color: "bg-slate-100 dark:bg-slate-800", iconColor: "text-slate-400 dark:text-slate-500", icon: "🚢", locked: true },
  ];

  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-6">
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight transition-colors">{t.profile.achievementBadges}</h3>
        <button className="text-sm font-bold text-[#0077b6] dark:text-[#38bdf8] hover:text-[#005f92] dark:hover:text-[#7dd3fc] transition-colors">
          {t.profile.viewAll}
        </button>
      </div>
      
      <div className="flex flex-wrap gap-6">
        {badges.map((badge, idx) => (
          <div key={idx} className="flex flex-col items-center gap-3">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-sm transition-colors ${badge.color} ${badge.locked ? 'opacity-50 grayscale border-2 border-dashed border-slate-300 dark:border-slate-600' : ''}`}>
              {badge.icon}
            </div>
            <span className={`text-xs font-bold transition-colors ${badge.locked ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {badge.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
