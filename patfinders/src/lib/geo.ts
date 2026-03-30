import { Coordinates } from "./types";
export function getDistanceMeters(point1: Coordinates, point2: Coordinates): number {
  const R = 6371000;
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLng = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((point1.lat * Math.PI) / 180) * Math.cos((point2.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export const formatDistance = (meters: number) => (meters < 1000 ? `${Math.round(meters)} м` : `${(meters / 1000).toFixed(1)} км`);
export const isWithinRadius = (user: Coordinates, target: Coordinates, radiusMeters: number) => getDistanceMeters(user, target) <= radiusMeters;
export function getCenter(points: Coordinates[]): Coordinates {
  const sum = points.reduce((acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }), { lat: 0, lng: 0 });
  return { lat: sum.lat / points.length, lng: sum.lng / points.length };
}
