"use client";

import { useState, useEffect } from "react";
import { Star, Send, User, Lock, EyeOff } from "lucide-react";
import { Location } from "@/constants/mock-data";
import { useLocationStore } from "@/store/useLocationStore";
import { useProfileStore } from "@/store/useProfileStore";
import Link from "next/link";

interface LocationReviewsProps {
  location: Location;
}

export function LocationReviews({ location }: LocationReviewsProps) {
  const { addReview } = useLocationStore();
  const { profile, isAuthenticated } = useProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const res = await fetch(`/api/locations/${location.id}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !isAuthenticated) return;

    setIsSubmitting(true);
    try {
      await addReview(location.id, {
        userName: isAnonymous ? 'Người dùng ẩn danh' : profile.fullName,
        rating,
        comment: comment.trim(),
        // Add isAnonymous for the API call in store
        isAnonymous: isAnonymous
      } as any);
      
      // Reset form
      setComment("");
      setRating(5);
      setIsAnonymous(false);

      // Re-fetch reviews to show newly submitted review
      await fetchReviews();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-12 mb-12">
      <h2 className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0077b6] dark:text-[#38bdf8] mb-6 transition-colors">
        Reviews & Ratings
      </h2>

      {/* Review Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 mb-8 transition-all overflow-hidden relative">
        {!isAuthenticated && (
          <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            <div className="w-12 h-12 bg-[#0077b6]/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-[#0077b6]" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-50 mb-1">Đăng nhập để đánh giá</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-[200px]">Bạn cần đăng nhập tài khoản để có thể chia sẻ trải nghiệm của mình.</p>
            <Link 
              href="/login" 
              className="bg-[#0077b6] hover:bg-[#005f92] text-white px-6 py-2 rounded-full text-xs font-bold transition-all shadow-md shadow-[#0077b6]/20"
            >
              Đăng nhập ngay
            </Link>
          </div>
        )}

        <h3 className="font-black text-[#0c2b48] dark:text-slate-200 mb-5 text-lg flex items-center gap-2">
          Gửi đánh giá của bạn
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">Đánh giá điểm đến</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95"
                >
                  <Star 
                    className={`w-7 h-7 transition-colors ${
                      (hoveredStar || rating) >= star 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-slate-200 dark:text-slate-700"
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-slate-400">{rating}/5</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">Nội dung đánh giá</span>
             <textarea
               placeholder="Hãy chia sẻ trải nghiệm của bạn về địa điểm này..."
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               rows={3}
               required
               className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077b6]/20 dark:focus:ring-[#38bdf8]/10 transition-all resize-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
             />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-10 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:bg-[#0077b6] transition-all"></div>
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
              </div>
              <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                <EyeOff className="w-3.5 h-3.5" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Đánh giá ẩn danh</span>
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim() || !isAuthenticated}
              className="flex items-center gap-2 bg-[#0c2b48] hover:bg-[#1a3a5a] dark:bg-[#38bdf8] dark:hover:bg-[#0284c7] text-white dark:text-slate-900 font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-[#0c2b48]/10 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              {isSubmitting ? "Đang gửi..." : (
                <>
                  <Send className="w-3.5 h-3.5" /> Gửi đánh giá
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {review.avatarUrl ? (
                      <img src={review.avatarUrl} alt={review.userName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{review.userName}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center bg-yellow-50 dark:bg-yellow-400/10 px-2 py-1 rounded-md gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">{review.rating}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-13">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
