import { action } from "./_generated/server";
import { api } from "./_generated/api";

// ─── MacArthur Highway Terminal Data ─────────────────────────────────────────
// Must mirror TERMINAL_COORDINATES and HIGHWAY_SEQUENCE in lib/constants.ts

const TERMINAL_NAMES = [
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
] as const;

const TERMINAL_COORDS: Record<string, { lat: number; lng: number }> = {
  "Valenzuela (Monumento)": { lat: 14.6576030, lng: 120.9840524 },
  "Our Lady of Fatima University": { lat: 14.6806000, lng: 120.9791000 },
  "Malanday":               { lat: 14.7179000, lng: 120.9572000 },
  "Meycauayan (Malhacan)":  { lat: 14.7376000, lng: 120.9608000 },
  "SM City Marilao":        { lat: 14.7543000, lng: 120.9542000 },
  "Marilao (Crossing)":     { lat: 14.7626718, lng: 120.9474775 },
  "Bocaue (Joners)":        { lat: 14.7805467, lng: 120.9357406 },
  "Bocaue (Crossing)":      { lat: 14.7975000, lng: 120.9291000 },
  "Balagtas (Intercity)":   { lat: 14.8056000, lng: 120.9193000 },
  "Balagtas (Palengke)":    { lat: 14.8207519, lng: 120.9033817 },
  "Guiguinto (Krus)":       { lat: 14.8284000, lng: 120.8844000 },
  "Guiguinto-Malolos Arch": { lat: 14.8392131, lng: 120.8595336 },
  "Malolos (Tikay)":        { lat: 14.8425629, lng: 120.8445668 },
  "Malolos (Robinsons)":    { lat: 14.8492727, lng: 120.8241607 },
  "Malolos (Crossing)":     { lat: 14.8527157, lng: 120.8159423 },
  "Bulacan State University": { lat: 14.8563764, lng: 120.8127236 },
  "Centro Escolar University": { lat: 14.8702000, lng: 120.8004000 },
  "Calumpit (Bridge)":      { lat: 14.9189000, lng: 120.7658000 },
};

// ─── Route Hints ──────────────────────────────────────────────────────────────
// Intermediate waypoints injected into OSRM when a segment follows a non-direct
// road path (loops, divided highways, etc.). Must mirror ROUTE_HINTS in
// lib/constants.ts so that seeded distances match what the map shows.
//
// Key format: "Origin Terminal|Destination Terminal" (directional)
const ROUTE_HINTS: Record<string, { lat: number; lng: number }[]> = {
  "SM City Marilao|Marilao (Crossing)": [
    { lat: 14.7599000, lng: 120.9505000 },
  ],
  "Marilao (Crossing)|Bocaue (Joners)": [
    { lat: 14.7682015, lng: 120.9422850 },
    { lat: 14.7745505, lng: 120.9390448 },
  ],
  "Guiguinto (Krus)|Guiguinto-Malolos Arch": [
    { lat: 14.8371181, lng: 120.8629990 },
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

// ─── Baseline Configs (matches paper's Conceptual Model) ──────────────────────

const VEHICLE_CONFIGS = [
  {
    vehicle: "jeepney",
    capacity: 22,
    base_speed_kph: 25,
    peak_min_wait: 5,
    peak_max_wait: 15,
    offpeak_min_wait: 15,
    offpeak_max_wait: 35,
    min_stops: 4,
    max_stops: 10,
    min_stop_delay: 0.5,
    max_stop_delay: 1.5,
  },
  {
    vehicle: "uv",
    capacity: 16,
    base_speed_kph: 35,
    peak_min_wait: 5,
    peak_max_wait: 12,
    offpeak_min_wait: 20,
    offpeak_max_wait: 40,
    min_stops: 0,
    max_stops: 2,
    min_stop_delay: 0.2,
    max_stop_delay: 0.6,
  },
];

const WEATHER_MODIFIERS = [
  { condition: "clear", speed_factor: 1.0, wait_factor: 1.0 },
  { condition: "rain", speed_factor: 0.8, wait_factor: 1.2 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dphi = ((lat2 - lat1) * Math.PI) / 180;
  const dlambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dphi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function fetchOsrmDistance(
  fromName: string,
  toName: string,
): Promise<number> {
  const from = TERMINAL_COORDS[fromName];
  const to   = TERMINAL_COORDS[toName];

  // Build waypoints: from + hints (forward or reverse) + to
  const fwdKey  = `${fromName}|${toName}`;
  const revKey  = `${toName}|${fromName}`;
  const hints   = ROUTE_HINTS[fwdKey]
    ?? (ROUTE_HINTS[revKey] ? [...ROUTE_HINTS[revKey]].reverse() : []);
  const waypoints = [
    { lat: from.lat, lng: from.lng },
    ...hints,
    { lat: to.lat,   lng: to.lng   },
  ];
  const waypointStr = waypoints.map((p) => `${p.lng},${p.lat}`).join(";");

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${waypointStr}?overview=false`;
    const res  = await fetch(url);
    const data = await res.json();
    if (data.code === "Ok" && data.routes?.[0]) {
      return parseFloat((data.routes[0].distance / 1000).toFixed(3));
    }
  } catch {
    // fall through to Haversine fallback
  }
  // Haversine × 1.2 road correction factor
  return parseFloat(
    (haversine(from.lat, from.lng, to.lat, to.lng) * 1.2).toFixed(3)
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Seed Action ──────────────────────────────────────────────────────────────

/**
 * Populates all Convex baseline tables.
 * Clears routeSegments first so stale terminal entries from previous
 * seeds are fully removed before inserting the new set.
 *
 * Strategy: Fetch N−1 consecutive adjacent segment distances from OSRM,
 * then compute all N×N pairwise distances by summing intermediate segments.
 * Safe to re-run whenever terminal names or coordinates change.
 */
export const seedDatabase = action({
  args: {},
  handler: async (ctx) => {
    const n = TERMINAL_NAMES.length;

    // 0. Wipe stale route segments so old terminal names don't linger
    const cleared = await ctx.runMutation(api.routes.clearRouteSegments, {});
    console.log(`✓ Cleared ${cleared.deleted} stale route segments`);

    // 1. Seed vehicle configs
    for (const cfg of VEHICLE_CONFIGS) {
      await ctx.runMutation(api.routes.upsertVehicleConfig, cfg);
    }
    console.log(`✓ Seeded ${VEHICLE_CONFIGS.length} vehicle configs`);

    // 2. Seed weather modifiers
    for (const mod of WEATHER_MODIFIERS) {
      await ctx.runMutation(api.routes.upsertWeatherModifier, mod);
    }
    console.log(`✓ Seeded ${WEATHER_MODIFIERS.length} weather modifiers`);

    // 3. Fetch bidirectional segment distances from OSRM (with ROUTE_HINTS applied)
    const fwdKm: number[] = [];
    const revKm: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      const fromName = TERMINAL_NAMES[i];
      const toName   = TERMINAL_NAMES[i + 1];

      // Forward segment
      const distFwd = await fetchOsrmDistance(fromName, toName);
      fwdKm.push(distFwd);
      await sleep(350);

      // Reverse segment
      const distRev = await fetchOsrmDistance(toName, fromName);
      revKm.push(distRev);
      await sleep(350);

      console.log(`  Segment [${i}↔${i + 1}] ${fromName} ↔ ${toName}: FWD ${distFwd}km | REV ${distRev}km`);
    }
    console.log(`✓ Fetched ${fwdKm.length} forward and ${revKm.length} reverse segments`);

    // 4. Compute and store all N×N directed pairs
    let stored = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;

        let distance_km = 0;
        if (i < j) {
          // Forward path (Northbound) sum
          for (let k = i; k < j; k++) distance_km += fwdKm[k];
        } else {
          // Reverse path (Southbound) sum
          for (let k = j; k < i; k++) distance_km += revKm[k];
        }
        
        distance_km = parseFloat(distance_km.toFixed(3));

        await ctx.runMutation(api.routes.upsertRouteSegment, {
          origin: TERMINAL_NAMES[i],
          destination: TERMINAL_NAMES[j],
          distance_km,
        });
        stored++;
      }
    }
    console.log(`✓ Stored ${stored} distinct bidirectional route segment pairs`);

    return {
      status: "success",
      totalPairsStored: stored,
    };
  },
});
