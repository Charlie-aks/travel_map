"use client";

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
  Ban,
  Loader2,
  RefreshCcw,
  UserCheck,
  UserCog
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserDetailModal } from "./UserDetailModal";

interface UserRecord {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  image: string | null;
  createdAt: string;
}

const ROLES = ["ALL", "ADMIN", "USER"];

export default function UserManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const [activeRole, setActiveRole] = useState("ALL");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetchUsers();
  }, [activeRole]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/admin/users", window.location.origin);
      if (activeRole !== "ALL") url.searchParams.append("role", activeRole);
      
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setActiveRole("ALL");
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (session?.user?.id === id) {
      alert("Bạn không thể tự xóa tài khoản của chính mình!");
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}" không? Thao tác này không thể hoàn tác.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        const err = await res.json();
        alert(err.error || "Lỗi khi xóa người dùng");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi hệ thống khi xóa người dùng.");
    }
  };

  const toggleUserRole = async (user: UserRecord) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    
    if (session?.user?.id === user.id && newRole === "USER") {
      alert("Bạn không thể tự hạ quyền của chính mình!");
      return;
    }

    if (!confirm(`Thay đổi quyền của ${user.name} thành ${newRole}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      } else {
        const err = await res.json();
        alert(err.error || "Lỗi khi cập nhật quyền");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi hệ thống khi cập nhật quyền.");
    }
  };

  const formatDate = (dateString: string) => {
    if (!isMounted) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <span>Directory</span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-[#006e9b]">Users</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between gap-4">
          <div>
            <h1 className="text-[2rem] md:text-[2.5rem] font-black tracking-tight text-[#0c2b48] leading-tight">User Management</h1>
            <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed text-sm md:text-base">
              Manage user accounts, roles, and platform permissions. Monitor activity and ensure community standards are maintained.
            </p>
          </div>
          <div className="flex w-full sm:w-auto gap-3 mt-2 sm:mt-0">
            <button 
              onClick={fetchUsers}
              className="p-3.5 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-[#006e9b] hover:shadow-sm transition-all active:rotate-180 duration-500 shrink-0"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
            <button className="bg-[#006e9b] flex-1 sm:flex-none justify-center hover:bg-[#005f85] text-white px-8 py-3.5 rounded-full font-bold text-[14px] flex items-center gap-2.5 transition-all shadow-[0_4px_15px_-5px_rgba(0,110,155,0.4)]">
              <UserPlus className="w-4 h-4 stroke-3" />
              Add New User
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <div 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm cursor-pointer hover:border-[#006e9b] transition-all"
            >
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-[13px] font-bold text-slate-400">Filter by Role:</span>
              <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48] uppercase tracking-wide">
                {activeRole === "ALL" ? "All Roles" : activeRole} <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {showRoleDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-50 overflow-hidden z-20">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setActiveRole(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full px-6 py-3.5 text-left text-[13px] font-bold transition-colors ${
                      activeRole === role ? 'bg-[#006e9b] text-white' : 'text-[#0c2b48] hover:bg-slate-50'
                    }`}
                  >
                    {role === "ALL" ? "All Roles" : role}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full border border-slate-100 shadow-sm opacity-50 cursor-not-allowed">
            <span className="text-[13px] font-bold text-slate-400">Status:</span>
            <button className="flex items-center gap-2 text-[13px] font-black text-[#0c2b48]">
              Active Only <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleClearAll}
          className="text-[13px] font-black text-slate-400 hover:text-red-500 transition-colors w-full md:w-auto text-center md:text-left pt-2 md:pt-0"
        >
          Clear All
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2rem] shadow-[0_2px_25px_-10px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 gap-4 min-w-[800px]">
              <Loader2 className="w-10 h-10 animate-spin opacity-20" />
              <p className="text-[11px] font-black uppercase tracking-widest">Loading member data...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
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
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm shrink-0 border border-slate-100 bg-slate-50">
                        {user.image ? (
                          <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100 uppercase font-black">
                            {user.name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-black text-[#0c2b48] text-base truncate">{user.name || "Unknown User"}</h3>
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[#0c2b48]">
                      {user.role === "ADMIN" ? (
                        <Shield className="w-4 h-4 text-[#006e9b]" />
                      ) : (
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                      )}
                      <span className="text-[13px] font-bold uppercase tracking-wide">{user.role || "USER"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#48bb78]" />
                      <span className="text-[11px] font-black tracking-widest uppercase text-[#48bb78]">
                        ACTIVE
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[13px] font-bold text-slate-500">{formatDate(user.createdAt)}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => setSelectedUser(user)}
                        title="View Details"
                        className="p-2.5 text-slate-300 hover:text-[#0c2b48] hover:bg-slate-100 rounded-full transition-all shadow-none hover:shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                       <button 
                        onClick={() => toggleUserRole(user)}
                        title="Change Role"
                        className="p-2.5 text-slate-300 hover:text-[#006e9b] hover:bg-white rounded-full transition-all shadow-none hover:shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <UserCog className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name || "this user")}
                        title="Delete User"
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-white rounded-full transition-all shadow-none hover:shadow-sm border border-transparent hover:border-slate-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-slate-400 font-bold">No users found in the system.</p>
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="px-4 md:px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] font-bold text-slate-400 text-center sm:text-left">
            Showing <span className="text-[#0c2b48]">1-{users.length}</span> of <span className="text-[#0c2b48]">{users.length}</span> users
          </p>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-300 hover:text-slate-600 disabled:opacity-30" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#006e9b] text-white text-[12px] font-black shadow-md shadow-[#006e9b]/20">1</button>
            <button className="p-2 text-slate-300 hover:text-slate-600 disabled:opacity-30" disabled>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <UserDetailModal 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
    </div>
  );
}

