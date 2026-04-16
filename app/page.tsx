"use client";

import { FleetPerformance } from "@/components/dashboard/FleetPerformance";
import { ForecastResults } from "@/components/dashboard/ForecastResults";
import { MapDisplay } from "@/components/dashboard/MapDisplay";
import { SimulationPanel } from "@/components/dashboard/SimulationPanel";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-grow p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          <SimulationPanel />
          <MapDisplay />
          <section className="lg:col-span-4 space-y-6">
            <ForecastResults />
            <FleetPerformance />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
