import AddLocationForm from "@/features/add-location/AddLocationForm";
import TipsSidebar from "@/features/add-location/TipsSidebar";

export default function AddLocationPage() {
  return (
    <main className="flex-1 w-full bg-[#f8fafc] dark:bg-slate-950 overflow-y-auto custom-scrollbar relative px-4 sm:px-6 md:px-12 lg:px-24 xl:px-48 py-6 md:py-12 transition-colors">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col-reverse lg:flex-row gap-8 lg:gap-24 relative">
        <TipsSidebar />
        <div className="flex-1 w-full">
          <AddLocationForm />
        </div>
      </div>
    </main>
  );
}
