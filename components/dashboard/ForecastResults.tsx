import { Card } from "@/components/ui/card";
import { Info, PlayCircle, Sparkles } from "lucide-react";
import { SimulationLoader } from "../3D/SimulationLoader";

interface ForecastResultsProps {
  status: "idle" | "simulating" | "completed";
}

export function ForecastResults({ status }: ForecastResultsProps) {
  if (status === "idle") {
    return (
      <Card className="p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-100 bg-linear-to-br from-background to-muted/20 border-dashed">
        <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 animate-pulse">
          <PlayCircle className="size-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg">Ready to Analyze</h3>
          <p className="text-xs text-muted-foreground max-w-60">
            Set your origin and destination then click run simulation to forecast your transit time.
          </p>
        </div>
      </Card>
    );
  }

  if (status === "simulating") {
    return (
      <Card className="p-0 shadow-sm overflow-hidden min-h-100 flex flex-col">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight uppercase flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-600 animate-spin" />
            Analyzing Route...
          </h2>
          <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/30">
            PROCESSING
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <SimulationLoader />
          <div className="w-full max-w-50 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-progress" style={{ width: "60%" }} />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 shadow-sm min-h-100 animate-in fade-in zoom-in-95 duration-500">
      <h2 className="text-sm font-bold tracking-tight uppercase mb-6 flex items-center justify-between">
        Forecast Results
        <Info className="size-4 text-muted-foreground font-normal" />
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/20">
          <p className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Minimum</p>
          <p className="text-lg font-bold">
            28<span className="text-[10px] font-medium ml-0.5 text-muted-foreground">m</span>
          </p>
          <p className="text-[8px] font-bold text-emerald-600/70 uppercase mt-1">Best Case</p>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800/30 scale-105 shadow-sm relative z-10">
          <p className="text-[8px] font-bold text-emerald-600 uppercase mb-1">Most Likely</p>
          <p className="text-2xl font-black text-emerald-600 leading-none">
            34<span className="text-xs font-bold ml-0.5 opacity-70">m</span>
          </p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase mt-2">Probable Duration</p>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/20">
          <p className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Maximum</p>
          <p className="text-lg font-bold">
            42<span className="text-[10px] font-medium ml-0.5 text-muted-foreground">m</span>
          </p>
          <p className="text-[8px] font-bold text-orange-600/70 uppercase mt-1">Worst Case</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">
            Wait Time Intervals
          </p>
          <div className="flex items-center gap-1.5 text-[8px] font-bold">
            <div className="size-1.5 rounded-full bg-emerald-500" /> MONTE CARLO
          </div>
        </div>

        <div className="relative h-32 w-full bg-muted/20 border rounded overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              d="M0,100 Q20,100 40,80 T60,20 T80,80 T100,100"
              fill="currentColor"
              className="text-emerald-500/10"
            />
            <path
              d="M0,100 Q20,100 40,80 T60,20 T80,80 T100,100"
              fill="none"
              stroke="currentColor"
              className="text-emerald-600"
              strokeWidth="1"
            />
            <line
              x1="55"
              y1="20"
              x2="55"
              y2="100"
              stroke="currentColor"
              className="text-emerald-600/30"
              strokeDasharray="1,1"
            />
          </svg>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 border text-[8px] font-bold px-1.5 rounded text-emerald-600">
            34m
          </div>
        </div>

        <div className="flex justify-between text-[8px] font-black text-muted-foreground/60 uppercase">
          <span>15m</span>
          <span>30m</span>
          <span>45m</span>
          <span>60+</span>
        </div>
      </div>
    </Card>
  );
}
