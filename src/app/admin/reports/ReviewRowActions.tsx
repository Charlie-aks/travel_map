"use client";

import { Trash2, EyeOff, Eye, Info } from "lucide-react";
import { useTransition } from "react";
import { toggleReviewStatusAction, deleteReviewAction } from "@/lib/actions/admin";
import Link from "next/link";

export function ReviewRowActions({ id, status }: { id: string, status: string | null }) {
  const [isPending, startTransition] = useTransition();

  const isHidden = status === 'HIDDEN';

  return (
    <div className="flex items-center justify-end gap-2 text-right">
      <Link 
        href={`?view=${id}`}
        className="p-2.5 text-slate-400 hover:text-[#0c2b48] hover:bg-slate-100 rounded-full transition-all border border-transparent inline-flex items-center justify-center"
        title="Xem chi tiết đánh giá"
        scroll={false}
      >
        <Info className="w-4 h-4" />
      </Link>
      <button 
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await toggleReviewStatusAction(id, status || 'PUBLISHED');
          });
        }}
        className={`p-2.5 rounded-full transition-all border border-transparent disabled:opacity-50 ${
          isHidden 
            ? 'text-slate-400 hover:text-[#48bb78] hover:bg-[#48bb78]/10' 
            : 'text-slate-400 hover:text-orange-500 hover:bg-orange-50'
        }`}
        title={isHidden ? "Hiển thị đánh giá" : "Ẩn đánh giá"}
      >
        {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>

      <button 
        disabled={isPending}
        onClick={() => {
          if(confirm("Bạn có chắc chắn muốn xóa đánh giá này vĩnh viễn không?")) {
            startTransition(async () => {
              await deleteReviewAction(id);
            });
          }
        }}
        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all border border-transparent disabled:opacity-50"
        title="Xóa đánh giá"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
