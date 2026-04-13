"use client";

import { useState } from "react";
import { Star, Send, User } from "lucide-react";
import { Location } from "@/constants/mock-data";
import { useLocationStore } from "@/store/useLocationStore";

interface LocationReviewsProps {
  location: Location;
}

export function LocationReviews({ location }: LocationReviewsProps) {
  const { addReview } = useLocationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    await addReview(location.id, {
      userName: userName.trim() || 'Khách du lịch ẩn danh',
      rating,
      comment: comment.trim(),
    });
    
    // Reset form
    setComment("");
    setUserName("");
    setRating(5);
    setIsSubmitting(false);
  };

  const reviews = location.reviews || [];

  return (
    <section className="mt-12 mb-12">
      <h2 className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#0077b6] dark:text-[#38bdf8] mb-6 transition-colors">
        Reviews & Ratings
      </h2>

      {/* Review Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 mb-8 transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-slate-50 mb-4 text-lg">Leave a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                      : "text-slate-300 dark:text-slate-700"
                  }`} 
                />
              </button>
            ))}
          </div>

          <div>
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077b6] dark:focus:ring-[#38bdf8] transition-colors text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>

          <div>
            <textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077b6] dark:focus:ring-[#38bdf8] transition-colors resize-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="flex items-center gap-2 bg-[#0077b6] hover:bg-[#005f92] dark:bg-[#38bdf8] dark:hover:bg-[#0284c7] text-white dark:text-slate-900 font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : (
              <>
                <Send className="w-4 h-4" /> Submit Review
              </>
            )}
          </button>
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
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-[3.25rem]">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
