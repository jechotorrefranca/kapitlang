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

export interface VehicleConfig {
  vehicle: string;
  capacity: number;
  base_speed_kph: number;
  peak_min_wait: number;
  peak_max_wait: number;
  offpeak_min_wait: number;
  offpeak_max_wait: number;
  min_stops: number;
  max_stops: number;
  min_stop_delay: number;
  max_stop_delay: number;
}

export interface WeatherModifier {
  condition: string;
  speed_factor: number;
  wait_factor: number;
}