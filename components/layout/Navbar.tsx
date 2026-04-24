"use client";

import { Bus, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-2 transition-colors hover:text-foreground ${
      isActive
        ? "text-foreground underline decoration-emerald-500 decoration-2 underline-offset-8"
        : "text-muted-foreground"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/kapitlang_logo.png" 
              alt="Kapit Lang Logo" 
              width={32} 
              height={32} 
              className="object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500 uppercase">
              KAPIT LANG
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className={getLinkClassName("/dashboard")}>
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <Link href="/routes" className={getLinkClassName("/routes")}>
              <Bus className="size-4" />
              Routes
            </Link>
            <Link href="/settings" className={getLinkClassName("/settings")}>
              <Settings className="size-4" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
