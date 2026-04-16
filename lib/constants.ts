export type TerminalName = "Bocaue" | "Marilao" | "Meycauayan" | "Manila";

export interface Coordinate {
  lat: number;
  lng: number;
}

export const TERMINAL_COORDINATES: Record<TerminalName, Coordinate> = {
  Bocaue: { lat: 14.809, lng: 120.923 },
  Marilao: { lat: 14.761, lng: 120.957 },
  Meycauayan: { lat: 14.733, lng: 120.963 },
  Manila: { lat: 14.657, lng: 120.984 },
};

export const DEFAULT_ORIGIN: TerminalName = "Bocaue";
export const DEFAULT_DESTINATION: TerminalName = "Meycauayan";
