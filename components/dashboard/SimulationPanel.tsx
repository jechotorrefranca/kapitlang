"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { LocationState, TERMINAL_COORDINATES, TerminalName, UI_TOWNS } from "@/lib/constants";
import { Bus, Car, CloudSun, Lightbulb, Zap } from "lucide-react";
import { useState } from "react";

interface SimulationPanelProps {
  origin: LocationState;
  destination: LocationState;
  onOriginUpdate: (lat: number, lng: number) => void;
  onDestinationUpdate: (lat: number, lng: number) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
}

export function SimulationPanel({ 
  origin, 
  destination, 
  onOriginUpdate,
  onDestinationUpdate,
  onRunSimulation,
  isSimulating
}: SimulationPanelProps) {
  const [vehicle, setVehicle] = useState<"jeep" | "uv">("jeep");

  const handleSelectionChange = (val: string, type: "origin" | "destination") => {
    if (val === "Custom PIN") return;
    const coords = TERMINAL_COORDINATES[val as Exclude<TerminalName, "Custom PIN">];
    if (coords) {
      if (type === "origin") onOriginUpdate(coords.lat, coords.lng);
      else onDestinationUpdate(coords.lat, coords.lng);
    }
  };

  return (
    <section className="lg:col-span-3 space-y-6">
      <Card className="p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="size-5 text-emerald-600 fill-emerald-600/10" />
          <h2 className="text-sm font-bold tracking-tight uppercase">Simulation</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="origin-terminal"
              className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block"
            >
              Origin
            </label>
            <NativeSelect 
              id="origin-terminal" 
              value={origin.name}
              onChange={(e) => handleSelectionChange(e.target.value, "origin")}
              className="w-full"
            >
              {UI_TOWNS.map(town => (
                <NativeSelectOption key={town} value={town}>{town}</NativeSelectOption>
              ))}
              {origin.name === "Custom PIN" && (
                <NativeSelectOption value="Custom PIN">Custom Location (Map Pin)</NativeSelectOption>
              )}
            </NativeSelect>
          </div>
          <div>
            <label
              htmlFor="destination-terminal"
              className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block"
            >
              Destination
            </label>
            <NativeSelect 
              id="destination-terminal" 
              value={destination.name}
              onChange={(e) => handleSelectionChange(e.target.value, "destination")}
              className="w-full"
            >
               {UI_TOWNS.map(town => (
                <NativeSelectOption key={town} value={town}>{town}</NativeSelectOption>
              ))}
              {destination.name === "Custom PIN" && (
                <NativeSelectOption value="Custom PIN">Custom Location (Map Pin)</NativeSelectOption>
              )}
            </NativeSelect>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block">
              Vehicle
            </p>
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-md border">
              <button
                onClick={() => setVehicle("jeep")}
                className={`flex items-center justify-center gap-2 py-1.5 rounded transition-all text-xs font-semibold ${
                  vehicle === "jeep"
                    ? "bg-background shadow-xs text-emerald-600 border border-emerald-100 dark:border-emerald-900/30"
                    : "text-muted-foreground hover:bg-background/50"
                }`}
              >
                <Bus className="size-3.5" />
                Jeep
              </button>
              <button
                onClick={() => setVehicle("uv")}
                className={`flex items-center justify-center gap-2 py-1.5 rounded transition-all text-xs font-semibold ${
                  vehicle === "uv"
                    ? "bg-background shadow-xs text-emerald-600 border border-emerald-100 dark:border-emerald-900/30"
                    : "text-muted-foreground hover:bg-background/50"
                }`}
              >
                <Car className="size-3.5" />
                UV
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="departure-time"
                className="text-[10px] font-bold uppercase text-muted-foreground block"
              >
                Time
              </label>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-[9px] font-bold border border-orange-200 dark:border-orange-900/50">
                <div className="size-1 rounded-full bg-orange-500 animate-pulse" />
                PEAK
              </span>
            </div>
            <Input
              id="departure-time"
              type="time"
              defaultValue="08:30"
              className="h-9 text-xs w-full"
            />
          </div>
          <div>
            <label
              htmlFor="weather-select"
              className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block"
            >
              Weather
            </label>
            <div className="relative w-full">
              <CloudSun className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <NativeSelect
                id="weather-select"
                defaultValue="Sunny"
                className="pl-9 h-9 text-xs w-full"
              >
                <NativeSelectOption value="Sunny">Sunny</NativeSelectOption>
                <NativeSelectOption value="Rainy">Rainy</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
          <Button 
            onClick={onRunSimulation}
            disabled={isSimulating}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 tracking-wide mt-2"
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                RUNNING...
              </span>
            ) : (
              "RUN SIMULATION"
            )}
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
  );
}
