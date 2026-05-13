export default function CollectionLoading() {
  return (
    <main className="flex-1 w-full bg-[#f8fafc] overflow-y-auto custom-scrollbar relative">
      {/* Hero Banner Skeleton */}
      <div className="relative h-[30vh] min-h-[250px] w-full bg-slate-200 animate-pulse">
        <div className="absolute inset-0 px-6 md:px-12 lg:px-24 xl:px-48 flex flex-col justify-end pb-12">
          <div className="h-6 w-32 bg-slate-300/50 rounded mb-6"></div>
          <div className="h-6 w-24 bg-slate-300/50 rounded mb-4"></div>
          <div className="h-12 w-3/4 max-w-2xl bg-slate-300/50 rounded"></div>
        </div>
      </div>

      {/* Grid of locations Skeleton */}
      <div className="px-6 md:px-12 lg:px-24 xl:px-48 py-12 max-w-[1400px] mx-auto w-full">
        <div className="mb-8">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col h-[320px]">
              <div className="h-[160px] bg-slate-200 animate-pulse w-full"></div>
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                <div className="mt-auto flex justify-between items-center">
                  <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
