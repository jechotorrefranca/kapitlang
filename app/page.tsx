"use client";

import { FleetPerformance } from "@/components/dashboard/FleetPerformance";
import { ForecastResults } from "@/components/dashboard/ForecastResults";
import { MapDisplay } from "@/components/dashboard/MapDisplay";
import { SimulationPanel } from "@/components/dashboard/SimulationPanel";
import { DEFAULT_DESTINATION, DEFAULT_ORIGIN, getPresetName, LocationState } from "@/lib/constants";
import { useState } from "react";

export default function Home() {
  const [origin, setOrigin] = useState<LocationState>(DEFAULT_ORIGIN);
  const [destination, setDestination] = useState<LocationState>(DEFAULT_DESTINATION);

  const handleOriginUpdate = (lat: number, lng: number) => {
    setOrigin({
      name: getPresetName(lat, lng),
      coords: { lat, lng }
    });
  };

  const handleDestinationUpdate = (lat: number, lng: number) => {
    setDestination({
      name: getPresetName(lat, lng),
      coords: { lat, lng }
    });
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <SimulationPanel 
        origin={origin} 
        destination={destination} 
        onOriginUpdate={handleOriginUpdate} 
        onDestinationUpdate={handleDestinationUpdate} 
      />
      <MapDisplay 
        origin={origin} 
        destination={destination}
        onOriginUpdate={handleOriginUpdate}
        onDestinationUpdate={handleDestinationUpdate}
      />
      <section className="lg:col-span-4 space-y-6">
        <ForecastResults />
        <FleetPerformance />
      </section>
    </div>
  );
}
