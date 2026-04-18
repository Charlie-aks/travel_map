import { SettingsSidebar } from "@/features/settings/SettingsSidebar";
import { ProfileHero } from "@/features/profile/ProfileHero";
import { GlobalImpact } from "@/features/profile/ProfileStats";
import { ProfileContentTabs } from "@/features/profile/ProfileContentTabs";
import { SocialConnections } from "@/features/profile/SocialConnections";
import { ProfileForms } from "@/features/profile/ProfileForms";

export default function ProfilePage() {
  return (
    <div className="flex w-full h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-slate-950 overflow-hidden transition-colors">
      
      {/* Left Sidebar */}
      <SettingsSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 md:px-12 py-10 transition-all">
          
          {/* Header Section */}
          <ProfileHero />

          <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8 lg:gap-10">
            {/* Left Column: Main Content */}
            <div className="2xl:col-span-2 space-y-10">
              <GlobalImpact />
              <ProfileContentTabs />
              <ProfileForms />
            </div>

            {/* Right Column: Social & Community */}
            <div className="space-y-10">
              <SocialConnections />
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
