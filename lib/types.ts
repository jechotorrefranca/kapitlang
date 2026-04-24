// lib/types.ts

export type VehicleType = "jeepney" | "uv";
export type WeatherType = "sunny" | "rain";

export type SimulationInput = {
    origin: string;
    destination: string;
    vehicle: VehicleType;
    time: string; // 24-hour time
    weather: WeatherType;
};

export type SimulationResult = {
    min: number;
    max: number;
    avg: number;
};

export type Route = {
    origin: string;
    destination: string;
    distance_km: number;
};

export type VehicleConfig = {
    type: VehicleType;
    capacity: number;
    stopDelayMin: number;
    stopDelayMax: number;
};