"use client";

import { 
  ChevronRight, 
  Plus, 
  Filter, 
  ChevronDown, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft,
  RefreshCcw,
  Loader2,
  MapPin,
  CheckCircle,
  Clock
} from "lucide-react";
import { useState, useEffect } from "react";
import { LocationRowActions } from "./LocationRowActions";

interface LocationRecord {
  id: string;
  title: string;
  category: string;
  status: string;
  imageUrl: string;
  description: string | null;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  } | null;
}

const CATEGORIES = ["ALL", "Nature", "Culture", "Cuisine", "Adventure", "Beach"];
const STATUSES = ["ALL", "APPROVED", "PENDING"];

export default function LocationManagementPage() {
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Filter states
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchLocations();
  }, [activeCategory, activeStatus]);

  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/admin/locations", window.location.origin);
      if (activeCategory !== "ALL") url.searchParams.append("category", activeCategory);
      if (activeStatus !== "ALL") url.searchParams.append("status", activeStatus);
      
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setActiveCategory("ALL");
    setActiveStatus("ALL");
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <span>Directory</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#006e9b]">Locations</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[2.5rem] font-black tracking-tight text-[#0c2b48] leading-tight">Location Management</h1>
            <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">
              Curate the finest destinations across Phan Thiet. Manage visibility, contributor credits, and content status for the editorial map.
            </p>
          </div>
          <div className="flex gap-3 mt-2">
             <button 
              onClick={fetchLocations}
              className="p-3.5 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-[#006e9b] hover:shadow-sm transition-all active:rotate-180 duration-500"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
            <button className="bg-[#006e9b] hover:bg-[#005f85] text-white px-8 py-3.5 rounded-full font-bold text-[14px] flex items-center gap-2.5 transition-all shadow-[0_4px_15px_-5px_rgba(0,110,155,0.4)]">
              <Plus className="w-4 h-4 stroke-3" />
              Add New Location
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Category Filter */}
          <div className="relative">
            <div 
              onClick={() => { setShowCatDropdown(!showCatDropdown); setShowStatusDropdown(false); }}
              className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm cursor-pointer hover:border-[#006e9b] transition-all"
            >
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-[13px] font-bold text-slate-400">Category:</span>
              <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48] uppercase">
                {activeCategory === "ALL" ? "All Categories" : activeCategory} <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${showCatDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {showCatDropdown && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-50 overflow-hidden z-20">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setShowCatDropdown(false);
                    }}
                    className={`w-full px-6 py-3.5 text-left text-[13px] font-bold transition-colors ${
                      activeCategory === cat ? 'bg-[#006e9b] text-white' : 'text-[#0c2b48] hover:bg-slate-50'
                    }`}
                  >
                    {cat === "ALL" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div 
              onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowCatDropdown(false); }}
              className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm cursor-pointer hover:border-[#006e9b] transition-all"
            >
              <span className="text-[13px] font-bold text-slate-400">Status:</span>
              <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48] uppercase">
                {activeStatus === "ALL" ? "Any Status" : activeStatus} <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-50 overflow-hidden z-20">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setActiveStatus(status);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full px-6 py-3.5 text-left text-[13px] font-bold transition-colors ${
                      activeStatus === status ? 'bg-[#006e9b] text-white' : 'text-[#0c2b48] hover:bg-slate-50'
                    }`}
                  >
                    {status === "ALL" ? "Any Status" : status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <button 
          onClick={handleClearAll}
          className="text-[13px] font-black text-slate-400 hover:text-red-500 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] shadow-[0_2px_25px_-10px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 gap-4">
            <Loader2 className="w-10 h-10 animate-spin opacity-20" />
            <p className="text-[11px] font-black uppercase tracking-widest">Loading location data...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Name & Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Contributor</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {locations.map((loc) => (
                <tr key={loc.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-slate-100 bg-slate-50">
                        {loc.imageUrl ? (
                           <img src={loc.imageUrl} alt={loc.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-200">
                             <MapPin className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-black text-[#0c2b48] text-base truncate">{loc.title}</h3>
                        <p className="text-[12px] font-bold text-slate-400 mt-0.5 truncate max-w-[200px]">{loc.description || "No description"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-wide bg-slate-100 text-slate-600`}>
                      {loc.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {loc.status === 'APPROVED' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                       ) : (
                        <Clock className="w-4 h-4 text-orange-400" />
                       )}
                      <span className={`text-[11px] font-black tracking-widest uppercase ${
                        loc.status === 'APPROVED' ? 'text-emerald-500' : 'text-orange-400'
                      }`}>
                        {loc.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                         {loc.author?.image ? (
                           <img src={loc.author.image} alt="" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-slate-300 uppercase">
                             {loc.author?.name?.charAt(0) || "U"}
                           </div>
                         )}
                      </div>
                      <span className="text-[13px] font-bold text-[#0c2b48]">{loc.author?.name || "Anonymous"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <LocationRowActions id={loc.id} status={loc.status} />
                  </td>
                </tr>
              ))}
              {locations.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-slate-400 font-bold">No locations match your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination Footer */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[12px] font-bold text-slate-400">
            Showing <span className="text-[#0c2b48]">1-{locations.length}</span> of <span className="text-[#0c2b48]">{locations.length}</span> locations
          </p>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-300 hover:text-slate-600 disabled:opacity-30" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#006e9b] text-white text-[12px] font-black shadow-md shadow-[#006e9b]/20">1</button>
            <button className="p-2 text-slate-300 hover:text-slate-600 disabled:opacity-30" disabled>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

