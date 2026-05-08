"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { User, Map, Bell, Shield, Settings2, KeyRound, Mail, Link2, Map as MapIcon, Globe, Moon, Trash2, Languages, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "@/i18n/useTranslation";
import { useI18nStore } from "@/store/useI18nStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useProfileStore } from "@/store/useProfileStore";
import { Input } from "@/components/ui/input";

export function SettingsForm() {
  const { theme, setTheme } = useTheme();
  const { t, language } = useTranslation();
  const setLanguage = useI18nStore((state) => state.setLanguage);
  
  const { profile, updateProfile } = useProfileStore();
  const settings = useSettingsStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile?.fullName || "");
  const [isSavingName, setIsSavingName] = useState(false);

  const handleSaveName = async () => {
    if (!newName.trim() || newName === profile?.fullName) {
      setIsEditingName(false);
      return;
    }
    setIsSavingName(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        updateProfile({ fullName: newName });
      } else {
        alert("Có lỗi xảy ra khi cập nhật tên.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingName(false);
      setIsEditingName(false);
    }
  };

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
              {/* Display Name Edit */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl transition-colors border border-transparent">
                <div className="flex items-center gap-4 w-full">
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm text-slate-600 dark:text-slate-400"><User className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Tên hiển thị</h4>
                    {isEditingName ? (
                      <Input 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        className="mt-1 h-8 text-xs bg-white dark:bg-slate-900" 
                        autoFocus
                      />
                    ) : (
                      <p className="text-xs font-semibold text-[#0077b6] dark:text-[#38bdf8] mt-0.5">{profile?.fullName || "Chưa có tên"}</p>
                    )}
                  </div>
                </div>
                {isEditingName ? (
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => { setIsEditingName(false); setNewName(profile?.fullName || ""); }} 
                      className="text-xs font-bold text-slate-500 hover:text-slate-700"
                    >
                      Hủy
                    </button>
                    <button 
                      onClick={handleSaveName} 
                      disabled={isSavingName}
                      className="text-xs font-bold bg-[#0077b6] text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      {isSavingName ? <Loader2 className="w-3 h-3 animate-spin" /> : "Lưu"}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditingName(true)} className="text-sm font-bold text-[#0077b6] dark:text-[#38bdf8] whitespace-nowrap ml-4">Đổi tên</button>
                )}
              </div>

              {/* Email (Read-only for now) */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl transition-colors border border-transparent">
                <div className="flex items-center gap-4">
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm text-slate-600 dark:text-slate-400"><Mail className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.settingsForm.emailAdd}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{profile?.email || "Chưa cập nhật email"}</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-slate-400 cursor-not-allowed">Cố định</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm text-slate-600 dark:text-slate-400"><Link2 className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.settingsForm.socialLinks}</h4>
                    <p className="text-xs font-semibold text-emerald-600 mt-0.5">Đã kết nối với Google</p>
                  </div>
                </div>
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
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3">{t.settingsForm.mapStyle}</p>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="mapStyle" 
                      className="peer sr-only" 
                      checked={settings.mapStyle === 'streets'}
                      onChange={() => settings.setMapStyle('streets')}
                    />
                    <div className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 peer-checked:border-[#0077b6] peer-checked:bg-blue-50 dark:peer-checked:bg-[#0077b6]/20 transition-all font-bold text-slate-600 dark:text-slate-400 peer-checked:text-[#0077b6] dark:peer-checked:text-[#38bdf8] flex items-center justify-center gap-2">
                       <MapIcon className="w-4 h-4" /> {t.settingsForm.streets}
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="mapStyle" 
                      className="peer sr-only" 
                      checked={settings.mapStyle === 'satellite'}
                      onChange={() => settings.setMapStyle('satellite')}
                    />
                    <div className="p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 peer-checked:border-emerald-600 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 transition-all font-bold text-slate-600 dark:text-slate-400 peer-checked:text-emerald-600 dark:peer-checked:text-emerald-400 flex items-center justify-center gap-2">
                       <Globe className="w-4 h-4" /> {t.settingsForm.satellite}
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-3">{t.settingsForm.distanceUnit}</p>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="unit" 
                      className="peer sr-only" 
                      checked={settings.distanceUnit === 'km'}
                      onChange={() => settings.setDistanceUnit('km')}
                    />
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 peer-checked:border-[#0077b6] peer-checked:bg-blue-50 dark:peer-checked:bg-[#0077b6]/20 transition-all font-bold text-center text-sm text-slate-600 dark:text-slate-400 peer-checked:text-[#0077b6] dark:peer-checked:text-[#38bdf8]">
                       {t.settingsForm.km}
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="unit" 
                      className="peer sr-only" 
                      checked={settings.distanceUnit === 'miles'}
                      onChange={() => settings.setDistanceUnit('miles')}
                    />
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 peer-checked:border-[#0077b6] peer-checked:bg-blue-50 dark:peer-checked:bg-[#0077b6]/20 transition-all font-bold text-center text-sm text-slate-600 dark:text-slate-400 peer-checked:text-[#0077b6] dark:peer-checked:text-[#38bdf8]">
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
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 flex items-center gap-2">Thông báo từ hệ thống</p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-snug">Nhận thông báo khi địa điểm của bạn được duyệt.</p>
                </div>
                <Switch 
                  checked={settings.notifications} 
                  onCheckedChange={settings.setNotifications} 
                  className="data-[state=checked]:bg-[#0077b6] dark:data-[state=checked]:bg-[#38bdf8]" 
                />
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1 flex items-center gap-2">Gợi ý địa điểm mới</p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-snug">Cho phép chúng tôi đề xuất các địa điểm dựa trên sở thích.</p>
                </div>
                <Switch 
                  checked={settings.nearbySpots} 
                  onCheckedChange={settings.setNearbySpots} 
                  className="data-[state=checked]:bg-[#0077b6] dark:data-[state=checked]:bg-[#38bdf8]" 
                />
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
                    <input 
                      type="radio" 
                      name="privacy" 
                      className="peer sr-only" 
                      checked={settings.privacy === 'public'}
                      onChange={() => settings.setPrivacy('public')}
                    />
                    <div className="py-2 text-center text-sm font-bold text-slate-500 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-slate-800 dark:peer-checked:text-slate-50 peer-checked:shadow-sm rounded-lg transition-all">
                      {t.settingsForm.public}
                    </div>
                 </label>
                 <label className="flex-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name="privacy" 
                      className="peer sr-only" 
                      checked={settings.privacy === 'private'}
                      onChange={() => settings.setPrivacy('private')}
                    />
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
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
