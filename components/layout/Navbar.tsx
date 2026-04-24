"use client";

import { Beaker, Bus, LayoutDashboard, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  
  // Local state to track experimental status for immediate UI updates
  const [isExp, setIsExp] = useState(false);

  // Function to sync with localStorage
  const syncExp = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("experimental_enabled") === "true";
      setIsExp(stored);
    }
  };

  useEffect(() => {
    syncExp(); // Initial check
    
    // Listen for custom event from settings page
    window.addEventListener("experimental-changed", syncExp);
    // Listen for storage events (if changed in another tab)
    window.addEventListener("storage", syncExp);
    
    return () => {
      window.removeEventListener("experimental-changed", syncExp);
      window.removeEventListener("storage", syncExp);
    };
  }, []);

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-2 transition-colors hover:text-foreground font-black uppercase text-[10px] tracking-widest ${isActive
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-muted-foreground"
      }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <Image
              src="/kapitlang_logo.png"
              alt="Kapit Lang Logo"
              width={32}
              height={32}
              className="object-contain transition-transform group-hover:scale-110"
              style={{ height: "auto" }}
            />
            <span className="text-sm sm:text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase whitespace-nowrap">
              KAPIT <span className="text-emerald-600">LANG</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 md:gap-8 text-sm font-medium">
            <Link href="/dashboard" className={getLinkClassName("/dashboard")}>
              <LayoutDashboard className="size-5 md:size-4" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
            <Link href="/routes" className={getLinkClassName("/routes")}>
              <Bus className="size-5 md:size-4" />
              <span className="hidden md:inline">Routes</span>
            </Link>
            {isExp && (
              <Link href="/experimental" className={getLinkClassName("/experimental")}>
                <Beaker className="size-5 md:size-4 text-purple-600" />
                <span className="hidden md:inline text-purple-600">Experimental</span>
              </Link>
            )}
            <Link href="/settings" className={getLinkClassName("/settings")}>
              <Settings className="size-5 md:size-4" />
              <span className="hidden md:inline">Settings</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
