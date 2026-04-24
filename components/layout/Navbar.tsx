"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Beaker, Bus, LayoutDashboard, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const experimentalSetting = useQuery(api.routes.getSystemSetting, { key: "experimental_enabled" });
  const experimentalEnabled = experimentalSetting?.value === true;

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
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/kapitlang_logo.png"
              alt="Kapit Lang Logo"
              width={32}
              height={32}
              className="object-contain transition-transform group-hover:scale-110"
              style={{ height: "auto" }}
            />
            <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              KAPIT <span className="text-emerald-600">LANG</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/dashboard" className={getLinkClassName("/dashboard")}>
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <Link href="/routes" className={getLinkClassName("/routes")}>
              <Bus className="size-4" />
              Routes
            </Link>
            {experimentalEnabled && (
              <Link href="/experimental" className={getLinkClassName("/experimental")}>
                <Beaker className="size-4 text-purple-600" />
                <span className="text-purple-600">Experimental</span>
              </Link>
            )}
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
