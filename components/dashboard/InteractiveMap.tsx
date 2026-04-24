"use client";
import { LocationState } from "@/lib/constants";
import { buildRouteWaypoints, Coord } from "@/lib/routing";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
// @ts-expect-error - internal leaflet property
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});
interface InteractiveMapProps {
  origin: LocationState;
  destination: LocationState;
  onOriginUpdate: (lat: number, lng: number) => void;
  onDestinationUpdate: (lat: number, lng: number) => void;
  pinMode: "origin" | "destination" | null;
  onPinComplete: () => void;
  shouldLocate: boolean;
  onLocateComplete: (lat: number, lng: number) => void;
  onZoomReady?: (zoomIn: () => void, zoomOut: () => void) => void;
}
function MapController({
  pinMode,
  onOriginUpdate,
  onDestinationUpdate,
  onPinComplete,
  shouldLocate,
  onLocateComplete,
  onZoomReady,
}: InteractiveMapProps) {
  const map = useMap();
  useEffect(() => {
    if (shouldLocate) map.locate({ setView: true, maxZoom: 16 });
  }, [shouldLocate, map]);
  useEffect(() => {
    onZoomReady?.(() => map.zoomIn(), () => map.zoomOut());
  }, [map, onZoomReady]);
  useMapEvents({
    click(e) {
      if (pinMode === "origin") { onOriginUpdate(e.latlng.lat, e.latlng.lng); onPinComplete(); }
      else if (pinMode === "destination") { onDestinationUpdate(e.latlng.lat, e.latlng.lng); onPinComplete(); }
    },
    locationfound(e) { onLocateComplete(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}
function CoordDebug() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  useMapEvents({
    mousemove(e) { setCoords({ lat: e.latlng.lat, lng: e.latlng.lng }); },
    mouseout() { setCoords(null); },
  });
  if (!coords) return null;
  return (
    <div style={{
      position: "absolute", bottom: 32, right: 12, zIndex: 10,
      pointerEvents: "none", background: "rgba(0,0,0,0.65)",
      backdropFilter: "blur(4px)", color: "#6ee7b7",
      fontFamily: "monospace", fontSize: 11, fontWeight: 700,
      padding: "4px 10px", borderRadius: 6,
      letterSpacing: "0.04em", border: "1px solid rgba(110,231,183,0.25)",
      whiteSpace: "nowrap",
    }}>
      {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
    </div>
  );
}
function buildWaypoints(
  originName: string,
  originCoords: Coord,
  destName: string,
  destCoords: Coord,
): string[] {
  return buildRouteWaypoints(originName, originCoords, destName, destCoords);
}
type LatLng = [number, number];
export default function InteractiveMap(props: InteractiveMapProps) {
  const { origin, destination, onOriginUpdate, onDestinationUpdate } = props;
  const [routeData, setRouteData] = useState<LatLng[]>([]);
  useEffect(() => {
    if (!origin.coords || !destination.coords) return;
    const fetchRoute = async () => {
      try {
        const waypointParts = buildWaypoints(
          origin.name, origin.coords,
          destination.name, destination.coords
        );
        const waypointStr = waypointParts.join(";");
        const url = `https://router.project-osrm.org/route/v1/driving/${waypointStr}?geometries=geojson&overview=full`;
        console.log(
          `[OSRM] ${origin.name} → ${destination.name}`,
          `\nWaypoints (${waypointParts.length}):`, waypointParts,
          `\nURL:`, url
        );
        const res = await fetch(url);
        const data = await res.json();
        if (data.code === "Ok" && data.routes?.[0]?.geometry?.coordinates) {
          setRouteData(
            data.routes[0].geometry.coordinates.map(
              ([lng, lat]: [number, number]): LatLng => [lat, lng]
            )
          );
        } else {
          console.warn("[OSRM] Routing failed:", data);
        }
      } catch (err) {
        console.error("[OSRM] Fetch error:", err);
      }
    };
    fetchRoute();
  }, [origin.coords, destination.coords, origin.name, destination.name]);
  const originIcon = useMemo(() => L.divIcon({
    html: `
      <div class="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600 drop-shadow-md">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3" fill="white"/>
        </svg>
      </div>
    `,
    className: "", iconSize: [36, 36], iconAnchor: [18, 36],
  }), []);
  const destIcon = useMemo(() => L.divIcon({
    html: `
      <div class="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-800 drop-shadow-md">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3" fill="white"/>
        </svg>
      </div>
    `,
    className: "", iconSize: [36, 36], iconAnchor: [18, 36],
  }), []);
  return (
    <MapContainer
      center={[14.75, 120.95]}
      zoom={12}
      className="h-full w-full z-0 cursor-crosshair"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      {routeData.length > 0 && (
        <>
          <Polyline positions={routeData} pathOptions={{ color: "#10b981", weight: 10, opacity: 0.3, lineCap: "round", lineJoin: "round" }} />
          <Polyline positions={routeData} pathOptions={{ color: "#059669", weight: 4, opacity: 1, lineCap: "round", lineJoin: "round" }} />
        </>
      )}
      <Marker
        position={[origin.coords.lat, origin.coords.lng]}
        icon={originIcon}
        draggable={true}
        eventHandlers={{ dragend: (e) => { const p = e.target.getLatLng(); onOriginUpdate(p.lat, p.lng); } }}
      />
      <Marker
        position={[destination.coords.lat, destination.coords.lng]}
        icon={destIcon}
        draggable={true}
        eventHandlers={{ dragend: (e) => { const p = e.target.getLatLng(); onDestinationUpdate(p.lat, p.lng); } }}
      />
      <MapController {...props} />
      <CoordDebug />
    </MapContainer>
  );
}
