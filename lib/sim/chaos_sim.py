import random

def is_peak(time_str: str, peak_hours: dict | None = None) -> bool:
    hour = int(time_str.split(":")[0])
    if peak_hours:
        am_start = peak_hours.get("am_start", 6)
        am_end = peak_hours.get("am_end", 9)
        pm_start = peak_hours.get("pm_start", 17)
        pm_end = peak_hours.get("pm_end", 20)
        return am_start <= hour <= am_end or pm_start <= hour <= pm_end
    return 6 <= hour <= 9 or 17 <= hour <= 20

def simulate_chaos(
    vehicle: str,
    distance_km: float,
    weather: str,
    time: str,
    base_defaults: dict,
    vehicle_config: dict | None = None,
    weather_modifier: dict | None = None,
    iterations: int = 500,
    peak_hours: dict | None = None,
    chaos_factors: list[dict] | None = None,
) -> dict:
    cfg = base_defaults.get(vehicle, base_defaults["jeepney"]).copy()
    if vehicle_config:
        cfg.update({k: v for k, v in vehicle_config.items() if k in cfg})

    is_rain = weather == "rain"
    w_speed, w_wait = 1.0, 1.0
    if is_rain:
        if weather_modifier:
            w_speed = weather_modifier.get("speed_factor", 0.8)
            w_wait = weather_modifier.get("wait_factor", 1.2)
        else:
            w_speed, w_wait = 0.8, 1.2

    base_speed = cfg["base_speed_kph"] * w_speed
    base_travel_min = (distance_km / base_speed) * 60
    peak = is_peak(time, peak_hours)

    # Parse chaos factors
    chaos_map = {cf['key']: cf for cf in (chaos_factors or [])}
    
    def get_chaos_val(key, default_val=0):
        factor = chaos_map.get(key)
        if factor and factor.get('enabled'):
            return factor.get('value', default_val)
        return 0

    holdap_chance = get_chaos_val('holdap_chance', 0)
    sagasa_chance = get_chaos_val('sagasa_chance', 0)
    bunggo_chance = get_chaos_val('bunggo_chance', 0)
    pulis_chance  = get_chaos_val('pulis_chance', 0)
    gas_time      = get_chaos_val('gas_time', 0)

    results: list[float] = []
    chaos_events_data = {}

    for _ in range(iterations):
        current_iter_time = base_travel_min
        
        # Standard wait times (ALIGNED WITH MAIN.PY)
        if peak:
            wait_time = random.uniform(cfg["peak_min_wait"], cfg["peak_max_wait"])
        else:
            wait_time = random.uniform(cfg["offpeak_min_wait"], cfg["offpeak_max_wait"])
        
        wait_time *= w_wait
        
        # Stops Delay (ALIGNED WITH MAIN.PY)
        stops = random.randint(int(cfg["min_stops"]), int(cfg["max_stops"]))
        stop_delay = stops * random.uniform(cfg["min_stop_delay"], cfg["max_stop_delay"])
        
        current_iter_time += wait_time + stop_delay
        
        def track_event(name, extra_time):
            if name not in chaos_events_data:
                chaos_events_data[name] = {"count": 0, "time_added": 0}
            chaos_events_data[name]["count"] += 1
            chaos_events_data[name]["time_added"] += extra_time

        # Refueling (Chaos)
        if gas_time > 0 and random.random() < 0.1: # 10% chance to refuel during trip
            current_iter_time += gas_time
            track_event("Nagpa-gas si koya hanep", gas_time)

        # Chaos Events
        if holdap_chance > 0 and random.random() * 100 < holdap_chance:
            extra = random.uniform(10, 30)
            current_iter_time += extra
            track_event("Naholdap pa malas", extra)
            
        if sagasa_chance > 0 and random.random() * 100 < sagasa_chance:
            extra = random.uniform(20, 50) # Time to wait and transfer to another ride
            current_iter_time += extra 
            track_event("Nakasagasa omg", extra)

        if bunggo_chance > 0 and random.random() * 100 < bunggo_chance:
            extra = random.uniform(20, 60)
            current_iter_time += extra
            track_event("Nabangga pa kamote", extra)

        if pulis_chance > 0 and random.random() * 100 < pulis_chance:
            extra = random.uniform(5, 15)
            current_iter_time += extra
            track_event("Nahuli ng Pulis nubayan", extra)

        results.append(current_iter_time)

    avg_wait = sum([random.uniform(cfg["peak_min_wait"] if peak else cfg["offpeak_min_wait"], cfg["peak_max_wait"] if peak else cfg["offpeak_max_wait"]) for _ in range(iterations)]) / iterations
    avg_delay = sum([random.randint(int(cfg["min_stops"]), int(cfg["max_stops"])) * random.uniform(cfg["min_stop_delay"], cfg["max_stop_delay"]) for _ in range(iterations)]) / iterations

    # Convert to list for easier frontend handling
    chaos_summary = [
        {
            "name": name,
            "count": data["count"],
            "avg_time_added": round(data["time_added"] / data["count"], 2)
        }
        for name, data in chaos_events_data.items()
    ]

    return {
        "min": round(min(results), 2),
        "max": round(max(results), 2),
        "avg": round(sum(results) / len(results), 2),
        "iterations": iterations,
        "distance_km": distance_km,
        "chaos_events": chaos_summary,
        "factors": {
            "base_travel_min": round(base_travel_min, 2),
            "avg_wait_min":    round(avg_wait, 2),
            "avg_stop_delay_min": round(avg_delay, 2),
            "weather_factor": w_speed,
        }
    }
