"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { AlertCircle, Bomb, FlaskConical, Fuel, Gavel, Save, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ExperimentalPage() {
  const chaosFactors = useQuery(api.routes.getChaosFactors);
  const upsertChaos = useMutation(api.routes.upsertChaosFactor);
  const [localFactors, setLocalFactors] = useState<Record<string, { enabled: boolean; value: number }>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (chaosFactors && Object.keys(localFactors).length === 0) {
      const initial: Record<string, { enabled: boolean; value: number }> = {};
      chaosFactors.forEach(f => {
        initial[f.key] = { enabled: f.enabled, value: f.value };
      });
      setLocalFactors(initial);
    }
  }, [chaosFactors]);

  const factors = [
    { key: "holdap_chance", label: "Chance na Maholdap", icon: ShieldAlert, description: "Risk of a robbery event occurring during the trip.", unit: "%" },
    { key: "sagasa_chance", label: "Chance na Makasagasa", icon: AlertCircle, description: "Risk of hitting a pedestrian (transfer delay).", unit: "%" },
    { key: "bunggo_chance", label: "Chance na Mabunggo", icon: Bomb, description: "Risk of collision with another vehicle.", unit: "%" },
    { key: "pulis_chance", label: "Huli ng Pulis", icon: Gavel, description: "Risk of being flagged for reckless driving.", unit: "%" },
    { key: "gas_time", label: "Time na Nagpapagas", icon: Fuel, description: "Time spent at the gas station if needed.", unit: "min" },
  ];

  const handleLocalUpdate = (key: string, enabled: boolean, value: number) => {
    setLocalFactors(prev => ({
      ...prev,
      [key]: { enabled, value }
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await Promise.all(
        Object.entries(localFactors).map(([key, data]) => 
          upsertChaos({ key, enabled: data.enabled, value: data.value })
        )
      );
      toast.success("Chaos parameters saved successfully");
    } catch {
      toast.error("Failed to save parameters");
    } finally {
      setIsSaving(false);
    }
  };

  const getLocalFactor = (key: string) => {
    return localFactors[key] || { enabled: false, value: 0 };
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <FlaskConical className="size-8 text-purple-600" />
            Experimental Lab
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            The "Chaos Engine" - Configure realistic hazards for Bulacan commute simulations.
          </p>
        </div>
        <Button 
          onClick={handleSaveAll} 
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-500 font-bold px-8 shadow-lg shadow-purple-500/20 gap-2"
        >
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Save Parameters"}
        </Button>
      </div>

      {/* Chaos Factors Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
          <Bomb className="size-5 text-red-600" />
          Chaos Engine Parameters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {factors.map((f) => {
            const data = getLocalFactor(f.key);
            const Icon = f.icon;
            return (
              <Card key={f.key} className={`border-slate-200/60 transition-all ${data.enabled ? 'border-red-200 bg-red-50/5' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Icon className={`size-4 ${data.enabled ? 'text-red-600' : 'text-slate-600'}`} />
                    </div>
                    <Switch 
                      checked={data.enabled}
                      onCheckedChange={(val) => handleLocalUpdate(f.key, val, data.value)}
                    />
                  </div>
                  <CardTitle className="text-sm font-black uppercase tracking-tight mt-3">{f.label}</CardTitle>
                  <CardDescription className="text-[10px] leading-tight font-medium">{f.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Input 
                      type="number" 
                      className="font-mono font-bold h-8 text-xs"
                      value={data.value}
                      disabled={!data.enabled}
                      onChange={(e) => handleLocalUpdate(f.key, data.enabled, parseFloat(e.target.value) || 0)}
                    />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{f.unit}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-4 rounded-xl flex gap-4 items-start">
        <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-red-900 dark:text-red-400 uppercase">Warning: Experimental Simulation</p>
          <p className="text-xs text-red-700 dark:text-red-500/80 leading-relaxed font-medium">
            Enabling these factors will switch your simulations to the <strong>Chaos Engine</strong>. These events significantly increase estimated travel times and reflect real-world hazards.
          </p>
        </div>
      </div>
    </div>
  );
}
