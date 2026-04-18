import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { LocationDetailModal } from "@/features/locations/LocationDetailModal";
import { Providers } from "@/components/Providers";
import { CommandMenu } from "@/components/layout/CommandMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phan Thiet Travel Map",
  description: "The Digital Concierge for Phan Thiet Discovery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-slate-50 dark:bg-slate-950 antialiased h-dvh flex flex-col overflow-hidden transition-colors")}>
        <Providers>
          <Navbar />
          {children}
          <LocationDetailModal />
          <CommandMenu />
        </Providers>
      </body>
    </html>
  );
}
