import { SettingsSidebar } from "@/features/settings/SettingsSidebar";
import { HelpCenterContent } from "@/features/help/HelpCenterContent";

export default function HelpPage() {
  return (
    <div className="flex w-full h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-slate-950 overflow-hidden transition-colors">
      <SettingsSidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <HelpCenterContent />
      </main>
    </div>
  );
}
