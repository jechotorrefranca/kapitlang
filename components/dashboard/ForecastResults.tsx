import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export function ForecastResults() {
  return (
    <Card className="p-5 shadow-sm">
      <h2 className="text-sm font-bold tracking-tight uppercase mb-6 flex items-center justify-between">
        Forecast Results
        <Info className="size-4 text-muted-foreground font-normal" />
      </h2>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-muted-foreground uppercase">Expected Time</p>
            <p className="text-xl font-bold">
              42<span className="text-sm font-medium ml-1 text-muted-foreground">mins</span>
            </p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="space-y-0.5 text-right font-medium">
            <p className="text-[9px] font-bold text-emerald-600 uppercase">Confidence</p>
            <p className="text-sm">High (92%)</p>
          </div>
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
            42m
          </div>
        </div>

        <div className="flex justify-between text-[8px] font-black text-muted-foreground/60 uppercase">
          <span>20m</span>
          <span>40m</span>
          <span>60m</span>
          <span>80+</span>
        </div>
      </div>
    </Card>
  );
}
