"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Coordinates } from "../types";

interface UseGeolocationReturn {
  position: Coordinates | null; error: string | null; isLoading: boolean; isWatching: boolean;
  startWatching: () => void; stopWatching: () => void; requestPermission: () => Promise<boolean>;
}
function mapError(err: GeolocationPositionError) {
  if (err.code === err.PERMISSION_DENIED) return "Разрешите доступ к геолокации в настройках";
  if (err.code === err.POSITION_UNAVAILABLE) return "Не удалось определить местоположение";
  if (err.code === err.TIMEOUT) return "Поиск местоположения занял слишком долго";
  return "Ошибка геолокации";
}
export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWatching, setIsWatching] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const onSuccess = (p: GeolocationPosition) => { setPosition({ lat: p.coords.latitude, lng: p.coords.longitude }); setError(null); setIsLoading(false); };
  const onError = (e: GeolocationPositionError) => { setError(mapError(e)); setIsLoading(false); };
  useEffect(() => { if (!navigator.geolocation) { setError("Геолокация не поддерживается"); setIsLoading(false); return; } navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }); }, []);
  const startWatching = useCallback(() => { if (watchIdRef.current !== null) return; watchIdRef.current = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }); setIsWatching(true); }, []);
  const stopWatching = useCallback(() => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; setIsWatching(false); }, []);
  const requestPermission = useCallback(async () => new Promise<boolean>((resolve) => navigator.geolocation.getCurrentPosition((p) => { onSuccess(p); resolve(true); }, (e) => { onError(e); resolve(false); }, { enableHighAccuracy: true })), []);
  useEffect(() => () => stopWatching(), [stopWatching]);
  return { position, error, isLoading, isWatching, startWatching, stopWatching, requestPermission };
}
