"use client";

import { SettingsSidebar } from "@/features/settings/SettingsSidebar";
import { AchievementHero } from "@/features/achievements/AchievementHero";
import { AchievementStats } from "@/features/achievements/AchievementStats";
import { BadgeGrid } from "@/features/achievements/BadgeGrid";
import { MilestoneTracker } from "@/features/achievements/MilestoneTracker";
import { motion } from "framer-motion";

export default function AchievementsPage() {
  return (
    <div className="flex w-full h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-slate-950 overflow-hidden transition-colors">
      
      {/* Left Sidebar */}
      <SettingsSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10">
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Left/Middle Column (Primary Content) */}
            <div className="xl:col-span-2">
              <AchievementHero />
              <AchievementStats />
              <BadgeGrid />
            </div>

            {/* Right Column (Secondary Content) */}
            <div className="space-y-10">
              <MilestoneTracker />
              
              {/* Leaderboard Sneak Peek */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-colors"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-50 uppercase tracking-tight transition-colors">Top Explorers</h3>
                  <button className="text-xs font-black text-[#0077b6] dark:text-[#38bdf8] uppercase tracking-widest hover:underline transition-all">View All</button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: 'Minh Tran', xp: '12.4k', rank: 1, img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80' },
                    { name: 'You', xp: '8.4k', rank: 14, img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80', active: true },
                    { name: 'Linh Hoang', xp: '8.2k', rank: 15, img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
                  ].map((user) => (
                    <div key={user.name} className={`flex items-center gap-4 p-3 rounded-2xl transition-colors ${user.active ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                      <span className="w-5 text-center text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{user.rank}</span>
                      <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800" />
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-50 transition-colors uppercase tracking-tight">{user.name}</h4>
                      </div>
                      <span className="text-sm font-black text-[#0077b6] dark:text-[#38bdf8] transition-colors">{user.xp}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
