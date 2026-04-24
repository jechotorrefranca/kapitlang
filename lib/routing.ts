import { HIGHWAY_SEQUENCE, ROUTE_HINTS, TERMINAL_COORDINATES, TerminalName } from "./constants";

export type Coord = { lat: number; lng: number };

export function haversineDist(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dphi = ((lat2 - lat1) * Math.PI) / 180;
  const dlambda = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dphi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function findNearestTerminalIdx(coord: Coord): number {
  let bestIdx = -1;
  let minD = Infinity;
  for (let i = 0; i < HIGHWAY_SEQUENCE.length; i++) {
    const tName = HIGHWAY_SEQUENCE[i] as Exclude<TerminalName, "Dropped Pin">;
    const tCoord = TERMINAL_COORDINATES[tName];
    if (tCoord) {
      const d = haversineDist(coord.lat, coord.lng, tCoord.lat, tCoord.lng);
      if (d < minD) {
        minD = d;
        bestIdx = i;
      }
    }
  }
  return bestIdx;
}

export function buildRouteWaypoints(
  originName: string,
  originCoords: Coord,
  destName: string,
  destCoords: Coord
): string[] {
  const pts: string[] = [`${originCoords.lng},${originCoords.lat}`];

  // 1. Identify starting sequence index
  let idxO = HIGHWAY_SEQUENCE.indexOf(originName as TerminalName);
  if (idxO === -1 || originName === "Dropped Pin") {
    idxO = findNearestTerminalIdx(originCoords);
  }

  // 2. Identify destination sequence index
  let idxD = HIGHWAY_SEQUENCE.indexOf(destName as TerminalName);
  if (idxD === -1 || destName === "Dropped Pin") {
    idxD = findNearestTerminalIdx(destCoords);
  }

  // 3. Assemble coordinates strictly along the MacArthur highway Sequence
  if (idxO !== -1 && idxD !== -1 && idxO !== idxD) {
    const isNorthbound = idxO < idxD;
    const step = isNorthbound ? 1 : -1;

    for (let i = idxO; isNorthbound ? i < idxD : i > idxD; i += step) {
      const fromName = HIGHWAY_SEQUENCE[i];
      const toName   = HIGHWAY_SEQUENCE[i + step];
      
      const fwdKey = `${fromName}|${toName}`;
      const revKey = `${toName}|${fromName}`;
      
      let hintPts: Coord[] = ROUTE_HINTS[fwdKey]
        ? ROUTE_HINTS[fwdKey]
        : ROUTE_HINTS[revKey]
          ? [...ROUTE_HINTS[revKey]].reverse()
          : [];

      // SPECIAL CASE: Branching off the Guiguinto/Tabang Intersection smoothly
      // If a Custom dropped pin naturally snapped to this Malolos Arch loop segment,
      // safely omit the stringent Guiguinto U-Turn loop hints so OSRM can natively 
      // calculate the fastest straight-turn into intersecting branching roads (like DRT Highway or Plaridel).
      const isLoopSegment = 
        fwdKey === "Guiguinto (Krus)|Guiguinto-Malolos Arch" || 
        fwdKey === "Guiguinto-Malolos Arch|Guiguinto (Krus)";
        
      if (isLoopSegment) {
        const isCustomDest = (i + step === idxD) && (!HIGHWAY_SEQUENCE.includes(destName as TerminalName));
        const isCustomOrig = (i === idxO) && (!HIGHWAY_SEQUENCE.includes(originName as TerminalName));
        
        if (isCustomDest || isCustomOrig) {
          hintPts = [];
        }
      }

      // Include all route hints enforcing the exact turn loops (skipping highways like NLEX)
      for (const h of hintPts) pts.push(`${h.lng},${h.lat}`);

      // Include intermediate terminal points as sequence anchors
      if (i + step !== idxD) {
        const nextTerminal = toName as Exclude<TerminalName, "Dropped Pin">;
        const c = TERMINAL_COORDINATES[nextTerminal];
        if (c) pts.push(`${c.lng},${c.lat}`);
      }
    }
  }

  pts.push(`${destCoords.lng},${destCoords.lat}`);
  
  // Condense any duplicate adjacent coordinates to avoid OSRM strictness errors
  return pts.filter((pt, index, arr) => index === 0 || pt !== arr[index - 1]);
}
