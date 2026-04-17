import { 
  ChevronRight, 
  Filter, 
  ChevronDown, 
  Eye, 
  Trash2, 
  ChevronLeft,
  Star,
  MessageSquare,
  MapPin,
  User as UserIcon
} from "lucide-react";

const MOCK_REPORTS = [
  {
    id: "1",
    location: {
      name: "Mui Ne White Sand Dunes",
      image: "https://images.unsplash.com/photo-1506190500382-77880267ce0b?q=80&w=200&auto=format&fit=crop"
    },
    user: {
      name: "Linh Nguyen",
      avatar: "https://i.pravatar.cc/150?u=linh"
    },
    rating: 5,
    content: "Cảnh đẹp tuyệt vời, cát trắng mịn và gió mát. Rất đáng trải nghiệm!",
    createdAt: "Oct 15, 2024"
  },
  {
    id: "2",
    location: {
      name: "The Bo Ke Coastline",
      image: "https://images.unsplash.com/photo-1559592413-7ece35b462f7?q=80&w=200&auto=format&fit=crop"
    },
    user: {
      name: "Thanh Son",
      avatar: "https://i.pravatar.cc/150?u=son"
    },
    rating: 3,
    content: "Đồ ăn ngon nhưng phục vụ hơi chậm vào giờ cao điểm.",
    createdAt: "Oct 12, 2024"
  },
  {
    id: "3",
    location: {
      name: "Ke Ga Lighthouse",
      image: "https://images.unsplash.com/photo-1548543604-a87c9909afec?q=80&w=200&auto=format&fit=crop"
    },
    user: {
      name: "Jane Doe",
      avatar: "https://i.pravatar.cc/150?u=jane"
    },
    rating: 4,
    content: "Ngọn hải đăng cổ nhất Việt Nam, kiến trúc rất ấn tượng.",
    createdAt: "Oct 10, 2024"
  }
];

export default function ReportsManagementPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <span>Directory</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#006e9b]">Reports & Reviews</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[2.5rem] font-black tracking-tight text-[#0c2b48] leading-tight">Reports & Reviews</h1>
            <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">
              Monitor user feedback and community ratings. Moderate content to ensure high-quality information and authentic experiences.
            </p>
          </div>
          <button className="bg-[#f45d48] hover:bg-[#d94f4a] text-white px-8 py-3.5 rounded-full font-bold text-[14px] flex items-center gap-2.5 transition-all shadow-[0_4px_15px_-5px_rgba(244,93,72,0.4)] mt-2">
            <Trash2 className="w-4 h-4 stroke-3" />
            Clear All Reports
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-[13px] font-bold text-slate-400">Sort by:</span>
            <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48]">
              Newest First <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>

          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm">
            <span className="text-[13px] font-bold text-slate-400">Rating:</span>
            <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48]">
              All Ratings <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
        
        <button className="text-[13px] font-black text-slate-400 hover:text-[#0c2b48] transition-colors">
          Reset Filters
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] shadow-[0_2px_25px_-10px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[200px]">Location</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[150px]">User</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[120px]">Rating</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[120px]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Content</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right min-w-[120px]">Actions</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest min-w-[120px]">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-100">
                        <img src={report.location.image} alt={report.location.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-black text-[#0c2b48] text-[14px] truncate">{report.location.name}</h3>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>View on map</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shrink-0">
                        <img src={report.user.avatar} alt={report.user.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[13px] font-bold text-[#0c2b48]">{report.user.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < report.rating ? 'fill-[#ffc107] text-[#ffc107]' : 'text-slate-200'}`} 
                        />
                      ))}
                      <span className="ml-2 text-[13px] font-black text-[#0c2b48]">{report.rating}.0</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-[#48bb78]`}></div>
                      <span className={`text-[11px] font-black tracking-widest uppercase text-[#48bb78]`}>
                        PUBLISHED
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 max-w-[200px]">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                      <p className="text-[13px] font-medium text-slate-600 line-clamp-2 leading-relaxed italic">
                        "{report.content}"
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-right">
                      <button className="p-2.5 text-slate-300 hover:text-[#0c2b48] hover:bg-white rounded-full transition-all shadow-none hover:shadow-sm border border-transparent hover:border-slate-100">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-white rounded-full transition-all shadow-none hover:shadow-sm border border-transparent hover:border-slate-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-nowrap">
                    <span className="text-[13px] font-bold text-slate-500">{report.createdAt}</span>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[12px] font-bold text-slate-400">
            Showing <span className="text-[#0c2b48]">1-3</span> of <span className="text-[#0c2b48]">42</span> reports
          </p>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-300 hover:text-slate-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#006e9b] text-white text-[12px] font-black shadow-md shadow-[#006e9b]/20">1</button>
            <button className="w-8 h-8 rounded-full hover:bg-slate-100 text-[#0c2b48] text-[12px] font-bold transition-colors">2</button>
            <button className="w-8 h-8 rounded-full hover:bg-slate-100 text-[#0c2b48] text-[12px] font-bold transition-colors">3</button>
            <button className="p-2 text-slate-300 hover:text-slate-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
