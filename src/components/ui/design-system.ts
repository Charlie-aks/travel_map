// src/components/ui/design-system.ts

export const coastalTheme = {
  colors: {
    primary: "var(--primary)",
    primaryForeground: "var(--primary-foreground)",
    sidebar: "var(--sidebar)",
    sidebarForeground: "var(--sidebar-foreground)",
    background: "var(--background)",
    foreground: "var(--foreground)",
  },
  animations: {
    staggerContainer: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    itemFadeUp: {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    }
  },
  glassmorphism: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
};

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
