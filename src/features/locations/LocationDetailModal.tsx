"use client";

import { useLocationStore } from "@/store/useLocationStore";
import { useAddLocationStore } from "@/store/useAddLocationStore";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Star, MapPin, Share, Heart, Clock, Ticket, Phone, Compass, Sun, Waves, Camera, Utensils, Edit3, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { CurrentWeatherVibe } from "./CurrentWeatherVibe";
import { LocationReviews } from "./LocationReviews";

export function LocationDetailModal() {
  const router = useRouter();
  const { isDetailModalOpen, setDetailModalOpen, selectedLocation, savedLocationIds, toggleSaveLocation } = useLocationStore();
  const { loadLocation } = useAddLocationStore();
  const { t } = useTranslation();

  const handleEdit = () => {
    if (selectedLocation) {
      loadLocation(selectedLocation);
      setDetailModalOpen(false);
      router.push('/add-location?edit=true');
    }
  };

  if (!selectedLocation) return null;
  const isSaved = savedLocationIds.includes(selectedLocation.id);

  return (
    <Sheet open={isDetailModalOpen} onOpenChange={setDetailModalOpen}>
      <SheetContent side="right" className="max-sm:w-full! max-sm:max-w-full! max-sm:rounded-none w-[95vw] md:min-w-[70vw] lg:min-w-[60vw] max-w-[95vw] p-0 overflow-hidden bg-[#f8fafc] dark:bg-slate-950 overflow-y-auto custom-scrollbar border-0 rounded-l-xl shadow-2xl transition-colors" aria-describedby="dialog-description">
        <SheetTitle className="sr-only">{selectedLocation.name}</SheetTitle>
        <SheetDescription id="dialog-description" className="sr-only">{selectedLocation.description}</SheetDescription>
        {/* 1. Hero Image Section */}
        <div className="relative w-full h-[400px]">
          {/* Custom Close Button for Mobile Only */}
          <SheetClose className="sm:hidden absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors border border-white/20">
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </SheetClose>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={selectedLocation.imageUrl} 
            alt={selectedLocation.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <span className="bg-black/30 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm mb-4 inline-block">
                {t.locationDetail.featuredDestination}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">{selectedLocation.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {selectedLocation.rating} ({selectedLocation.reviewsCount} {t.locationDetail.reviews})
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4" />
                  {selectedLocation.distance}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-md px-5 py-2.5 rounded-full transition-colors font-semibold shadow-sm">
                <Share className="w-4 h-4" /> {t.locationDetail.share}
              </button>
              <button 
                onClick={() => toggleSaveLocation(selectedLocation.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors font-bold shadow-lg ${
                  isSaved 
                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-900/60" 
                    : "bg-white text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Heart className={`w-4 h-4 transition-all ${isSaved ? "fill-current" : "text-[#0077b6] fill-blue-100 dark:text-[#38bdf8] dark:fill-[#38bdf8]/20"}`} /> 
                {isSaved ? t.locationDetail.saved : t.locationDetail.save}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Content Split Layout */}
        <div className="p-5 sm:p-8 md:p-12 flex flex-col lg:flex-row gap-8 sm:gap-12 max-w-[1200px] mx-auto">
          
          {/* Left Column: Details */}
          <div className="flex-1">
            <section className="mb-12">
              <h2 className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0077b6] dark:text-[#38bdf8] mb-4 transition-colors">{t.locationDetail.about}</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium mb-6 transition-colors">
                {selectedLocation.description}
              </p>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">
                {t.locationDetail.aboutDesc}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0077b6] dark:text-[#38bdf8] mb-6 transition-colors">{t.locationDetail.highlights}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <Sun />, title: t.locationDetail.highlightList.goldenHour.title, desc: t.locationDetail.highlightList.goldenHour.desc },
                  { icon: <Waves />, title: t.locationDetail.highlightList.calmWaters.title, desc: t.locationDetail.highlightList.calmWaters.desc },
                  { icon: <Utensils />, title: t.locationDetail.highlightList.freshSeafood.title, desc: t.locationDetail.highlightList.freshSeafood.desc },
                  { icon: <Camera />, title: t.locationDetail.highlightList.photogenic.title, desc: t.locationDetail.highlightList.photogenic.desc }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
                    <div className="text-[#0077b6] dark:text-[#38bdf8] mb-4 transition-colors">{item.icon}</div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-50 mb-2 transition-colors">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <LocationReviews location={selectedLocation} />
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="sticky top-8 space-y-6">
              
              <CurrentWeatherVibe lat={selectedLocation.lat} lng={selectedLocation.lng} />
              
              {/* Plan Your Visit Card */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
                <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-50 mb-8 transition-colors">{t.locationDetail.planVisit}</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#0077b6] dark:text-[#38bdf8] flex items-center justify-center shrink-0 transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors">{t.locationDetail.address}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">{selectedLocation.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#0077b6] dark:text-[#38bdf8] flex items-center justify-center shrink-0 transition-colors">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors">{t.locationDetail.bestTiming}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">{selectedLocation.bestTiming || t.locationDetail.allDay}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 transition-colors">{t.locationDetail.open24}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#0077b6] dark:text-[#38bdf8] flex items-center justify-center shrink-0 transition-colors">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors">{t.locationDetail.entrance}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">{selectedLocation.price || t.locationDetail.freeAccess}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#0077b6] dark:text-[#38bdf8] flex items-center justify-center shrink-0 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 transition-colors">{t.locationDetail.contact}</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">+84 252 3847 444</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 transition-colors">
                  <button
                    onClick={() => {
                      if (selectedLocation) {
                        useLocationStore.getState().setRoutingDestination(selectedLocation);
                        useLocationStore.getState().setDetailModalOpen(false);
                      }
                    }}
                    className="w-full bg-[#0077b6] hover:bg-[#005f92] dark:bg-[#38bdf8] dark:hover:bg-[#0284c7] text-white dark:text-slate-900 font-bold py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <Compass className="w-5 h-5" /> {t.locationDetail.inAppDirections}
                  </button>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-50 dark:bg-blue-900/20 text-[#0077b6] dark:text-[#38bdf8] hover:bg-blue-100 dark:hover:bg-blue-900/40 font-bold py-3.5 rounded-xl transition-colors shadow-none flex items-center justify-center gap-2"
                  >
                    {t.locationDetail.openGoogleMaps}
                  </a>
                  <button onClick={handleEdit} className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Edit3 className="w-4 h-4" /> {t.locationDetail.editSpot}
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(t.locationDetail.deleteConfirm)) {
                        // @ts-ignore
                        useLocationStore.getState().deleteLocation(selectedLocation.id);
                        setDetailModalOpen(false);
                      }
                    }} 
                    className="w-full mt-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    {t.locationDetail.deleteSpot}
                  </button>
                </div>
              </div>

              {/* Insider Tip Card */}
              <div className="bg-[#fffdf0] dark:bg-yellow-900/10 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 shadow-sm relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full blur-2xl -mr-10 -mt-10 transition-colors"></div>
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <Compass className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                  <span className="text-[10px] font-extrabold text-orange-600 dark:text-orange-500 tracking-wider uppercase transition-colors">{t.locationDetail.insiderTip}</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium relative z-10 transition-colors">
                  {t.locationDetail.insiderTipDesc}
                </p>
              </div>

            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
