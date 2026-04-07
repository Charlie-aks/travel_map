import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { LocationDetailModal } from "@/features/locations/LocationDetailModal";
import { ThemeProvider } from "@/components/ThemeProvider";

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
      <body className={cn(inter.className, "bg-slate-50 dark:bg-slate-950 antialiased h-screen flex flex-col overflow-hidden transition-colors")}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}
          disableTransitionOnChange
          suppressHydrationWarning
        >
          <Navbar />
          {children}
          <LocationDetailModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
