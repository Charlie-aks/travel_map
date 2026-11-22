import { 
  ChevronRight, 
  Filter, 
  ChevronDown, 
  ChevronLeft,
  Star,
  MessageSquare,
  MapPin,
  Trash2,
  AlertTriangle,
  User
} from "lucide-react";
import { db } from "@/db";
import { reports, reviews } from "@/db/schema";
import { desc, inArray } from "drizzle-orm";
import { ReviewRowActions } from "./ReviewRowActions";
import { ReviewDetailModal } from "./ReviewDetailModal";
import { publicUserColumns } from "@/lib/privacy";

interface PageProps {
  searchParams: {
    view?: string;
  }
}

export default async function ReportsManagementPage({ searchParams }: PageProps) {
  const dbReports = await db.query.reports.findMany({
    orderBy: [desc(reports.createdAt)],
    with: { reporter: { columns: publicUserColumns } }
  });

  const reviewIds = dbReports.filter(r => r.targetType === 'REVIEW').map(r => r.targetId);
  const targetReviews = reviewIds.length > 0 ? await db.query.reviews.findMany({
    where: inArray(reviews.id, reviewIds),
    with: {
      location: { columns: { id: true, title: true, imageUrl: true } },
      author: { columns: publicUserColumns },
    }
  }) : [];

  const displayData = dbReports.map(report => {
    if (report.targetType === 'REVIEW') {
      const review = targetReviews.find(r => r.id === report.targetId);
      return { report, review };
    }
    return { report, review: null };
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <span>Directory</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#006e9b]">Reports</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-4">
          <div>
            <h1 className="text-[2rem] md:text-[2.5rem] font-black tracking-tight text-[#0c2b48] leading-tight">User Reports</h1>
            <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed text-sm md:text-base">
              Monitor user feedback and community flags. Moderate content to ensure a safe and authentic environment.
            </p>
          </div>
          <button className="bg-[#f45d48] w-full sm:w-auto justify-center hover:bg-[#d94f4a] text-white px-8 py-3.5 rounded-full font-bold text-[14px] flex items-center gap-2.5 transition-all shadow-[0_4px_15px_-5px_rgba(244,93,72,0.4)] mt-2">
            <Trash2 className="w-4 h-4 stroke-3" />
            Clear Resolved
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-[13px] font-bold text-slate-400">Status:</span>
            <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48]">
              Pending <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
        
        <button className="text-[13px] font-black text-slate-400 hover:text-[#0c2b48] transition-colors w-full md:w-auto text-center md:text-left pt-2 md:pt-0">
          Reset Filters
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] shadow-[0_2px_25px_-10px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[150px]">Reporter</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[200px]">Reason</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[250px]">Reported Content</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[120px]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right min-w-[120px]">Actions</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[120px]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic">
                    Chưa có báo cáo nào.
                  </td>
                </tr>
              ) : displayData.map(({ report, review }) => {
                const isResolved = report.status !== 'PENDING';
                return (
                  <tr key={report.id} className={`group hover:bg-slate-50/50 transition-colors ${isResolved ? 'opacity-60' : ''}`}>
                    <td className="px-8 py-6 text-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shrink-0 bg-slate-100 flex items-center justify-center">
                          {report.reporter?.image ? (
                            <img 
                              src={report.reporter.image} 
                              alt={report.reporter.name || "User"} 
                              className="w-full h-full object-cover" 
                            />
                          ) : <User className="w-4 h-4 text-slate-400" />}
                        </div>
                        <span className="text-[13px] font-bold text-[#0c2b48]">{report.reporter?.name || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span className="text-[13px] font-bold">{report.reason}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 max-w-[250px]">
                      {review ? (
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                             <MapPin className="w-3 h-3" /> {review.location?.title || "Unknown Location"}
                           </div>
                           <div className="flex items-start gap-2">
                             <MessageSquare className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                             <p className="text-[13px] font-medium line-clamp-2 leading-relaxed italic text-slate-600">
                               "{review.content}"
                             </p>
                           </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Content not found or deleted</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isResolved ? 'bg-slate-300' : 'bg-[#f45d48]'}`}></div>
                        <span className={`text-[11px] font-black tracking-widest uppercase ${isResolved ? 'text-slate-400' : 'text-[#f45d48]'}`}>
                          {report.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {/* For now, reuse review actions but apply it to the reported review, or create specific report actions */}
                      {review && <ReviewRowActions id={review.id} status={review.status} />}
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
        <div className="px-4 md:px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] font-bold text-slate-400 text-center sm:text-left">
            Showing <span className="text-[#0c2b48]">{displayData.length > 0 ? 1 : 0}-{displayData.length}</span> of <span className="text-[#0c2b48]">{displayData.length}</span> reports
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
      
      {/* Detail modal for reported review context */}
      <ReviewDetailModal 
        review={searchParams?.view ? (targetReviews.find(r => r.id === searchParams.view) as any || null) : null}
      />
    </div>
  );
}
