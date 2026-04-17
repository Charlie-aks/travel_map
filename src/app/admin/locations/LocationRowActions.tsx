"use client";

import { CheckCircle, Trash2, Eye } from "lucide-react";
import { useTransition } from "react";
import { approveLocationAction, deleteLocationAction } from "@/lib/actions/admin";

export function LocationRowActions({ id, status }: { id: string, status: string | null }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      {status === 'PENDING' && (
        <button 
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await approveLocationAction(id);
            });
          }}
          className="p-2.5 text-slate-400 hover:text-[#48bb78] hover:bg-[#48bb78]/10 rounded-full transition-all border border-transparent disabled:opacity-50"
          title="Phê duyệt địa điểm"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      )}
      <button 
        disabled={isPending}
        className="p-2.5 text-slate-300 hover:text-[#0c2b48] hover:bg-slate-100 rounded-full transition-all border border-transparent pointer-events-none opacity-50 flex items-center justify-center"
        title="Xem chi tiết (Đang tắt)"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button 
        disabled={isPending}
        onClick={() => {
          if(confirm("Bạn có chắc chắn muốn xóa địa điểm này không? Hành động này không thể hoàn tác.")) {
            startTransition(async () => {
              await deleteLocationAction(id);
            });
          }
        }}
        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all border border-transparent disabled:opacity-50"
        title="Xóa địa điểm"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
