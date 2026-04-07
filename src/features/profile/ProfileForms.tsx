"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { User, ShieldCheck, KeyRound, Smartphone, MonitorSmartphone, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";

export function ProfileForms() {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState(profile);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 mb-12">
      {/* Top Form: Personal Info */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2 mb-8">
          <User className="w-5 h-5 text-[#0077b6] dark:text-[#38bdf8] transition-colors" />
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-50 transition-colors">{t.profile.personalInfo}</h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors">{t.profile.fullName}</label>
            <input 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-slate-100 dark:bg-slate-800 border-transparent focus:border-[#0077b6] dark:focus:border-[#38bdf8] focus:ring-0 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors">{t.profile.bio}</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full bg-slate-100 dark:bg-slate-800 border-transparent focus:border-[#0077b6] dark:focus:border-[#38bdf8] focus:ring-0 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors">{t.profile.hometown}</label>
              <input 
                name="hometown"
                value={formData.hometown}
                onChange={handleChange}
                className="w-full bg-slate-100 dark:bg-slate-800 border-transparent focus:border-[#0077b6] dark:focus:border-[#38bdf8] focus:ring-0 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors">{t.profile.website}</label>
              <input 
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-slate-100 dark:bg-slate-800 border-transparent focus:border-[#0077b6] dark:focus:border-[#38bdf8] focus:ring-0 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={handleSave}
              className={`font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm ${
                isSaved ? "bg-emerald-500 text-white" : "bg-[#0077b6] hover:bg-[#005f92] text-white"
              }`}
            >
              {isSaved ? t.profile.savedSuccess : t.profile.saveChanges}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Form: Account Security */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2 mb-8">
          <ShieldCheck className="w-5 h-5 text-[#0077b6] dark:text-[#38bdf8] transition-colors" />
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-50 transition-colors">{t.profile.accountSecurity}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-slate-700 p-2.5 rounded-xl text-[#0077b6] dark:text-[#38bdf8] shadow-sm transition-colors">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">{t.profile.changePassword}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 transition-colors">{t.profile.changePasswordDesc}</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-slate-700 p-2.5 rounded-xl text-[#0077b6] dark:text-[#38bdf8] shadow-sm transition-colors">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">{t.profile.twoFactor}</h4>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 transition-colors">{t.profile.twoFactorDesc}</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-slate-700 p-2.5 rounded-xl text-[#0077b6] dark:text-[#38bdf8] shadow-sm transition-colors">
                <MonitorSmartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">{t.profile.activeSessions}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 transition-colors">{t.profile.activeSessionsDesc}</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 transition-colors">
          <button className="flex items-center gap-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold text-sm px-2 py-1 rounded transition-colors group">
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {t.profile.deleteAccount}
          </button>
        </div>
      </div>
    </div>
  );
}
