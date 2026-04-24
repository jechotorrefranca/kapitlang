"use client";
import { HIGHWAY_SEQUENCE } from "@/lib/constants";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
// @ts-expect-error internal leaflet
delete L.Icon.Default.prototype._getIconUrl;
interface Coord { lat: number; lng: number }
type LatLng = [number, number];
interface Props {
  coords: Record<string, Coord>;
  selected: string | null;
  onDrag: (name: string, lat: number, lng: number) => void;
  onSelect: (name: string) => void;
  hints: Record<string, Coord[]>;
  selectedSegment: string | null;
  hintEditMode: boolean;
  onAddHint: (segKey: string, lat: number, lng: number) => void;
  onDragHint: (segKey: string, idx: number, lat: number, lng: number) => void;
  onDeleteHint: (segKey: string, idx: number) => void;
}
function FlyTo({ target }: { target: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 17, { duration: 0.7 });
  }, [target, map]);
  return null;
}
function CoordDebug({ addMode }: { addMode: boolean }) {
  const [pos, setPos] = useState<Coord | null>(null);
  useMapEvents({
    mousemove: (e) => setPos({ lat: e.latlng.lat, lng: e.latlng.lng }),
    mouseout: () => setPos(null),
  });
  if (!pos) return null;
  return (
    <div style={{
      position: "absolute", bottom: 12, right: 12, zIndex: 1000,
      pointerEvents: "none",
      background: addMode ? "rgba(146,64,14,0.85)" : "rgba(0,0,0,0.75)",
      backdropFilter: "blur(6px)",
      color: addMode ? "#fde68a" : "#6ee7b7",
      fontFamily: "monospace", fontSize: 11, fontWeight: 700,
      padding: "4px 10px", borderRadius: 6,
      letterSpacing: "0.04em",
      border: addMode ? "1px solid rgba(251,191,36,0.4)" : "1px solid rgba(110,231,183,0.3)",
      whiteSpace: "nowrap",
    }}>
      {addMode ? "📍 " : ""}{pos.lat.toFixed(7)}, {pos.lng.toFixed(7)}
    </div>
  );
}
function MapClickHandler({
  active, segKey, onAdd,
}: { active: boolean; segKey: string | null; onAdd: Props["onAddHint"] }) {
  useMapEvents({
    click(e) {
      if (active && segKey) {
        onAdd(segKey, e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}
function TerminalMarker({
  name, index, coord, isSelected, isDimmed, onDrag, onSelect,
}: {
  name: string; index: number; coord: Coord;
  isSelected: boolean; isDimmed: boolean;
  onDrag: Props["onDrag"]; onSelect: Props["onSelect"];
}) {
  const icon = useMemo(() => {
    const size = isSelected ? 32 : isDimmed ? 18 : 22;
    const bg = isSelected ? "#059669" : isDimmed ? "#334155" : "#64748b";
    const border = isSelected ? "#d1fae5" : isDimmed ? "#475569" : "#94a3b8";
    const shadow = isSelected
      ? "0 0 0 3px rgba(5,150,105,0.35), 0 2px 8px rgba(0,0,0,0.4)"
      : "0 1px 4px rgba(0,0,0,0.4)";
    const opacity = isDimmed ? "0.5" : "1";
    return L.divIcon({
      html: `<div style="width:${size}px;height:${size}px;background:${bg};border:2px solid ${border};border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:${isSelected ? 12 : 9}px;font-weight:700;font-family:monospace;box-shadow:${shadow};cursor:grab;opacity:${opacity};">${index + 1}</div>`,
      className: "",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }, [isSelected, isDimmed, index]);
  return (
    <Marker
      position={[coord.lat, coord.lng]}
      icon={icon}
      draggable={!isDimmed}
      eventHandlers={{
        click: () => onSelect(name),
        dragend: (e) => { const { lat, lng } = e.target.getLatLng(); onDrag(name, lat, lng); },
      }}
    />
  );
}
function HintMarker({
  segKey, idx, coord, isActive, onDrag, onDelete,
}: {
  segKey: string; idx: number; coord: Coord;
  isActive: boolean;
  onDrag: Props["onDragHint"];
  onDelete: Props["onDeleteHint"];
}) {
  const icon = useMemo(() => {
    const size = isActive ? 22 : 14;
    const bg = isActive ? "#7c3aed" : "#4c1d95";
    const border = isActive ? "#c4b5fd" : "#6d28d9";
    return L.divIcon({
      html: `<div style="width:${size}px;height:${size}px;background:${bg};border:2px solid ${border};border-radius:3px;display:flex;align-items:center;justify-content:center;color:white;font-size:${isActive ? 9 : 7}px;font-weight:700;font-family:monospace;box-shadow:0 1px 4px rgba(0,0,0,0.5);cursor:grab;transform:rotate(45deg);"><span style="transform:rotate(-45deg)">${idx + 1}</span></div>`,
      className: "",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }, [isActive, idx]);
  return (
    <Marker
      position={[coord.lat, coord.lng]}
      icon={icon}
      draggable={isActive}
      eventHandlers={{
        dblclick: () => onDelete(segKey, idx),
        dragend: (e) => { const { lat, lng } = e.target.getLatLng(); onDrag(segKey, idx, lat, lng); },
      }}
    />
  );
}
async function fetchRouteGeometry(
  terminals: string[],
  coords: Record<string, Coord>,
  extraWaypoints: Coord[] = [],
): Promise<LatLng[]> {
  const termPts = terminals.map((n) => coords[n]).filter(Boolean);
  const allPts = extraWaypoints.length
    ? [termPts[0], ...extraWaypoints, termPts[termPts.length - 1]]
    : termPts;
  const waypointStr = allPts.map((c) => `${c.lng},${c.lat}`).join(";");
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${waypointStr}?geometries=geojson&overview=full`
  );
  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.[0]?.geometry?.coordinates) return [];
  return data.routes[0].geometry.coordinates.map(
    ([lng, lat]: [number, number]): LatLng => [lat, lng]
  );
}
const KNOWN_TERMINALS = HIGHWAY_SEQUENCE.filter((t) => t !== "Dropped Pin");
export default function TerminalMapEditor({
  coords, selected, onDrag, onSelect,
  hints, selectedSegment, hintEditMode, onAddHint, onDragHint, onDeleteHint,
}: Props) {
  const [routeLine, setRouteLine] = useState<LatLng[]>([]);
  const [segLine, setSegLine] = useState<LatLng[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const fullDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const segDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (fullDebounce.current) clearTimeout(fullDebounce.current);
    fullDebounce.current = setTimeout(async () => {
      setIsFetching(true);
      try { setRouteLine(await fetchRouteGeometry(KNOWN_TERMINALS, coords)); }
      catch { }
      finally { setIsFetching(false); }
    }, 600);
    return () => { if (fullDebounce.current) clearTimeout(fullDebounce.current); };
  }, [coords]);
  useEffect(() => {
    if (!selectedSegment) { setSegLine([]); return; }
    if (segDebounce.current) clearTimeout(segDebounce.current);
    segDebounce.current = setTimeout(async () => {
      const [a, b] = selectedSegment.split("|");
      const segHints = hints[selectedSegment] ?? [];
      try {
        const line = await fetchRouteGeometry([a, b], coords, segHints);
        setSegLine(line);
      } catch { }
    }, 400);
    return () => { if (segDebounce.current) clearTimeout(segDebounce.current); };
  }, [selectedSegment, hints, coords]);
  const flyTarget = useMemo((): LatLng | null => {
    if (!selected || !coords[selected]) return null;
    return [coords[selected].lat, coords[selected].lng];
  }, [selected, coords]);
  const segEndpoints = useMemo(() => {
    if (!selectedSegment) return new Set<string>();
    return new Set(selectedSegment.split("|"));
  }, [selectedSegment]);
  const hintEntries = useMemo(() =>
    Object.entries(hints).flatMap(([key, pts]) =>
      pts.map((coord, idx) => ({ key, idx, coord }))
    ), [hints]);
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[14.75, 120.95]}
        zoom={13}
        className={`h-full w-full ${hintEditMode ? "cursor-crosshair" : ""}`}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        { }
        {routeLine.length > 0 && (
          <>
            <Polyline positions={routeLine} pathOptions={{ color: "#10b981", weight: 10, opacity: 0.12, lineCap: "round", lineJoin: "round" }} />
            <Polyline positions={routeLine} pathOptions={{ color: "#059669", weight: 2.5, opacity: 0.5, lineCap: "round", lineJoin: "round", dashArray: "6 4" }} />
          </>
        )}
        { }
        {segLine.length > 0 && (
          <>
            <Polyline positions={segLine} pathOptions={{ color: "#7c3aed", weight: 12, opacity: 0.2, lineCap: "round", lineJoin: "round" }} />
            <Polyline positions={segLine} pathOptions={{ color: "#a78bfa", weight: 4, opacity: 1, lineCap: "round", lineJoin: "round" }} />
          </>
        )}
        { }
        {[...segEndpoints].map((name) => {
          const c = coords[name];
          if (!c) return null;
          return (
            <CircleMarker
              key={`seg-ring-${name}`}
              center={[c.lat, c.lng]}
              radius={18}
              pathOptions={{ color: "#a78bfa", weight: 2, opacity: 0.7, fillOpacity: 0 }}
            />
          );
        })}
        { }
        {KNOWN_TERMINALS.map((name, index) => {
          const coord = coords[name];
          if (!coord) return null;
          const isDimmed = selectedSegment !== null && !segEndpoints.has(name);
          return (
            <TerminalMarker
              key={name}
              name={name}
              index={index}
              coord={coord}
              isSelected={selected === name}
              isDimmed={isDimmed && hintEditMode}
              onDrag={onDrag}
              onSelect={onSelect}
            />
          );
        })}
        { }
        {hintEntries.map(({ key, idx, coord }) => (
          <HintMarker
            key={`hint-${key}-${idx}`}
            segKey={key}
            idx={idx}
            coord={coord}
            isActive={key === selectedSegment}
            onDrag={onDragHint}
            onDelete={onDeleteHint}
          />
        ))}
        { }
        <MapClickHandler
          active={hintEditMode}
          segKey={selectedSegment}
          onAdd={onAddHint}
        />
        <FlyTo target={flyTarget} />
        <CoordDebug addMode={hintEditMode} />
      </MapContainer>
      { }
      {isFetching && (
        <div style={{
          position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
          zIndex: 1000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
          color: "#6ee7b7", fontFamily: "monospace", fontSize: 10, fontWeight: 700,
          padding: "4px 12px", borderRadius: 20,
          border: "1px solid rgba(110,231,183,0.3)", whiteSpace: "nowrap",
          letterSpacing: "0.04em",
        }}>
          ⟳ Updating route…
        </div>
      )}
      { }
      {hintEditMode && selectedSegment && (
        <div style={{
          position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
          zIndex: 1000, background: "rgba(109,40,217,0.85)", backdropFilter: "blur(6px)",
          color: "#ede9fe", fontFamily: "monospace", fontSize: 10, fontWeight: 700,
          padding: "5px 14px", borderRadius: 20,
          border: "1px solid rgba(196,181,253,0.4)", whiteSpace: "nowrap",
          letterSpacing: "0.04em",
        }}>
          📍 Click map to add hint · Double-click hint ◆ to remove
        </div>
      )}
    </div>
  );
}
