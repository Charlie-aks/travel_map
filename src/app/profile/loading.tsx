export default function ProfileLoading() {
  return (
    <div className="flex-1 w-full bg-[#f8fafc] overflow-y-auto custom-scrollbar">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-8 px-6">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-32 h-32 rounded-full bg-slate-200 animate-pulse shadow-sm shrink-0 border-4 border-white"></div>
          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mx-auto md:mx-0"></div>
            <div className="h-4 w-64 bg-slate-100 rounded animate-pulse mx-auto md:mx-0"></div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
              <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse"></div>
              <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse"></div>
              <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-[1000px] mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {/* Left Column */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 bg-slate-100 rounded-full animate-pulse shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 w-full bg-slate-100 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-1/2 bg-slate-50 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100">
              <div className="h-14 w-32 bg-slate-50 animate-pulse border-r border-slate-100"></div>
              <div className="h-14 w-32 bg-slate-50 animate-pulse border-r border-slate-100"></div>
              <div className="h-14 w-32 bg-slate-50 animate-pulse"></div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
