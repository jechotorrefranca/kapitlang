"use client";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowRight, Bus, Car, History } from "lucide-react";
import Link from "next/link";

export function RecentRoutes() {
  const recentLogs = useQuery(api.routes.getRecentSimulationLogs, { limit: 3 });

  if (recentLogs === undefined) {
    return (
      <Card className="p-5 shadow-sm space-y-4">
        <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded bg-muted" />
                <div className="space-y-1">
                  <div className="h-2 w-24 bg-muted rounded" />
                  <div className="h-2 w-16 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
          <History className="size-3" />
          Recent Activity
        </h3>
        <Link href="/routes" className="text-[10px] font-bold text-emerald-600 hover:underline uppercase tracking-tighter">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {recentLogs.length === 0 ? (
          <p className="text-[10px] text-muted-foreground text-center py-4 uppercase font-bold opacity-50 italic">
            No simulations yet
          </p>
        ) : (
          recentLogs.map((log) => (
            <div key={log._id} className="group relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded border bg-muted/50 flex items-center justify-center group-hover:border-emerald-200 transition-colors shrink-0">
                    {log.vehicle === "jeepney" ? (
                      <Bus className="size-4 text-emerald-600" />
                    ) : (
                      <Car className="size-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-tight w-full">
                      <span className="truncate max-w-[80px] sm:max-w-[120px]">{log.origin}</span>
                      <ArrowRight className="size-2.5 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[80px] sm:max-w-[120px]">{log.destination}</span>
                    </div>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 mt-0.5">
                      {log.vehicle} • {log.weather}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-[13px] font-black text-slate-800 dark:text-slate-200 leading-none">
                    {Math.round(log.result_avg)}<span className="text-[9px] font-bold ml-0.5">m</span>
                  </p>
                  <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-tighter mt-1">
                    AVG. TIME
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
