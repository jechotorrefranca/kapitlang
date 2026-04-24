export interface VehicleFactors {
  base_travel_min:    number | null;
  avg_wait_min:       number | null;
  avg_stop_delay_min: number | null;
  weather_factor:     number;
  speed_kph:          number | null;
  capacity:           number | null;
}

export interface SimulationResult {
  min: number;
  max: number;
  avg: number;
  distance_km: number;
  vehicle: "jeepney" | "uv";
  weather: "clear" | "rain";
  factors: VehicleFactors;
}