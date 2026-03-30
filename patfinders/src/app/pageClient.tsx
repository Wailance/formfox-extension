"use client";
import { useState } from "react";
import Map from "@/components/Map";
import LocationPermission from "@/components/LocationPermission";
import QuestGenerator from "@/components/QuestGenerator";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useRouter } from "next/navigation";
import { ProfileRow, QuestRow } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
export default function HomeClient({ isAuthenticated }: { isAuthenticated: boolean; profile: ProfileRow | null; recentQuests: QuestRow[] }) {
  const { position, error, requestPermission } = useGeolocation();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  if (!position) return <div className="mx-auto mt-4 max-w-3xl px-4"><LocationPermission requestPermission={requestPermission} error={error} /></div>;
  return <div className="mx-auto max-w-3xl px-4 pt-4"><div className="h-[60vh] overflow-hidden rounded-xl"><Map center={[position.lat, position.lng]} userPosition={[position.lat, position.lng]} /></div><div className="mt-4 glass-card"><h2 className="mb-2 text-xl font-bold">Квест дня</h2><Button className="w-full rounded-xl bg-emerald-500 text-lg font-semibold text-slate-950" onClick={() => (isAuthenticated ? setOpen(true) : router.push("/auth/login"))}>🗺️ НАЧАТЬ КВЕСТ</Button></div>{open && <QuestGenerator isOpen={open} onClose={() => setOpen(false)} userPosition={position} onQuestCreated={() => {}} />}</div>;
}
