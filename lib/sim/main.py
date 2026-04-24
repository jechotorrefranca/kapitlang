from fastapi import FastAPI, HTTPException
import random

app = FastAPI()

_DEFAULTS: dict[str, dict] = {
    "jeepney": {
        "base_speed_kph":   25,
        "peak_min_wait":     5,
        "peak_max_wait":    15,
        "offpeak_min_wait": 15,
        "offpeak_max_wait": 35,
        "min_stops":         4,
        "max_stops":        10,
        "min_stop_delay":  0.5,
        "max_stop_delay":  1.5,
    },
    "uv": {
        "base_speed_kph":   35,
        "peak_min_wait":     5,
        "peak_max_wait":    12,
        "offpeak_min_wait": 20,
        "offpeak_max_wait": 40,
        "min_stops":         0,
        "max_stops":         2,
        "min_stop_delay":  0.2,
        "max_stop_delay":  0.6,
    },
}

def is_peak(time_str: str, peak_hours: dict | None = None) -> bool:
    hour = int(time_str.split(":")[0])
    if peak_hours:
        am_start = peak_hours.get("am_start", 6)
        am_end = peak_hours.get("am_end", 9)
        pm_start = peak_hours.get("pm_start", 17)
        pm_end = peak_hours.get("pm_end", 20)
        return am_start <= hour <= am_end or pm_start <= hour <= pm_end
    return 6 <= hour <= 9 or 17 <= hour <= 20

def simulate(
    vehicle: str,
    distance_km: float,
    weather: str,
    time: str,
    vehicle_config: dict | None = None,
    weather_modifier: dict | None = None,
    iterations: int = 500,
    peak_hours: dict | None = None,
) -> dict:
    cfg = _DEFAULTS.get(vehicle, _DEFAULTS["jeepney"]).copy()
    if vehicle_config:
        cfg.update({k: v for k, v in vehicle_config.items() if k in cfg})

    is_rain = weather == "rain"
    if weather_modifier and is_rain:
        w_speed = weather_modifier.get("speed_factor", 0.8)
        w_wait  = weather_modifier.get("wait_factor",  1.2)
    elif is_rain:
        w_speed, w_wait = 0.8, 1.2
    else:
        w_speed, w_wait = 1.0, 1.0

    base_speed = cfg["base_speed_kph"] * w_speed
    peak = is_peak(time, peak_hours)

    results: list[float] = []
    total_wait_time = 0.0
    total_stop_delay = 0.0

    base_travel_min = (distance_km / base_speed) * 60

    for _ in range(iterations):
        if peak:
            wait_time = random.uniform(cfg["peak_min_wait"], cfg["peak_max_wait"])
        else:
            wait_time = random.uniform(cfg["offpeak_min_wait"], cfg["offpeak_max_wait"])
        wait_time *= w_wait
        total_wait_time += wait_time

        stops = random.randint(int(cfg["min_stops"]), int(cfg["max_stops"]))
        stop_delay = stops * random.uniform(cfg["min_stop_delay"], cfg["max_stop_delay"])
        total_stop_delay += stop_delay

        results.append(wait_time + stop_delay + base_travel_min)

    avg_wait = total_wait_time / iterations
    avg_delay = total_stop_delay / iterations

    return {
        "min":         round(min(results), 2),
        "max":         round(max(results), 2),
        "avg":         round(sum(results) / len(results), 2),
        "distance_km": distance_km,
        "factors": {
            "base_travel_min": round(base_travel_min, 2),
            "avg_wait_min":    round(avg_wait, 2),
            "avg_stop_delay_min": round(avg_delay, 2),
            "weather_factor":  w_speed,
        }
    }

@app.post("/simulate")
def run_simulation(data: dict):
    required = {"vehicle", "weather", "time", "distance_km"}
    missing = required - data.keys()
    if missing:
        raise HTTPException(status_code=422, detail=f"Missing fields: {missing}")

    return simulate(
        vehicle=data["vehicle"],
        distance_km=float(data["distance_km"]),
        weather=data["weather"],
        time=data["time"],
        vehicle_config=data.get("vehicle_config"),
        weather_modifier=data.get("weather_modifier"),
        iterations=int(data.get("iterations", 500)),
        peak_hours=data.get("peak_hours"),
    )

