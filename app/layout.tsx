import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KAPIT LANG | Transit Simulation Dashboard",
  description: "Transit Simulation Dashboard for Kapit Lang",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("antialiased", inter.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans">
        <ConvexClientProvider>
          <div className="flex flex-col min-h-screen bg-muted/40 dark:bg-zinc-950">
            <Navbar />
            <main className="flex-grow p-6 lg:p-8">
              {children}
            </main>
            <Footer />
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
