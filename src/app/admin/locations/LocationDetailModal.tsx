import { X, MapPin, Calendar, User, Tag, ToggleLeft, ToggleRight, CheckCircle, Clock } from "lucide-react";

interface LocationRecord {
  id: string;
  title: string;
  category: string;
  status: string;
  imageUrl: string;
  description: string | null;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  } | null;
}

interface LocationDetailModalProps {
  location: LocationRecord | null;
  onClose: () => void;
}

export function LocationDetailModal({ location, onClose }: LocationDetailModalProps) {
  if (!location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden mt-8 max-h-[90vh] flex flex-col pt-2 animate-in zoom-in-95 duration-200">
        <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-[1.5rem] font-black text-[#0c2b48]">Location Details</h2>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 shrink-0">
              <div className="aspect-4/5 rounded-2xl overflow-hidden shadow-md bg-slate-50 border border-slate-100">
                {location.imageUrl ? (
                  <img src={location.imageUrl} alt={location.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 flex-col gap-2">
                    <MapPin className="w-8 h-8 opacity-50" />
                    <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-slate-100 text-slate-500">
                    ID: {location.id.slice(0, 8)}...
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 ${
                    location.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'
                  }`}>
                    {location.status === 'APPROVED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {location.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-[#0c2b48]">{location.title}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Tag className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Category</span>
                  </div>
                  <p className="font-bold text-[#0c2b48]">{location.category}</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Created</span>
                  </div>
                  <p className="font-bold text-[#0c2b48]">
                    {new Date(location.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Added By</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-100 shrink-0 bg-white">
                    {location.author?.image ? (
                      <img src={location.author.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[12px] font-black text-slate-300 uppercase">
                        {location.author?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <span className="text-[14px] font-bold text-[#0c2b48]">{location.author?.name || "Anonymous User"}</span>
                </div>
              </div>

              <div>
                <p className="text-[13px] font-medium text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {location.description || "No description provided for this location."}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
