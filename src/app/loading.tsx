export default function Loading() {
  return (
    <div className="flex flex-1 w-full overflow-hidden bg-white relative h-full">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex flex-col w-[380px] h-full bg-white border-r border-slate-200 z-10 shrink-0">
        <div className="p-4 border-b border-slate-200">
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-full"></div>
          <div className="flex gap-2 mt-4 overflow-hidden">
            <div className="h-8 bg-slate-100 rounded-full animate-pulse w-20 shrink-0"></div>
            <div className="h-8 bg-slate-100 rounded-full animate-pulse w-24 shrink-0"></div>
            <div className="h-8 bg-slate-100 rounded-full animate-pulse w-16 shrink-0"></div>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden space-y-4">
          <div className="flex gap-4 p-3 border border-slate-100 rounded-xl">
            <div className="w-20 h-20 bg-slate-100 rounded-lg animate-pulse shrink-0"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2"></div>
              <div className="h-3 bg-slate-100 rounded animate-pulse w-1/4 mt-2"></div>
            </div>
          </div>
          <div className="flex gap-4 p-3 border border-slate-100 rounded-xl">
            <div className="w-20 h-20 bg-slate-100 rounded-lg animate-pulse shrink-0"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3"></div>
              <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2"></div>
              <div className="h-3 bg-slate-100 rounded animate-pulse w-1/3 mt-2"></div>
            </div>
          </div>
          <div className="flex gap-4 p-3 border border-slate-100 rounded-xl">
            <div className="w-20 h-20 bg-slate-100 rounded-lg animate-pulse shrink-0"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-4/5"></div>
              <div className="h-3 bg-slate-100 rounded animate-pulse w-1/3"></div>
              <div className="h-3 bg-slate-100 rounded animate-pulse w-1/4 mt-2"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Skeleton */}
      <div className="flex-1 relative h-full bg-slate-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading map data...</p>
        </div>
      </div>
    </div>
  );
}
