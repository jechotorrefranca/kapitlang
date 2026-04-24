"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { LocationState, TERMINAL_COORDINATES, TerminalName, UI_TOWNS } from "@/lib/constants";
import { ArrowUpDown, Bus, Car, CloudRain, CloudSun, Lightbulb, Zap } from "lucide-react";
import { useRef, useState } from "react";

interface SimulationPanelProps {
  origin: LocationState;
  destination: LocationState;
  onOriginUpdate: (lat: number, lng: number) => void;
  onDestinationUpdate: (lat: number, lng: number) => void;
  onRunSimulation: (vehicle: string, time: string, weather: string) => void;
  onSwap: () => void;
  isSimulating: boolean;
}

export function SimulationPanel({
  origin,
  destination,
  onOriginUpdate,
  onDestinationUpdate,
  onRunSimulation,
  onSwap,
  isSimulating
}: SimulationPanelProps) {
  const [vehicle, setVehicle] = useState<"jeepney" | "uv">("jeepney");
  const [weather, setWeather] = useState<"clear" | "rain">("clear");
  const timeRef = useRef<HTMLInputElement>(null);
  const [isPeak, setIsPeak] = useState(true);

  const handleSelectionChange = (val: string, type: "origin" | "destination") => {
    if (val === "Dropped Pin") return;

    // Disallow identical hardcoded terminals natively by automatically swapping them
    if (type === "origin" && val === destination.name) {
      onSwap();
      return;
    }
    if (type === "destination" && val === origin.name) {
      onSwap();
      return;
    }

    const coords = TERMINAL_COORDINATES[val as Exclude<TerminalName, "Dropped Pin">];
    if (coords) {
      if (type === "origin") onOriginUpdate(coords.lat, coords.lng);
      else onDestinationUpdate(coords.lat, coords.lng);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    const hour = parseInt(time.split(":")[0]);
    setIsPeak(hour >= 6 && hour <= 9 || hour >= 17 && hour <= 20);
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
              {!UI_TOWNS.includes(origin.name) && (
                <NativeSelectOption value={origin.name}>
                  {origin.name === "Dropped Pin" ? "Custom Location (Drop a Pin)" : origin.name}
                </NativeSelectOption>
              )}
            </NativeSelect>
          </div>
          <div className="flex justify-center -my-1">
            <button
              type="button"
              onClick={onSwap}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-muted-foreground border bg-background hover:bg-muted hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-xs group"
              title="Swap origin and destination"
            >
              <ArrowUpDown className="size-3 transition-transform group-hover:rotate-180 duration-300" />
              Swap
            </button>
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
              {!UI_TOWNS.includes(destination.name) && (
                <NativeSelectOption value={destination.name}>
                  {destination.name === "Dropped Pin" ? "Custom Location (Drop a Pin)" : destination.name}
                </NativeSelectOption>
              )}
            </NativeSelect>
          </div>


          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block">
              Vehicle
            </p>
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-md border">
              <button
                onClick={() => setVehicle("jeepney")}
                className={`flex items-center justify-center gap-2 py-1.5 rounded transition-all text-xs font-semibold ${vehicle === "jeepney"
                  ? "bg-background shadow-xs text-emerald-600 border border-emerald-100 dark:border-emerald-900/30"
                  : "text-muted-foreground hover:bg-background/50"
                  }`}
              >
                <Bus className="size-3.5" />
                Jeep
              </button>
              <button
                onClick={() => setVehicle("uv")}
                className={`flex items-center justify-center gap-2 py-1.5 rounded transition-all text-xs font-semibold ${vehicle === "uv"
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
              {isPeak && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-[9px] font-bold border border-orange-200 dark:border-orange-900/50">
                  <div className="size-1 rounded-full bg-orange-500 animate-pulse" />
                  PEAK
                </span>
              )}
            </div>
            <Input
              id="departure-time"
              ref={timeRef}
              type="time"
              defaultValue="08:30"
              onChange={handleTimeChange}
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
              {weather === "rain" ? (
                <CloudRain className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              ) : (
                <CloudSun className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              )}
              <NativeSelect
                id="weather-select"
                value={weather}
                onChange={(e) => setWeather(e.target.value as "clear" | "rain")}
                className="pl-9 h-9 text-xs w-full"
              >
                <NativeSelectOption value="clear">Sunny</NativeSelectOption>
                <NativeSelectOption value="rain">Rainy</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
          <Button
            onClick={() => onRunSimulation(vehicle, timeRef.current?.value ?? "08:30", weather)}
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
