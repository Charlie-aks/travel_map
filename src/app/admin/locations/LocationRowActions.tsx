"use client";

import { CheckCircle, Trash2, Eye, Edit2 } from "lucide-react";
import { useTransition } from "react";
import { approveLocationAction, deleteLocationAction } from "@/lib/actions/admin";
import { actionErrorMessage } from "../components/action-feedback";

export function LocationRowActions({ id, status, onView, onEdit, onActionComplete }: { id: string, status: string | null, onView?: () => void, onEdit?: () => void, onActionComplete?: () => void }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      {status === 'PENDING' && (
        <button 
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await approveLocationAction(id);
              if ("error" in result) {
                alert(actionErrorMessage(result.code));
                return;
              }
              onActionComplete?.();
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
        onClick={onView}
        className="p-2.5 text-slate-400 hover:text-[#0c2b48] hover:bg-slate-100 rounded-full transition-all border border-transparent flex items-center justify-center cursor-pointer"
        title="Xem chi tiết"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button 
        disabled={isPending}
        onClick={onEdit}
        className="p-2.5 text-slate-400 hover:text-[#006e9b] hover:bg-blue-50 rounded-full transition-all border border-transparent flex items-center justify-center cursor-pointer"
        title="Chỉnh sửa"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button 
        disabled={isPending}
        onClick={() => {
          if(confirm("Bạn có chắc chắn muốn xóa địa điểm này không? Hành động này không thể hoàn tác.")) {
            startTransition(async () => {
              const result = await deleteLocationAction(id);
              if ("error" in result) {
                alert(actionErrorMessage(result.code));
                return;
              }
              onActionComplete?.();
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
