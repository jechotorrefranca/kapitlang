import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Flag, Locate, MapPin, Minus, Plus } from "lucide-react";
import Image from "next/image";

export function MapDisplay() {
  return (
    <section className="lg:col-span-5 relative h-[600px] lg:h-auto">
      <Card className="h-full w-full overflow-hidden border shadow-sm relative bg-zinc-100 dark:bg-zinc-900">
        <Image
          src="/mas logo.png"
          alt="Transit Map"
          className="w-full h-full object-cover opacity-20 grayscale pointer-events-none"
          fill
        />
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M20,30 Q40,40 60,70"
              fill="none"
              stroke="currentColor"
              className="text-emerald-500"
              strokeWidth="0.5"
              strokeDasharray="1,1"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute top-[30%] left-[20%] flex flex-col items-center">
            <div className="bg-emerald-600 p-1.5 rounded-full border-2 border-background shadow animate-bounce">
              <MapPin className="size-3 text-white" />
            </div>
            <span className="mt-1 bg-background px-1.5 py-0.5 rounded text-[8px] font-bold border shadow-xs">
              BOCAUE
            </span>
          </div>
          <div className="absolute top-[70%] left-[60%] flex flex-col items-center">
            <div className="bg-zinc-800 p-1.5 rounded-full border-2 border-background shadow">
              <Flag className="size-3 text-white" />
            </div>
            <span className="mt-1 bg-background px-1.5 py-0.5 rounded text-[8px] font-bold border shadow-xs">
              MEYCAUAYAN
            </span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 pointer-events-auto">
          <Button
            size="icon"
            variant="outline"
            className="size-8 bg-background shadow-xs hover:bg-muted"
          >
            <Plus className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-8 bg-background shadow-xs hover:bg-muted"
          >
            <Minus className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-8 bg-background shadow-xs hover:bg-muted mt-2"
          >
            <Locate className="size-4" />
          </Button>
        </div>

        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur border px-2.5 py-1.5 rounded-md shadow-xs flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[7px] font-bold text-muted-foreground uppercase leading-none mb-1">
              Status
            </span>
            <span className="text-[10px] font-bold text-emerald-600">ALL CLEAR</span>
          </div>
          <Activity className="size-3 text-emerald-500" />
        </div>
      </Card>
    </section>
  );
}
