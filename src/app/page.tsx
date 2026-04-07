import { Sidebar } from "@/features/locations/Sidebar";
import Map from "@/features/map-view/Map";

export default function Home() {
  return (
    <main className="flex flex-1 w-full overflow-hidden bg-white relative">
      <Sidebar />
      <div className="flex-1 relative h-full">
        <Map />
      </div>
    </main>
  );
}
