import { Card } from "@/components/ui/card";
import { SimulationResult } from "@/lib/types";
import { Bomb, Bus, Car, FlaskConical, Info, PlayCircle, Sparkles } from "lucide-react";
import { SimulationLoader } from "../3D/SimulationLoader";
interface ForecastResultsProps {
  status: "idle" | "simulating" | "completed";
  result: SimulationResult | null;
}
export function ForecastResults({ status, result }: ForecastResultsProps) {
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
        <div className="flex items-center gap-2">
          Forecast Results
          {result?.vehicle && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/30">
              {result.vehicle === "jeepney" ? <Bus className="size-3" /> : <Car className="size-3" />}
              {result.vehicle.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <span className="text-[10px] font-mono font-bold text-slate-500 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5">
              {result.distance_km.toFixed(2)} km
            </span>
          )}
          <Info className="size-4 text-muted-foreground font-normal" />
        </div>
      </h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/20">
          <p className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Minimum</p>
          <p className="text-lg font-bold">
            {result ? Math.round(result.min) : "—"}<span className="text-[10px] font-medium ml-0.5 text-muted-foreground">m</span>
          </p>
          <p className="text-[8px] font-bold text-emerald-600/70 uppercase mt-1">Best Case</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800/30 scale-105 shadow-sm relative z-10">
          <p className="text-[8px] font-bold text-emerald-600 uppercase mb-1">Most Likely</p>
          <p className="text-2xl font-black text-emerald-600 leading-none">
            {result ? Math.round(result.avg) : "—"}<span className="text-xs font-bold ml-0.5 opacity-70">m</span>
          </p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase mt-2">Probable Duration</p>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/20">
          <p className="text-[8px] font-bold text-muted-foreground uppercase mb-1">Maximum</p>
          <p className="text-lg font-bold">
            {result ? Math.round(result.max) : "—"}<span className="text-[10px] font-medium ml-0.5 text-muted-foreground">m</span>
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
            <div className="size-1.5 rounded-full bg-emerald-500" /> MONTE CARLO ({result?.iterations || 500} TESTS)
          </div>
        </div>
        {(() => {
          const axisMin = result ? Math.max(0, Math.floor(result.min / 5) * 5) : 15;
          const axisMax = result ? Math.max(axisMin + 30, Math.ceil(result.max / 10) * 10) : 60;
          const scaleX = (val: number) => Math.max(0, Math.min(100, ((val - axisMin) / (axisMax - axisMin)) * 100));
          const xMin = result ? scaleX(result.min) : 0;
          const xAvg = result ? scaleX(result.avg) : 55;
          const xMax = result ? scaleX(result.max) : 100;
          const cp1x = (xMin + xAvg) / 2;
          const cp2x = (xAvg + xMax) / 2;
          const dynamicPath = `M${xMin},100 C${cp1x},100 ${cp1x},20 ${xAvg},20 C${cp2x},20 ${cp2x},100 ${xMax},100`;
          const span = axisMax - axisMin;
          const markers = [
            axisMin,
            Math.round(axisMin + span * 0.33),
            Math.round(axisMin + span * 0.66),
            axisMax
          ];
          return (
            <>
              <div className="relative h-32 w-full bg-muted/20 border rounded overflow-hidden">
                <svg
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  <path
                    d={result ? `${dynamicPath} L${xMax},100 L${xMin},100 Z` : "M0,100 Q20,100 40,80 T60,20 T80,80 T100,100"}
                    fill="currentColor"
                    className="text-emerald-500/10"
                  />
                  <path
                    d={result ? dynamicPath : "M0,100 Q20,100 40,80 T60,20 T80,80 T100,100"}
                    fill="none"
                    stroke="currentColor"
                    className="text-emerald-600"
                    strokeWidth="1"
                  />
                  <line
                    x1={xAvg}
                    y1="20"
                    x2={xAvg}
                    y2="100"
                    stroke="currentColor"
                    className="text-emerald-600/30"
                    strokeDasharray="1,1"
                  />
                </svg>
                <div
                  className="absolute bottom-2 -translate-x-1/2 bg-white dark:bg-zinc-800 border text-[8px] font-bold px-1.5 rounded text-emerald-600 transition-all duration-500"
                  style={{ left: `${xAvg}%` }}
                >
                  {result ? `${Math.round(result.avg)}m` : "—"}
                </div>
              </div>
              <div className="flex justify-between text-[8px] font-black text-muted-foreground/60 uppercase mb-4">
                {markers.map((m, i) => (
                  <span key={i}>{m}{i === markers.length - 1 ? "+" : "m"}</span>
                ))}
              </div>
            </>
          );
        })()}
        { }
        {result?.factors && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center justify-between">
              Applied Factors ({result.vehicle})
              {result.is_experimental && (
                <span className="text-purple-600 font-black animate-pulse flex items-center gap-1">
                  <FlaskConical className="size-3" /> CHAOS ENGINE
                </span>
              )}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded flex flex-col p-2 border">
                <span className="text-[8px] uppercase font-bold text-slate-500">Wait Time</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {result.factors.avg_wait_min ? `${result.factors.avg_wait_min.toFixed(1)}m` : "—"}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded flex flex-col p-2 border">
                <span className="text-[8px] uppercase font-bold text-slate-500">Stop Delay</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {result.factors.avg_stop_delay_min ? `${result.factors.avg_stop_delay_min.toFixed(1)}m` : "—"}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded flex flex-col p-2 border">
                <span className="text-[8px] uppercase font-bold text-slate-500">Speed</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {result.factors.speed_kph ? `${result.factors.speed_kph} kph` : "—"}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded flex flex-col p-2 border">
                <span className="text-[8px] uppercase font-bold text-slate-500">Weather Mult.</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {result.factors.weather_factor ? `${result.factors.weather_factor}x` : "—"}
                </span>
              </div>
            </div>

            {/* Chaos Events */}
            {result.factors.chaos_events && result.factors.chaos_events.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Bomb className="size-3 text-red-600" />
                  <span className="text-[10px] font-black uppercase text-red-600 tracking-tighter">Events Detected</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {result.factors.chaos_events.map((event, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/50 dark:bg-red-900/20 rounded p-1.5 border border-red-100/50 dark:border-red-900/30">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-red-700 dark:text-red-300 uppercase leading-none mb-1">
                          {event.name}
                        </span>
                        <span className="text-[9px] font-bold text-red-600/60 uppercase">
                          Impact: +{event.avg_time_added}m avg delay
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-xs font-mono font-bold text-red-700 dark:text-red-300">
                          {event.count}/{result.iterations || 500}
                        </span>
                        <span className="text-[8px] font-bold text-red-600/40 uppercase">
                          Occurrence
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
