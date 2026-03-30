"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { MapProps } from "./Map";
function mapIcon(html: string) { return L.divIcon({ className: "", html, iconSize: [32, 32], iconAnchor: [16, 16] }); }
function ClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) { useMapEvents({ click: (e) => onMapClick?.(e.latlng.lat, e.latlng.lng) }); return null; }
export default function MapInner({ center, userPosition, markers = [], routePoints, zoom = 15, className, onMapClick, currentRadiusMeters }: MapProps) {
  return (
    <div className={className ?? "h-full w-full rounded-xl overflow-hidden"}>
      <MapContainer center={center} zoom={zoom} className="h-full w-full">
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
        {userPosition && <Marker position={userPosition} icon={mapIcon('<div class="user-marker-pulse"></div>')}><Popup>Ты здесь</Popup></Marker>}
        {markers.map((m, i) => <Marker key={`${m.lat}-${m.lng}-${i}`} position={[m.lat, m.lng]} icon={mapIcon(m.type === "task-done" ? '<div class="task-done-marker">✓</div>' : `<div class="task-marker">${m.label ?? i + 1}</div>`)}><Popup>{m.label ?? "Точка"}</Popup></Marker>)}
        {routePoints && routePoints.length > 1 && <Polyline positions={routePoints} pathOptions={{ color: "#10B981", weight: 4, dashArray: "6 6" }} />}
        {markers[0] && currentRadiusMeters && <Circle center={[markers[0].lat, markers[0].lng]} radius={currentRadiusMeters} pathOptions={{ color: "#10B981" }} />}
        <ClickHandler onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
}
