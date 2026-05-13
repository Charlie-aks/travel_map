import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8 lg:p-10 w-full h-full flex flex-col">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
          <div className="h-8 w-64 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
      
      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="h-5 w-24 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-slate-100 rounded-full animate-pulse"></div>
            </div>
            <div className="h-10 w-20 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-slate-100 rounded animate-pulse mt-2"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-center">
        <div className="flex flex-col items-center text-slate-400 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="font-medium animate-pulse">Đang tải dữ liệu hệ thống...</p>
        </div>
      </div>
    </div>
  );
}
