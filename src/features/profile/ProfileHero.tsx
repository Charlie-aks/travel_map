"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { useTranslation } from "@/i18n/useTranslation";
import { Camera, Share2, Edit3, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function ProfileHero() {
  const { profile } = useProfileStore();
  const { t } = useTranslation();

  const levelTitle = t.profile.levels[profile.level.titleKey as keyof typeof t.profile.levels] || profile.level.titleKey;

  return (
    <div className="relative mb-12">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-[2.5rem] shadow-lg border border-slate-200 dark:border-slate-800 transition-colors">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={profile.coverUrl} 
          alt="Cover" 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        
        <button className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2.5 rounded-2xl border border-white/30 transition-all shadow-sm">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Info Container */}
      <div className="relative px-4 sm:px-8 flex flex-col xl:flex-row items-center xl:items-start gap-6 justify-between">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full xl:w-auto">
          {/* Avatar */}
          <div className="relative group shrink-0 -mt-16 md:-mt-24 z-10 pl-0 md:pl-4">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full p-2 bg-white dark:bg-slate-950 shadow-2xl transition-colors">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 transition-colors bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
              </div>
            </div>
            <button className="absolute bottom-2 right-2 bg-[#0077b6] dark:bg-[#38bdf8] text-white dark:text-slate-950 p-3.5 rounded-full shadow-xl hover:-translate-y-1 transition-transform border-4 border-white dark:border-slate-950">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Text Info */}
          <div className="flex-1 md:pt-6 text-center md:text-left w-full">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-3">
              <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight drop-shadow-sm transition-colors">
                {profile.fullName}
              </h1>
              <span className="px-3.5 py-1.5 bg-[#f1f5cd] dark:bg-[#2a2d10] text-[#6d7e00] dark:text-[#a5b630] rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm border border-[#e5ebba] dark:border-[#383a15] transition-all">
                {levelTitle}
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-bold transition-colors">
               <span className="flex items-center gap-1.5 hover:text-[#0077b6] dark:hover:text-[#38bdf8] cursor-default transition-colors">
                 <MapPin className="w-4 h-4" /> {profile.hometown}
               </span>
               <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
               <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-default transition-colors">{t.profile.exploring}</span>
            </div>

            <p className="mt-5 text-slate-600 dark:text-slate-300 text-[15px] font-medium leading-relaxed max-w-2xl mx-auto md:mx-0 transition-colors">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto mt-8 xl:mt-0 xl:pt-6 shrink-0">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#0077b6] hover:bg-[#005f92] text-white px-7 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-lg shadow-blue-500/25 transition-all active:scale-95">
            <Edit3 className="w-4 h-4" />
            {t.profile.editProfile}
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-7 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest border-2 border-slate-100 dark:border-slate-700 shadow-sm transition-all active:scale-95">
            <Share2 className="w-4 h-4" />
            {t.profile.shareProfile}
          </button>
        </div>
      </div>
    </div>
  );
}
