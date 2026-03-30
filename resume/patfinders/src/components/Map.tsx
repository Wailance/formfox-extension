"use client";
import dynamic from "next/dynamic";
type MarkerType = "task" | "task-done" | "user";
export interface MapProps { center: [number, number]; userPosition?: [number, number]; markers?: Array<{ lat: number; lng: number; type: MarkerType; label?: string }>; routePoints?: [number, number][]; zoom?: number; className?: string; onMapClick?: (lat: number, lng: number) => void; currentRadiusMeters?: number; }
function MapSkeleton() { return <div className="h-full w-full animate-pulse rounded-xl bg-slate-800 grid place-items-center text-slate-400">🗺️</div>; }
const MapInner = dynamic(() => import("./MapInner"), { ssr: false, loading: MapSkeleton });
export default function Map(props: MapProps) { return <MapInner {...props} />; }
