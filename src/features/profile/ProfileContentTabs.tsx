"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Map as MapIcon, MessageSquare, Clock, Globe, ArrowRight, Star } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { useLocationStore } from "@/store/useLocationStore";

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
  const { savedLocationIds, locations, toggleSaveLocation, setSelectedLocation, setDetailModalOpen } = useLocationStore();
  
  const savedItems = locations.filter(loc => savedLocationIds.includes(loc.id));

  if (savedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">No saved locations yet.</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Explore the map and heart places you love!</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedItems.map((location) => (
        <div 
          key={location.id} 
          onClick={() => {
            setSelectedLocation(location);
            setDetailModalOpen(true);
          }}
          className="relative aspect-square w-full rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
        >
          {/* Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={location.imageUrl} 
            alt={location.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-500 group-hover:opacity-90"></div>

          {/* Content Container */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            {/* Top Container: Tag + Heart */}
            <div className="flex justify-between items-start">
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-extrabold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-sm">
                {location.category}
              </span>
              <button 
                  onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveLocation(location.id);
                  }}
                  className="bg-white/20 hover:bg-rose-500/80 backdrop-blur-md rounded-full p-2.5 text-white border border-white/30 transition-all hover:border-transparent"
              >
                <Heart className="w-4 h-4 fill-white" />
              </button>
            </div>

            {/* Bottom Content */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-2xl text-white mb-2 leading-tight drop-shadow-md line-clamp-2">
                  {location.name}
                </h3>
                <p className="text-slate-200 font-medium text-xs flex items-center gap-2">
                  {location.distance} <span className="w-1 h-1 bg-slate-400 rounded-full"></span> Mui Ne Area
                </p>
              </div>
              
              {/* Rating floating tag */}
              <div className="bg-white text-slate-800 font-bold text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl shrink-0 translate-y-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {location.rating}
              </div>
            </div>
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
  const { locations, setSelectedLocation, setDetailModalOpen } = useLocationStore();

  const allReviews = locations.flatMap((loc) => {
    if (!loc.reviews) return [];
    return loc.reviews.map((rev) => ({
      ...rev,
      location: loc,
      locationName: loc.name,
      bgImage: loc.imageUrl,
    }));
  });

  allReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allReviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Bạn chưa có đánh giá nào.</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Hãy ghé thăm các địa điểm và chia sẻ cảm nhận của bạn nhé!</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {allReviews.map((rev) => (
         <div 
           key={rev.id} 
           onClick={() => {
             setSelectedLocation(rev.location);
             setDetailModalOpen(true);
           }}
           className="relative aspect-square w-full rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
         >
           {/* Background Image */}
           <img src={rev.bgImage} alt={rev.locationName} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
           
           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 transition-opacity duration-500 group-hover:opacity-100"></div>

           {/* Content Container */}
           <div className="absolute inset-0 p-6 flex flex-col justify-between">
             {/* Top Container: Location Tag + Rating */}
             <div className="flex justify-between items-start gap-2">
                <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm truncate">
                  {rev.locationName}
                </span>
                <div className="flex gap-0.5 bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-full shrink-0">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-yellow-400 text-yellow-400 drop-shadow-md' : 'text-slate-500/50 fill-transparent'}`} />
                   ))}
                </div>
             </div>

             {/* Bottom Content: Review Text */}
             <div>
                <h4 className="text-white font-extrabold text-xl leading-tight mb-2 line-clamp-1 drop-shadow-md">{rev.userName}</h4>
                <p className="text-slate-200 text-sm font-medium leading-relaxed line-clamp-3 mb-3">{rev.comment}</p>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" />
                  {new Date(rev.date).toLocaleDateString('vi-VN')}
                </div>
             </div>
           </div>
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
