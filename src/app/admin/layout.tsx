import Link from "next/link";
import { Search, Bell, HelpCircle, LayoutDashboard, MapPin, Users, FileText, Settings } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminNavShell } from "./components/AdminNavShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // If there's no session, no user, or the role is not ADMIN, redirect out.
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/");
  }

  const userContext = {
    name: session?.user?.name || null,
    image: session?.user?.image || null,
    role: (session?.user as any)?.role || null
  };

  return (
    <AdminNavShell userContext={userContext}>
      {children}
    </AdminNavShell>
  );
}
