"use client";

import { useProfileStore } from "@/store/useProfileStore";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { Star, TrendingUp, Trophy } from "lucide-react";

export function MilestoneTracker() {
  const { profile } = useProfileStore();
  const { t } = useTranslation();

  const nextLevel = profile.level.current + 1;
  const xpLeft = profile.level.maxXp - profile.level.xp;
  
  // Find next big badge (closest to unlock)
  const lockedBadges = profile.badges.filter(b => !b.unlocked);
  const nextBadge = lockedBadges.sort((a, b) => b.progress/b.target - a.progress/a.target)[0];

  const milestones = [
    {
      id: 'level',
      icon: <Star className="w-5 h-5" />,
      title: `Level ${nextLevel}`,
      desc: t.profile.nextLevel,
      current: profile.level.xp,
      target: profile.level.maxXp,
      color: "from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-600",
      bg: "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800"
    },
    ...(nextBadge ? [{
      id: 'badge',
      icon: <Trophy className="w-5 h-5" />,
      title: t.profile.badges[nextBadge.id as keyof typeof t.profile.badges].name,
      desc: t.profile.milestones,
      current: nextBadge.progress,
      target: nextBadge.target,
      color: "from-amber-600 to-amber-400 dark:from-amber-400 dark:to-amber-600",
      bg: "bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800"
    }] : [])
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-colors">
      <h3 className="text-xl font-black text-slate-800 dark:text-slate-50 mb-8 tracking-tight flex items-center gap-3 transition-colors">
        <TrendingUp className="w-5 h-5 text-[#0077b6] dark:text-[#38bdf8]" />
        {t.profile.milestones}
      </h3>

      <div className="space-y-8">
        {milestones.map((milestone, idx) => (
          <motion.div 
            key={milestone.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`p-6 rounded-2xl border transition-all ${milestone.bg}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-950 shadow-sm transition-colors text-slate-400 dark:text-slate-500">
                {milestone.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-50 transition-colors uppercase tracking-widest">{milestone.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{milestone.desc}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-slate-800 dark:text-slate-50 transition-colors">
                  {Math.round((milestone.current / milestone.target) * 100)}%
                </span>
              </div>
            </div>

            <div className="h-3 bg-white dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800 transition-colors shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                className={`h-full rounded-full bg-linear-to-r shadow-sm ${milestone.color}`}
              />
            </div>
            
            <div className="mt-3 flex justify-between text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500">
              <span>{milestone.current} {t.profile.earnedBadges.split(' ')[2]}</span>
              <span>{milestone.target} {t.profile.earnedBadges.split(' ')[2]}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-8 py-3 bg-slate-50/50 dark:bg-slate-950/30 hover:bg-white dark:hover:bg-slate-950/50 text-slate-400 dark:text-slate-500 hover:text-[#0077b6] dark:hover:text-[#38bdf8] font-black text-xs uppercase tracking-widest rounded-xl transition-all border border-dashed border-slate-200 dark:border-slate-800 hover:border-[#0077b6] dark:hover:border-[#38bdf8]">
        Explore Challenges
      </button>
    </div>
  );
}
