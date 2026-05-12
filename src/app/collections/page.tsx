"use client";

import { useLocationStore } from "@/store/useLocationStore";
import { LocationCard } from "@/features/locations/LocationCard";
import { Lightbulb, Calendar, Bus } from "lucide-react";
import { useState, useMemo } from "react";

export default function CollectionsPage() {
  const { locations, savedLocationIds } = useLocationStore();
  const [activeTab, setActiveTab] = useState("Tất cả");

  const tabs = ["Tất cả", "Bãi biển", "Quán ăn", "Nghỉ dưỡng", "Văn hóa"];

  // Filter logic
  const savedLocations = locations.filter(loc => savedLocationIds.includes(loc.id));
  
  const filteredOutput = activeTab === "Tất cả" 
    ? savedLocations 
    : savedLocations.filter(loc => {
        if (activeTab === "Bãi biển") return loc.category === "Beaches";
        if (activeTab === "Quán ăn") return loc.category === "Dining";
        if (activeTab === "Nghỉ dưỡng") return loc.category === "Stay";
        if (activeTab === "Văn hóa") return loc.category === "Cultural";
        return true;
      });

  // 1. Gợi ý thông minh
  const { suggestedLocation, favoriteCategoryName } = useMemo(() => {
    if (savedLocations.length === 0) return { suggestedLocation: null, favoriteCategoryName: "" };

    const categoryCount = savedLocations.reduce((acc, loc) => {
      acc[loc.category] = (acc[loc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    let favoriteCategory = "Beaches";
    let maxCount = 0;
    for (const [cat, count] of Object.entries(categoryCount)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteCategory = cat;
      }
    }

    const categoryNames: Record<string, string> = {
      "Beaches": "biển",
      "Dining": "ẩm thực",
      "Stay": "nghỉ dưỡng",
      "Cultural": "văn hóa"
    };

    // Find highest rated unsaved location in favorite category
    const unsavedInFav = locations
      .filter(loc => loc.category === favoriteCategory && !savedLocationIds.includes(loc.id))
      .sort((a, b) => b.rating - a.rating);

    return {
      suggestedLocation: unsavedInFav.length > 0 ? unsavedInFav[0] : null,
      favoriteCategoryName: categoryNames[favoriteCategory] || "du lịch"
    };
  }, [savedLocations, locations, savedLocationIds]);

  // Helper to calculate distance
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
  };

  // 2. Lịch trình động (AI/Dynamic Schedule based on coordinates)
  const schedule = useMemo(() => {
    if (savedLocations.length === 0) return [];
    
    const unvisited = [...savedLocations];
    const scheduleItems = [];
    
    // Start with the first saved location
    let current = unvisited.shift()!;
    scheduleItems.push(current);

    // Greedy Nearest Neighbor to build a logical path
    while (unvisited.length > 0 && scheduleItems.length < 4) {
      let nearestIdx = 0;
      let minDistance = Infinity;
      for (let i = 0; i < unvisited.length; i++) {
        const dist = getDistance(current.lat, current.lng, unvisited[i].lat, unvisited[i].lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }
      current = unvisited[nearestIdx];
      scheduleItems.push(current);
      unvisited.splice(nearestIdx, 1);
    }
    
    const times = ["08:30 AM", "12:00 PM", "15:30 PM", "19:00 PM"];
    const actions = ["Khởi hành tại", "Ăn trưa/Nghỉ tại", "Buổi chiều ở", "Buổi tối tại"];
    
    return scheduleItems.map((loc, idx) => ({
      time: times[idx] || "Tối",
      action: actions[idx] || "Tham quan",
      name: loc.name,
      id: loc.id
    }));
  }, [savedLocations]);

  return (
    <main className="flex-1 w-full bg-[#f8fafc] overflow-y-auto custom-scrollbar relative px-6 md:px-12 lg:px-24 py-12">
      <div className="max-w-[1400px] mx-auto w-full">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight drop-shadow-sm">
              Địa điểm đã lưu
            </h1>
            <p className="text-lg text-slate-500 font-medium">
              Bạn có <span className="font-bold text-[#0077b6]">{savedLocations.length}</span> địa điểm tuyệt vời đang chờ khám phá tại Phan Thiết.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex-wrap">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab 
                    ? "bg-white text-[#0077b6] shadow-[0_2px_10px_rgb(0,0,0,0.08)] ring-1 ring-slate-100" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Column Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Area: Grid of Location Cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-start auto-rows-max">
            {filteredOutput.length > 0 ? (
              filteredOutput.map((loc) => (
                <LocationCard key={loc.id} location={loc} showDelete={true} />
              ))
            ) : (
              <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-500 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-slate-300" />
                </div>
                Bạn chưa lưu địa điểm nào trong mục này.
              </div>
            )}
          </div>

          {/* Right Area: Widgets */}
          <div className="w-full lg:w-[380px] shrink-0 space-y-6 lg:sticky lg:top-8 self-start">
            
            {/* Widget 1: Insider Tip */}
            {suggestedLocation ? (
              <div className="bg-[#0077b6] text-white rounded-3xl overflow-hidden shadow-lg p-8 relative">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase mb-6 opacity-90">
                  <Lightbulb className="w-4 h-4" /> Gợi ý thông minh
                </div>
                <h3 className="text-2xl font-extrabold mb-4 leading-tight">Dành riêng cho bạn</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-8">
                  Dựa trên sở thích yêu thích <strong className="text-white">{favoriteCategoryName}</strong> của bạn, chúng tôi gợi ý <strong>{suggestedLocation.name}</strong> mà bạn chưa từng ghé thăm.
                </p>
                <button 
                  onClick={() => window.location.href = `/?location=${suggestedLocation.id}`}
                  className="w-full bg-white text-[#0077b6] hover:bg-slate-50 font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                >
                  Khám phá ngay
                </button>
              </div>
            ) : (
              <div className="bg-[#0077b6] text-white rounded-3xl overflow-hidden shadow-lg p-8 relative">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase mb-6 opacity-90">
                  <Lightbulb className="w-4 h-4" /> Bắt đầu khám phá
                </div>
                <h3 className="text-2xl font-extrabold mb-4 leading-tight">Lưu địa điểm yêu thích</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-8">
                  Hãy dạo quanh bản đồ và nhấn lưu các địa điểm bạn muốn đến. Chúng tôi sẽ thiết kế gợi ý và lịch trình dành riêng cho bạn!
                </p>
                <button 
                  onClick={() => window.location.href = `/`}
                  className="w-full bg-white text-[#0077b6] hover:bg-slate-50 font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                >
                  Mở bản đồ
                </button>
              </div>
            )}

            {/* Widget 2: Suggested Schedule */}
            {schedule.length > 0 && (
              <div className="bg-[#eaeaec]/60 border border-slate-200/60 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-extrabold text-slate-800">Lịch trình đề xuất</h3>
                  <Calendar className="w-5 h-5 text-slate-400" />
                </div>
                
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {schedule.map((item, idx) => (
                    <div key={item.id} className={`relative flex items-start justify-start gap-4 ${idx > 0 ? 'mt-6' : ''}`}>
                      <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 z-10 ${idx === 0 ? 'bg-[#0077b6] shadow-[0_0_0_4px_rgba(0,119,182,0.1)]' : 'bg-slate-300'}`} />
                      <div>
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${idx === 0 ? 'text-[#0077b6]' : 'text-slate-400'}`}>{item.time}</span>
                        <h4 className="text-sm font-bold text-slate-800 mt-1">{item.action} <br/><span className="text-[#0077b6]">{item.name}</span></h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 3: Dynamic Updates (Fetch randomly or keep a cool banner) */}
            <div className="relative h-32 rounded-3xl overflow-hidden shadow-md group cursor-pointer" onClick={() => window.location.href = "/"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop" 
                alt="Bus" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold tracking-widest uppercase text-blue-300 mb-1">Tin tức</span>
                <h4 className="font-bold text-sm line-clamp-1">Khai trương tuyến xe Bus mới đến Mũi Né</h4>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
