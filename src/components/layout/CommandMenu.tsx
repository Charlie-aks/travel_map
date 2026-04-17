"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Compass, Search, MapPin, User, Settings, LayoutGrid } from "lucide-react";
import { coastalTheme, cn } from "@/components/ui/design-system";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-slate-900/40 backdrop-blur-sm">
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={() => setOpen(false)} 
      />
      <Command 
        className={cn(
          "w-full max-w-[600px] overflow-hidden rounded-2xl shadow-2xl transition-all",
          coastalTheme.glassmorphism
        )}
      >
        <div className="flex items-center border-b border-slate-100 dark:border-slate-800 px-3 transition-colors">
          <Search className="mr-2 h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
          <Command.Input 
            autoFocus
            className="flex h-14 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-50 disabled:cursor-not-allowed disabled:opacity-50" 
            placeholder="Type a command or search..." 
          />
        </div>
        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
          <Command.Empty className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No results found.
          </Command.Empty>
          
          <Command.Group heading="Navigation" className="px-2 text-xs font-medium text-slate-500 dark:text-slate-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold">
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/"))}
              className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-3 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-50 font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Compass className="mr-3 h-5 w-5 text-primary" />
              Explore Map
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/add-location"))}
              className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-3 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-50 font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              <MapPin className="mr-3 h-5 w-5 text-primary" />
              Add Location
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

          <Command.Group heading="Settings & Admin" className="px-2 text-xs font-medium text-slate-500 dark:text-slate-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold">
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/profile"))}
              className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-3 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-50 font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              <User className="mr-3 h-5 w-5" />
              Profile
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/admin/locations"))}
              className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-3 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-50 font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              <LayoutGrid className="mr-3 h-5 w-5" />
              Moderation Queue
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/settings"))}
              className="relative flex cursor-pointer select-none items-center rounded-xl px-3 py-3 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-50 font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
