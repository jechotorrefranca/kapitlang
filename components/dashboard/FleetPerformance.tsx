import { Card } from "@/components/ui/card";
import { Bus, Car } from "lucide-react";

export function FleetPerformance() {
  return (
    <Card className="p-5 shadow-sm">
      <h3 className="text-[10px] font-bold uppercase text-muted-foreground mb-4 tracking-widest">
        Fleet Performance
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between group cursor-help">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded border bg-muted flex items-center justify-center group-hover:border-emerald-200 transition-colors">
              <Bus className="size-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold mb-0.5 leading-none">Jeepney (Express)</p>
              <p className="text-[9px] text-muted-foreground">12 units in transit</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 tracking-tight flex items-center gap-1">
            <div className="size-1 rounded-full bg-emerald-500" />
            ON TIME
          </span>
        </div>
        <div className="flex items-center justify-between group cursor-help">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded border bg-muted flex items-center justify-center group-hover:border-orange-200 transition-colors">
              <Car className="size-4 text-orange-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold mb-0.5 leading-none">UV Express</p>
              <p className="text-[9px] text-muted-foreground">4 units in terminal</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-orange-500 tracking-tight flex items-center gap-1 text-nowrap">
            <div className="size-1 rounded-full bg-orange-500" />
            HIGH DEMAND
          </span>
        </div>
      </div>
    </Card>
  );
}
