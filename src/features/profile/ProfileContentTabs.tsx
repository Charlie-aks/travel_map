"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Map as MapIcon, MessageSquare, Clock, Globe, ArrowRight, Star, MapPin, Edit3 } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { useLocationStore } from "@/store/useLocationStore";
import { useRouter } from "next/navigation";
import { useAddLocationStore } from "@/store/useAddLocationStore";
import Map from "@/features/map-view/Map";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 6;

type TabType = 'saved' | 'my-locations' | 'map' | 'reviews' | 'activities';

export function ProfileContentTabs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('saved');

  const tabs = [
    { id: 'saved', label: t.profile.savedPlaces, icon: <Heart className="w-4 h-4" /> },
    { id: 'my-locations', label: t.profile.myLocations || "Địa điểm của tôi", icon: <MapPin className="w-4 h-4" /> },
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
            {activeTab === 'my-locations' && <MyLocationsTab />}
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
  const [currentPage, setCurrentPage] = useState(1);
  
  const savedItems = locations.filter(loc => savedLocationIds.includes(loc.id));
  const totalPages = Math.ceil(savedItems.length / ITEMS_PER_PAGE);
  const currentItems = savedItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
    <div className="flex flex-col">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((location) => (
          <div 
            key={location.id} 
            onClick={() => {
              setSelectedLocation(location);
              setDetailModalOpen(true);
            }}
            className="relative aspect-square w-full rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
          >
            <img 
              src={location.imageUrl} 
              alt={location.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-500 group-hover:opacity-90"></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
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
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-2xl text-white mb-2 leading-tight drop-shadow-md line-clamp-2">
                    {location.name}
                  </h3>
                  <p className="text-slate-200 font-medium text-xs flex items-center gap-2">
                    {location.distance} <span className="w-1 h-1 bg-slate-400 rounded-full"></span> Mui Ne Area
                  </p>
                </div>
                <div className="bg-white text-slate-800 font-bold text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl shrink-0 translate-y-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {location.rating}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {(totalPages > 1) && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}

function MyLocationsTab() {
  const { t } = useTranslation();
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { loadLocation } = useAddLocationStore();

  useEffect(() => {
    fetch('/api/profile/locations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLocations(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      })
  }, []);

  if (loading) {
     return <div className="py-20 text-center text-slate-500">Loading...</div>;
  }

  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MapPin className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{t.profile.noLocations || "Bạn chưa gửi địa điểm nào."}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(locations.length / ITEMS_PER_PAGE);
  const currentItems = locations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((location) => (
          <div key={location.id} className="relative aspect-square w-full rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
            <img src={location.imageUrl} alt={location.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-500 group-hover:opacity-90"></div>
            
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm text-white ${location.status === 'APPROVED' ? 'bg-green-500/80 border-green-400' : 'bg-amber-500/80 border-amber-400'} backdrop-blur-md border`}>
                  {location.status === 'APPROVED' ? (t.profile.approved || "Đã duyệt") : (t.profile.pending || "Đang chờ")}
                </span>
                {location.status === 'PENDING' && (
                    <button 
                      onClick={() => {
                          loadLocation(location);
                          router.push('/add-location');
                      }}
                      className="bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2.5 text-white border border-white/30 transition-all flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                )}
              </div>
              
              <div>
                 <h3 className="font-extrabold text-xl text-white mb-1 leading-tight drop-shadow-md line-clamp-2">
                   {location.name}
                 </h3>
                 <p className="text-slate-200 font-medium text-xs">
                   {location.category}
                 </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {(totalPages > 1) && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}

function MyMapTab() {
  return (
    <div className="h-[600px] relative rounded-[2rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
       <Map />
    </div>
  );
}

function ReviewsPhotosTab() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('/api/profile/reviews')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
     return <div className="py-20 text-center text-slate-500">Loading...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <MessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Bạn chưa có đánh giá nào.</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Hãy ghé thăm các địa điểm và chia sẻ cảm nhận của bạn nhé!</p>
      </div>
    );
  }

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const currentItems = reviews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((rev) => (
           <div 
             key={rev.id} 
             className="relative aspect-square w-full rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
           >
             <img src={rev.bgImage} alt={rev.locationName} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 transition-opacity duration-500 group-hover:opacity-100"></div>

             <div className="absolute inset-0 p-6 flex flex-col justify-between">
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

               <div>
                  <h4 className="text-white font-extrabold text-xl leading-tight mb-2 line-clamp-1 drop-shadow-md">{rev.userName}</h4>
                  <p className="text-slate-200 text-sm font-medium leading-relaxed line-clamp-3 mb-3">{rev.comment}</p>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" />
                    {rev.date}
                  </div>
               </div>
             </div>
           </div>
        ))}
      </div>
      {(totalPages > 1) && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
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
