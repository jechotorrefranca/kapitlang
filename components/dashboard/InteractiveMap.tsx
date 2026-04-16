"use client";

import { LocationState } from "@/lib/constants";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";

// Fix for default Leaflet icon not appearing
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
}

function MapController({ 
  pinMode, 
  onOriginUpdate, 
  onDestinationUpdate, 
  onPinComplete,
  shouldLocate,
  onLocateComplete
}: InteractiveMapProps) {
  const map = useMap();

  // Handling geolocation
  useEffect(() => {
    if (shouldLocate) {
      map.locate({ setView: true, maxZoom: 16 });
    }
  }, [shouldLocate, map]);

  useMapEvents({
    click(e) {
      if (pinMode === "origin") {
        onOriginUpdate(e.latlng.lat, e.latlng.lng);
        onPinComplete();
      } else if (pinMode === "destination") {
        onDestinationUpdate(e.latlng.lat, e.latlng.lng);
        onPinComplete();
      }
    },
    locationfound(e) {
      onLocateComplete(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function InteractiveMap(props: InteractiveMapProps) {
  const { origin, destination, onOriginUpdate, onDestinationUpdate } = props;
  const [routeData, setRouteData] = useState<[number, number][]>([]);

  // Fetch route from OSRM
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.coords.lng},${origin.coords.lat};${destination.coords.lng},${destination.coords.lat}?geometries=geojson&overview=full`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.code === "Ok" && data.routes?.[0]?.geometry?.coordinates) {
          // OSRM returns [lng, lat], Leaflet needs [lat, lng]
          const coords = data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
          setRouteData(coords);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [origin.coords, destination.coords]);

  // Custom emerald pin icon for Origin (Solid Fill)
  const originIcon = useMemo(() => L.divIcon({
    html: `
      <div class="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600 drop-shadow-md">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3" fill="white"/>
        </svg>
      </div>
    `,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 36] // Tip at the bottom center
  }), []);

  // Custom dark pin icon for Destination (Solid Fill)
  const destIcon = useMemo(() => L.divIcon({
    html: `
      <div class="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-800 drop-shadow-md">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3" fill="white"/>
        </svg>
      </div>
    `,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 36] // Tip at the bottom center
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
      
      {/* Route Line with Glow Effect */}
      {routeData.length > 0 && (
        <>
          {/* Outer Glow */}
          <Polyline 
            positions={routeData} 
            pathOptions={{ 
              color: "#10b981", // emerald-500
              weight: 10,
              opacity: 0.3,
              lineCap: "round",
              lineJoin: "round",
            }} 
          />
          {/* Inner Sharp Line */}
          <Polyline 
            positions={routeData} 
            pathOptions={{ 
              color: "#059669", // emerald-600
              weight: 4,
              opacity: 1,
              lineCap: "round",
              lineJoin: "round",
            }} 
          />
        </>
      )}
      
      <Marker 
        position={[origin.coords.lat, origin.coords.lng]} 
        icon={originIcon} 
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            onOriginUpdate(position.lat, position.lng);
          },
        }}
      />
      
      <Marker 
        position={[destination.coords.lat, destination.coords.lng]} 
        icon={destIcon} 
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            onDestinationUpdate(position.lat, position.lng);
          },
        }}
      />

      <MapController {...props} />
    </MapContainer>
  );
}
