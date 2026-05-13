export default function CollectionsListLoading() {
  return (
    <main className="flex-1 w-full bg-[#f8fafc] overflow-y-auto custom-scrollbar">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-8 px-6 md:px-12 lg:px-24 xl:px-48 text-center md:text-left shadow-sm">
        <div className="h-10 w-64 bg-slate-200 rounded animate-pulse mb-4 mx-auto md:mx-0"></div>
        <div className="h-6 w-96 bg-slate-100 rounded animate-pulse mx-auto md:mx-0"></div>
      </div>

      {/* Grid of collections Skeleton */}
      <div className="px-6 md:px-12 lg:px-24 xl:px-48 py-12 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col h-[300px]">
              <div className="h-[200px] bg-slate-200 animate-pulse w-full"></div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
