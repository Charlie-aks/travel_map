import { X, Mail, Shield, UserCheck, Calendar, ShieldAlert } from "lucide-react";

interface UserRecord {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  image: string | null;
  createdAt: string;
}

interface UserDetailModalProps {
  user: UserRecord | null;
  onClose: () => void;
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-black text-[#0c2b48]">User Profile</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-md border-4 border-white shrink-0 bg-slate-100 mb-4 ring-1 ring-slate-100">
              {user.image ? (
                <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[2rem] font-black text-slate-300 uppercase">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            
            <h3 className="text-2xl font-black text-[#0c2b48] mb-1">{user.name || "Unknown User"}</h3>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
              <Mail className="w-4 h-4" />
              <span>{user.email || "No email available"}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${user.role === 'ADMIN' ? 'bg-[#006e9b]/10 text-[#006e9b]' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {user.role === 'ADMIN' ? <ShieldAlert className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">System Role</p>
                  <p className="font-bold text-[#0c2b48]">{user.role || "USER"}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-200/50 text-slate-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Joined Date</p>
                  <p className="font-bold text-[#0c2b48]">{new Date(user.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-200/50 text-slate-500">
                  <span className="font-black text-sm px-1 text-slate-500">ID</span>
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">User ID</p>
                  <p className="font-mono text-xs font-bold text-slate-500 mt-1">{user.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
