export type TerminalName = 
  | "Valenzuela (Monumento)"
  | "Meycauayan (Junction)" 
  | "Marilao (Poblacion)" 
  | "SM City Marilao" 
  | "Lolomboy (Bocaue South)" 
  | "Bocaue (Crossing)" 
  | "Turo (Bocaue North)" 
  | "Balagtas (Crossing)" 
  | "Tabang (Guiguinto)" 
  | "Tikay (Malolos Entrance)" 
  | "Malolos (Crossing)" 
  | "Longos (Malolos North)" 
  | "Calumpit (Bridge)"
  | "Custom PIN";

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface LocationState {
  name: TerminalName;
  coords: Coordinate;
}

// Hyper-precise MacArthur Highway anchor points
export const TERMINAL_COORDINATES: Record<Exclude<TerminalName, "Custom PIN">, Coordinate> = {
  "Valenzuela (Monumento)": { lat: 14.6573, lng: 120.9841 },
  "Meycauayan (Junction)": { lat: 14.7369, lng: 120.9608 },
  "Marilao (Poblacion)": { lat: 14.7450, lng: 120.9580 },
  "SM City Marilao": { lat: 14.7541, lng: 120.9561 },
  "Lolomboy (Bocaue South)": { lat: 14.7796, lng: 120.9332 },
  "Bocaue (Crossing)": { lat: 14.8056, lng: 120.9357 },
  "Turo (Bocaue North)": { lat: 14.8180, lng: 120.9375 },
  "Balagtas (Crossing)": { lat: 14.8227, lng: 120.9130 },
  "Tabang (Guiguinto)": { lat: 14.8385, lng: 120.8753 },
  "Tikay (Malolos Entrance)": { lat: 14.8423, lng: 120.8532 },
  "Malolos (Crossing)": { lat: 14.8515321, lng: 120.8159491 },
  "Longos (Malolos North)": { lat: 14.8710, lng: 120.7950 },
  "Calumpit (Bridge)": { lat: 14.9142801, lng: 120.7634356 },
};

// Source of Truth for the MacArthur Highway sequence (South to North)
export const HIGHWAY_SEQUENCE: TerminalName[] = [
  "Valenzuela (Monumento)",
  "Meycauayan (Junction)",
  "Marilao (Poblacion)",
  "SM City Marilao",
  "Lolomboy (Bocaue South)",
  "Bocaue (Crossing)",
  "Turo (Bocaue North)",
  "Balagtas (Crossing)",
  "Tabang (Guiguinto)",
  "Tikay (Malolos Entrance)",
  "Malolos (Crossing)",
  "Longos (Malolos North)",
  "Calumpit (Bridge)"
];

// All landmarks are visible in the refined route model
export const UI_TOWNS: TerminalName[] = HIGHWAY_SEQUENCE;

export const DEFAULT_ORIGIN: LocationState = {
  name: "Bocaue (Crossing)",
  coords: TERMINAL_COORDINATES["Bocaue (Crossing)"],
};

export const DEFAULT_DESTINATION: LocationState = {
  name: "Meycauayan (Junction)",
  coords: TERMINAL_COORDINATES["Meycauayan (Junction)"],
};

// Helper to find preset name for coords
export const getPresetName = (lat: number, lng: number): TerminalName => {
  const match = Object.entries(TERMINAL_COORDINATES).find(([_, coords]) => {
    return Math.abs(coords.lat - lat) < 0.0001 && Math.abs(coords.lng - lng) < 0.0001;
  });
  return match ? (match[0] as TerminalName) : "Custom PIN";
};