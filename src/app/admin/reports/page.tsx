import { 
  ChevronRight, 
  Filter, 
  ChevronDown, 
  ChevronLeft,
  Star,
  MessageSquare,
  MapPin,
  Trash2
} from "lucide-react";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ReviewRowActions } from "./ReviewRowActions";

export default async function ReportsManagementPage() {
  const dbReviews = await db.query.reviews.findMany({
    with: {
      location: true,
      author: true,
    },
    orderBy: [desc(reviews.createdAt)]
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <span>Directory</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#006e9b]">Reports & Reviews</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[2.5rem] font-black tracking-tight text-[#0c2b48] leading-tight">Reports & Reviews</h1>
            <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">
              Monitor user feedback and community ratings. Moderate content to ensure high-quality information and authentic experiences.
            </p>
          </div>
          <button className="bg-[#f45d48] hover:bg-[#d94f4a] text-white px-8 py-3.5 rounded-full font-bold text-[14px] flex items-center gap-2.5 transition-all shadow-[0_4px_15px_-5px_rgba(244,93,72,0.4)] mt-2 opacity-50 cursor-not-allowed">
            <Trash2 className="w-4 h-4 stroke-3" />
            Clear All Reports
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-[13px] font-bold text-slate-400">Sort by:</span>
            <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48]">
              Newest First <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>

          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm">
            <span className="text-[13px] font-bold text-slate-400">Rating:</span>
            <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48]">
              All Ratings <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
        
        <button className="text-[13px] font-black text-slate-400 hover:text-[#0c2b48] transition-colors">
          Reset Filters
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] shadow-[0_2px_25px_-10px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[200px]">Location</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[150px]">User</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[120px]">Rating</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[120px]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Content</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right min-w-[120px]">Actions</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[120px]">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dbReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center text-slate-400 italic">
                    Chưa có đánh giá nào từ người dùng.
                  </td>
                </tr>
              ) : dbReviews.map((report) => {
                const isHidden = report.status === 'HIDDEN';
                return (
                  <tr key={report.id} className={`group hover:bg-slate-50/50 transition-colors ${isHidden ? 'opacity-60' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-100">
                          <img 
                            src={report.location?.imageUrl || "https://images.unsplash.com/photo-1506190500382-77880267ce0b?w=200"} 
                            alt={report.location?.title || "Unknown"} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="font-black text-[#0c2b48] text-[14px] truncate">{report.location?.title || "Unknown Location"}</h3>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>View on map</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shrink-0">
                          <img 
                            src={report.author?.image || "https://i.pravatar.cc/150?u=" + report.authorId} 
                            alt={report.author?.name || "User"} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="text-[13px] font-bold text-[#0c2b48]">{report.author?.name || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < report.rating ? 'fill-[#ffc107] text-[#ffc107]' : 'text-slate-200'}`} 
                          />
                        ))}
                        <span className="ml-2 text-[13px] font-black text-[#0c2b48]">{report.rating}.0</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isHidden ? 'bg-slate-300' : 'bg-[#48bb78]'}`}></div>
                        <span className={`text-[11px] font-black tracking-widest uppercase ${isHidden ? 'text-slate-400' : 'text-[#48bb78]'}`}>
                          {report.status || 'PUBLISHED'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 max-w-[200px]">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        <p className={`text-[13px] font-medium line-clamp-2 leading-relaxed italic ${isHidden ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                          "{report.content}"
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <ReviewRowActions id={report.id} status={report.status} />
                    </td>
                    <td className="px-8 py-6 text-nowrap">
                      <span className="text-[13px] font-bold text-slate-500">
                        {report.createdAt ? new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                      </span>
                    </td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[12px] font-bold text-slate-400">
            Showing <span className="text-[#0c2b48]">{dbReviews.length > 0 ? 1 : 0}-{dbReviews.length}</span> of <span className="text-[#0c2b48]">{dbReviews.length}</span> reports
          </p>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-300 hover:text-slate-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#006e9b] text-white text-[12px] font-black shadow-md shadow-[#006e9b]/20">1</button>
            <button className="p-2 text-slate-300 hover:text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
