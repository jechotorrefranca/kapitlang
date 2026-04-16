import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-8 bg-background">
      <div className="container px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.2em] uppercase">
          Powered by Convex | Simulation Engine v1.2
        </p>
        <div className="flex gap-8 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
          <Link href="#" className="hover:text-emerald-600 transition-colors">
            Support
          </Link>
          <Link href="#" className="hover:text-emerald-600 transition-colors">
            Status
          </Link>
          <Link
            href="#"
            className="hover:text-emerald-600 transition-colors border-l pl-8 border-border"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
