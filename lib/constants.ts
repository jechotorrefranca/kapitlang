export type TerminalName = 
  | "Valenzuela"
  | "Meycauayan" 
  | "Marilao" 
  | "Bocaue" 
  | "Balagtas" 
  | "Guiguinto" 
  | "Malolos" 
  | "Calumpit"
  | "Custom PIN";

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface LocationState {
  name: TerminalName;
  coords: Coordinate;
}

export const TERMINAL_COORDINATES: Record<Exclude<TerminalName, "Custom PIN">, Coordinate> = {
  Valenzuela: { lat: 14.6573, lng: 120.9841 },
  Meycauayan: { lat: 14.7370761, lng: 120.9609312 },
  Marilao: { lat: 14.7541914, lng: 120.9565916 },
  Bocaue: { lat: 14.8009303, lng: 120.9321208 },
  Balagtas: { lat: 14.8178386, lng: 120.9064569 },
  Guiguinto: { lat: 14.8329683, lng: 120.8805214 },
  Malolos: { lat: 14.8515321, lng: 120.8159491 },
  Calumpit: { lat: 14.9142801, lng: 120.7634356 },
};

export const DEFAULT_ORIGIN: LocationState = {
  name: "Bocaue",
  coords: TERMINAL_COORDINATES.Bocaue,
};

export const DEFAULT_DESTINATION: LocationState = {
  name: "Meycauayan",
  coords: TERMINAL_COORDINATES.Meycauayan,
};

// Helper to find preset name for coords
export const getPresetName = (lat: number, lng: number): TerminalName => {
  const match = Object.entries(TERMINAL_COORDINATES).find(([_, coords]) => {
    return Math.abs(coords.lat - lat) < 0.0001 && Math.abs(coords.lng - lng) < 0.0001;
  });
  return match ? (match[0] as TerminalName) : "Custom PIN";
};
