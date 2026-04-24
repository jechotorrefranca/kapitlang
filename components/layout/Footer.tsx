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
        <div className="flex items-center gap-4">
          <Image
            src="/kapitlang_logo.png"
            alt="Kapit Lang Logo"
            width={60}
            height={18}
            className="opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all object-contain"
            style={{ height: "auto" }}
          />
          <p className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.2em] uppercase border-l pl-4 border-border">
            Powered by Convex | Kapit Lang v1.0
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
                  Every donation, no matter how small, makes a huge difference. <br />
                  Kumakapit lang kami kaya magbigay na kayo 🚌💨
                </p>
              </div>
            </DialogContent>
          </Dialog>
          <Link href="#" className="hover:text-emerald-600 transition-colors">
            Members
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
