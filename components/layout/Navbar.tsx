import { Bus, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500 uppercase">
            KAPIT LANG
          </span>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 transition-colors hover:text-foreground text-foreground underline decoration-emerald-500 decoration-2 underline-offset-8"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 transition-colors hover:text-foreground text-muted-foreground"
            >
              <Bus className="size-4" />
              Routes
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 transition-colors hover:text-foreground text-muted-foreground"
            >
              <Settings className="size-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
            Jocas (Staff)
          </span>
        </div>
      </div>
    </header>
  );
}
