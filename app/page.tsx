"use client";

import { FleetPerformance } from "@/components/dashboard/FleetPerformance";
import { ForecastResults } from "@/components/dashboard/ForecastResults";
import { MapDisplay } from "@/components/dashboard/MapDisplay";
import { SimulationPanel } from "@/components/dashboard/SimulationPanel";
import { DEFAULT_DESTINATION, DEFAULT_ORIGIN, TerminalName } from "@/lib/constants";
import { useState } from "react";

export default function Home() {
  const [origin, setOrigin] = useState<TerminalName>(DEFAULT_ORIGIN);
  const [destination, setDestination] = useState<TerminalName>(DEFAULT_DESTINATION);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <SimulationPanel 
        origin={origin} 
        destination={destination} 
        onOriginChange={setOrigin} 
        onDestinationChange={setDestination} 
      />
      <MapDisplay origin={origin} destination={destination} />
      <section className="lg:col-span-4 space-y-6">
        <ForecastResults />
        <FleetPerformance />
      </section>
    </div>
  );
}
