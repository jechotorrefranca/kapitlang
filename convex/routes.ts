import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ─── Queries ────────────────────────────────────────────────────────────────

/**
 * Returns the pre-seeded road distance (in km) for a given origin→destination
 * terminal pair. Returns null if the pair hasn't been seeded yet.
 */
export const getRouteSegment = query({
  args: {
    origin: v.string(),
    destination: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("routeSegments")
      .withIndex("by_route", (q) =>
        q.eq("origin", args.origin).eq("destination", args.destination)
      )
      .unique();
  },
});

/**
 * Returns baseline simulation parameters for the given vehicle type ("jeepney" | "uv").
 */
export const getVehicleConfig = query({
  args: { vehicle: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vehicleConfig")
      .withIndex("by_vehicle", (q) => q.eq("vehicle", args.vehicle))
      .unique();
  },
});

/**
 * Returns the speed and wait multipliers for the given weather condition ("clear" | "rain").
 */
export const getWeatherModifier = query({
  args: { condition: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("weatherModifiers")
      .withIndex("by_condition", (q) => q.eq("condition", args.condition))
      .unique();
  },
});

/**
 * Returns all weather modifiers. Useful for the Settings page.
 */
export const getAllWeatherModifiers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("weatherModifiers").collect();
  },
});

/**
 * Returns all vehicle configs. Useful for the Settings page.
 */
export const getAllVehicleConfigs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vehicleConfig").collect();
  },
});

/**
 * Returns all simulation logs inside the database. Useful for the Routes page.
 */
export const getAllSimulationLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("simulationLogs").order("desc").collect();
  },
});

/**
 * Returns an individual system setting (like monte_carlo_tests).
 */
export const getSystemSetting = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("systemSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
  },
});

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Upserts a route segment distance. Used by the seed action.
 */
export const upsertRouteSegment = mutation({
  args: {
    origin: v.string(),
    destination: v.string(),
    distance_km: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("routeSegments")
      .withIndex("by_route", (q) =>
        q.eq("origin", args.origin).eq("destination", args.destination)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { distance_km: args.distance_km });
    } else {
      await ctx.db.insert("routeSegments", args);
    }
  },
});

/**
 * Upserts all vehicle config parameters. Used by the seed action.
 */
export const upsertVehicleConfig = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("vehicleConfig")
      .withIndex("by_vehicle", (q) => q.eq("vehicle", args.vehicle))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("vehicleConfig", args);
    }
  },
});

/**
 * Upserts a weather modifier entry. Used by the seed action.
 */
export const upsertWeatherModifier = mutation({
  args: {
    condition: v.string(),
    speed_factor: v.number(),
    wait_factor: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("weatherModifiers")
      .withIndex("by_condition", (q) => q.eq("condition", args.condition))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        speed_factor: args.speed_factor,
        wait_factor: args.wait_factor,
      });
    } else {
      await ctx.db.insert("weatherModifiers", args);
    }
  },
});

/**
 * Appends a simulation run to the historical log.
 * Called automatically after every successful simulation.
 */
export const logSimulation = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("simulationLogs", args);
  },
});

/**
 * Deletes ALL documents in routeSegments.
 * Call this before re-seeding when terminal names have changed.
 */
export const clearRouteSegments = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("routeSegments").collect();
    await Promise.all(all.map((doc) => ctx.db.delete(doc._id)));
    return { deleted: all.length };
  },
});

/**
 * Upserts a system-wide setting value. Used by the Settings page.
 */
export const upsertSystemSetting = mutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("systemSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("systemSettings", args);
    }
  },
});
