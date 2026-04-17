import { 
  ChevronRight, 
  Plus, 
  Filter, 
  ChevronDown, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft
} from "lucide-react";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { desc } from "drizzle-orm";
import { LocationRowActions } from "./LocationRowActions";

export default async function LocationManagementPage() {
  const dbLocations = await db.query.locations.findMany({
    with: {
      author: true
    },
    orderBy: [desc(locations.createdAt)]
  });

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
          <button className="bg-[#006e9b] hover:bg-[#005f85] text-white px-8 py-3.5 rounded-full font-bold text-[14px] flex items-center gap-2.5 transition-all shadow-[0_4px_15px_-5px_rgba(0,110,155,0.4)] mt-2">
            <Plus className="w-4 h-4 stroke-3" />
            Add New Location
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-[13px] font-bold text-slate-400">Filter by Category:</span>
            <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48]">
              All Categories <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>

          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm">
            <span className="text-[13px] font-bold text-slate-400">Status:</span>
            <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48]">
              Any Status <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
        
        <button className="text-[13px] font-black text-slate-400 hover:text-[#0c2b48] transition-colors">
          Clear All
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] shadow-[0_2px_25px_-10px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100">
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
            {dbLocations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-8 text-center text-slate-400 font-semibold">
                  Chưa có địa điểm nào trong CSDL.
                </td>
              </tr>
            ) : null}
            {dbLocations.map((loc) => (
              <tr key={loc.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-slate-100">
                      <img src={loc.imageUrl} alt={loc.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-black text-[#0c2b48] text-base truncate">{loc.title}</h3>
                      <p className="text-[12px] font-bold text-slate-400 mt-0.5 truncate max-w-[200px]">{loc.description || "Chưa có mô tả"}</p>
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
                    <div className={`w-2 h-2 rounded-full ${
                      loc.status === 'APPROVED' ? 'bg-[#48bb78]' : 'bg-[#ed8936]'
                    }`}></div>
                    <span className={`text-[11px] font-black tracking-widest uppercase ${
                      loc.status === 'APPROVED' ? 'text-[#48bb78]' : 'text-[#ed8936]'
                    }`}>
                      {loc.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shrink-0">
                      <img src={loc.author?.image || `https://ui-avatars.com/api/?name=${loc.author?.name || 'User'}&background=random`} alt={loc.author?.name || "User"} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[13px] font-bold text-[#0c2b48]">{loc.author?.name || "Người dùng ẩn danh"}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <LocationRowActions id={loc.id} status={loc.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        {dbLocations.length > 0 && (
          <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[12px] font-bold text-slate-400">
              Showing <span className="text-[#0c2b48]">1-{dbLocations.length}</span> of <span className="text-[#0c2b48]">{dbLocations.length}</span> locations
            </p>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-300 hover:text-slate-600 cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="w-8 h-8 rounded-full bg-[#006e9b] text-white text-[12px] font-black shadow-md shadow-[#006e9b]/20">1</button>
              <button className="p-2 text-slate-300 hover:text-slate-600 cursor-not-allowed">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
