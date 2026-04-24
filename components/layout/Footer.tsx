"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const developers = [
    { name: "Jecho", image: "/jecho.png", bank: "MariBank" },
    { name: "Jocas", image: "/jocas.jpg", bank: "MariBank" },
    { name: "Eleazar", image: "/eleazar.png", bank: "MariBank" },
  ];

  return (
    <footer className="border-t py-5 bg-background">
      <div className="container px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/kapitlang_logo.png"
            alt="Kapit Lang Logo"
            width={24}
            height={24}
            className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all object-contain"
          />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
            Kapit Lang
          </span>
          <p className="text-[10px] font-bold text-muted-foreground/40 tracking-[0.2em] uppercase border-l pl-3 border-border">
            v1.0
          </p>
        </div>
        <div className="flex gap-8 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
          <Dialog>
            <DialogTrigger asChild>
              <button className="hover:text-emerald-600 transition-colors cursor-pointer outline-none">
                Support
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-7xl sm:h-[85vh] max-h-[900px] flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <Heart className="size-5 text-red-500 fill-red-500" />
                  Support the Developers
                </DialogTitle>
                <DialogDescription className="text-xs font-medium">
                  Kapit Lang is a passion project. Your support helps us keep the servers running and the simulations accurate.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
                  {developers.map((dev) => (
                    <div key={dev.name} className="flex flex-col items-center gap-4 group">
                      <div className="relative size-96 rounded-2xl overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-xl group-hover:scale-105 transition-transform duration-500">
                        <Image
                          src={dev.image}
                          alt={`${dev.name} QR Code`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-slate-100">
                          {dev.name}
                        </p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                          {dev.bank}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-dashed text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">
                  Kumakapit lang kami kaya magbigay na kayo 🚌💨
                </p>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <button className="hover:text-emerald-600 transition-colors cursor-pointer outline-none">
                About
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl p-15">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Image src="/kapitlang_logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                  <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                    KAPIT <span className="text-emerald-600">LANG</span>
                  </span>
                </DialogTitle>
                <DialogDescription className="text-sm font-medium leading-relaxed pt-4">
                  Addressing the daily travel unpredictability for Bulacan commuters.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-8 py-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600">Project Overview</h3>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                    Kapit Lang is a stochastic simulation application that provides realistic, probability-based commute estimates by modeling terminal dynamics and en-route delays along MacArthur Highway.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600">Tech Stack</h3>
                    <ul className="text-[10px] font-bold space-y-1.5 uppercase text-slate-500">
                      <li>• Next.js / React</li>
                      <li>• Convex (Database & Logic)</li>
                      <li>• Python (FastAPI Engine)</li>
                      <li>• React Three Fiber (3D)</li>
                      <li>• Tailwind CSS & Shadcn UI</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600">The Team</h3>
                    <ul className="text-[10px] font-bold space-y-1.5 uppercase text-slate-900 dark:text-slate-100">
                      <li>• Jecho P. Torrefranca</li>
                      <li>• Jocas Arabella S. Cruz</li>
                      <li>• Eleazar James S. Galope</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4 text-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Developed by the KapitLang Team
                </p>
              </div>
            </DialogContent>
          </Dialog>
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
