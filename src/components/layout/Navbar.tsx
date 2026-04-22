"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Settings, Menu, Compass, Bookmark, MapPin, User, LayoutGrid, Award, HelpCircle, LogOut } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { useLocationStore } from "@/store/useLocationStore";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useTranslation } from "@/i18n/useTranslation";
import { useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const profile = useProfileStore((state) => state.profile);
  const isAuthenticated = useProfileStore((state) => state.isAuthenticated);
  const { fetchLocations, locations, fetchSavedLocations } = useLocationStore();

  useEffect(() => {
    // Only fetch if empty to prevent re-fetching constantly, or just fetch once
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [fetchLocations, locations.length]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedLocations();
    }
  }, [fetchSavedLocations, isAuthenticated]);

  if (pathname === '/register' || pathname === '/login' || pathname.startsWith('/admin')) return null;

  const mainNav = [
    { href: '/', label: t.navbar.explore, icon: <Compass className="w-5 h-5" /> },
    { href: '/collections', label: t.navbar.collections, icon: <Bookmark className="w-5 h-5" /> },
    { href: '/add-location', label: t.navbar.addLocation, icon: <MapPin className="w-5 h-5" /> }
  ];

  const profileNav = [
    { href: '/profile', label: t.settingsSidebar.profile, icon: <User className="w-5 h-5" /> },
    { href: '/achievements', label: t.settingsSidebar.achievements, icon: <Award className="w-5 h-5" /> },
    { href: '/settings', label: t.settingsSidebar.settings, icon: <Settings className="w-5 h-5" /> },
    { href: '/help', label: t.settingsSidebar.helpSupport, icon: <HelpCircle className="w-5 h-5" /> }
  ];

  return (
    <header className="h-16 shrink-0 w-full border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] z-20 relative flex items-center justify-between px-4 md:px-6 transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Drawer */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 flex flex-col bg-[#f8fafc] dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800">
              <SheetHeader className="p-6 text-left border-b border-white dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 z-10">
                <SheetTitle className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-50">
                  {t.navbar.title} <span className="text-[#0077b6] dark:text-[#38bdf8]">{t.navbar.map}</span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10 custom-scrollbar">
                {/* Main Nav Section */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#0077b6] dark:text-[#38bdf8] px-2">Navigation</h4>
                  <nav className="flex flex-col space-y-1.5">
                    {mainNav.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                      return (
                        <SheetClose 
                          key={item.href} 
                          nativeButton={false}
                          render={
                            <Link 
                              href={item.href}
                              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-[15px] transition-all shadow-sm ${
                                isActive ? 'bg-white dark:bg-slate-900 text-[#0077b6] dark:text-[#38bdf8] border border-slate-100 dark:border-slate-800' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50 border border-transparent'
                              }`}
                            />
                          }
                        >
                          {item.icon}
                          {item.label}
                        </SheetClose>
                      );
                    })}
                  </nav>
                </div>

                {/* Profile Section */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-2">Account</h4>
                  
                  <div className="flex items-center gap-4 px-4 py-4 mb-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <img src={profile.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-slate-50 dark:border-slate-800" />
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-50">{profile.fullName}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5 tracking-wider">Level {profile.level?.current || 1}</p>
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-1.5">
                    {profileNav.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <SheetClose 
                          key={item.href} 
                          nativeButton={false}
                          render={
                            <Link 
                              href={item.href}
                              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                                isActive ? 'bg-[#f1f5cd] dark:bg-[#2a2d10] text-[#6d7e00] dark:text-[#a5b630] shadow-[0_2px_10px_rgba(202,213,158,0.3)] dark:shadow-none' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                              }`}
                            />
                          }
                        >
                          <div className={isActive ? "text-[#8a9d18] dark:text-[#b5ce1f]" : "text-slate-400 dark:text-slate-500"}>
                            {item.icon}
                          </div>
                          {item.label}
                        </SheetClose>
                      );
                    })}
                    {isAuthenticated && (
                      <SheetClose
                        nativeButton={false}
                        render={
                          <div 
                            onClick={() => {
                              useProfileStore.getState().logout();
                              router.push('/login');
                            }}
                            className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 w-full text-left cursor-pointer"
                          />
                        }
                      >
                        <div className="text-red-500">
                          <LogOut className="w-5 h-5" />
                        </div>
                        {t.settingsSidebar.logOut}
                      </SheetClose>
                    )}
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="text-xl font-bold text-slate-800 dark:text-slate-50 tracking-tight transition-colors">
          {t.navbar.title} <span className="text-[#0077b6] dark:text-[#38bdf8]">{t.navbar.map}</span>
        </Link>
        
        {/* Main Nav (Desktop) */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-1 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-colors">
          <Link 
            href="/" 
            className={`px-5 py-2 text-sm rounded-xl transition-all ${
              pathname === '/' 
                ? 'font-bold text-slate-800 dark:text-slate-50 bg-white dark:bg-slate-800 shadow-sm' 
                : 'font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            {t.navbar.explore}
          </Link>
          <Link 
            href="/collections" 
            className={`px-5 py-2 text-sm rounded-xl transition-all ${
              pathname === '/collections' || pathname.startsWith('/collections/')
                ? 'font-bold text-slate-800 dark:text-slate-50 bg-white dark:bg-slate-800 shadow-sm' 
                : 'font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            {t.navbar.collections}
          </Link>
          <Link 
            href="/add-location" 
            className={`px-5 py-2 text-sm rounded-xl transition-all ${
              pathname === '/add-location' 
                ? 'font-bold text-slate-800 dark:text-slate-50 bg-white dark:bg-slate-800 shadow-sm' 
                : 'font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`}
          >
            {t.navbar.addLocation}
          </Link>
        </nav>
      </div>

      {/* Right section: Profile */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link href="/settings" className="hidden md:block text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link href="/profile" className="hidden md:block w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm hover:ring-2 hover:ring-[#0077b6] dark:hover:ring-[#38bdf8] transition-all">
              <img src={profile.avatarUrl} alt="User" className="w-full h-full object-cover" />
            </Link>
          </>
        ) : (
          <Link href="/login" className="bg-[#0077b6] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[#005f92] transition-colors">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
