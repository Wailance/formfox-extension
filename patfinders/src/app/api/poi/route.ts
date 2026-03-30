import { fetchPOIs } from "@/lib/overpass";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = Number(url.searchParams.get("lat")); const lng = Number(url.searchParams.get("lng")); const radius = Number(url.searchParams.get("radius") ?? 1000);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  const pois = await fetchPOIs(lat, lng, radius);
  return NextResponse.json({ pois });
}
