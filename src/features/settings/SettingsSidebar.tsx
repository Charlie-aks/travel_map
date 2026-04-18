"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { User, LayoutGrid, Award, Settings, HelpCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useTranslation } from "@/i18n/useTranslation";

export function SettingsSidebar() {
  const profile = useProfileStore((state) => state.profile);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const navItems = [
    { icon: <User className="w-5 h-5" />, label: t.settingsSidebar.profile, href: "/profile" },
    { icon: <Award className="w-5 h-5" />, label: t.settingsSidebar.achievements, href: "/achievements" },
    { icon: <Settings className="w-5 h-5" />, label: t.settingsSidebar.settings, href: "/settings" },
    { icon: <HelpCircle className="w-5 h-5" />, label: t.settingsSidebar.helpSupport, href: "/help" },
  ];

  return (
    <aside className="w-[240px] lg:w-[280px] shrink-0 h-[calc(100vh-4rem)] hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 py-8 px-6 overflow-y-auto sticky top-16 z-10 transition-colors">
      {/* Profile Summary */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-md mb-4 bg-slate-100 dark:bg-slate-800 relative group transition-colors">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
        </div>
        <h2 className="font-extrabold text-slate-800 dark:text-slate-50 text-lg text-center tracking-tight leading-tight transition-colors">{profile.fullName}</h2>
        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1 text-center transition-colors">Digital Concierge Member</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 flex flex-col pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/profile" && pathname.startsWith("/profile"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                isActive 
                  ? "bg-[#f1f5cd] dark:bg-[#2a2d10] text-[#6d7e00] dark:text-[#a5b630] shadow-[0_2px_10px_rgba(202,213,158,0.3)] dark:shadow-none" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-50"
              }`}
            >
              <div className={isActive ? "text-[#8a9d18] dark:text-[#b5ce1f]" : "text-slate-400 dark:text-slate-500"}>
                {item.icon}
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-8 space-y-3">
        <button className="w-full bg-[#0077b6] hover:bg-[#005f92] text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-sm">
          {t.settingsSidebar.upgrade}
        </button>
        <button 
          onClick={() => {
            useProfileStore.getState().logout();
            router.push('/login');
          }}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold px-4 py-3 rounded-xl transition-colors w-full text-sm"
        >
          <LogOut className="w-4 h-4" /> {t.settingsSidebar.logOut}
        </button>
      </div>
    </aside>
  );
}
