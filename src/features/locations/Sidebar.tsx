"use client";

import { useState } from "react";
import { Search, Map as MapIcon, GripHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/constants/mock-data";
import { useLocationStore } from "@/store/useLocationStore";
import { LocationCard } from "./LocationCard";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from "@/components/ui/drawer";
import { useTranslation } from "@/i18n/useTranslation";

const categories: Category[] = ["All", "Beaches", "Dining", "Stay", "Cultural"];

export function Sidebar() {
  const { activeCategory, setActiveCategory, setSearchQuery, filteredLocations } = useLocationStore();
  const locations = filteredLocations();
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();

  // Trigger map resize when sidebar toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSearchQuery(e.target.value);
  };

  const getCategoryLabel = (cat: string) => {
    switch(cat) {
      case 'All': return t.map.categories.all;
      case 'Beaches': return t.map.categories.beaches;
      case 'Dining': return t.map.categories.dining;
      case 'Stay': return t.map.categories.stay;
      case 'Cultural': return t.map.categories.cultural;
      default: return cat;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 w-full transition-colors">
      {/* Header & Filter */}
      <div className="px-6 pt-8 pb-4 bg-transparent z-10 transition-colors">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-50 tracking-tight mb-2 transition-colors">{t.map.exploreTitle}</h1>
        <p className="text-[15px] text-slate-500 dark:text-slate-400 mb-6 transition-colors">
          {t.map.youHave} <span className="font-bold text-[#0077b6] dark:text-[#38bdf8] transition-colors">{locations.length}</span> {t.map.placesWaiting}
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            className="pl-11 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm border-slate-100 dark:border-slate-800 focus-visible:ring-[#0077b6] text-slate-800 dark:text-slate-50 text-base transition-colors" 
            placeholder={t.map.searchPlaceholder} 
            value={searchValue}
            onChange={handleSearch}
          />
        </div>

        <Tabs defaultValue="All" value={activeCategory} onValueChange={(v) => setActiveCategory(v as Category)}>
          <TabsList className="w-full justify-start overflow-x-auto bg-transparent p-0 no-scrollbar gap-2 h-auto flex-nowrap">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-slate-800 dark:data-[state=active]:text-slate-50 data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-500 dark:data-[state=inactive]:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 shrink-0"
              >
                {getCategoryLabel(cat)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* List */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 transparent' }}>
        <div className="flex flex-col pt-4">
          {useLocationStore((s) => s.isLoading) ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="mb-4 bg-white dark:bg-slate-900 rounded-[24px] p-2 flex gap-4 h-[120px] shadow-sm animate-pulse">
                <div className="w-[100px] h-[104px] rounded-[18px] bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                <div className="flex-1 py-2 pr-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : locations.length > 0 ? (
            locations.map((loc) => (
              <LocationCard key={loc.id} location={loc} />
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-[15px] transition-colors">
              {t.map.noLocationsFound}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div 
        className={`hidden md:flex h-full border-r border-slate-100 dark:border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-30 bg-white dark:bg-slate-900 transition-all duration-300 relative shrink-0 ${
          isOpen ? 'w-[420px]' : 'w-0'
        }`}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md rounded-full p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center pointer-events-auto"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
        </button>

        <div className="w-full h-full overflow-hidden">
          <div className="w-[420px] h-full flex flex-col bg-[#f8fafc] dark:bg-slate-950 transition-colors">
            {sidebarContent}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet (Drawer) */}
      <div className="md:hidden fixed bottom-1 left-0 right-0 z-50 px-2">
        <Drawer>
          <DrawerTrigger asChild>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-4 flex flex-col items-center cursor-pointer border border-slate-100 dark:border-slate-800 mx-2 mb-2 transition-colors">
              <GripHorizontal className="w-6 h-6 text-slate-300 dark:text-slate-600 mb-2 transition-colors" />
              <div className="flex items-center justify-between w-full px-2">
                <span className="font-bold text-slate-800 dark:text-slate-50 transition-colors">{t.map.locationList}</span>
                <span className="bg-blue-50 dark:bg-blue-900/30 text-[13px] text-[#0077b6] dark:text-[#38bdf8] px-3 py-1 rounded-full font-bold transition-colors">
                  {locations.length}
                </span>
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent className="h-[85vh] bg-[#f8fafc] dark:bg-slate-950 transition-colors border-t border-slate-200 dark:border-slate-800">
            <DrawerTitle className="sr-only">{t.map.locationList}</DrawerTitle>
            {sidebarContent}
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
