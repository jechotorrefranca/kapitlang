import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t py-8 bg-background">
      <div className="container px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Image 
            src="/kapitlang_logo.png" 
            alt="Kapit Lang Logo" 
            width={80} 
            height={24} 
            className="opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all object-contain"
          />
          <p className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.2em] uppercase border-l pl-4 border-border">
            Powered by Convex | Simulation Engine v1.2
          </p>
        </div>
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
