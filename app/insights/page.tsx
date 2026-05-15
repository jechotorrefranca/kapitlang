"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bus,
  Car,
  Clock,
  Cloud,
  Gauge,
  Loader2,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const DEFAULT_CONGESTION: Record<string, number> = {
  Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0,
};

const chartConfig = {
  min: { label: "Minimum", color: "oklch(0.75 0.18 155)" },
  max: { label: "Maximum", color: "oklch(0.65 0.20 25)" },
  avg: { label: "Most Likely", color: "oklch(0.65 0.2 160)" },
} satisfies ChartConfig;

function InsightsContent() {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") ?? "";
  const destination = searchParams.get("destination") ?? "";

  // Database-backed congestion modifiers
  const dbModifiers = useQuery(api.routes.getInsightsModifiers);
  const upsertModifier = useMutation(api.routes.upsertInsightsModifier);

  const [dayCongestion, setDayCongestion] = useState<Record<string, number>>({ ...DEFAULT_CONGESTION });
  const [isSaving, setIsSaving] = useState(false);

  // Sync DB → local state
  useEffect(() => {
    if (dbModifiers) {
      const merged = { ...DEFAULT_CONGESTION };
      for (const mod of dbModifiers) {
        merged[mod.day] = mod.congestion;
      }
      setDayCongestion(merged);
    }
  }, [dbModifiers]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const day of DAYS) {
        await upsertModifier({ day, congestion: dayCongestion[day] ?? 0 });
      }
      toast.success("Traffic modifiers saved", {
        description: "Settings synced to database — available on all devices.",
      });
    } catch {
      toast.error("Failed to save modifiers");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setDayCongestion({ ...DEFAULT_CONGESTION });
    setIsSaving(true);
    try {
      for (const day of DAYS) {
        await upsertModifier({ day, congestion: 0 });
      }
      toast.info("Traffic modifiers reset to defaults");
    } catch {
      toast.error("Failed to reset modifiers");
    } finally {
      setIsSaving(false);
    }
  };

  const logId = searchParams.get("logId");

  // Fetch the specific log by ID if available
  const specificLog = useQuery(
    api.routes.getSimulationLogById,
    logId ? { id: logId as never } : "skip"
  );

  // Fallback: fetch all logs for this route pair
  const routeLogs = useQuery(
    api.routes.getSimulationLogsByRoute,
    !logId && origin && destination ? { origin, destination } : "skip"
  );

  // Use the specific log if available, otherwise fall back to latest from route query
  const displayLog = specificLog ?? (routeLogs && routeLogs.length > 0 ? routeLogs[routeLogs.length - 1] : null);

  // Base values come from the single clicked log (or median of route logs as fallback)
  const baseValues = useMemo(() => {
    if (specificLog) {
      return {
        min: specificLog.result_min,
        max: specificLog.result_max,
        avg: specificLog.result_avg,
      };
    }
    if (routeLogs && routeLogs.length > 0) {
      const median = (values: number[]) => {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];
      };
      return {
        min: median(routeLogs.map((l) => l.result_min)),
        max: median(routeLogs.map((l) => l.result_max)),
        avg: median(routeLogs.map((l) => l.result_avg)),
      };
    }
    return null;
  }, [specificLog, routeLogs]);

  const generateWeeklyData = useCallback(() => {
    if (!baseValues) return [];

    return DAYS.map((day) => {
      const congestionFactor = 1 + (dayCongestion[day] ?? 0) / 100;
      return {
        day,
        min: Math.round(baseValues.min * congestionFactor * 100) / 100,
        max: Math.round(baseValues.max * congestionFactor * 100) / 100,
        avg: Math.round(baseValues.avg * congestionFactor * 100) / 100,
      };
    });
  }, [baseValues, dayCongestion]);

  const weeklyData = useMemo(() => generateWeeklyData(), [generateWeeklyData]);

  const weeklyAvg = weeklyData.length > 0
    ? Math.round((weeklyData.reduce((s, d) => s + d.avg, 0) / weeklyData.length) * 10) / 10
    : 0;
  const weeklyPeak = weeklyData.length > 0
    ? Math.round(Math.max(...weeklyData.map((d) => d.max)) * 10) / 10
    : 0;
  const weeklyLow = weeklyData.length > 0
    ? Math.round(Math.min(...weeklyData.map((d) => d.min)) * 10) / 10
    : 0;

  if (!origin || !destination) {
    return (
      <div className="max-w-7xl mx-auto p-6 lg:p-8 animate-in fade-in duration-700">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 opacity-50">
          <BarChart3 className="size-16" />
          <h2 className="text-xl font-black uppercase tracking-tight">No Route Selected</h2>
          <p className="text-sm text-muted-foreground max-w-md text-center">
            Navigate to the <strong>Routes</strong> tab and click on any simulation entry to view its weekly commute insights.
          </p>
          <Link href="/routes">
            <Button variant="outline" className="gap-2 font-bold uppercase text-xs tracking-wider mt-2">
              <ArrowLeft className="size-3" />
              Go to Routes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/routes"
            className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs hover:underline mb-1 w-fit"
          >
            <ArrowLeft className="size-3" />
            Back to Routes
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Route Insights
          </h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <span className="font-bold text-slate-700 dark:text-slate-300">{origin}</span>
            <ArrowRight className="size-3.5 text-emerald-600" />
            <span className="font-bold text-slate-700 dark:text-slate-300">{destination}</span>
          </div>
        </div>
        {displayLog && (
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-950 shadow-sm border border-slate-200 dark:border-slate-800 text-center min-w-20">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Vehicle</div>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                {displayLog.vehicle === "jeepney" ? <Bus className="size-3.5 text-emerald-600" /> : <Car className="size-3.5 text-emerald-600" />}
                <span className="text-sm font-black text-emerald-600 uppercase">{displayLog.vehicle}</span>
              </div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-950 shadow-sm border border-slate-200 dark:border-slate-800 text-center min-w-20">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Weather</div>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                {displayLog.weather === "clear" ? <Sun className="size-3.5 text-amber-500" /> : <Cloud className="size-3.5 text-blue-400" />}
                <span className="text-sm font-black capitalize">{displayLog.weather}</span>
              </div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-950 shadow-sm border border-slate-200 dark:border-slate-800 text-center min-w-20">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Distance</div>
              <div className="text-sm font-black font-mono text-emerald-600 mt-0.5">{displayLog.distance_km.toFixed(2)} km</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid — items-stretch for equal height columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
        {/* Left column: Chart + Daily Breakdown */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                <BarChart3 className="size-4 text-emerald-600" />
                Weekly Commute Forecast
              </CardTitle>
              <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <span>{origin}</span>
                <ArrowRight className="size-2.5" />
                <span>{destination}</span>
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {weeklyData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 opacity-40 space-y-2">
                  <BarChart3 className="size-12" />
                  <p className="font-bold uppercase tracking-widest text-sm">Loading data...</p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[340px] w-full">
                  <AreaChart data={weeklyData} margin={{ top: 12, right: 12, bottom: 0, left: -8 }}>
                    <defs>
                      <linearGradient id="gradMin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.75 0.18 155)" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="oklch(0.75 0.18 155)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradMax" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.65 0.20 25)" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="oklch(0.65 0.20 25)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.65 0.2 160)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="oklch(0.65 0.2 160)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-[10px] font-bold uppercase" />
                    <YAxis tickLine={false} axisLine={false} className="text-[10px]" tickFormatter={(v: number) => `${v}m`} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(label) => `${label}`}
                          formatter={(value, name) => (
                            <div className="flex items-center gap-2">
                              <div className="size-2 rounded-full" style={{ backgroundColor: chartConfig[name as keyof typeof chartConfig]?.color }} />
                              <span className="text-muted-foreground">{chartConfig[name as keyof typeof chartConfig]?.label}</span>
                              <span className="font-mono font-bold ml-auto tabular-nums">
                                {typeof value === "number" ? value.toFixed(1) : value} min
                              </span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Area type="monotone" dataKey="max" stroke="oklch(0.65 0.20 25)" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#gradMax)" dot={false} />
                    <Area type="monotone" dataKey="min" stroke="oklch(0.75 0.18 155)" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#gradMin)" dot={false} />
                    <Area type="monotone" dataKey="avg" stroke="oklch(0.65 0.2 160)" strokeWidth={3} fill="url(#gradAvg)" dot={{ r: 4, fill: "oklch(0.65 0.2 160)", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, strokeWidth: 2 }} />
                  </AreaChart>
                </ChartContainer>
              )}
              {weeklyData.length > 0 && (
                <div className="flex items-center justify-center gap-6 pt-2 pb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0.5 bg-[oklch(0.65_0.2_160)] rounded-full" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Most Likely</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0.5 border-t-2 border-dashed border-[oklch(0.75_0.18_155)] rounded-full" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0.5 border-t-2 border-dashed border-[oklch(0.65_0.20_25)] rounded-full" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Max</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Breakdown Table */}
          {weeklyData.length > 0 && (
            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/60 overflow-hidden flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                  <Clock className="size-4 text-emerald-600" />
                  Daily Breakdown
                </CardTitle>
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                  Predicted commute times per day with applied modifiers
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                      <tr>
                        <th className="px-5 py-3 text-left font-bold text-slate-900 dark:text-slate-100 text-[10px] uppercase tracking-wider">Day</th>
                        <th className="px-5 py-3 text-right font-bold text-slate-900 dark:text-slate-100 text-[10px] uppercase tracking-wider">Min</th>
                        <th className="px-5 py-3 text-right font-bold text-slate-900 dark:text-slate-100 text-[10px] uppercase tracking-wider">Most Likely</th>
                        <th className="px-5 py-3 text-right font-bold text-slate-900 dark:text-slate-100 text-[10px] uppercase tracking-wider">Max</th>
                        <th className="px-5 py-3 text-right font-bold text-slate-900 dark:text-slate-100 text-[10px] uppercase tracking-wider">Modifier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyData.map((d) => {
                        const mod = dayCongestion[d.day] ?? 0;
                        const isBusiest = d.avg === Math.max(...weeklyData.map((w) => w.avg));
                        return (
                          <tr
                            key={d.day}
                            className={`border-t transition-colors ${isBusiest ? "bg-emerald-50/40 dark:bg-emerald-950/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-900/50"}`}
                          >
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-xs uppercase">{d.day}</span>
                                {isBusiest && (
                                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded uppercase">Peak</span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-3 text-right font-mono text-xs text-teal-600">{d.min.toFixed(1)} min</td>
                            <td className="px-5 py-3 text-right font-mono text-xs font-bold text-emerald-600">{d.avg.toFixed(1)} min</td>
                            <td className="px-5 py-3 text-right font-mono text-xs text-rose-500">{d.max.toFixed(1)} min</td>
                            <td className="px-5 py-3 text-right">
                              {mod !== 0 ? (
                                <span className={`text-[10px] font-mono font-bold ${mod > 0 ? "text-amber-600" : "text-blue-600"}`}>
                                  {mod > 0 ? "+" : ""}{mod}%
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono font-bold text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Summary Stats */}
          <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                <Gauge className="size-4 text-emerald-600" />
                Week Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/30 dark:border-emerald-800/30">
                  <div className="text-lg font-black text-emerald-600">{weeklyAvg || "—"}</div>
                  <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Avg (min)</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/30 dark:border-teal-800/30">
                  <div className="text-lg font-black text-teal-600">{weeklyLow || "—"}</div>
                  <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Low (min)</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/30 dark:border-rose-800/30">
                  <div className="text-lg font-black text-rose-500">{weeklyPeak || "—"}</div>
                  <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Peak (min)</div>
                </div>
              </div>
              {weeklyData.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="size-3" />
                    Busiest Day
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border">
                    <span className="font-black text-sm uppercase">
                      {weeklyData.reduce((max, d) => (d.avg > max.avg ? d : max), weeklyData[0]).day}
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-600">
                      {weeklyData.reduce((max, d) => (d.avg > max.avg ? d : max), weeklyData[0]).avg.toFixed(1)} min
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Per-Day Congestion Modifiers — flex-1 to stretch */}
          <Card className="shadow-sm border-amber-200/40 dark:border-amber-800/40 bg-amber-50/5 dark:bg-amber-900/5 flex-1">
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-amber-600" />
                Traffic Modifiers
              </CardTitle>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                Per-day congestion adjustment (supports negative)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {DAYS.map((day) => (
                <div key={day} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{day}</Label>
                    <Input
                      type="number"
                      step="any"
                      min={-50}
                      max={200}
                      value={dayCongestion[day]}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "" || raw === "-") return;
                        const val = parseFloat(raw);
                        if (!isNaN(val)) {
                          setDayCongestion((prev) => ({ ...prev, [day]: Math.max(-50, Math.min(200, val)) }));
                        }
                      }}
                      className="w-20 h-6 text-[10px] font-mono font-bold text-center text-amber-600 px-1"
                    />
                  </div>
                  <Slider
                    value={[dayCongestion[day]]}
                    onValueChange={(v) => setDayCongestion((prev) => ({ ...prev, [day]: Math.round(v[0] * 10) / 10 }))}
                    min={-50}
                    max={200}
                    step={0.1}
                    className="[&_[data-slot=slider-range]]:bg-amber-500 [&_[data-slot=slider-thumb]]:border-amber-500"
                  />
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={isSaving}
                  className="flex-1 text-xs font-bold text-slate-500 hover:text-red-600 gap-1.5"
                >
                  <RotateCcw className="size-3" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 gap-1.5 shadow-md shadow-amber-500/10"
                >
                  {isSaving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <BarChart3 className="size-5 animate-pulse" />
          <span className="text-sm font-bold uppercase tracking-widest">Loading Insights...</span>
        </div>
      </div>
    }>
      <InsightsContent />
    </Suspense>
  );
}
