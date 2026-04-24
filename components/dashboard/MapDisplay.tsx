"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LocationState } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Activity, Flag, MapPin, Minus, Navigation, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
const DynamicInteractiveMap = dynamic(
  () => import("./InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Loading Satellite Map...</span>
      </div>
    )
  }
);
interface MapDisplayProps {
  origin: LocationState;
  destination: LocationState;
  onOriginUpdate: (lat: number, lng: number) => void;
  onDestinationUpdate: (lat: number, lng: number) => void;
}
export function MapDisplay({ origin, destination, onOriginUpdate, onDestinationUpdate }: MapDisplayProps) {
  const [pinMode, setPinMode] = useState<"origin" | "destination" | null>(null);
  const [shouldLocate, setShouldLocate] = useState(false);
  const zoomInRef = useRef<() => void>(null);
  const zoomOutRef = useRef<() => void>(null);
  const handleZoomReady = useCallback((zoomIn: () => void, zoomOut: () => void) => {
    zoomInRef.current = zoomIn;
    zoomOutRef.current = zoomOut;
  }, []);
  const togglePinMode = (mode: "origin" | "destination") => {
    setPinMode(prev => prev === mode ? null : mode);
  };
  const handleLocateMe = () => {
    setShouldLocate(true);
    setTimeout(() => setShouldLocate(false), 1000);
  };
  return (
    <section className="lg:col-span-5 relative h-[600px] lg:h-auto">
      <Card className="h-full w-full overflow-hidden border shadow-sm relative bg-zinc-100 dark:bg-zinc-900">
        <DynamicInteractiveMap
          origin={origin}
          destination={destination}
          onOriginUpdate={onOriginUpdate}
          onDestinationUpdate={onDestinationUpdate}
          pinMode={pinMode}
          onPinComplete={() => setPinMode(null)}
          shouldLocate={shouldLocate}
          onLocateComplete={(lat, lng) => {
            console.log("User located at:", lat, lng);
          }}
          onZoomReady={handleZoomReady}
        />
        { }
        <div className="absolute top-4 right-4 z-1000 flex flex-col gap-2">
          <Button
            size="sm"
            variant={pinMode === "origin" ? "default" : "secondary"}
            className={cn("gap-2 shadow-md h-9 px-3", pinMode === "origin" && "bg-emerald-600 hover:bg-emerald-700")}
            onClick={() => togglePinMode("origin")}
          >
            <MapPin className="size-3.5" />
            <span className="text-[10px] font-bold uppercase">Set Origin</span>
          </Button>
          <Button
            size="sm"
            variant={pinMode === "destination" ? "default" : "secondary"}
            className={cn("gap-2 shadow-md h-9 px-3", pinMode === "destination" && "bg-zinc-800 hover:bg-zinc-900")}
            onClick={() => togglePinMode("destination")}
          >
            <Flag className="size-3.5" />
            <span className="text-[10px] font-bold uppercase">Set Dest</span>
          </Button>
        </div>
        { }
        <div className="absolute bottom-8 left-4 z-1000 flex flex-col gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="size-9 shadow-md"
            onClick={handleLocateMe}
            aria-label="Locate me"
          >
            <Navigation className="size-4" />
          </Button>
          <div className="flex flex-col rounded-md overflow-hidden border shadow-md">
            <Button
              size="icon"
              variant="secondary"
              className="size-9 rounded-none rounded-t-md border-b"
              onClick={() => zoomInRef.current?.()}
              aria-label="Zoom in"
            >
              <Plus className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="size-9 rounded-none rounded-b-md"
              onClick={() => zoomOutRef.current?.()}
              aria-label="Zoom out"
            >
              <Minus className="size-4" />
            </Button>
          </div>
        </div>
        <div className="absolute top-4 left-4 z-1000 bg-background/80 backdrop-blur border px-2.5 py-1.5 rounded-md shadow-xs flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[7px] font-bold text-muted-foreground uppercase leading-none mb-1">
              Status
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              {pinMode ? `SELECTING ${pinMode.toUpperCase()}` : "LIVE TRACKING"}
            </span>
          </div>
          <Activity className={cn("size-3 text-emerald-500", pinMode && "animate-pulse")} />
        </div>
      </Card>
    </section>
  );
}
