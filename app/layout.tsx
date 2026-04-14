import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-headline",
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
    <html lang="en" className={cn("antialiased", inter.variable, manrope.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-on-surface font-body">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
