import { 
  ChevronRight, 
  UserPlus, 
  Filter, 
  ChevronDown, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft,
  Mail,
  Shield,
  CheckCircle,
  Ban
} from "lucide-react";

const MOCK_USERS = [
  {
    id: "1",
    name: "Linh Nguyen",
    email: "linh.nguyen@example.com",
    role: "Admin",
    status: "ACTIVE",
    joinedDate: "Mar 12, 2024",
    avatar: "https://i.pravatar.cc/150?u=linh"
  },
  {
    id: "2",
    name: "Thanh Son",
    email: "son.thanh@tourist.vn",
    role: "Moderator",
    status: "ACTIVE",
    joinedDate: "Apr 05, 2024",
    avatar: "https://i.pravatar.cc/150?u=son"
  },
  {
    id: "3",
    name: "Jane Doe",
    email: "jane.doe@global.com",
    role: "Contributor",
    status: "SUSPENDED",
    joinedDate: "Feb 20, 2024",
    avatar: "https://i.pravatar.cc/150?u=jane"
  },
  {
    id: "4",
    name: "Alex Marine",
    email: "alex.m@coastal.com",
    role: "Lead Curator",
    status: "ACTIVE",
    joinedDate: "Jan 10, 2024",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  }
];

export default function UserManagementPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <span>Directory</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#006e9b]">Users</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[2.5rem] font-black tracking-tight text-[#0c2b48] leading-tight">User Management</h1>
            <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">
              Manage user accounts, roles, and platform permissions. Monitor activity and ensure community standards are maintained.
            </p>
          </div>
          <button className="bg-[#006e9b] hover:bg-[#005f85] text-white px-8 py-3.5 rounded-full font-bold text-[14px] flex items-center gap-2.5 transition-all shadow-[0_4px_15px_-5px_rgba(0,110,155,0.4)] mt-2">
            <UserPlus className="w-4 h-4 stroke-3" />
            Add New User
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-[13px] font-bold text-slate-400">Filter by Role:</span>
            <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48]">
              All Roles <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>

          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm">
            <span className="text-[13px] font-bold text-slate-400">Status:</span>
            <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48]">
              Active Only <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
        
        <button className="text-[13px] font-black text-slate-400 hover:text-[#0c2b48] transition-colors">
          Clear All
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] shadow-[0_2px_25px_-10px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Name & Email</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Role</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Joined Date</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_USERS.map((user) => (
              <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm shrink-0 border border-slate-100">
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-black text-[#0c2b48] text-base truncate">{user.name}</h3>
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-[#0c2b48]">
                    <Shield className="w-4 h-4 text-[#006e9b]" />
                    <span className="text-[13px] font-bold">{user.role}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {user.status === 'ACTIVE' ? (
                      <CheckCircle className="w-4 h-4 text-[#48bb78]" />
                    ) : (
                      <Ban className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-[11px] font-black tracking-widest uppercase ${
                      user.status === 'ACTIVE' ? 'text-[#48bb78]' : 'text-red-500'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[13px] font-bold text-slate-500">{user.joinedDate}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2.5 text-slate-300 hover:text-[#0c2b48] hover:bg-white rounded-full transition-all shadow-none hover:shadow-sm border border-transparent hover:border-slate-100">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 text-slate-300 hover:text-[#006e9b] hover:bg-white rounded-full transition-all shadow-none hover:shadow-sm border border-transparent hover:border-slate-100">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-white rounded-full transition-all shadow-none hover:shadow-sm border border-transparent hover:border-slate-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[12px] font-bold text-slate-400">
            Showing <span className="text-[#0c2b48]">1-4</span> of <span className="text-[#0c2b48]">150</span> users
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
