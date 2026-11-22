import { redirect } from "next/navigation";
import { getAdminViewer } from "@/lib/auth-guard";
import { AdminNavShell } from "./components/AdminNavShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // ADMIN: toàn quyền. DEMO: chỉ xem (mọi thao tác ghi bị server từ chối).
  // Role đọc từ DB. Lưu ý: layout chỉ điều khiển giao diện — API route và
  // server action phải tự kiểm tra quyền.
  const viewer = await getAdminViewer();
  if (!viewer) redirect("/");

  const userContext = {
    name: viewer.name || null,
    image: viewer.image || null,
    role: viewer.role,
  };

  return <AdminNavShell userContext={userContext}>{children}</AdminNavShell>;
}
