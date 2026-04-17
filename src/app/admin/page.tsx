import { Plus, TrendingUp, MapPin, Users, AlertTriangle, ChevronDown, FileText } from "lucide-react";
import { VisitorChart } from "./components/VisitorChart";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[2.5rem] font-black tracking-tight text-[#0c2b48] leading-tight">Coastal Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back. The tides are in your favor today.</p>
        </div>
        <button className="bg-[#006e9b] hover:bg-[#005f85] text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-colors shadow-sm mt-2">
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-[1.25rem] p-7 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[150px]">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-[0.9rem] bg-[#eef3fb] flex items-center justify-center text-[#3076cc]">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="px-3 py-1.5 rounded-full bg-[#f1f6fd] text-[#3076cc] text-[11px] font-black">
              +12.5%
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Visitors</p>
            <h3 className="text-3xl font-black text-[#0c2b48]">12.5k</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[1.25rem] p-7 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[150px]">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-[0.9rem] bg-[#f0ebd9] flex items-center justify-center text-[#6e744e]">
              <MapPin className="w-5 h-5 stroke-[2.5]" fill="currentColor" />
            </div>
            <div className="px-3 py-1.5 rounded-full bg-[#f5f3e9] text-[#6e744e] text-[11px] font-black">
              +4 this week
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">New Locations</p>
            <h3 className="text-3xl font-black text-[#0c2b48]">45</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[1.25rem] p-7 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[150px]">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-[0.9rem] bg-[#fcece3] flex items-center justify-center text-[#da7f47]">
              <Users className="w-5 h-5 stroke-[2.5]" fill="currentColor" />
            </div>
            <div className="px-3 py-1.5 rounded-full bg-[#fef5f0] text-[#da7f47] text-[11px] font-black flex items-center gap-1.5">
               Live Now
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Active Users</p>
            <h3 className="text-3xl font-black text-[#0c2b48]">1.2k</h3>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-[1.25rem] p-7 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[150px]">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-[0.9rem] bg-[#fde9e8] flex items-center justify-center text-[#d94f4a]">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" fill="currentColor" />
            </div>
            <div className="px-3 py-1.5 rounded-full bg-[#fef0f0] text-[#d94f4a] text-[11px] font-black">
              Urgent
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pending Reports</p>
            <h3 className="text-3xl font-black text-[#0c2b48]">8</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Trends and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Trends Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col min-h-[400px]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#0c2b48]">Visitor Trends</h2>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Monthly traffic volume in Phan Thiet regions</p>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#f4f5f7] hover:bg-slate-200 rounded-full text-[13px] font-bold text-[#0c2b48] transition-colors">
              Last 30 Days <ChevronDown className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <div className="flex-1 w-full relative">
            <VisitorChart />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-[#f7f8f9] lg:bg-transparent rounded-3xl p-6 lg:p-4 flex flex-col">
          <h2 className="text-xl font-bold text-[#0c2b48] mb-8">Recent Activities</h2>
          
          <div className="flex-1 space-y-7 relative before:absolute before:inset-0 before:ml-[19px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#e0e4eb] before:to-transparent">
            {/* Activity Item 1 */}
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 relative z-10 shadow-sm overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=1" alt="Sarah J." className="w-full h-full object-cover" />
              </div>
              <div className="bg-transparent pt-0.5">
                <p className="text-sm font-semibold text-slate-500 leading-tight">
                  <span className="font-bold text-[#0c2b48]">Sarah J.</span> added <span className="font-bold text-[#0c2b48]">Mui Ne Dunes</span>
                </p>
                <p className="text-[9px] font-black text-slate-300 mt-1 uppercase tracking-widest">2 Minutes Ago</p>
                <div className="mt-2 w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Activity Item 2 */}
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 relative z-10 shadow-sm overflow-hidden bg-[#243545]">
                 <img src="https://i.pravatar.cc/150?u=a042581f4e29026704b" alt="Mark" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
              </div>
              <div className="pt-0.5">
                <p className="text-sm font-semibold text-slate-500 leading-tight">
                  <span className="font-bold text-[#0c2b48]">Mark L.</span> reviewed <span className="font-bold text-[#0c2b48]">Red Canyon</span>
                </p>
                <p className="text-[9px] font-black text-slate-300 mt-1 uppercase tracking-widest">15 Minutes Ago</p>
                <div className="mt-2 w-6 h-6 rounded-full bg-[#3076cc] flex items-center justify-center text-white">
                    <span className="text-xs">★</span>
                </div>
              </div>
            </div>

            {/* Activity Item 3 */}
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#d68545] flex-shrink-0 flex items-center justify-center text-white relative z-10 shadow-sm">
                <FileText className="w-4 h-4 fill-white text-[#d68545]" />
              </div>
              <div className="pt-0.5">
                <p className="text-sm font-semibold text-slate-500 leading-tight">
                  <span className="font-bold text-[#0c2b48]">System</span> flagged <span className="font-bold text-[#0c2b48]">Content</span>
                </p>
                <p className="text-[9px] font-black text-slate-300 mt-1 uppercase tracking-widest">1 Hour Ago</p>
              </div>
            </div>

            {/* Activity Item 4 */}
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 relative z-10 shadow-sm overflow-hidden">
                 <img src="https://i.pravatar.cc/150?u=3" alt="Anna W." className="w-full h-full object-cover" />
              </div>
              <div className="pt-0.5">
                <p className="text-sm font-semibold text-slate-500 leading-tight">
                  <span className="font-bold text-[#0c2b48]">Anna W.</span> updated <span className="font-bold text-[#0c2b48]">Fish Market</span>
                </p>
                <p className="text-[9px] font-black text-slate-300 mt-1 uppercase tracking-widest">3 Hours Ago</p>
                <div className="mt-2 w-4 h-4 rounded-full bg-[#5e7050] border-2 border-white"></div>
              </div>
            </div>
          </div>

          <button className="text-[13px] font-black text-[#006e9b] mt-8 hover:text-[#005f85] transition-colors self-center">
            View All Activity
          </button>
        </div>
      </div>

      {/* Contribution Heatmap Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-1.5 bg-[#f4f6ee] rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden h-[280px]">
          {/* Decorative shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/60 rounded-[3rem] rotate-12 blur-sm"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 bg-[#ecefde]/60 rounded-full blur-xl"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <h2 className="text-xl font-bold text-[#0c2b48]">Contribution Heatmap</h2>
            <p className="text-xs font-bold text-slate-500 mt-1 mb-8 uppercase tracking-widest">Visual density of new user contributions</p>
            
            <div className="space-y-6 flex-1 flex flex-col justify-end">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 rounded-full bg-white/60 overflow-hidden shadow-sm">
                  <div className="h-full bg-[#8c5929] rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-bold text-[#0c2b48] w-40 text-right">Ham Tien (85%)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 rounded-full bg-white/60 overflow-hidden shadow-sm">
                  <div className="h-full bg-[#1b5e82] rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-bold text-[#0c2b48] w-40 text-right">Mui Ne (60%)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 rounded-full bg-white/60 overflow-hidden shadow-sm">
                  <div className="h-full bg-[#6a755d] rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-sm font-bold text-[#0c2b48] w-40 text-right">Phan Thiet City (40%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1.5 bg-gradient-to-br from-[#fbfdfd] to-[#eff3f3] rounded-3xl p-10 flex flex-col justify-center items-start h-[280px] shadow-[inset_0_0_0_1px_rgba(255,255,255,1)] border border-slate-100">
          <h2 className="text-4xl font-black text-[#0c2b48] w-[80%] leading-[1.1] tracking-tight">Curate the<br/>Next Horizon.</h2>
          <button className="mt-8 bg-white text-[#0c2b48] px-8 py-3.5 rounded-full font-bold shadow-[0_4px_15px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_-5px_rgba(0,0,0,0.1)] transition-all border border-slate-100 text-[14px]">
            Review Submissions
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-between items-center py-6 border-t border-slate-200 mt-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2024 THE COASTAL EDITORIAL PORTAL</p>
        <div className="flex gap-8">
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0c2b48] transition-colors">STATUS</a>
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0c2b48] transition-colors">POLICY</a>
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0c2b48] transition-colors">SUPPORT</a>
        </div>
      </footer>
    </div>
  );
}
