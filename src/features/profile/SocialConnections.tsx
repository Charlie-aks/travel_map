"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { Globe, Camera, MessageCircle, ExternalLink, Users } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";

export function SocialConnections() {
  const { t } = useTranslation();
  const { profile } = useProfileStore();

  const socials = [
    { id: 'facebook', icon: <Globe className="w-5 h-5" />, label: 'Facebook', connected: true, color: 'text-blue-600' },
    { id: 'instagram', icon: <Camera className="w-5 h-5" />, label: 'Instagram', connected: true, color: 'text-pink-600' },
    { id: 'twitter', icon: <MessageCircle className="w-5 h-5" />, label: 'Twitter', connected: false, color: 'text-sky-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] transition-colors h-full">
      <div className="flex items-center gap-2 mb-8">
        <Users className="w-5 h-5 text-[#0077b6] dark:text-[#38bdf8] transition-colors" />
        <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-50 uppercase tracking-tight transition-colors">
          {t.profile.linkedAccounts}
        </h3>
      </div>

      <div className="space-y-4">
        {socials.map((social) => (
          <div 
            key={social.id}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
              social.connected 
                ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800" 
                : "bg-white dark:bg-slate-900 border-dashed border-slate-200 dark:border-slate-800 opacity-60 grayscale"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-white dark:bg-slate-950 shadow-sm transition-colors ${social.color}`}>
                {social.icon}
              </div>
              <span className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight transition-colors">
                {social.label}
              </span>
            </div>
            
            {social.connected ? (
               <button className="text-slate-400 hover:text-[#0077b6] dark:hover:text-[#38bdf8] transition-all">
                  <ExternalLink className="w-4 h-4" />
               </button>
            ) : (
               <button className="text-[10px] font-black uppercase text-[#0077b6] dark:text-[#38bdf8] hover:underline transition-all tracking-wider">
                  Connect
               </button>
            )}
          </div>
        ))}
      </div>

      {/* Profile Sharing Sneak Peek */}
      <div className="mt-8 p-6 bg-linear-to-br from-[#0077b6] to-[#00b4d8] rounded-2xl text-white shadow-lg overflow-hidden relative group cursor-pointer transition-transform active:scale-95">
         <div className="relative z-10">
            <h4 className="text-sm font-black uppercase tracking-widest mb-1 italic">Spread the Vibes</h4>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-4">Share your map with friends</p>
            <div className="flex -space-x-3 transition-transform group-hover:translate-x-1">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center transition-transform hover:-translate-y-1">
                     <Users className="w-3 h-3 text-slate-400" />
                  </div>
               ))}
            </div>
         </div>
         <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 transition-transform group-hover:rotate-0">
            <Users className="w-20 h-20" />
         </div>
      </div>
    </div>
  );
}
