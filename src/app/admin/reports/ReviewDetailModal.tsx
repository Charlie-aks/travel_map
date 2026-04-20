"use client";

import { X, Star, MapPin, User, FileText, Calendar, EyeOff, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReviewDetails {
  id: string;
  rating: number;
  content: string | null;
  status: string | null;
  createdAt: Date | null;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  location: {
    id: string;
    title: string | null;
    imageUrl: string | null;
  } | null;
}

interface ReviewDetailModalProps {
  review: ReviewDetails | null;
}

export function ReviewDetailModal({ review }: ReviewDetailModalProps) {
  const router = useRouter();

  if (!review) return null;

  const isHidden = review.status === 'HIDDEN';

  const closeModal = () => {
    router.push('/admin/reports');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden mt-8 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-[#0c2b48]">Review Details</h2>
            {isHidden && (
              <span className="px-3 py-1 rounded-full text-[10px] bg-red-50 text-red-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> Hidden
              </span>
            )}
          </div>
          <button 
            onClick={closeModal}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                <img 
                  src={review.location?.imageUrl || "https://images.unsplash.com/photo-1506190500382-77880267ce0b?w=400"} 
                  alt={review.location?.title || "Location"} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Location</span>
                </div>
                <p className="font-bold text-[#0c2b48]">{review.location?.title || "Unknown Location"}</p>
                <p className="font-mono text-[10px] text-slate-400 mt-1 break-all">ID: {review.location?.id}</p>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Review Author</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-100 shrink-0 bg-white">
                    {review.author?.image ? (
                      <img src={review.author.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[12px] font-black text-slate-300 uppercase">
                        {review.author?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[14px] font-bold text-[#0c2b48] block">{review.author?.name || "Anonymous User"}</span>
                    <p className="font-mono text-[10px] text-slate-400 break-all">ID: {review.author?.id}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Star className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Rating Given</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < review.rating ? 'fill-[#ffc107] text-[#ffc107]' : 'text-slate-200'}`} 
                      />
                    ))}
                    <span className="ml-2 text-xl font-black text-[#0c2b48]">{review.rating}.0</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Posted on</span>
                  </div>
                  <p className="font-bold text-[#0c2b48]">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'Unknown'}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[#0c2b48] mb-2 px-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-[12px] font-bold uppercase tracking-widest">Review Content</span>
                </div>
                <div className={`p-5 rounded-2xl border border-slate-100 min-h-[100px] flex items-start gap-3 ${isHidden ? 'bg-red-50/50' : 'bg-slate-50/50'}`}>
                  {isHidden && <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
                  <p className={`text-[14px] font-medium leading-relaxed italic ${isHidden ? 'text-red-900/70 border-l-2 border-red-200 pl-3' : 'text-slate-600 border-l-2 border-[#006e9b]/20 pl-3'}`}>
                    "{review.content || "Người dùng này không để lại nội dung đánh giá."}"
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
