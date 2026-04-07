import { SettingsSidebar } from "@/features/settings/SettingsSidebar";
import { SettingsForm } from "@/features/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="flex w-full h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-slate-950 overflow-hidden transition-colors">
      <SettingsSidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar relative transition-all">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-10">
          <SettingsForm />
        </div>
      </main>
    </div>
  );
}
