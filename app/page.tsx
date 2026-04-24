import { ArrowRight, Bus, Clock, MapPin, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-950 rounded-3xl border border-white/5 px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container px-6 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Zap className="size-3 fill-emerald-400" />
                Next-Gen Transit Simulation
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                <Image
                  src="/kapitlang_logo.png"
                  alt="Kapit Lang Logo"
                  width={120}
                  height={120}
                  className="object-contain"
                  style={{ height: "auto" }}
                />
                <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white leading-none">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 uppercase">Kapit Lang</span>
                </h1>
              </div>
              <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                Experience the first stochastic simulation engine built specifically for MacArthur Highway.
                Predict travel times with models that account for "fill-and-go" dynamics, rush hour queues, and en-route delays.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 group"
                >
                  Enter Dashboard
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/routes"
                  className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-white/10 font-bold rounded-xl transition-all"
                >
                  Explore Routes
                </Link>
              </div>
            </div>
            <div className="flex-1 lg:flex-[1.2] relative animate-in fade-in zoom-in duration-1000 delay-500 min-h-[400px]">
              <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/10">
                <Image
                  src="/hero.jpg"
                  alt="Kapit Lang Simulation Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">Built for the Real-World Commute</h2>
          <p className="text-slate-400 text-lg">
            Standard navigation apps fail in Bulacan because they ignore the unique "terminal culture" of local PUVs. We don't.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container px-6 mx-auto max-w-7xl">
          {[
            {
              title: "Stochastic Engine",
              desc: "Instead of fixed travel times, we run 500+ Monte Carlo simulations to give you a probability distribution of your arrival.",
              icon: <Zap className="size-6" />,
              color: "bg-amber-500/20 text-amber-400 border-amber-500/40"
            },
            {
              title: "Terminal Fill-Rate",
              desc: "Our model calculates the exact wait time based on vehicle type (Jeepney vs. UV) and terminal 'fill-and-go' logic.",
              icon: <Bus className="size-6" />,
              color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
            },
            {
              title: "Sequence Anchors",
              desc: "Precise routing along the MacArthur Highway sequence prevents 'lost' route calculating common in standard GPS apps.",
              icon: <MapPin className="size-6" />,
              color: "bg-blue-500/20 text-blue-400 border-blue-500/40"
            }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-900 border border-white/10 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all group shadow-xl">
              <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 border-2 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-emerald-400 transition-colors tracking-tight">
                {f.title}
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm lg:text-base font-medium">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      { }
      <section className="pb-24">
        <div className="p-12 lg:p-20 rounded-[2.5rem] bg-emerald-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 pointer-events-none" />
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-white/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                Stop Guessing. <br />
                Start Simulating.
              </h2>
              <p className="text-emerald-900/80 font-medium text-lg max-w-xl">
                Whether it's the 7 AM rush at Monumento or a rainy afternoon in Malolos, Kapit Lang knows the odds.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link
                href="/dashboard"
                className="px-10 py-5 bg-slate-950 text-white font-black rounded-2xl hover:scale-105 transition-all text-center shadow-2xl shadow-slate-950/20"
              >
                Launch Simulator
              </Link>
              <div className="px-8 py-5 border-2 border-slate-950/20 text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2">
                <Clock className="size-5" />
                Live in Bulacan
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-12 border-t border-white/5 text-center space-y-4">
        <div className="text-slate-500 text-sm font-medium uppercase tracking-widest">
          Kapit Lang • Bulacan Transit Analytics
        </div>
        <div className="text-xs text-slate-600 max-w-2xl mx-auto px-6">
          A stochastic simulation project designed to empower commuters along the MacArthur Highway.
          Built with Convex, Next.js, and Python.
        </div>
      </footer>
    </div>
  );
}
