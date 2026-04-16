import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Bus, Car, CloudSun, Lightbulb, Zap } from "lucide-react";

export function SimulationPanel() {
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
            <NativeSelect id="origin-terminal" defaultValue="Bocaue">
              <NativeSelectOption value="Bocaue">Bocaue Central</NativeSelectOption>
              <NativeSelectOption value="Marilao">Marilao North</NativeSelectOption>
            </NativeSelect>
          </div>
          <div>
            <label
              htmlFor="destination-terminal"
              className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block"
            >
              Destination
            </label>
            <NativeSelect id="destination-terminal" defaultValue="Meycauayan">
              <NativeSelectOption value="Meycauayan">Meycauayan NLT</NativeSelectOption>
              <NativeSelectOption value="Manila">Manila Gateway</NativeSelectOption>
            </NativeSelect>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block">
              Vehicle
            </p>
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-md border">
              <button className="flex items-center justify-center gap-2 py-1.5 rounded bg-background shadow-xs text-xs font-semibold text-emerald-600 border border-emerald-100 dark:border-emerald-900/30">
                <Bus className="size-3.5" />
                Jeep
              </button>
              <button className="flex items-center justify-center gap-2 py-1.5 rounded text-xs font-medium text-muted-foreground hover:bg-background/50">
                <Car className="size-3.5" />
                UV
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="departure-time"
                className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block"
              >
                Time
              </label>
              <Input
                id="departure-time"
                type="time"
                defaultValue="08:30"
                className="h-9 text-xs"
              />
            </div>
            <div className="flex items-end pb-1.5">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-[9px] font-bold border border-orange-200 dark:border-orange-900/50">
                <div className="size-1 rounded-full bg-orange-500 animate-pulse" />
                PEAK
              </span>
            </div>
          </div>
          <div>
            <label
              htmlFor="weather-select"
              className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block"
            >
              Weather
            </label>
            <div className="relative">
              <CloudSun className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <NativeSelect id="weather-select" defaultValue="Sunny" className="pl-9 h-9 text-xs">
                <NativeSelectOption value="Sunny">Sunny</NativeSelectOption>
                <NativeSelectOption value="Rainy">Rainy</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 tracking-wide mt-2">
            RUN SIMULATION
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
