import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
export const getVehicleConfig = query({
  args: { vehicle: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vehicleConfig")
      .withIndex("by_vehicle", (q) => q.eq("vehicle", args.vehicle))
      .unique();
  },
});
export const getWeatherModifier = query({
  args: { condition: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("weatherModifiers")
      .withIndex("by_condition", (q) => q.eq("condition", args.condition))
      .unique();
  },
});
export const getAllWeatherModifiers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("weatherModifiers").collect();
  },
});
export const getAllVehicleConfigs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vehicleConfig").collect();
  },
});
export const getAllSimulationLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("simulationLogs").order("desc").collect();
  },
});
export const getRecentSimulationLogs = query({
  args: { limit: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.query("simulationLogs").order("desc").take(args.limit);
  },
});
export const getPaginatedSimulationLogs = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    vehicle: v.optional(v.string()),
    weather: v.optional(v.string()),
    origin: v.optional(v.string()),
    destination: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("simulationLogs");
    if (args.vehicle) {
      q = q.filter((f) => f.eq(f.field("vehicle"), args.vehicle));
    }
    if (args.weather) {
      q = q.filter((f) => f.eq(f.field("weather"), args.weather));
    }
    if (args.origin) {
      q = q.filter((f) => f.eq(f.field("origin"), args.origin));
    }
    if (args.destination) {
      q = q.filter((f) => f.eq(f.field("destination"), args.destination));
    }
    return await q.order("desc").paginate(args.paginationOpts);
  },
});
export const getSystemSetting = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("systemSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
  },
});
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
    return await ctx.db.insert("simulationLogs", args);
  },
});
export const clearRouteSegments = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("routeSegments").collect();
    await Promise.all(all.map((doc) => ctx.db.delete(doc._id)));
    return { deleted: all.length };
  },
});
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
export const getTotalSimulationLogsCount = query({
  args: {
    vehicle: v.optional(v.string()),
    weather: v.optional(v.string()),
    origin: v.optional(v.string()),
    destination: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("simulationLogs");
    if (args.vehicle) {
      q = q.filter((f) => f.eq(f.field("vehicle"), args.vehicle));
    }
    if (args.weather) {
      q = q.filter((f) => f.eq(f.field("weather"), args.weather));
    }
    if (args.origin) {
      q = q.filter((f) => f.eq(f.field("origin"), args.origin));
    }
    if (args.destination) {
      q = q.filter((f) => f.eq(f.field("destination"), args.destination));
    }
    const all = await q.collect();
    return all.length;
  },
});

// Chaos Factors
export const getChaosFactors = query({
  handler: async (ctx) => {
    return await ctx.db.query("chaosFactors").collect();
  },
});

export const getDistinctRoutePairs = query({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db.query("simulationLogs").collect();
    const seen = new Set<string>();
    const pairs: { origin: string; destination: string; count: number; latestAvg: number; latestMin: number; latestMax: number }[] = [];
    for (const log of logs) {
      const key = `${log.origin}|${log.destination}`;
      if (!seen.has(key)) {
        seen.add(key);
        const routeLogs = logs.filter((l) => l.origin === log.origin && l.destination === log.destination);
        const latest = routeLogs[routeLogs.length - 1];
        pairs.push({
          origin: log.origin,
          destination: log.destination,
          count: routeLogs.length,
          latestAvg: latest?.result_avg ?? 0,
          latestMin: latest?.result_min ?? 0,
          latestMax: latest?.result_max ?? 0,
        });
      }
    }
    return pairs;
  },
});

export const getSimulationLogsByRoute = query({
  args: {
    origin: v.string(),
    destination: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("simulationLogs").collect();
    return logs
      .filter((l) => l.origin === args.origin && l.destination === args.destination)
      .sort((a, b) => a._creationTime - b._creationTime);
  },
});

export const getSimulationLogById = query({
  args: { id: v.id("simulationLogs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const upsertChaosFactor = mutation({
  args: {
    key: v.string(),
    enabled: v.boolean(),
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("chaosFactors")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { enabled: args.enabled, value: args.value });
    } else {
      await ctx.db.insert("chaosFactors", {
        key: args.key,
        enabled: args.enabled,
        value: args.value,
      });
    }
  },
});

// Insights Traffic Modifiers
export const getInsightsModifiers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("insightsModifiers").collect();
  },
});

export const upsertInsightsModifier = mutation({
  args: {
    day: v.string(),
    congestion: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("insightsModifiers")
      .withIndex("by_day", (q) => q.eq("day", args.day))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { congestion: args.congestion });
    } else {
      await ctx.db.insert("insightsModifiers", args);
    }
  },
});
