import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  category: 'exploration' | 'contribution' | 'special';
  unlocked: boolean;
  progress: number;
  target: number;
  unlockedAt?: string;
  icon?: string;
}

export type Role = 'USER' | 'ADMIN';



export interface UserProfile {
  fullName: string;
  bio: string;
  hometown: string;
  website: string;
  avatarUrl: string;
  level: {
    current: number;
    titleKey: string;
    xp: number;
    maxXp: number;
  };
  stats: {
    reviews: number;
    photos: number;
    spots: number;
    helpfulVotes: number;
    milesTraveled: number;
    followersCount: number;
    followingCount: number;
  };
  coverUrl: string;
  badges: Badge[];
  role: Role;
}

interface ProfileState {
  profile: UserProfile;
  isAuthenticated: boolean;
  login: (name: string, email?: string, role?: Role) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  unlockBadge: (badgeId: string) => void;
  incrementBadgeProgress: (badgeId: string, amount?: number) => void;
  incrementStat: (statKey: keyof UserProfile['stats'], amount?: number) => void;
  addXp: (amount: number) => void;
  fetchStats: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  fullName: 'Khách du lịch ẩn danh',
  bio: 'Chasing sunsets from Mui Ne to Ke Ga. Digital nomad with a passion for authentic seafood and hidden beach coves.',
  hometown: 'Phan Thiet, Binh Thuan',
  website: 'alex.travels',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  level: {
    current: 12,
    titleKey: 'ambassador',
    xp: 8450,
    maxXp: 10000,
  },
  stats: {
    reviews: 42,
    photos: 156,
    spots: 8,
    helpfulVotes: 892,
    milesTraveled: 1240,
    followersCount: 856,
    followingCount: 124,
  },
  coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  badges: [
    { id: 'seaLover', category: 'exploration', unlocked: true, progress: 5, target: 5, unlockedAt: '2024-03-15', icon: '🏖️' },
    { id: 'foodie', category: 'exploration', unlocked: true, progress: 5, target: 5, unlockedAt: '2024-03-20', icon: '🍽️' },
    { id: 'nightOwl', category: 'exploration', unlocked: false, progress: 2, target: 3, icon: '🌙' },
    { id: 'builder', category: 'contribution', unlocked: true, progress: 1, target: 1, unlockedAt: '2024-02-10', icon: '🏗️' },
    { id: 'photographer', category: 'contribution', unlocked: true, progress: 156, target: 10, unlockedAt: '2024-02-28', icon: '📸' },
    { id: 'inspirer', category: 'contribution', unlocked: false, progress: 42, target: 50, icon: '✨' },
    { id: 'sunriseHunter', category: 'special', unlocked: false, progress: 0, target: 1, icon: '🌅' },
    { id: 'islandHopper', category: 'exploration', unlocked: false, progress: 1, target: 3, icon: '🚢' },
    { id: 'duneClimber', category: 'exploration', unlocked: false, progress: 2, target: 4, icon: '🏜️' },
    { id: 'explorer', category: 'exploration', unlocked: false, progress: 3, target: 10, icon: '🗺️' },
    { id: 'guide', category: 'contribution', unlocked: false, progress: 0, target: 5, icon: '🧭' },
  ],
  role: 'USER',
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      isAuthenticated: false,
      login: (name, email, role = 'USER') => set((state) => ({
        isAuthenticated: true,
        profile: { ...state.profile, fullName: name, role }
      })),
      logout: () => set((state) => ({
        isAuthenticated: false,
        profile: { ...defaultProfile }
      })),
      updateProfile: (data) => 
        set((state) => ({ 
          profile: { ...state.profile, ...data } 
        })),
      unlockBadge: (badgeId) =>
        set((state) => ({
          profile: {
            ...state.profile,
            badges: state.profile.badges.map(b => 
              b.id === badgeId ? { ...b, unlocked: true, unlockedAt: new Date().toISOString().split('T')[0] } : b
            )
          }
        })),
      incrementBadgeProgress: (badgeId, amount = 1) =>
        set((state) => {
          const badges = state.profile.badges.map((b) => {
            if (b.id !== badgeId || b.unlocked) return b;
            const newProgress = Math.min(b.progress + amount, b.target);
            const isNowUnlocked = newProgress >= b.target;
            return {
              ...b,
              progress: newProgress,
              unlocked: isNowUnlocked,
              ...(isNowUnlocked ? { unlockedAt: new Date().toISOString().split('T')[0] } : {})
            };
          });
          return { profile: { ...state.profile, badges } };
        }),
      incrementStat: (statKey, amount = 1) => 
        set((state) => ({
           profile: {
              ...state.profile,
              stats: {
                 ...state.profile.stats,
                 [statKey]: state.profile.stats[statKey] + amount
              }
           }
        })),
      addXp: (amount) =>
        set((state) => {
          let newXp = state.profile.level.xp + amount;
          let newLevel = state.profile.level.current;
          let max = state.profile.level.maxXp;
          
          if (newXp >= max) {
            newXp -= max;
            newLevel += 1;
            max += 2000; // Increase threshold for next level
          }
          
          return {
            profile: {
              ...state.profile,
              level: { ...state.profile.level, xp: newXp, current: newLevel, maxXp: max }
            }
          };
        }),
      fetchStats: async () => {
        try {
          const res = await fetch('/api/profile/stats');
          if (!res.ok) return;
          const data = await res.json();
          
          set((state) => ({
            profile: {
              ...state.profile,
              stats: {
                ...state.profile.stats,
                reviews: data.reviews,
                spots: data.spots,
              }
            }
          }));
        } catch (error) {
          console.error("Failed to fetch stats in store:", error);
        }
      },
    }),
    {
      name: 'phan-thiet-profile-storage-v2', // version bump
    }
  )
);
