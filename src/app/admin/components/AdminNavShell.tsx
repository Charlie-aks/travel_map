"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bell, 
  HelpCircle, 
  LayoutDashboard, 
  MapPin, 
  Users, 
  FileText, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { AdminSearchBar } from "./AdminSearchBar";

interface AdminNavShellProps {
  children: React.ReactNode;
  userContext: {
    name: string | null;
    image: string | null;
    role: string | null;
  };
}

export function AdminNavShell({ children, userContext }: AdminNavShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/locations", icon: MapPin, label: "Locations" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/reports", icon: FileText, label: "Reports" },
    { href: "/admin/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="flex flex-col md:flex-row h-dvh bg-[#f7f8f9] font-sans text-slate-900 overflow-hidden relative">
      
      {/* Mobile Header (Only visible on small screens) */}
      <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={toggleMenu} className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-[#0c2b48]">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-black text-[#0c2b48] text-lg">Coastal Admin</span>
        </div>
        <div className="w-8 h-8 rounded-full shadow-sm overflow-hidden border border-slate-200">
          <img src={userContext.image || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt="User" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 transform bg-[#fbfbfc] border-r border-[#eef0f2] w-64 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-6 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-[1.35rem] font-black text-[#0c2b48] leading-tight">The Coastal Editorial</h1>
            <p className="text-xs font-semibold text-slate-400 mt-1.5 uppercase tracking-wider">Admin Console</p>
          </div>
          <button onClick={closeMenu} className="md:hidden p-2 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
            return (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={closeMenu}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-colors font-semibold ${
                  isActive 
                  ? "bg-[#e3e7d3] text-[#2c3d1f] font-bold" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? "text-[#5e7050]" : ""}`} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* User Card */}
        <div className="p-3 m-4 rounded-xl bg-[#f4f5f6] flex items-center gap-3 border border-[#ecedef] shrink-0">
          <div className="w-10 h-10 rounded-full shadow-sm overflow-hidden shrink-0">
            <img src={userContext.image || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt={userContext.name || ""} className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[13px] font-bold text-[#0c2b48] truncate">{userContext.name}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate mt-0.5">{userContext.role}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Topbar */}
        <header className="hidden md:flex h-20 px-8 items-center justify-between border-b border-transparent bg-transparent z-10 shrink-0">
          <div className="w-full max-w-md">
            <AdminSearchBar />
          </div>

          <div className="flex items-center gap-3 ml-auto">
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
                <img src={userContext.image || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto w-full pt-6 md:pt-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
