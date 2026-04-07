"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Map as MapIcon, MessageSquare, Clock, Globe, ArrowRight } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";

type TabType = 'saved' | 'map' | 'reviews' | 'activities';

export function ProfileContentTabs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('saved');

  const tabs = [
    { id: 'saved', label: t.profile.savedPlaces, icon: <Heart className="w-4 h-4" /> },
    { id: 'map', label: t.profile.myMap, icon: <MapIcon className="w-4 h-4" /> },
    { id: 'reviews', label: t.profile.reviewsPhotos, icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'activities', label: t.profile.activities, icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-[0_8px_40px_rgba(0,0,0,0.03)] transition-colors mb-12 min-h-[600px]">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit transition-all">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? "bg-white dark:bg-slate-700 text-[#0077b6] dark:text-[#38bdf8] shadow-sm transform scale-105" 
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'saved' && <SavedPlacesTab />}
            {activeTab === 'map' && <MyMapTab />}
            {activeTab === 'reviews' && <ReviewsPhotosTab />}
            {activeTab === 'activities' && <ActivityTimelineTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SavedPlacesTab() {
  const { t } = useTranslation();
  // Mock saved places
  const savedItems = [
    { id: 1, name: 'Mui Ne Beach', category: 'Nature', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
    { id: 2, name: 'Cham Towers', category: 'Culture', img: 'https://images.unsplash.com/photo-1598214815403-9c86466f3630?w=400' },
    { id: 3, name: 'Red Sand Dunes', category: 'Nature', img: 'https://images.unsplash.com/photo-1596402184320-417d7178b2cd?w=400' },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedItems.map((item) => (
        <div key={item.id} className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all hover:scale-[1.02] hover:shadow-lg">
          <div className="h-40 overflow-hidden relative">
            <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <button className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2 text-white border border-white/30 transition-all">
              <Heart className="w-4 h-4 fill-white" />
            </button>
          </div>
          <div className="p-4">
            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight mb-1">{item.name}</h4>
            <span className="text-[10px] font-bold text-[#0077b6] dark:text-[#38bdf8] uppercase tracking-widest">{item.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MyMapTab() {
  return (
    <div className="h-[450px] relative rounded-[2rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
       <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors">
          <div className="text-center p-8">
             <Globe className="w-12 h-12 text-[#0077b6] dark:text-[#38bdf8] mx-auto mb-4 opacity-30 animate-pulse" />
             <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Map data is loading...</p>
             <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-2 uppercase tracking-tighter">Your 12 markers are being processed</p>
          </div>
       </div>
    </div>
  );
}

function ReviewsPhotosTab() {
  const reviews = [
    { id: 1, title: 'Amazing sunset!', body: 'Best place to see the sunset in Mui Ne. Definitely worth it.', date: '2 days ago', rating: 5 },
    { id: 2, title: 'Good seafood', body: 'Local catch was fresh but a bit pricey.', date: '1 week ago', rating: 4 },
  ];

  return (
    <div className="space-y-6">
      {reviews.map((rev) => (
         <div key={rev.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
           <div className="flex justify-between items-start mb-4">
             <div>
               <h4 className="text-sm font-black text-slate-800 dark:text-white transition-colors">{rev.title}</h4>
               <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 transition-colors uppercase tracking-widest">{rev.date}</p>
             </div>
             <div className="flex gap-1">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className={`w-3 h-3 rounded-full ${i < rev.rating ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-slate-200 dark:bg-slate-700'}`} />
               ))}
             </div>
           </div>
           <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium transition-colors">{rev.body}</p>
         </div>
      ))}
    </div>
  );
}

function ActivityTimelineTab() {
  const events = [
    { id: 1, type: 'checkin', text: 'Checked in at Mui Ne Sand Dunes', time: 'Yesterday, 6:00 PM' },
    { id: 2, type: 'contribution', text: 'Added a new review for Làng Chài Seafood', time: '3 days ago' },
    { id: 3, type: 'achievement', text: 'Earned the "Sea Lover" Badge', time: 'Last week' },
  ];

  return (
    <div className="space-y-8 py-4 pl-4">
       {events.map((ev, idx) => (
         <div key={ev.id} className="relative flex gap-6 group">
            {/* Timeline Line */}
            {idx !== events.length - 1 && (
               <div className="absolute left-[11px] top-10 w-[2px] h-10 bg-slate-100 dark:bg-slate-800 transition-colors" />
            )}
            
            <div className="relative z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-[#0077b6] dark:border-[#38bdf8] flex items-center justify-center transition-colors group-hover:scale-125">
               <div className="w-1.5 h-1.5 rounded-full bg-[#0077b6] dark:bg-[#38bdf8]" />
            </div>

            <div>
               <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight transition-colors">{ev.text}</p>
               <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 transition-colors">{ev.time}</p>
            </div>
         </div>
       ))}
    </div>
  );
}
