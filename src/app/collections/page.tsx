"use client";

import { useLocationStore } from "@/store/useLocationStore";
import { LocationCard } from "@/features/locations/LocationCard";
import { Lightbulb, Calendar, Bus } from "lucide-react";
import { useState } from "react";

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
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
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
          
          {/* Left Area: Grid of Location Cards (occupies flex-2 or w-2/3) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-start auto-rows-max">
            {filteredOutput.length > 0 ? (
              filteredOutput.map((loc) => (
                <LocationCard key={loc.id} location={loc} showDelete={true} />
              ))
            ) : (
              <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-500">
                Bạn chưa lưu địa điểm nào trong mục này.
              </div>
            )}
          </div>

          {/* Right Area: 3 Widgets Sticky sidebar style (occupies flex-1 or w-1/3) */}
          <div className="w-full lg:w-[380px] shrink-0 space-y-6 lg:sticky lg:top-8 self-start">
            
            {/* Widget 1: Insider Tip */}
            <div className="bg-[#0077b6] text-white rounded-3xl overflow-hidden shadow-lg p-8 relative">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase mb-6 opacity-90">
                <Lightbulb className="w-4 h-4" /> Insider Tip
              </div>
              <h3 className="text-2xl font-extrabold mb-4 leading-tight">Gợi ý dành riêng cho bạn</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">
                Dựa trên sở thích yêu thích bãi biển của bạn, chúng tôi gợi ý <strong>Làng Chài Mũi Né</strong> để ngắm hoàng hôn rực rỡ nhất.
              </p>
              <button className="w-full bg-white text-[#0077b6] hover:bg-slate-50 font-bold py-3.5 rounded-xl transition-colors shadow-sm">
                Khám phá ngay
              </button>
            </div>

            {/* Widget 2: Suggested Schedule */}
            <div className="bg-[#eaeaec]/60 border border-slate-200/60 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm shadow-sm">
              <h3 className="text-xl font-extrabold text-slate-800 mb-8">Lịch trình đề xuất</h3>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                
                {/* Timeline Item 1 */}
                <div className="relative flex items-start justify-start gap-4">
                  <div className="w-3 h-3 bg-[#0077b6] rounded-full mt-1.5 shrink-0 shadow-[0_0_0_4px_rgba(0,119,182,0.1)] z-10" />
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">05:30 AM</span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">Ngắm bình minh tại<br/>Đồi Cát Trắng</h4>
                  </div>
                </div>

                {/* Timeline Item 2 */}
                <div className="relative flex items-start justify-start gap-4 mt-6">
                  <div className="w-3 h-3 bg-slate-300 rounded-full mt-1.5 shrink-0 z-10" />
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">12:30 PM</span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">Hải sản tại Bãi Rạng</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 3: Bus Update */}
            <div className="relative h-32 rounded-3xl overflow-hidden shadow-md group cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop" 
                alt="Bus" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold tracking-widest uppercase text-blue-300 mb-1">Cập nhật</span>
                <h4 className="font-bold text-sm">Tuyến xe bus Mũi Né mới</h4>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
