"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Beaker, FlaskConical, Sparkles, Wand2 } from "lucide-react";

export default function ExperimentalPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
          <FlaskConical className="size-8 text-purple-600" />
          Experimental Lab
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Try out upcoming features and stochastic algorithms before they hit production.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-purple-200/60 dark:border-purple-800/60 bg-purple-50/10 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="size-24 text-purple-600" />
          </div>
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
              <Wand2 className="size-4 text-purple-600" />
              Smart Route Optimizer
            </CardTitle>
            <CardDescription className="text-xs">
              AI-driven pathfinding that accounts for real-time traffic heatmaps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-32 bg-purple-100/50 dark:bg-purple-900/20 rounded-lg border border-dashed border-purple-300 dark:border-purple-700 flex items-center justify-center">
              <span className="text-[10px] font-bold text-purple-600/50 uppercase tracking-widest">Under Construction</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800/60 shadow-sm relative group">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-tighter flex items-center gap-2">
              <Beaker className="size-4 text-slate-600" />
              Dynamic Weather Sync
            </CardTitle>
            <CardDescription className="text-xs">
              Automatically fetch local Bulacan weather data for simulation accuracy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-32 bg-slate-100/50 dark:bg-slate-900/20 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
               <span className="text-[10px] font-bold text-slate-600/50 uppercase tracking-widest">Alpha Preview</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
        <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
          <FlaskConical className="size-8 text-purple-600" />
        </div>
        <div className="max-w-md">
          <h3 className="font-bold text-lg">Contribute to the Lab</h3>
          <p className="text-sm text-muted-foreground mt-1">
            These features are currently in pre-alpha. Feedback and pull requests are welcome in the repository.
          </p>
        </div>
      </div>
    </div>
  );
}
