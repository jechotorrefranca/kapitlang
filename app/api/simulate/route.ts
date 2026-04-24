import { api } from "@/convex/_generated/api";
import { buildRouteWaypoints, haversineDist } from "@/lib/routing";
import { ConvexHttpClient } from "convex/browser";
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
  let distance_km: number | null = null;
  if (origin && destination) {
    const segment = await convex.query(api.routes.getRouteSegment, {
      origin,
      destination,
    });
    if (segment) distance_km = segment.distance_km;
  }
  if (distance_km === null) {
    const waypoints = buildRouteWaypoints(
      origin ?? "Dropped Pin",
      { lat: originLat, lng: originLng },
      destination ?? "Dropped Pin",
      { lat: destLat, lng: destLng }
    );
    const waypointStr = waypoints.join(";");
    distance_km = await fetchOsrmDistance(waypointStr);
  }
  const weatherModifier = await convex.query(api.routes.getWeatherModifier, {
    condition: weather,
  });
  const vehicleConfig = await convex.query(api.routes.getVehicleConfig, {
    vehicle,
  });
  const iterationsSetting = await convex.query(api.routes.getSystemSetting, {
    key: "monte_carlo_tests",
  });
  const peakHoursSetting = await convex.query(api.routes.getSystemSetting, {
    key: "peak_hours",
  });
  const iterations = iterationsSetting?.value ?? 500;
  const peak_hours = peakHoursSetting?.value ?? null;

  const experimentalEnabledSetting = await convex.query(api.routes.getSystemSetting, {
    key: "experimental_enabled",
  });
  const experimentalEnabled = experimentalEnabledSetting?.value === true;

  let chaosFactors: unknown[] | null = null;
  if (experimentalEnabled) {
    chaosFactors = await convex.query(api.routes.getChaosFactors);
  }

  const pythonUrl = process.env.PYTHON_API_URL || "http://localhost:8000";
  const endpoint = experimentalEnabled ? "/simulate_chaos" : "/simulate";

  const simRes = await fetch(`${pythonUrl}${endpoint}`, {
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
      peak_hours,
      chaos_factors: chaosFactors,
    }),
  });

  if (!simRes.ok) {
    return Response.json({ error: "Simulation engine error" }, { status: simRes.status });
  }

  const data = await simRes.json();

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

  const factors = {
    ...(data.factors || {}),
    base_travel_min:    data.factors?.base_travel_min    ?? data.base_travel_min    ?? null,
    avg_wait_min:       data.factors?.avg_wait_min       ?? data.avg_wait_min        ?? null,
    avg_stop_delay_min: data.factors?.avg_stop_delay_min ?? data.avg_stop_delay_min  ?? null,
    weather_factor:     data.factors?.weather_factor     ?? data.weather_factor      ?? (weatherModifier?.speed_factor ?? 1),
    speed_kph:          vehicleConfig?.base_speed_kph    ?? null,
    capacity:           vehicleConfig?.capacity          ?? null,
    chaos_events:       data.chaos_events                ?? null,
  };

  return Response.json({
    min: data.min,
    max: data.max,
    avg: data.avg,
    distance_km,
    vehicle,
    weather,
    factors,
    is_experimental: experimentalEnabled,
    iterations: data.iterations || iterations
  });
}
async function fetchOsrmDistance(waypointStr: string): Promise<number> {
  try {
    const res = await fetch(
      `http://router.project-osrm.org/route/v1/driving/${waypointStr}?overview=false`,
      { signal: AbortSignal.timeout(5000) }
    );
    const json = await res.json();
    if (json.code === "Ok" && json.routes?.[0]) {
      return parseFloat((json.routes[0].distance / 1000).toFixed(3));
    }
  } catch {
  }
  const pts = waypointStr.split(";");
  const first = pts[0].split(",");
  const last = pts[pts.length - 1].split(",");
  return parseFloat(
    (haversineDist(Number(first[1]), Number(first[0]), Number(last[1]), Number(last[0])) * 1.2).toFixed(3)
  );
}
