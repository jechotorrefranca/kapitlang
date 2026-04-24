import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Module-level client — reused across requests
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const body = await req.json();
  const {
    vehicle,
    weather,
    time,
    origin,
    destination,
    originLat,
    originLng,
    destLat,
    destLng,
  } = body;

  // ── 1. Distance: try Convex first, fall back to OSRM ──────────────────────
  let distance_km: number | null = null;

  if (origin && destination) {
    const segment = await convex.query(api.routes.getRouteSegment, {
      origin,
      destination,
    });
    if (segment) distance_km = segment.distance_km;
  }

  if (distance_km === null) {
    distance_km = await fetchOsrmDistance(originLng, originLat, destLng, destLat);
  }

  // ── 2. Weather modifier from Convex ───────────────────────────────────────
  const weatherModifier = await convex.query(api.routes.getWeatherModifier, {
    condition: weather,
  });

  // ── 3. Vehicle config from Convex ─────────────────────────────────────────
  const vehicleConfig = await convex.query(api.routes.getVehicleConfig, {
    vehicle,
  });

  // ── 3.5 System setting (Iterations) ───────────────────────────────────────
  const iterationsSetting = await convex.query(api.routes.getSystemSetting, {
    key: "monte_carlo_tests",
  });
  const iterations = iterationsSetting?.value ?? 500;

  // ── 4. Run Monte Carlo simulation ─────────────────────────────────────────
  const pythonUrl = process.env.PYTHON_API_URL || "http://localhost:8000";
  const simRes = await fetch(`${pythonUrl}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vehicle,
      weather,
      time,
      distance_km,
      vehicle_config: vehicleConfig ?? null,
      weather_modifier: weatherModifier ?? null,
      iterations,
    }),
  });

  if (!simRes.ok) {
    return Response.json({ error: "Simulation engine error" }, { status: simRes.status });
  }

  const data = await simRes.json();

  // ── 5. Log the run to Convex ──────────────────────────────────────────────
  await convex.mutation(api.routes.logSimulation, {
    origin: origin ?? "Custom PIN",
    destination: destination ?? "Custom PIN",
    originLat,
    originLng,
    destLat,
    destLng,
    vehicle,
    weather,
    time,
    distance_km,
    result_min: data.min,
    result_max: data.max,
    result_avg: data.avg,
  });

  // ── 6. Build factor breakdown for selected vehicle ────────────────────────
  const factors = {
    ...(data.factors || {}),
    base_travel_min:    data.factors?.base_travel_min    ?? data.base_travel_min    ?? null,
    avg_wait_min:       data.factors?.avg_wait_min       ?? data.avg_wait_min        ?? null,
    avg_stop_delay_min: data.factors?.avg_stop_delay_min ?? data.avg_stop_delay_min  ?? null,
    weather_factor:     data.factors?.weather_factor     ?? data.weather_factor      ?? (weatherModifier?.speed_factor ?? 1),
    speed_kph:          vehicleConfig?.base_speed_kph    ?? null,
    capacity:           vehicleConfig?.capacity          ?? null,
  };

  return Response.json({
    min: data.min,
    max: data.max,
    avg: data.avg,
    distance_km,
    vehicle,
    weather,
    factors
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function fetchOsrmDistance(
  originLng: number,
  originLat: number,
  destLng: number,
  destLat: number
): Promise<number> {
  try {
    const res = await fetch(
      `http://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=false`,
      { signal: AbortSignal.timeout(5000) }
    );
    const json = await res.json();
    if (json.code === "Ok" && json.routes?.[0]) {
      return parseFloat((json.routes[0].distance / 1000).toFixed(3));
    }
  } catch {
    // fall through to Haversine
  }
  return parseFloat((haversine(originLat, originLng, destLat, destLng) * 1.2).toFixed(3));
}

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
