"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Activity,
  Bus,
  Car,
  CloudSun,
  Flag,
  Info,
  LayoutDashboard,
  Lightbulb,
  Locate,
  MapPin,
  Minus,
  Plus,
  Settings,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500 uppercase">KAPIT LANG</span>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="#" className="flex items-center gap-2 transition-colors hover:text-foreground text-foreground underline decoration-emerald-500 decoration-2 underline-offset-8">
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
              <Link href="#" className="flex items-center gap-2 transition-colors hover:text-foreground text-muted-foreground">
                <Bus className="size-4" />
                Routes
              </Link>
              <Link href="#" className="flex items-center gap-2 transition-colors hover:text-foreground text-muted-foreground">
                <Settings className="size-4" />
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">Jocas (Staff)</span>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-3 space-y-6">
            <Card className="p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="size-5 text-emerald-600 fill-emerald-600/10" />
                <h2 className="text-sm font-bold tracking-tight uppercase">Simulation</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="origin-terminal" className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block">Origin</label>
                  <NativeSelect id="origin-terminal" defaultValue="Bocaue">
                    <NativeSelectOption value="Bocaue">Bocaue Central</NativeSelectOption>
                    <NativeSelectOption value="Marilao">Marilao North</NativeSelectOption>
                  </NativeSelect>
                </div>
                <div>
                  <label htmlFor="destination-terminal" className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block">Destination</label>
                  <NativeSelect id="destination-terminal" defaultValue="Meycauayan">
                    <NativeSelectOption value="Meycauayan">Meycauayan NLT</NativeSelectOption>
                    <NativeSelectOption value="Manila">Manila Gateway</NativeSelectOption>
                  </NativeSelect>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block">Vehicle</p>
                  <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-md border">
                    <button className="flex items-center justify-center gap-2 py-1.5 rounded bg-background shadow-xs text-xs font-semibold text-emerald-600 border border-emerald-100 dark:border-emerald-900/30">
                      <Bus className="size-3.5" />
                      Jeep
                    </button>
                    <button className="flex items-center justify-center gap-2 py-1.5 rounded text-xs font-medium text-muted-foreground hover:bg-background/50">
                      <Car className="size-3.5" />
                      UV
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="departure-time" className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block">Time</label>
                    <Input id="departure-time" type="time" defaultValue="08:30" className="h-9 text-xs" />
                  </div>
                  <div className="flex items-end pb-1.5">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-[9px] font-bold border border-orange-200 dark:border-orange-900/50">
                      <div className="size-1 rounded-full bg-orange-500 animate-pulse" />
                      PEAK
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="weather-select" className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block">Weather</label>
                  <div className="relative">
                    <CloudSun className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <NativeSelect id="weather-select" defaultValue="Sunny" className="pl-9 h-9 text-xs">
                      <NativeSelectOption value="Sunny">Sunny</NativeSelectOption>
                      <NativeSelectOption value="Rainy">Rainy</NativeSelectOption>
                    </NativeSelect>
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 tracking-wide mt-2">
                  RUN SIMULATION
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30">
              <div className="flex gap-3">
                <Lightbulb className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-[11px] text-emerald-800 dark:text-emerald-400 leading-relaxed font-medium">
                  Peak hour traffic increases variability by 24% for MacArthur Highway routes.
                </p>
              </div>
            </Card>
          </section>

          <section className="lg:col-span-5 relative h-[600px] lg:h-auto">
            <Card className="h-full w-full overflow-hidden border shadow-sm relative bg-zinc-100 dark:bg-zinc-900">
              <Image 
                src="/mas logo.png" 
                alt="Transit Map" 
                className="w-full h-full object-cover opacity-20 grayscale pointer-events-none"
                fill
              />
              <div className="absolute inset-0 pointer-events-none">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path 
                    d="M20,30 Q40,40 60,70" 
                    fill="none" 
                    stroke="currentColor" 
                    className="text-emerald-500" 
                    strokeWidth="0.5" 
                    strokeDasharray="1,1" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-[30%] left-[20%] flex flex-col items-center">
                  <div className="bg-emerald-600 p-1.5 rounded-full border-2 border-background shadow animate-bounce">
                    <MapPin className="size-3 text-white" />
                  </div>
                  <span className="mt-1 bg-background px-1.5 py-0.5 rounded text-[8px] font-bold border shadow-xs">BOCAUE</span>
                </div>
                <div className="absolute top-[70%] left-[60%] flex flex-col items-center">
                  <div className="bg-zinc-800 p-1.5 rounded-full border-2 border-background shadow">
                    <Flag className="size-3 text-white" />
                  </div>
                  <span className="mt-1 bg-background px-1.5 py-0.5 rounded text-[8px] font-bold border shadow-xs">MEYCAUAYAN</span>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 pointer-events-auto">
                <Button size="icon" variant="outline" className="size-8 bg-background shadow-xs hover:bg-muted">
                  <Plus className="size-4" />
                </Button>
                <Button size="icon" variant="outline" className="size-8 bg-background shadow-xs hover:bg-muted">
                  <Minus className="size-4" />
                </Button>
                <Button size="icon" variant="outline" className="size-8 bg-background shadow-xs hover:bg-muted mt-2">
                  <Locate className="size-4" />
                </Button>
              </div>

              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur border px-2.5 py-1.5 rounded-md shadow-xs flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[7px] font-bold text-muted-foreground uppercase leading-none mb-1">Status</span>
                  <span className="text-[10px] font-bold text-emerald-600">ALL CLEAR</span>
                </div>
                <Activity className="size-3 text-emerald-500" />
              </div>
            </Card>
          </section>

          <section className="lg:col-span-4 space-y-6">
            <Card className="p-5 shadow-sm">
              <h2 className="text-sm font-bold tracking-tight uppercase mb-6 flex items-center justify-between">
                Forecast Results
                <Info className="size-4 text-muted-foreground font-normal" />
              </h2>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">Expected Time</p>
                    <p className="text-xl font-bold">42<span className="text-sm font-medium ml-1 text-muted-foreground">mins</span></p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="space-y-0.5 text-right font-medium">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase">Confidence</p>
                    <p className="text-sm">High (92%)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Wait Time Intervals</p>
                  <div className="flex items-center gap-1.5 text-[8px] font-bold">
                    <div className="size-1.5 rounded-full bg-emerald-500" /> MONTE CARLO
                  </div>
                </div>
                
                <div className="relative h-32 w-full bg-muted/20 border rounded overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path 
                      d="M0,100 Q20,100 40,80 T60,20 T80,80 T100,100" 
                      fill="currentColor" 
                      className="text-emerald-500/10"
                    />
                    <path 
                      d="M0,100 Q20,100 40,80 T60,20 T80,80 T100,100" 
                      fill="none" 
                      stroke="currentColor" 
                      className="text-emerald-600" 
                      strokeWidth="1"
                    />
                    <line x1="55" y1="20" x2="55" y2="100" stroke="currentColor" className="text-emerald-600/30" strokeDasharray="1,1" />
                  </svg>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 border text-[8px] font-bold px-1.5 rounded text-emerald-600">42m</div>
                </div>
                
                <div className="flex justify-between text-[8px] font-black text-muted-foreground/60 uppercase">
                  <span>20m</span>
                  <span>40m</span>
                  <span>60m</span>
                  <span>80+</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase text-muted-foreground mb-4 tracking-widest">Fleet Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between group cursor-help">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded border bg-muted flex items-center justify-center group-hover:border-emerald-200 transition-colors">
                      <Bus className="size-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold mb-0.5 leading-none">Jeepney (Express)</p>
                      <p className="text-[9px] text-muted-foreground">12 units in transit</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 tracking-tight flex items-center gap-1">
                    <div className="size-1 rounded-full bg-emerald-500" />
                    ON TIME
                  </span>
                </div>
                <div className="flex items-center justify-between group cursor-help">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded border bg-muted flex items-center justify-center group-hover:border-orange-200 transition-colors">
                      <Car className="size-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold mb-0.5 leading-none">UV Express</p>
                      <p className="text-[9px] text-muted-foreground">4 units in terminal</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-orange-500 tracking-tight flex items-center gap-1 text-nowrap">
                    <div className="size-1 rounded-full bg-orange-500" />
                    HIGH DEMAND
                  </span>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>

      <footer className="border-t py-8 bg-background">
        <div className="container px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.2em] uppercase">
            Powered by Convex | Simulation Engine v1.2
          </p>
          <div className="flex gap-8 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
            <Link href="#" className="hover:text-emerald-600 transition-colors">Support</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Status</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors border-l pl-8 border-border">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
