import { getDistanceMeters } from "./geo";
import { POI } from "./types";

function generateNameFromTags(tags: Record<string, string>): string {
  if (tags.name) return tags.name;
  if (tags.description) return tags.description;
  if (tags.historic) return "Историческое место";
  if (tags.tourism) return "Достопримечательность";
  if (tags.amenity) return tags.amenity.charAt(0).toUpperCase() + tags.amenity.slice(1);
  return "Интересное место";
}

function mapElement(el: { id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }): POI | null {
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (!lat || !lng) return null;
  const tags = el.tags ?? {};
  const type = tags.tourism ? "tourism" : tags.historic ? "historic" : tags.amenity ? "amenity" : tags.building ? "building" : "artwork";
  const subtype = tags.tourism ?? tags.historic ?? tags.amenity ?? tags.building ?? tags.artwork_type ?? "unknown";
  return { id: el.id, lat, lng, name: generateNameFromTags(tags), type, subtype, tags };
}

async function queryOverpass(lat: number, lng: number, radiusMeters: number): Promise<POI[]> {
  const query = `[out:json][timeout:25];
(
node["tourism"~"attraction|artwork|museum|viewpoint|monument"](around:${radiusMeters},${lat},${lng});
node["historic"](around:${radiusMeters},${lat},${lng});
node["amenity"~"library|theatre|cinema|fountain|clock|place_of_worship"](around:${radiusMeters},${lat},${lng});
node["memorial"](around:${radiusMeters},${lat},${lng});
node["artwork_type"](around:${radiusMeters},${lat},${lng});
way["building"]["name"](around:${radiusMeters},${lat},${lng});
node["natural"~"tree|peak|spring"](around:${radiusMeters},${lat},${lng});
);out center body 50;`;
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: ctrl.signal
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { elements?: Array<{ id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }> };
    const mapped = (data.elements ?? []).map(mapElement).filter((p): p is POI => Boolean(p));
    const dedup: POI[] = [];
    mapped.forEach((poi) => {
      if (!dedup.some((d) => getDistanceMeters({ lat: d.lat, lng: d.lng }, { lat: poi.lat, lng: poi.lng }) < 20)) dedup.push(poi);
    });
    return dedup;
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchPOIs(lat: number, lng: number, radiusMeters: number): Promise<POI[]> {
  let pois = await queryOverpass(lat, lng, radiusMeters);
  if (pois.length < 3) pois = await queryOverpass(lat, lng, Math.round(radiusMeters * 1.5));
  return pois;
}
