"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { TERMINAL_COORDINATES, TerminalName } from "@/lib/constants";

// Fix for default Leaflet icon not appearing
// @ts-expect-error - internal leaflet property
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface InteractiveMapProps {
  origin: TerminalName;
  destination: TerminalName;
}

function MapController({ origin, destination }: InteractiveMapProps) {
  const map = useMap();

  useEffect(() => {
    const originCoords = TERMINAL_COORDINATES[origin];
    const destCoords = TERMINAL_COORDINATES[destination];

    if (originCoords && destCoords) {
      const bounds = L.latLngBounds(
        [originCoords.lat, originCoords.lng],
        [destCoords.lat, destCoords.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [origin, destination, map]);

  return null;
}

export default function InteractiveMap({ origin, destination }: InteractiveMapProps) {
  const originCoords = TERMINAL_COORDINATES[origin];
  const destCoords = TERMINAL_COORDINATES[destination];

  // Custom emerald icon for Origin
  const originIcon = useMemo(() => L.divIcon({
    className: "bg-emerald-600 rounded-full border-2 border-white shadow-lg",
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  }), []);

  // Custom dark icon for Destination
  const destIcon = useMemo(() => L.divIcon({
    className: "bg-zinc-800 rounded-full border-2 border-white shadow-lg",
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  }), []);

  return (
    <MapContainer
      center={[14.75, 120.95]}
      zoom={12}
      className="h-full w-full z-0"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      />
      
      {originCoords && (
        <Marker position={[originCoords.lat, originCoords.lng]} icon={originIcon} />
      )}
      
      {destCoords && (
        <Marker position={[destCoords.lat, destCoords.lng]} icon={destIcon} />
      )}

      <MapController origin={origin} destination={destination} />
    </MapContainer>
  );
}
