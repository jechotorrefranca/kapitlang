export type TerminalName =
  | "Valenzuela (Monumento)"
  | "Our Lady of Fatima University"
  | "Malanday"
  | "Meycauayan (Malhacan)"
  | "SM City Marilao"
  | "Marilao (Crossing)"
  | "Bocaue (Joners)"
  | "Bocaue (Crossing)"
  | "Balagtas (Intercity)"
  | "Balagtas (Palengke)"
  | "Guiguinto (Krus)"
  | "Guiguinto-Malolos Arch"
  | "Malolos (Tikay)"
  | "Malolos (Robinsons)"
  | "Malolos (Crossing)"
  | "Bulacan State University"
  | "Centro Escolar University"
  | "Calumpit (Bridge)"
  | "Dropped Pin";

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface LocationState {
  name: TerminalName;
  coords: Coordinate;
}

export const TERMINAL_COORDINATES: Record<Exclude<TerminalName, "Dropped Pin">, Coordinate> = {
  "Valenzuela (Monumento)": { lat: 14.6576030, lng: 120.9840524 },
  "Our Lady of Fatima University": { lat: 14.6806000, lng: 120.9791000 },
  "Malanday": { lat: 14.7179000, lng: 120.9572000 },
  "Meycauayan (Malhacan)": { lat: 14.7376000, lng: 120.9608000 },
  "SM City Marilao": { lat: 14.7543000, lng: 120.9542000 },
  "Marilao (Crossing)": { lat: 14.7626718, lng: 120.9474775 },
  "Bocaue (Joners)": { lat: 14.7805467, lng: 120.9357406 },
  "Bocaue (Crossing)": { lat: 14.7975000, lng: 120.9291000 },
  "Balagtas (Intercity)": { lat: 14.8056000, lng: 120.9193000 },
  "Balagtas (Palengke)": { lat: 14.8207519, lng: 120.9033817 },
  "Guiguinto (Krus)": { lat: 14.8284000, lng: 120.8844000 },
  "Guiguinto-Malolos Arch": { lat: 14.8392131, lng: 120.8595336 },
  "Malolos (Tikay)": { lat: 14.8425629, lng: 120.8445668 },
  "Malolos (Robinsons)": { lat: 14.8492727, lng: 120.8241607 },
  "Malolos (Crossing)": { lat: 14.8527157, lng: 120.8159423 },
  "Bulacan State University": { lat: 14.8563764, lng: 120.8127236 },
  "Centro Escolar University": { lat: 14.8702000, lng: 120.8004000 },
  "Calumpit (Bridge)": { lat: 14.9189000, lng: 120.7658000 },
};

export const HIGHWAY_SEQUENCE: TerminalName[] = [
  "Valenzuela (Monumento)",
  "Our Lady of Fatima University",
  "Malanday",
  "Meycauayan (Malhacan)",
  "SM City Marilao",
  "Marilao (Crossing)",
  "Bocaue (Joners)",
  "Bocaue (Crossing)",
  "Balagtas (Intercity)",
  "Balagtas (Palengke)",
  "Guiguinto (Krus)",
  "Guiguinto-Malolos Arch",
  "Malolos (Tikay)",
  "Malolos (Robinsons)",
  "Malolos (Crossing)",
  "Bulacan State University",
  "Centro Escolar University",
  "Calumpit (Bridge)",
];

export const UI_TOWNS: TerminalName[] = HIGHWAY_SEQUENCE;

export const DEFAULT_ORIGIN: LocationState = {
  name: "Bocaue (Crossing)",
  coords: TERMINAL_COORDINATES["Bocaue (Crossing)"],
};

export const DEFAULT_DESTINATION: LocationState = {
  name: "SM City Marilao",
  coords: TERMINAL_COORDINATES["SM City Marilao"],
};

export const getPresetName = (lat: number, lng: number): TerminalName => {
  const match = Object.entries(TERMINAL_COORDINATES).find(([_, coords]) => {
    return Math.abs(coords.lat - lat) < 0.0001 && Math.abs(coords.lng - lng) < 0.0001;
  });
  return match ? (match[0] as TerminalName) : "Dropped Pin";
};

export const ROUTE_HINTS: Record<string, Coordinate[]> = {
  "SM City Marilao|Marilao (Crossing)": [
    { lat: 14.7599000, lng: 120.9505000 },
  ],
  "Marilao (Crossing)|Bocaue (Joners)": [
    { lat: 14.7682015, lng: 120.9422850 },
    { lat: 14.7745505, lng: 120.9390448 },
  ],
  "Guiguinto (Krus)|Guiguinto-Malolos Arch": [
    { lat: 14.8371181, lng: 120.8629990 },
    { lat: 14.8398146, lng: 120.8622694 },
    { lat: 14.8388605, lng: 120.8630097 },
    { lat: 14.8389331, lng: 120.8612287 },
    { lat: 14.8391404, lng: 120.8599520 },
  ],
  "Guiguinto-Malolos Arch|Guiguinto (Krus)": [
    { lat: 14.8390440, lng: 120.8602157 },
    { lat: 14.8387744, lng: 120.8612515 },
    { lat: 14.8378876, lng: 120.8616433 },
    { lat: 14.8370528, lng: 120.8630387 },
  ],
};

