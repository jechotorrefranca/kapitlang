"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* TopNavBar */}
      <header className="bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-none">
          <div className="flex items-center gap-6">
            <span className="text-2xl font-black tracking-tighter text-emerald-900 dark:text-emerald-50 font-headline">KAPIT LANG</span>
            <span className="text-slate-500 font-medium border-l border-slate-200 dark:border-slate-700 pl-6 py-1 text-sm">Welcome, Jocas!</span>
          </div>
          <nav className="flex items-center gap-8">
            <Link className="text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-600 dark:border-emerald-400 pb-1 flex items-center gap-2" href="#">
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span className="font-label text-[10px] uppercase tracking-wider">Dashboard</span>
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors flex items-center gap-2" href="#">
              <span className="material-symbols-outlined text-sm">directions_bus</span>
              <span className="font-label text-[10px] uppercase tracking-wider">Routes</span>
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors flex items-center gap-2" href="#">
              <span className="material-symbols-outlined text-sm">settings</span>
              <span className="font-label text-[10px] uppercase tracking-wider">Settings</span>
            </Link>
          </nav>
        </div>
        <div className="bg-slate-200/50 dark:bg-slate-800/50 h-[1px] w-full"></div>
      </header>

      <main className="flex-grow p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-[1600px] mx-auto w-full">
        {/* Left Column: Input Form */}
        <section className="lg:col-span-3 space-y-6">
          <Card className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_40px_rgba(25,28,29,0.04)] border border-outline-variant/10 ring-0">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <h2 className="font-headline text-lg font-extrabold tracking-tight uppercase text-on-surface">SIMULATE YOUR COMMUTE</h2>
            </div>
            <div className="space-y-5">
              {/* Origin */}
              <div>
                <label htmlFor="origin-terminal" className="block font-label text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Origin Terminal</label>
                <div className="relative">
                  <NativeSelect id="origin-terminal" defaultValue="Bocaue Central Terminal" className="w-full bg-surface-container-high border-none rounded-xl py-0 px-0 h-auto focus:ring-2 focus:ring-primary appearance-none">
                    <NativeSelectOption>Select Terminal</NativeSelectOption>
                    <NativeSelectOption value="Bocaue Central Terminal">Bocaue Central Terminal</NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>
              {/* Destination */}
              <div>
                <label htmlFor="destination-terminal" className="block font-label text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Destination Terminal</label>
                <div className="relative">
                  <NativeSelect id="destination-terminal" defaultValue="Meycauayan NLT Terminal" className="w-full bg-surface-container-high border-none rounded-xl py-0 px-0 h-auto focus:ring-2 focus:ring-primary appearance-none">
                    <NativeSelectOption>Select Terminal</NativeSelectOption>
                    <NativeSelectOption value="Meycauayan NLT Terminal">Meycauayan NLT Terminal</NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>
              {/* Vehicle Type */}
              <div>
                <p className="block font-label text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Vehicle Type</p>
                <div className="flex bg-surface-container-high p-1 rounded-xl">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-container-lowest shadow-sm text-primary font-semibold text-sm">
                    <span className="material-symbols-outlined text-lg">directions_bus</span>
                    Jeepney
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-slate-500 font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-lg">airport_shuttle</span>
                    UV Express
                  </button>
                </div>
              </div>
              {/* Departure Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="departure-time" className="block font-label text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-nowrap">Departure Time</label>
                  <Input 
                    id="departure-time"
                    type="time" 
                    defaultValue="08:30" 
                    className="w-full bg-surface-container-high border-none rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-primary h-10 ring-0"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-900/50">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-tight">Peak Hour</span>
                  </div>
                </div>
              </div>
              {/* Weather */}
              <div>
                <label htmlFor="weather-select" className="block font-label text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Weather</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 z-10" style={{ fontVariationSettings: "'FILL' 1" }}>sunny</span>
                  <NativeSelect id="weather-select" defaultValue="Sunny" className="w-full bg-surface-container-high border-none rounded-xl py-0 pl-10 h-auto focus:ring-2 focus:ring-primary appearance-none ring-0">
                    <NativeSelectOption value="Sunny">Sunny</NativeSelectOption>
                    <NativeSelectOption value="Rainy">Rainy</NativeSelectOption>
                    <NativeSelectOption value="Overcast">Overcast</NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold py-6 rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all border-none">
                <span className="material-symbols-outlined mr-2">model_training</span>
                SIMULATE COMMUTE
              </Button>
            </div>
          </Card>

          {/* Contextual Tip Card */}
          <div className="bg-secondary-fixed p-5 rounded-xl border border-secondary/10 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-on-secondary-fixed text-xs font-medium mb-1 uppercase tracking-wider">PRO TIP</p>
              <p className="text-on-secondary-fixed-variant text-[11px] leading-relaxed">Simulating UV Express routes during peak hours typically shows 15% reduction in variability compared to Jeepneys.</p>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-secondary/10" style={{ fontSize: '72px' }}>lightbulb</span>
          </div>
        </section>

        {/* Center Column: Map Area */}
        <section className="lg:col-span-5 h-[680px] relative">
          <div className="w-full h-full bg-surface-container rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 relative">
            {/* Map Background */}
            <Image 
              src="/mas logo.png" 
              alt="Map showing transit routes in Bulacan" 
              className="w-full h-full object-cover opacity-60 grayscale-[0.5]"
              fill
              priority
            />
            {/* Map UI Elements Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Route Path (Simplified SVG Line) */}
              <svg className="absolute inset-0 w-full h-full" fill="none" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
                <path className="drop-shadow-sm opacity-80" d="M100 150 C 150 200, 120 350, 250 450" stroke="#0058be" strokeDasharray="8 6" strokeLinecap="round" strokeWidth="4"></path>
              </svg>
              {/* Marker A (Bocaue) */}
              <div className="absolute top-[140px] left-[90px] flex flex-col items-center">
                <div className="bg-primary p-1 rounded-full border-2 border-white shadow-lg animate-pulse">
                  <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <span className="mt-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-primary shadow-sm">Bocaue</span>
              </div>
              {/* Marker B (Meycauayan) */}
              <div className="absolute top-[440px] left-[240px] flex flex-col items-center">
                <div className="bg-secondary p-1 rounded-full border-2 border-white shadow-lg">
                  <span className="material-symbols-outlined text-white text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
                </div>
                <span className="mt-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-secondary shadow-sm">Meycauayan</span>
              </div>
              {/* Highway Labels */}
              <div className="absolute top-[300px] left-[160px] -rotate-[35deg]">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">MacArthur Highway</span>
              </div>
              <div className="absolute top-[380px] left-[140px]">
                <span className="bg-surface-container-lowest/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-medium text-slate-500 shadow-sm">Marilao Crossing</span>
              </div>
            </div>
            {/* Floating Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 pointer-events-auto">
              <Button size="icon" variant="outline" className="bg-white hover:bg-slate-50 border-none shadow-md text-slate-600 hover:text-primary transition-colors size-10 rounded-lg">
                <span className="material-symbols-outlined">add</span>
              </Button>
              <Button size="icon" variant="outline" className="bg-white hover:bg-slate-50 border-none shadow-md text-slate-600 hover:text-primary transition-colors size-10 rounded-lg">
                <span className="material-symbols-outlined">remove</span>
              </Button>
              <Button size="icon" variant="outline" className="bg-white hover:bg-slate-50 border-none shadow-md text-slate-600 hover:text-primary transition-colors mt-2 size-10 rounded-lg">
                <span className="material-symbols-outlined">my_location</span>
              </Button>
            </div>
            {/* Weather Widget Overlay */}
            <div className="absolute top-6 right-6 pointer-events-auto">
              <div className="glass-panel p-4 rounded-xl border border-white/40 shadow-xl flex items-center gap-4">
                <div className="flex flex-col text-left">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none">Real-time Weather</span>
                  <span className="font-headline font-bold text-on-surface text-sm mt-1">32°C Sunny</span>
                </div>
                <span className="material-symbols-outlined text-orange-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>sunny</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Analytics/Forecast */}
        <section className="lg:col-span-4 space-y-6">
          <Card className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_40px_rgba(25,28,29,0.04)] border border-outline-variant/10 ring-0">
            <div className="mb-6">
              <h2 className="font-headline text-lg font-extrabold tracking-tight uppercase text-on-surface mb-4">COMMUTE FORECAST</h2>
              <div className="bg-secondary/5 border border-secondary/10 p-3 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-sm">info</span>
                <p className="text-[10px] font-medium text-secondary-container leading-tight uppercase tracking-wide">
                  Route: Bocaue Central -&gt; Meycauayan NLT | Vehicle: Jeepney | Dep: 08:30 AM (Peak) | Weather: Sunny
                </p>
              </div>
            </div>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex flex-col items-center text-center">
                <span className="font-label text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">MOST LIKELY</span>
                <span className="font-headline text-2xl font-black text-blue-700 dark:text-blue-400">42 MIN</span>
              </div>
              <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center text-center">
                <span className="font-label text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-1">BEST CASE</span>
                <span className="font-headline text-2xl font-black text-emerald-700 dark:text-emerald-400">28 MIN</span>
              </div>
              <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 flex flex-col items-center text-center">
                <span className="font-label text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-1">WORST CASE</span>
                <span className="font-headline text-2xl font-black text-purple-700 dark:text-purple-400">75 MIN</span>
              </div>
            </div>
            {/* Chart Area */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Duration Probability</h3>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> SIMULATION
                  </span>
                </div>
              </div>
              <div className="relative h-48 w-full mt-4 flex items-end justify-between px-2 overflow-hidden">
                {/* Simulated Bell Curve */}
                <div className="absolute inset-0 flex items-end">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
                    <path className="opacity-30" d="M0 150 Q100 150 150 140 T200 40 T250 140 T400 150" fill="url(#blue-grad)"></path>
                    <path d="M0 150 Q100 150 150 140 T200 40 T250 140 T400 150" fill="none" stroke="#2170e4" strokeWidth="2"></path>
                    <defs>
                      <linearGradient id="blue-grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#2170e4"></stop>
                        <stop offset="100%" stopColor="transparent"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                {/* Marker line for Peak */}
                <div className="absolute left-1/2 bottom-0 h-40 w-[2px] bg-secondary-container/40 border-l border-dashed border-secondary-container">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-secondary-container text-white text-[9px] px-2 py-0.5 rounded-full font-bold">50 MINS</div>
                </div>
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="w-full h-[1px] bg-slate-300"></div>
                  <div className="w-full h-[1px] bg-slate-300"></div>
                  <div className="w-full h-[1px] bg-slate-300"></div>
                </div>
              </div>
              {/* X Axis Labels */}
              <div className="flex justify-between mt-4 px-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase">20m</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">40m</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">60m</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">80m</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">100m</span>
              </div>
            </div>
          </Card>

          {/* Vehicle Stats Card */}
          <Card className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 ring-0">
            <h3 className="font-headline text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-4">Real-time Fleet Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-500">electric_rickshaw</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold">Bocaue - Marilao Line</p>
                    <p className="text-[10px] text-slate-400">12 Units Active</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">Normal Flow</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-500">laptop_car</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold">Meycauayan Express</p>
                    <p className="text-[10px] text-slate-400">4 Units Active</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-500">High Demand</span>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 w-full py-12 mt-auto flex flex-col items-center justify-center text-center px-4">
        <p className="font-body text-[10px] uppercase tracking-[0.1em] font-medium text-slate-400 dark:text-slate-600">
          Powered by Convex (Real-time DB) | Python Simulation (Monte Carlo) | TANTSA v1.2
        </p>
        <div className="mt-4 flex gap-6">
          <Link className="text-slate-400 hover:text-emerald-600 transition-colors opacity-80 hover:opacity-100 text-[10px] uppercase font-bold" href="#">System Status</Link>
          <Link className="text-slate-400 hover:text-emerald-600 transition-colors opacity-80 hover:opacity-100 text-[10px] uppercase font-bold" href="#">Documentation</Link>
          <Link className="text-slate-400 hover:text-emerald-600 transition-colors opacity-80 hover:opacity-100 text-[10px] uppercase font-bold" href="#">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
