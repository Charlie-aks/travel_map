"use client";

import { Plus, TrendingUp, MapPin, Users, AlertTriangle, ChevronDown, FileText, Loader2, Bookmark, MessageSquare, Star } from "lucide-react";
import { VisitorChart } from "./components/VisitorChart";
import { useState, useEffect } from "react";

interface Activity {
  id: string;
  type: 'REVIEW' | 'LOCATION';
  userName: string;
  userImage?: string;
  targetName: string;
  time: string;
  rating?: number;
}

interface OverviewData {
  stats: {
    totalUsers: number;
    totalLocations: number;
    totalSaves: number;
    pendingReports: number;
  };
  activities: Activity[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/overview");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    if (!isMounted) return "";
    const now = new Date();
    const then = new Date(dateString);
    const diffInMs = now.getTime() - then.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    
    if (diffInMins < 1) return "vừa xong";
    if (diffInMins < 60) return `${diffInMins} phút trước`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    return then.toLocaleDateString("vi-VN");
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-4">
        <div>
          <h1 className="text-[2rem] md:text-[2.5rem] font-black tracking-tight text-[#0c2b48] leading-tight">Coastal Overview</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Welcome back. The tides are in your favor today.</p>
        </div>
        <button className="bg-[#006e9b] hover:bg-[#005f85] text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-colors shadow-sm w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Saves */}
        <div className="bg-white rounded-[1.25rem] p-7 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[150px]">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-[0.9rem] bg-[#eef3fb] flex items-center justify-center text-[#3076cc]">
              <Bookmark className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Saves</p>
            <h3 className="text-3xl font-black text-[#0c2b48]">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin opacity-20" /> : (data?.stats.totalSaves || 0)}
            </h3>
          </div>
        </div>

        {/* Card 2: New Locations */}
        <div className="bg-white rounded-[1.25rem] p-7 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[150px]">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-[0.9rem] bg-[#f0ebd9] flex items-center justify-center text-[#6e744e]">
              <MapPin className="w-5 h-5 stroke-[2.5]" fill="currentColor" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Locations</p>
            <h3 className="text-3xl font-black text-[#0c2b48]">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin opacity-20" /> : (data?.stats.totalLocations || 0)}
            </h3>
          </div>
        </div>

        {/* Card 3: Active Users */}
        <div className="bg-white rounded-[1.25rem] p-7 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[150px]">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-[0.9rem] bg-[#fcece3] flex items-center justify-center text-[#da7f47]">
              <Users className="w-5 h-5 stroke-[2.5]" fill="currentColor" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Active Users</p>
            <h3 className="text-3xl font-black text-[#0c2b48]">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin opacity-20" /> : (data?.stats.totalUsers || 0)}
            </h3>
          </div>
        </div>

        {/* Card 4: Pending Reports */}
        <div className="bg-white rounded-[1.25rem] p-7 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[150px]">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-[0.9rem] bg-[#fde9e8] flex items-center justify-center text-[#d94f4a]">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" fill="currentColor" />
            </div>
            {data?.stats.pendingReports ? data.stats.pendingReports > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-[#fef0f0] text-[#d94f4a] text-[11px] font-black animate-pulse">
                Action Required
              </div>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pending Approvals</p>
            <h3 className="text-3xl font-black text-[#0c2b48]">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin opacity-20" /> : (data?.stats.pendingReports || 0)}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Trends and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Trends Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col min-h-[400px]">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0c2b48]">Visitor Trends</h2>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Monthly traffic volume in Phan Thiet regions</p>
            </div>
            <button className="flex items-center justify-between w-full sm:w-auto gap-1.5 px-4 py-2 bg-[#f4f5f7] hover:bg-slate-200 rounded-full text-[13px] font-bold text-[#0c2b48] transition-colors">
              <span>Last 30 Days</span> <ChevronDown className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <div className="flex-1 w-full relative min-h-[300px]">
            <VisitorChart />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-[#f7f8f9] lg:bg-transparent rounded-3xl p-6 lg:p-4 flex flex-col">
          <h2 className="text-xl font-bold text-[#0c2b48] mb-8">Recent Activities</h2>
          
          <div className="flex-1 space-y-7 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#e0e4eb] before:to-transparent">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <Loader2 className="w-8 h-8 animate-spin" />
               </div>
            ) : (data?.activities || []).map((activity) => (
              <div key={activity.id} className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex-shrink-0 relative z-10 shadow-sm overflow-hidden bg-slate-200 border border-white">
                  {activity.userImage ? (
                    <img src={activity.userImage} alt={activity.userName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase text-slate-400 bg-slate-100">
                      {activity.userName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="bg-transparent pt-0.5">
                  <p className="text-sm font-semibold text-slate-500 leading-tight">
                    <span className="font-bold text-[#0c2b48]">{activity.userName}</span> {activity.type === 'LOCATION' ? 'added' : 'reviewed'} <span className="font-bold text-[#0c2b48]">{activity.targetName}</span>
                  </p>
                  <p className="text-[9px] font-black text-slate-300 mt-1 uppercase tracking-widest">{getTimeAgo(activity.time)}</p>
                  <div className={`mt-2 w-7 h-7 rounded-full flex items-center justify-center ${activity.type === 'LOCATION' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                      {activity.type === 'LOCATION' ? <MapPin className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            ))}
            {!isLoading && data?.activities.length === 0 && (
              <p className="text-center text-xs font-bold text-slate-300 py-10 uppercase tracking-widest">No recent activity</p>
            )}
          </div>

          <button className="text-[13px] font-black text-[#006e9b] mt-8 hover:text-[#005f85] transition-colors self-center">
            View All Activity
          </button>
        </div>
      </div>

      {/* Contribution Heatmap Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1.5 bg-[#f4f6ee] rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden h-[280px]">
          {/* Decorative shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/60 rounded-[3rem] rotate-12 blur-sm"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 bg-[#ecefde]/60 rounded-full blur-xl"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <h2 className="text-xl font-bold text-[#0c2b48]">Contribution Heatmap</h2>
            <p className="text-xs font-bold text-slate-500 mt-1 mb-8 uppercase tracking-widest">Visual density of new user contributions</p>
            
            <div className="space-y-6 flex-1 flex flex-col justify-end">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 rounded-full bg-white/60 overflow-hidden shadow-sm">
                  <div className="h-full bg-[#8c5929] rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-bold text-[#0c2b48] w-40 text-right">Ham Tien (85%)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 rounded-full bg-white/60 overflow-hidden shadow-sm">
                  <div className="h-full bg-[#1b5e82] rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-bold text-[#0c2b48] w-40 text-right">Mui Ne (60%)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 rounded-full bg-white/60 overflow-hidden shadow-sm">
                  <div className="h-full bg-[#6a755d] rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-sm font-bold text-[#0c2b48] w-40 text-right">Phan Thiet City (40%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1.5 bg-gradient-to-br from-[#fbfdfd] to-[#eff3f3] rounded-3xl p-10 flex flex-col justify-center items-start h-[280px] shadow-[inset_0_0_0_1px_rgba(255,255,255,1)] border border-slate-100">
          <h2 className="text-4xl font-black text-[#0c2b48] w-[80%] leading-[1.1] tracking-tight">Curate the<br/>Next Horizon.</h2>
          <button className="mt-8 bg-white text-[#0c2b48] px-8 py-3.5 rounded-full font-bold shadow-[0_4px_15px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_-5px_rgba(0,0,0,0.1)] transition-all border border-slate-100 text-[14px]">
            Review Submissions
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-slate-200 mt-10 gap-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center md:text-left">© 2024 THE COASTAL EDITORIAL PORTAL</p>
        <div className="flex gap-6 md:gap-8 flex-wrap justify-center">
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0c2b48] transition-colors">STATUS</a>
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0c2b48] transition-colors">POLICY</a>
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0c2b48] transition-colors">SUPPORT</a>
        </div>
      </footer>
    </div>
  );
}

