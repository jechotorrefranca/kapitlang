export interface VehicleFactors {
  base_travel_min:    number | null;
  avg_wait_min:       number | null;
  avg_stop_delay_min: number | null;
  weather_factor:     number;
  speed_kph:          number | null;
  capacity:           number | null;
}

export interface ChaosEvent {
  name: string;
  count: number;
  avg_time_added: number;
}

export interface SimulationFactors {
  base_travel_min: number;
  avg_wait_min: number;
  avg_stop_delay_min: number;
  weather_factor: number;
  speed_kph?: number;
  capacity?: number;
  chaos_events?: ChaosEvent[] | null;
}

export interface SimulationResult {
  min: number;
  max: number;
  avg: number;
  distance_km: number;
  vehicle: string;
  weather: string;
  factors: SimulationFactors;
  is_experimental?: boolean;
  iterations?: number;
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