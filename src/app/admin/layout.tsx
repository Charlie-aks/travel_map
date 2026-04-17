import Link from "next/link";
import { Search, Bell, HelpCircle, LayoutDashboard, MapPin, Users, FileText, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#f7f8f9] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#fbfbfc] flex flex-col border-r border-[#eef0f2]">
        <div className="p-6 pb-4">
          <h1 className="text-[1.35rem] font-black text-[#0c2b48] leading-tight">The Coastal Editorial</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1.5 uppercase tracking-wider">Admin Console</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link href="/admin" className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[#e3e7d3] text-[#2c3d1f] font-bold transition-colors">
            <LayoutDashboard className="w-5 h-5 text-[#5e7050]" />
            Dashboard
          </Link>
          <Link href="/admin/locations" className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-semibold">
            <MapPin className="w-5 h-5" />
            Locations
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-semibold">
            <Users className="w-5 h-5" />
            Users
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-semibold">
            <FileText className="w-5 h-5" />
            Reports
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-semibold">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        {/* User Card */}
        <div className="p-3 m-4 rounded-xl bg-[#f4f5f6] flex items-center gap-3 border border-[#ecedef]">
          <div className="w-10 h-10 rounded-full shadow-sm overflow-hidden shrink-0">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Alex Marine" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[13px] font-bold text-[#0c2b48] truncate">Alex Marine</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate mt-0.5">Lead Curator</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-transparent bg-transparent z-10 shrink-0">
          <div className="relative w-[400px]">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search insights, locations, or users..." 
              className="w-full pl-11 pr-4 py-2.5 bg-[#e9ecef]/50 hover:bg-[#e9ecef]/80 rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0c2b48]/10 transition-all text-[#0c2b48] placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-full hover:bg-slate-200/50 text-slate-500 hover:text-[#0c2b48] transition-colors">
              <Bell className="w-5 h-5" fill="currentColor" />
              <div className="absolute top-2 right-2.5 w-2.5 h-2.5 rounded-full bg-[#f45d48] border-2 border-[#f7f8f9]"></div>
            </button>
            <button className="p-2.5 rounded-full hover:bg-slate-200/50 text-slate-500 hover:text-[#0c2b48] transition-colors">
              <HelpCircle className="w-5 h-5" fill="currentColor" />
            </button>
            <div className="flex items-center gap-3 ml-4">
              <span className="text-[13px] font-bold text-[#0c2b48]">Profile</span>
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm shrink-0 border border-slate-200">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Children */}
        <main className="flex-1 overflow-y-auto px-8 pb-4 custom-scrollbar">
          <div className="max-w-6xl mx-auto w-full pt-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
