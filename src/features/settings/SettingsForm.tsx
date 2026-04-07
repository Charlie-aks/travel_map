"use client";

import { Switch } from "@/components/ui/switch";
import { User, Map, Bell, Shield, Settings2, KeyRound, Mail, Link2, Map as MapIcon, Ruler, MessageSquare, MapPin, Globe, Moon, Trash2, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "@/i18n/useTranslation";
import { useI18nStore } from "@/store/useI18nStore";

export function SettingsForm() {
  const { theme, setTheme } = useTheme();
  const { t, language } = useTranslation();
  const setLanguage = useI18nStore((state) => state.setLanguage);

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto md:mx-0 pb-20">
      
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-50 mb-2 tracking-tight transition-colors">{t.settingsForm.appSettings}</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium transition-colors">{t.settingsForm.appSettingsDesc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Section 1: Tài Khoản */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-50 text-[#0077b6] p-2 rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight transition-colors">{t.settingsForm.account}</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm text-slate-600"><KeyRound className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{t.settingsForm.changeEmail}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{t.settingsForm.emailDesc}</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-[#0077b6]">{t.settingsForm.changeEmail}</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm text-slate-600"><Mail className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{t.settingsForm.emailAdd}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">alex.rivers@explorer.com</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-[#0077b6]">{t.settingsForm.changeEmail}</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm text-slate-600"><Link2 className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{t.settingsForm.socialLinks}</h4>
                    <p className="text-xs font-semibold text-emerald-600 mt-0.5">{t.settingsForm.socialDesc}</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-[#0077b6]">{t.settingsForm.connect}</button>
              </div>
            </div>
          </div>

          {/* Section 2: Cấu Hình Bản Đồ */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-2 rounded-xl transition-colors">
                <MapIcon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight transition-colors">{t.settingsForm.mapSettings}</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="font-bold text-slate-800 text-sm mb-3">{t.settingsForm.mapStyle}</p>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer group">
                    <input type="radio" name="mapStyle" className="peer sr-only" defaultChecked />
                    <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 peer-checked:border-[#0077b6] peer-checked:bg-blue-50 transition-all font-bold text-slate-600 peer-checked:text-[#0077b6] flex items-center justify-center gap-2">
                       <MapIcon className="w-4 h-4" /> {t.settingsForm.streets}
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer group">
                    <input type="radio" name="mapStyle" className="peer sr-only" />
                    <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 peer-checked:border-emerald-600 peer-checked:bg-emerald-50 transition-all font-bold text-slate-600 peer-checked:text-emerald-600 flex items-center justify-center gap-2">
                       <Globe className="w-4 h-4" /> {t.settingsForm.satellite}
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <p className="font-bold text-slate-800 text-sm mb-3">{t.settingsForm.distanceUnit}</p>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer group">
                    <input type="radio" name="unit" className="peer sr-only" defaultChecked />
                    <div className="p-3 rounded-xl border border-slate-200 bg-white peer-checked:border-[#0077b6] peer-checked:bg-blue-50 transition-all font-bold text-center text-sm text-slate-600 peer-checked:text-[#0077b6]">
                       {t.settingsForm.km}
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer group">
                    <input type="radio" name="unit" className="peer sr-only" />
                    <div className="p-3 rounded-xl border border-slate-200 bg-white peer-checked:border-[#0077b6] peer-checked:bg-blue-50 transition-all font-bold text-center text-sm text-slate-600 peer-checked:text-[#0077b6]">
                       {t.settingsForm.miles}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 3: Thông Báo */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 p-2 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight transition-colors">{t.settingsForm.notifications}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-slate-400" /> {t.settingsForm.reviewReplies}</p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-snug">{t.settingsForm.reviewRepliesDesc}</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#0077b6] dark:data-[state=checked]:bg-[#38bdf8]" />
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {t.settingsForm.nearbySpots}</p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-snug">{t.settingsForm.nearbySpotsDesc}</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#0077b6] dark:data-[state=checked]:bg-[#38bdf8]" />
              </div>
            </div>
          </div>

          {/* Section 4: Quyền Riêng Tư */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 p-2 rounded-xl transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight transition-colors">{t.settingsForm.privacy}</h2>
            </div>
            
            <div>
               <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{t.settingsForm.savedList}</p>
               <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-snug mb-4">{t.settingsForm.savedListDesc}</p>
               
               <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-1 flex transition-colors">
                 <label className="flex-1 cursor-pointer">
                    <input type="radio" name="privacy" className="peer sr-only" defaultChecked />
                    <div className="py-2 text-center text-sm font-bold text-slate-500 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-slate-800 dark:peer-checked:text-slate-50 peer-checked:shadow-sm rounded-lg transition-all">
                      {t.settingsForm.public}
                    </div>
                 </label>
                 <label className="flex-1 cursor-pointer">
                    <input type="radio" name="privacy" className="peer sr-only" />
                    <div className="py-2 text-center text-sm font-bold text-slate-500 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-slate-800 dark:peer-checked:text-slate-50 peer-checked:shadow-sm rounded-lg transition-all">
                      {t.settingsForm.private}
                    </div>
                 </label>
               </div>
            </div>
          </div>

          {/* Section 5: Hệ Thống */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-2 rounded-xl transition-colors">
                <Settings2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight transition-colors">{t.settingsForm.system}</h2>
            </div>
            
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group"
                onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
              >
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800 dark:text-slate-200"><Languages className="w-4 h-4 text-slate-400 group-hover:text-[#0077b6] dark:group-hover:text-[#38bdf8] transition-colors" /> {t.settingsForm.language}</div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded select-none hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{t.settingsForm.languageVal}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800 dark:text-slate-200"><Moon className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" /> {t.settingsForm.darkMode}</div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                  className="data-[state=checked]:bg-[#0077b6]"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group border-t border-slate-50 dark:border-slate-800/50 pt-4 mt-2">
                <div className="flex items-center gap-3 text-sm font-bold text-red-600 dark:text-red-400"><Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" /> {t.settingsForm.clearCache}</div>
                <span className="text-xs font-semibold text-slate-400">{t.settingsForm.clearCacheDesc}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
