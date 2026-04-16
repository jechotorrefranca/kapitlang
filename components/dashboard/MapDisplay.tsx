"use client";

import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";
import dynamic from "next/dynamic";
import { TerminalName } from "@/lib/constants";

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
  origin: TerminalName;
  destination: TerminalName;
}

export function MapDisplay({ origin, destination }: MapDisplayProps) {
  return (
    <section className="lg:col-span-5 relative h-[600px] lg:h-auto">
      <Card className="h-full w-full overflow-hidden border shadow-sm relative bg-zinc-100 dark:bg-zinc-900">
        <DynamicInteractiveMap origin={origin} destination={destination} />

        <div className="absolute top-4 left-4 z-[1000] bg-background/80 backdrop-blur border px-2.5 py-1.5 rounded-md shadow-xs flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[7px] font-bold text-muted-foreground uppercase leading-none mb-1">
              Status
            </span>
            <span className="text-[10px] font-bold text-emerald-600">LIVE TRACKING</span>
          </div>
          <Activity className="size-3 text-emerald-500" />
        </div>
      </Card>
    </section>
  );
}
