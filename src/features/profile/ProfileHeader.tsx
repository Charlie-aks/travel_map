"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { Camera, MapPin } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function ProfileHeader() {
  const profile = useProfileStore((state) => state.profile);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col xl:flex-row gap-6 mb-8 mt-2">
      
      {/* Left Card: User Info Hero */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-8 items-center sm:items-start relative overflow-hidden transition-colors">
        {/* Abstract Gradient Background for left card (based on user request) */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-linear-to-br from-red-500 via-orange-400 to-transparent pointer-events-none" />

        <div className="relative shrink-0 z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
          </div>
          <button className="absolute -bottom-2 -right-2 bg-[#0077b6] dark:bg-[#38bdf8] text-white dark:text-slate-900 p-2.5 rounded-full shadow-lg border-2 border-white dark:border-slate-800 hover:scale-110 transition-transform">
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left z-10">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight transition-colors">{profile.fullName}</h1>
            <span className="bg-[#f1f5cd] dark:bg-[#2a2d10] text-[#6d7e00] dark:text-[#a5b630] text-[10px] uppercase font-extrabold px-3 py-1.5 rounded-full tracking-wider flex items-center gap-1.5 shadow-sm border border-[#e5ebba] dark:border-[#2a2d10] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8a9d18] dark:bg-[#b5ce1f]"></span>
              {t.profile.eliteExplorer}
            </span>
          </div>
          
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500 dark:text-slate-400 font-semibold mb-6 text-sm transition-colors">
            <MapPin className="w-4 h-4" />
            {profile.hometown} • {t.profile.exploring}
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto sm:mx-0 transition-colors">
            {profile.bio}
          </p>
        </div>
      </div>

      {/* Right Card: Level Status */}
      <div className="w-full xl:w-[340px] shrink-0 bg-linear-to-br from-[#006ca5] to-[#004e7a] rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden flex flex-col justify-center">
        {/* Decor */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full pointer-events-none mix-blend-overlay"></div>
        <div className="absolute right-10 bottom-10 w-20 h-20 bg-white opacity-10 rounded-full pointer-events-none mix-blend-overlay"></div>
        
        <p className="font-bold text-blue-100 text-sm mb-1 z-10">{t.profile.currentLevel}</p>
        <h2 className="text-5xl font-extrabold mb-6 z-10 drop-shadow-md tracking-tight">Level 42</h2>
        
        <div className="z-10 w-full bg-black/20 rounded-full h-2 mb-3 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
          <div className="bg-blue-300 h-2 rounded-full w-[70%] relative">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
          </div>
        </div>
        <p className="text-xs text-blue-100 font-medium mb-8 z-10">1,250 {t.profile.pointsUntil} 43</p>

        <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm z-10">
          {t.profile.viewLeaderboard}
        </button>
      </div>

    </div>
  );
}
