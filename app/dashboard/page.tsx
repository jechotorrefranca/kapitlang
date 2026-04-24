"use client";
import { FleetPerformance } from "@/components/dashboard/FleetPerformance";
import { ForecastResults } from "@/components/dashboard/ForecastResults";
import { MapDisplay } from "@/components/dashboard/MapDisplay";
import { SimulationPanel } from "@/components/dashboard/SimulationPanel";
import { SimulationLoader } from "@/components/3D/SimulationLoader";
import { DEFAULT_DESTINATION, DEFAULT_ORIGIN, getPresetName, LocationState } from "@/lib/constants";
import { SimulationResult } from "@/lib/types";
import { useState } from "react";
export default function DashboardPage() {
  const [origin, setOrigin] = useState<LocationState>(DEFAULT_ORIGIN);
  const [destination, setDestination] = useState<LocationState>(DEFAULT_DESTINATION);
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "simulating" | "completed">("idle");
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const fetchGeocodedName = async (lat: number, lng: number, setter: typeof setOrigin) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.address) {
        const road = data.address.road || data.address.neighbourhood || "";
        const city = data.address.town || data.address.city || data.address.village || "";
        const shortName = [road, city].filter(Boolean).join(", ");
        if (shortName) {
          setter(prev => prev.name === "Dropped Pin" ? { ...prev, name: `${shortName}` as unknown as typeof prev.name } : prev);
        }
      }
    } catch {
    }
  };
  const handleOriginUpdate = (lat: number, lng: number) => {
    const presetName = getPresetName(lat, lng);
    setOrigin({ name: presetName, coords: { lat, lng } });
    if (presetName === "Dropped Pin") fetchGeocodedName(lat, lng, setOrigin);
    if (simulationStatus === "completed") setSimulationStatus("idle");
  };
  const handleDestinationUpdate = (lat: number, lng: number) => {
    const presetName = getPresetName(lat, lng);
    setDestination({ name: presetName, coords: { lat, lng } });
    if (presetName === "Dropped Pin") fetchGeocodedName(lat, lng, setDestination);
    if (simulationStatus === "completed") setSimulationStatus("idle");
  };
  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
    if (simulationStatus === "completed") setSimulationStatus("idle");
  };
  const handleRunSimulation = async (vehicle: string, time: string, weather: string) => {
    setSimulationStatus("simulating");
    setSimulationResult(null);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle,
          weather,
          time,
          origin: origin.name,
          destination: destination.name,
          originLat: origin.coords.lat,
          originLng: origin.coords.lng,
          destLat: destination.coords.lat,
          destLng: destination.coords.lng,
        }),
      });
      if (!res.ok) throw new Error("Simulation failed");
      const data: SimulationResult = await res.json();
      setSimulationResult(data);
      setSimulationStatus("completed");
    } catch (err) {
      console.error(err);
      setSimulationStatus("idle");
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <SimulationPanel 
        origin={origin} 
        destination={destination} 
        onOriginUpdate={handleOriginUpdate} 
        onDestinationUpdate={handleDestinationUpdate}
        onSwap={handleSwap}
        onRunSimulation={handleRunSimulation}
        isSimulating={simulationStatus === "simulating"}
      />
      <MapDisplay 
        origin={origin} 
        destination={destination}
        onOriginUpdate={handleOriginUpdate}
        onDestinationUpdate={handleDestinationUpdate}
      />
      <section className="lg:col-span-4 space-y-6">
        <ForecastResults status={simulationStatus} result={simulationResult} />
        <FleetPerformance />
      </section>
      
      {/* Preload 3D Assets and Canvas */}
      <div className="fixed opacity-0 pointer-events-none -z-50 size-0 overflow-hidden">
        <SimulationLoader />
      </div>
    </div>
  );
}
