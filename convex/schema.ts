import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Pre-computed road distances between all terminal pairs along MacArthur Highway.
  // Populated once by the seedDatabase action via OSRM.
  routeSegments: defineTable({
    origin: v.string(),
    destination: v.string(),
    distance_km: v.number(),
  }).index("by_route", ["origin", "destination"]),

  // Baseline simulation parameters per vehicle type.
  // These drive the Monte Carlo engine's stochastic rules.
  vehicleConfig: defineTable({
    vehicle: v.string(),           // "jeepney" | "uv"
    capacity: v.number(),          // max passenger capacity
    base_speed_kph: v.number(),    // average road speed (km/h)
    peak_min_wait: v.number(),     // min terminal wait during peak hours (min)
    peak_max_wait: v.number(),     // max terminal wait during peak hours (min)
    offpeak_min_wait: v.number(),  // min terminal wait during off-peak (min)
    offpeak_max_wait: v.number(),  // max terminal wait during off-peak (min)
    min_stops: v.number(),         // minimum en-route passenger stops
    max_stops: v.number(),         // maximum en-route passenger stops
    min_stop_delay: v.number(),    // min delay per stop (min)
    max_stop_delay: v.number(),    // max delay per stop (min)
  }).index("by_vehicle", ["vehicle"]),

  // Environmental speed and wait multipliers per weather condition.
  weatherModifiers: defineTable({
    condition: v.string(),         // "clear" | "rain"
    speed_factor: v.number(),      // multiplier applied to base_speed_kph
    wait_factor: v.number(),       // multiplier applied to terminal wait time
  }).index("by_condition", ["condition"]),

  // Historical log of every simulation run for building a dataset over time.
  simulationLogs: defineTable({
    origin: v.string(),
    destination: v.string(),
    originLat: v.optional(v.number()),
    originLng: v.optional(v.number()),
    destLat: v.optional(v.number()),
    destLng: v.optional(v.number()),
    vehicle: v.string(),
    weather: v.string(),
    time: v.string(),
    distance_km: v.number(),
    result_min: v.number(),
    result_max: v.number(),
    result_avg: v.number(),
  }),

  // System-wide application settings (e.g., number of Monte Carlo tests).
  systemSettings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),
});

