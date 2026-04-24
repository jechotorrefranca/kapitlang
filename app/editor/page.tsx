"use client";

import { HIGHWAY_SEQUENCE, ROUTE_HINTS, TERMINAL_COORDINATES } from "@/lib/constants";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";

const TerminalMapEditor = dynamic(() => import("./TerminalMapEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-900 text-slate-400 text-sm">
      Loading map…
    </div>
  ),
});

type EditableCoords = Record<string, { lat: number; lng: number }>;
type HintRecord = Record<string, { lat: number; lng: number }[]>;
type Tab = "terminals" | "hints";

const ORIGINAL = Object.fromEntries(
  Object.entries(TERMINAL_COORDINATES).map(([k, v]) => [k, { ...v }])
);

const KNOWN_TERMINALS = HIGHWAY_SEQUENCE.filter((t) => t !== "Dropped Pin");


const SEGMENTS = KNOWN_TERMINALS.slice(0, -1).map(
  (name, i) => `${name}|${KNOWN_TERMINALS[i + 1]}`
);

function fmt(n: number) { return n.toFixed(7); }

export default function EditorPage() {

  const [tab, setTab] = useState<Tab>("terminals");
  const [coords, setCoords] = useState<EditableCoords>(() => ({ ...ORIGINAL }));
  const [selected, setSelected] = useState<string | null>(KNOWN_TERMINALS[0] ?? null);
  const [copied, setCopied] = useState<"coords" | "hints" | null>(null);
  const [hints, setHints] = useState<HintRecord>(() => {
    const init: HintRecord = {};
    for (const seg of SEGMENTS) {
      const [a, b] = seg.split("|");
      init[seg] = [];
      init[`${b}|${a}`] = [];
    }
    for (const [key, pts] of Object.entries(ROUTE_HINTS)) {
      if (key in init) init[key] = pts.map((p) => ({ ...p }));
    }
    return init;
  });
  const [selectedSeg, setSelectedSeg] = useState<string | null>(null);
  const [hintAddMode, setHintAddMode] = useState(false);


  const handleDrag = (name: string, lat: number, lng: number) =>
    setCoords((prev) => ({ ...prev, [name]: { lat, lng } }));
  const handleReset = (name: string) =>
    setCoords((prev) => ({ ...prev, [name]: { ...ORIGINAL[name] } }));
  const handleResetAll = () => setCoords({ ...ORIGINAL });

  const changedCount = useMemo(
    () => KNOWN_TERMINALS.filter(
      (n) => fmt(coords[n]?.lat) !== fmt(ORIGINAL[n]?.lat) ||
        fmt(coords[n]?.lng) !== fmt(ORIGINAL[n]?.lng)
    ).length,
    [coords]
  );


  const handleAddHint = (segKey: string, lat: number, lng: number) =>
    setHints((prev) => ({ ...prev, [segKey]: [...(prev[segKey] ?? []), { lat, lng }] }));

  const handleDragHint = (segKey: string, idx: number, lat: number, lng: number) =>
    setHints((prev) => {
      const pts = [...(prev[segKey] ?? [])];
      pts[idx] = { lat, lng };
      return { ...prev, [segKey]: pts };
    });

  const handleDeleteHint = (segKey: string, idx: number) =>
    setHints((prev) => {
      const pts = [...(prev[segKey] ?? [])];
      pts.splice(idx, 1);
      return { ...prev, [segKey]: pts };
    });

  const handleClearSegHints = (segKey: string) =>
    setHints((prev) => ({ ...prev, [segKey]: [] }));


  const coordsCode = useMemo(() => {
    const lines = KNOWN_TERMINALS.map(
      (name) => `  "${name}": { lat: ${fmt(coords[name].lat)}, lng: ${fmt(coords[name].lng)} },`
    );
    return `export const TERMINAL_COORDINATES: Record<Exclude<TerminalName, "Dropped Pin">, Coordinate> = {\n${lines.join("\n")}\n};`;
  }, [coords]);

  const hintsCode = useMemo(() => {
    const filled = Object.entries(hints).filter(([, pts]) => pts.length > 0);
    if (filled.length === 0) return `export const ROUTE_HINTS: Record<string, Coordinate[]> = {};\n`;
    const lines = filled.map(([key, pts]) => {
      const inner = pts.map((p) => `    { lat: ${fmt(p.lat)}, lng: ${fmt(p.lng)} },`).join("\n");
      return `  "${key}": [\n${inner}\n  ],`;
    });
    return `export const ROUTE_HINTS: Record<string, Coordinate[]> = {\n${lines.join("\n")}\n};\n`;
  }, [hints]);

  const handleCopy = async (which: "coords" | "hints") => {
    await navigator.clipboard.writeText(which === "coords" ? coordsCode : hintsCode);
    setCopied(which);
    setTimeout(() => setCopied(null), 2000);
  };


  const selectedCoord = selected ? coords[selected] : null;
  const segHintCount = (seg: string) => hints[seg]?.length ?? 0;
  const totalHints = useMemo(
    () => Object.values(hints).reduce((s, pts) => s + pts.length, 0),
    [hints]
  );


  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      { }
      <header className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
            DEV TOOL
          </span>
          <h1 className="text-sm font-bold text-slate-100">Terminal Coordinate Editor</h1>
          {hintAddMode && selectedSeg && (
            <span className="text-xs text-amber-300 font-bold bg-amber-950 border border-amber-700 px-3 py-0.5 rounded animate-pulse">
              📍 HINT ADD MODE — click the map to drop a waypoint
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {changedCount > 0 && (
            <span className="text-xs text-amber-400 font-semibold bg-amber-950 border border-amber-800 px-2 py-0.5 rounded">
              {changedCount} coord change{changedCount !== 1 ? "s" : ""}
            </span>
          )}
          {totalHints > 0 && (
            <span className="text-xs text-violet-400 font-semibold bg-violet-950 border border-violet-800 px-2 py-0.5 rounded">
              {totalHints} hint{totalHints !== 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={handleResetAll}
            className="text-xs text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded transition-colors"
          >
            Reset Coords
          </button>
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded"
          >
            ← Back to App
          </Link>
        </div>
      </header>

      { }
      <div className="flex-1 flex overflow-hidden">
        { }
        <aside className="w-72 shrink-0 border-r border-slate-800 flex flex-col overflow-hidden bg-slate-900">
          { }
          <div className="flex border-b border-slate-800">
            {(["terminals", "hints"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${tab === t
                  ? "text-emerald-400 border-b-2 border-emerald-500 bg-emerald-950/30"
                  : "text-slate-500 hover:text-slate-300"
                  }`}
              >
                {t === "terminals" ? `Terminals (${KNOWN_TERMINALS.length})` : `Route Hints (${totalHints})`}
              </button>
            ))}
          </div>

          { }
          {tab === "terminals" && (
            <>
              <div className="flex-1 overflow-y-auto">
                {KNOWN_TERMINALS.map((name, index) => {
                  const coord = coords[name];
                  const orig = ORIGINAL[name];
                  const changed = fmt(coord?.lat) !== fmt(orig?.lat) || fmt(coord?.lng) !== fmt(orig?.lng);
                  const isSelected = selected === name;

                  return (
                    <div
                      key={name}
                      onClick={() => setSelected(name)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelected(name)}
                      className={`w-full text-left px-4 py-3 border-b border-slate-800/60 transition-colors cursor-pointer ${isSelected
                        ? "bg-emerald-950/60 border-l-2 border-l-emerald-500"
                        : "hover:bg-slate-800/50"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`shrink-0 size-5 rounded-full flex items-center justify-center text-[9px] font-bold font-mono ${isSelected ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"
                              }`}
                          >
                            {index + 1}
                          </span>
                          <span className="text-[11px] font-medium leading-snug text-slate-200 truncate">
                            {name}
                          </span>
                        </div>
                        {changed && (
                          <span className="text-[8px] font-bold text-amber-400 bg-amber-950 border border-amber-800 px-1 py-0.5 rounded shrink-0">
                            CHANGED
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 ml-7 font-mono text-[9px] text-slate-500 space-y-0.5">
                        <div className={changed && fmt(coord?.lat) !== fmt(orig?.lat) ? "text-amber-400" : ""}>
                          lat: {fmt(coord?.lat ?? 0)}
                        </div>
                        <div className={changed && fmt(coord?.lng) !== fmt(orig?.lng) ? "text-amber-400" : ""}>
                          lng: {fmt(coord?.lng ?? 0)}
                        </div>
                      </div>
                      {changed && (
                        <span
                          onClick={(e) => { e.stopPropagation(); handleReset(name); }}
                          role="button"
                          tabIndex={0}
                          className="mt-1.5 ml-7 text-[9px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
                        >
                          reset
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {selected && selectedCoord && (
                <div className="shrink-0 p-4 border-t border-slate-800 bg-slate-950">
                  <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">Selected</p>
                  <p className="text-xs font-semibold text-slate-200 mb-2 leading-snug">{selected}</p>
                  <div className="font-mono text-[10px] text-emerald-400 space-y-1 bg-slate-900 rounded p-2 border border-slate-800">
                    <div>lat: {fmt(selectedCoord.lat)}</div>
                    <div>lng: {fmt(selectedCoord.lng)}</div>
                  </div>
                </div>
              )}
            </>
          )}

          { }
          {tab === "hints" && (
            <>
              <div className="px-3 py-2 border-b border-slate-800 text-[9px] text-slate-500">
                Select a segment, then click the map to place waypoints. Double-click a hint to remove it.
              </div>
              <div className="flex-1 overflow-y-auto">
                {SEGMENTS.map((seg, i) => {
                  const [a, b] = seg.split("|");
                  const fwdKey = seg;
                  const revKey = `${b}|${a}`;
                  const fwdCount = segHintCount(fwdKey);
                  const revCount = segHintCount(revKey);
                  const fwdSel = selectedSeg === fwdKey;
                  const revSel = selectedSeg === revKey;

                  return (
                    <div key={seg} className="border-b border-slate-800/60">
                      { }
                      <div className="flex items-center gap-2 px-4 pt-2.5 pb-1">
                        <span className="shrink-0 size-5 rounded flex items-center justify-center text-[8px] font-bold font-mono bg-slate-800 text-slate-400">
                          {i + 1}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 truncate">{a} ↔ {b}</span>
                      </div>

                      { }
                      <div className="flex gap-1 px-3 pb-2.5">
                        { }
                        <button
                          onClick={() => { setSelectedSeg(fwdKey); setHintAddMode(false); }}
                          className={`flex-1 flex items-center justify-between text-left px-2 py-1.5 rounded transition-colors ${fwdSel
                            ? "bg-violet-950 border border-violet-600"
                            : "bg-slate-800/60 border border-slate-700/60 hover:border-slate-500"
                            }`}
                        >
                          <span className={`text-[9px] font-medium truncate ${fwdSel ? "text-violet-200" : "text-slate-400"
                            }`}>
                            → {b}
                          </span>
                          {fwdCount > 0 && (
                            <span className="shrink-0 ml-1 text-[8px] font-bold text-violet-300 bg-violet-950 border border-violet-800 px-1 py-0.5 rounded">
                              {fwdCount}
                            </span>
                          )}
                        </button>

                        { }
                        <button
                          onClick={() => { setSelectedSeg(revKey); setHintAddMode(false); }}
                          className={`flex-1 flex items-center justify-between text-left px-2 py-1.5 rounded transition-colors ${revSel
                            ? "bg-amber-950 border border-amber-600"
                            : "bg-slate-800/60 border border-slate-700/60 hover:border-slate-500"
                            }`}
                        >
                          <span className={`text-[9px] font-medium truncate ${revSel ? "text-amber-200" : "text-slate-400"
                            }`}>
                            ← {a}
                          </span>
                          {revCount > 0 && (
                            <span className="shrink-0 ml-1 text-[8px] font-bold text-amber-300 bg-amber-950 border border-amber-800 px-1 py-0.5 rounded">
                              {revCount}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              { }
              {selectedSeg && (() => {
                const [selA, selB] = selectedSeg.split("|");
                const isForward = SEGMENTS.some((s) => s === selectedSeg);
                const accentCls = isForward ? "text-violet-300" : "text-amber-300";
                const dirLabel = `${selA} → ${selB}`;

                return (
                  <div className="shrink-0 p-3 border-t border-slate-800 bg-slate-950 space-y-2">
                    <p className="text-[9px] uppercase tracking-widest text-slate-500">
                      Editing {isForward ? "↗ northbound" : "↙ southbound"} segment
                    </p>
                    <p className={`text-[10px] font-semibold leading-snug ${accentCls}`}>
                      {dirLabel}
                    </p>
                    <p className="text-[9px] text-slate-500">
                      {segHintCount(selectedSeg)} hint point{segHintCount(selectedSeg) !== 1 ? "s" : ""}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setHintAddMode((v) => !v)}
                        className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all ${hintAddMode
                          ? "bg-amber-600 text-white"
                          : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                          }`}
                      >
                        {hintAddMode ? "✓ Adding… (click map)" : "+ Add Hints"}
                      </button>
                      <button
                        onClick={() => handleClearSegHints(selectedSeg)}
                        className="px-3 text-[10px] font-bold py-1.5 rounded bg-red-950 hover:bg-red-900 text-red-400 border border-red-900 transition-all"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </aside>

        { }
        <div className="flex-1 relative">
          <TerminalMapEditor
            coords={coords}
            selected={tab === "terminals" ? selected : null}
            onDrag={handleDrag}
            onSelect={tab === "terminals" ? setSelected : () => { }}
            hints={hints}
            selectedSegment={selectedSeg}
            hintEditMode={hintAddMode && tab === "hints"}
            onAddHint={handleAddHint}
            onDragHint={handleDragHint}
            onDeleteHint={handleDeleteHint}
          />
        </div>

        { }
        <aside className="w-80 shrink-0 border-l border-slate-800 flex flex-col bg-slate-900 overflow-hidden">
          { }
          <div className="flex shrink-0 border-b border-slate-800">
            <div className="flex items-center justify-between w-full px-4 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                TERMINAL_COORDINATES
              </span>
              <button
                onClick={() => handleCopy("coords")}
                className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${copied === "coords"
                  ? "bg-emerald-700 text-emerald-100"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                  }`}
              >
                {copied === "coords" ? "✓" : "Copy"}
              </button>
            </div>
          </div>
          <div className="h-1/2 overflow-y-auto border-b border-slate-800 p-2">
            <pre className="text-[8.5px] font-mono text-slate-400 leading-relaxed whitespace-pre-wrap break-all">
              {coordsCode}
            </pre>
          </div>

          { }
          <div className="flex shrink-0 border-b border-slate-800">
            <div className="flex items-center justify-between w-full px-4 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                ROUTE_HINTS
              </span>
              <button
                onClick={() => handleCopy("hints")}
                className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all ${copied === "hints"
                  ? "bg-violet-700 text-violet-100"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                  }`}
              >
                {copied === "hints" ? "✓" : "Copy"}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <pre className="text-[8.5px] font-mono text-violet-300 leading-relaxed whitespace-pre-wrap break-all">
              {hintsCode}
            </pre>
          </div>

          <div className="shrink-0 p-3 border-t border-slate-800">
            <p className="text-[9px] text-slate-600 leading-relaxed">
              Copy each block and paste into <code className="text-slate-400">lib/constants.ts</code>.
              Update matching coords in <code className="text-slate-400">convex/seed.ts</code> then re-run the seed.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
