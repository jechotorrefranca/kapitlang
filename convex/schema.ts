import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  routeSegments: defineTable({
    origin: v.string(),
    destination: v.string(),
    distance_km: v.number(),
  }).index("by_route", ["origin", "destination"]),
  vehicleConfig: defineTable({
    vehicle: v.string(),
    capacity: v.number(),
    base_speed_kph: v.number(),
    peak_min_wait: v.number(),
    peak_max_wait: v.number(),
    offpeak_min_wait: v.number(),
    offpeak_max_wait: v.number(),
    min_stops: v.number(),
    max_stops: v.number(),
    min_stop_delay: v.number(),
    max_stop_delay: v.number(),
  }).index("by_vehicle", ["vehicle"]),
  weatherModifiers: defineTable({
    condition: v.string(),
    speed_factor: v.number(),
    wait_factor: v.number(),
  }).index("by_condition", ["condition"]),
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
  systemSettings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),
  chaosFactors: defineTable({
    key: v.string(),
    enabled: v.boolean(),
    value: v.number(), // percentage or minutes
  }).index("by_key", ["key"]),
});
