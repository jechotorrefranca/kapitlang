"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { VehicleConfig, WeatherModifier } from "@/lib/types";
import { useMutation, useQuery } from "convex/react";
import { CloudRain, FlaskConical, Gauge, RotateCcw, Save, Settings2, ShieldCheck, Truck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  // Database Queries
  const systemSettings = useQuery(api.routes.getSystemSetting, { key: "monte_carlo_tests" });
  const peakHoursSetting = useQuery(api.routes.getSystemSetting, { key: "peak_hours" });
  const dbVehicleConfigs = useQuery(api.routes.getAllVehicleConfigs);
  const dbWeatherModifiers = useQuery(api.routes.getAllWeatherModifiers);

  const experimentalSetting = useQuery(api.routes.getSystemSetting, { key: "experimental_enabled" });

  // Database Mutations
  const upsertSetting = useMutation(api.routes.upsertSystemSetting);
  const upsertVehicle = useMutation(api.routes.upsertVehicleConfig);
  const upsertWeather = useMutation(api.routes.upsertWeatherModifier);

  // unified Local State
  const [iterations, setIterations] = useState<number>(500);
  const [peakHours, setPeakHours] = useState({
    am_start: 6,
    am_end: 9,
    pm_start: 17,
    pm_end: 20,
  });
  const [experimentalEnabled, setExperimentalEnabled] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleConfig[]>([]);
  const [weather, setWeather] = useState<WeatherModifier[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Sync database values to local state on load
  useEffect(() => {
    if (systemSettings?.value) setIterations(systemSettings.value);
    if (peakHoursSetting?.value) setPeakHours(peakHoursSetting.value);
    if (experimentalSetting?.value !== undefined) setExperimentalEnabled(experimentalSetting.value);
    if (dbVehicleConfigs) setVehicles(dbVehicleConfigs as unknown as VehicleConfig[]);
    if (dbWeatherModifiers) setWeather(dbWeatherModifiers as unknown as WeatherModifier[]);
  }, [systemSettings, peakHoursSetting, experimentalSetting, dbVehicleConfigs, dbWeatherModifiers]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    const loadingToast = toast.loading("Saving all changes...");
    try {
      // 1. Save General Settings
      await upsertSetting({ key: "monte_carlo_tests", value: iterations });
      await upsertSetting({ key: "peak_hours", value: peakHours });

      // 2. Save Vehicle Configs
      for (const v of vehicles) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, _creationTime, ...data } = v as unknown as Record<string, unknown>;
        await upsertVehicle(data as unknown as VehicleConfig);
      }

      // 3. Save Weather Modifiers
      for (const w of weather) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, _creationTime, ...data } = w as unknown as Record<string, unknown>;
        await upsertWeather(data as unknown as WeatherModifier);
      }

      toast.dismiss(loadingToast);
      toast.success("All settings saved and synchronized");
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Failed to save some settings");
    } finally {
      setIsSaving(false);
    }
  };

  const updateVehicle = (index: number, updates: Partial<VehicleConfig>) => {
    const newVehicles = [...vehicles];
    newVehicles[index] = { ...newVehicles[index], ...updates };
    setVehicles(newVehicles);
  };

  const handleReset = () => {
    setIterations(500);
    setPeakHours({
      am_start: 6,
      am_end: 9,
      pm_start: 17,
      pm_end: 20,
    });
    setVehicles([
      {
        vehicle: "jeepney",
        capacity: 22,
        base_speed_kph: 25,
        peak_min_wait: 5,
        peak_max_wait: 15,
        offpeak_min_wait: 15,
        offpeak_max_wait: 35,
        min_stops: 4,
        max_stops: 10,
        min_stop_delay: 0.5,
        max_stop_delay: 1.5,
      },
      {
        vehicle: "uv",
        capacity: 16,
        base_speed_kph: 35,
        peak_min_wait: 5,
        peak_max_wait: 12,
        offpeak_min_wait: 20,
        offpeak_max_wait: 40,
        min_stops: 0,
        max_stops: 2,
        min_stop_delay: 0.2,
        max_stop_delay: 0.6,
      },
    ]);
    setWeather([
      { condition: "clear", speed_factor: 1.0, wait_factor: 1.0 },
      { condition: "rain", speed_factor: 0.8, wait_factor: 1.2 },
    ]);
    toast.info("Local settings reset to factory defaults. Review and click Save Changes to persist.");
  };

  const updateWeather = (index: number, updates: Partial<WeatherModifier>) => {
    const newWeather = [...weather];
    newWeather[index] = { ...newWeather[index], ...updates };
    setWeather(newWeather);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <Settings2 className="size-8 text-emerald-600" />
            System Control
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Fine-tune the stochastic engine parameters and global transit rules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={isSaving}
            className="text-slate-500 hover:text-red-600 font-bold gap-2 text-xs"
          >
            <RotateCcw className="size-3" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 font-bold gap-2 shadow-md shadow-emerald-500/10 px-6"
          >
            <Save className="size-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-100 dark:bg-slate-900 border p-1">
          <TabsTrigger value="general" className="font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-800">
            <Zap className="size-3 mr-2" /> General
          </TabsTrigger>
          <TabsTrigger value="vehicles" className="font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-800">
            <Truck className="size-3 mr-2" /> Vehicles
          </TabsTrigger>
          <TabsTrigger value="environment" className="font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-800">
            <CloudRain className="size-3 mr-2" /> Environment
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/60">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                  <Gauge className="size-4 text-emerald-600" />
                  Monte Carlo Core
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase">Iterations Count</Label>
                  <Input
                    type="number"
                    value={iterations}
                    onChange={(e) => setIterations(parseInt(e.target.value) || 0)}
                    className="font-mono font-bold"
                  />
                  <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">High values = Better accuracy, slower load.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200/60 dark:border-slate-800/60">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  Rush Hour Windows
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">AM Start (H)</Label>
                    <Input type="number" value={peakHours.am_start} onChange={(e) => setPeakHours({ ...peakHours, am_start: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">AM End (H)</Label>
                    <Input type="number" value={peakHours.am_end} onChange={(e) => setPeakHours({ ...peakHours, am_end: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">PM Start (H)</Label>
                    <Input type="number" value={peakHours.pm_start} onChange={(e) => setPeakHours({ ...peakHours, pm_start: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">PM End (H)</Label>
                    <Input type="number" value={peakHours.pm_end} onChange={(e) => setPeakHours({ ...peakHours, pm_end: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {vehicles.map((v, idx) => (
              <Card key={v.vehicle} className="shadow-sm border-slate-200/60 dark:border-slate-800/60">
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase tracking-tighter text-emerald-600">
                    {v.vehicle} Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase">Speed (kph)</Label>
                      <Input type="number" value={v.base_speed_kph} onChange={(e) => updateVehicle(idx, { base_speed_kph: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase">Capacity</Label>
                      <Input type="number" value={v.capacity} onChange={(e) => updateVehicle(idx, { capacity: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase">Peak Wait (Min/Max)</Label>
                      <div className="flex gap-2">
                        <Input type="number" value={v.peak_min_wait} onChange={(e) => updateVehicle(idx, { peak_min_wait: parseInt(e.target.value) || 0 })} />
                        <Input type="number" value={v.peak_max_wait} onChange={(e) => updateVehicle(idx, { peak_max_wait: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase">Off-Peak Wait (Min/Max)</Label>
                      <div className="flex gap-2">
                        <Input type="number" value={v.offpeak_min_wait} onChange={(e) => updateVehicle(idx, { offpeak_min_wait: parseInt(e.target.value) || 0 })} />
                        <Input type="number" value={v.offpeak_max_wait} onChange={(e) => updateVehicle(idx, { offpeak_max_wait: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-500 uppercase">Stops (Min/Max)</Label>
                      <div className="flex gap-2">
                        <Input type="number" value={v.min_stops} onChange={(e) => updateVehicle(idx, { min_stops: parseInt(e.target.value) || 0 })} />
                        <Input type="number" value={v.max_stops} onChange={(e) => updateVehicle(idx, { max_stops: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Environment Tab */}
        <TabsContent value="environment" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weather.map((w, idx) => (
              <Card key={w.condition} className="shadow-sm border-slate-200/60 dark:border-slate-800/60">
                <div className={`h-1 w-full ${w.condition === 'rain' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-tighter">{w.condition} MODIFIER</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Speed Factor</Label>
                    <Input type="number" step="0.1" value={w.speed_factor} onChange={(e) => updateWeather(idx, { speed_factor: parseFloat(e.target.value) || 1 })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Wait Factor</Label>
                    <Input type="number" step="0.1" value={w.wait_factor} onChange={(e) => updateWeather(idx, { wait_factor: parseFloat(e.target.value) || 1 })} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="shadow-sm border-purple-200/60 dark:border-purple-800/60 bg-purple-50/5 dark:bg-purple-900/5 mt-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
              <FlaskConical className="size-4 text-purple-600" />
              Experimental Lab
            </CardTitle>
            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Unleash the unpredictable. Explore the hidden variables of chaos.</p>
          </div>
          <Switch
            checked={experimentalEnabled}
            onCheckedChange={async (val) => {
              setExperimentalEnabled(val);
              localStorage.setItem("experimental_enabled", val.toString());
              window.dispatchEvent(new Event("experimental-changed"));
              await upsertSetting({ key: "experimental_enabled", value: val });
              if (val) {
                toast.success("Experimental Lab activated", {
                  description: "You can now access the Experimental tab in the navbar.",
                });
              } else {
                toast.info("Experimental Lab deactivated");
              }
            }}
          />
        </CardHeader>
        <CardContent>
          <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
            Toggling this will <span className="font-bold text-purple-600 underline">instantly</span> update the navigation bar. Use with caution as these features may be unstable.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
