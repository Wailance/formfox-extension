"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NARRATIVE_THEMES, QUEST_TYPES } from "@/lib/constants";
import { Coordinates, NarrativeTheme, QuestType } from "@/lib/types";
import QuestLoader from "./QuestLoader";
import { appToast } from "./ui/toast";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
export default function QuestGenerator({ isOpen, onClose, userPosition, onQuestCreated }: { isOpen: boolean; onClose: () => void; userPosition: Coordinates; onQuestCreated: (questId: string) => void; }) {
  const router = useRouter(); const [questType, setQuestType] = useState<QuestType | null>(null); const [theme, setTheme] = useState<NarrativeTheme | null>(null); const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const create = async () => {
    if (!questType || !theme) return;
    setLoading(true);
    const radius = QUEST_TYPES.find((q) => q.value === questType)?.radius ?? 1000;
    const res = await fetch("/api/quest/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lat: userPosition.lat, lng: userPosition.lng, quest_type: questType, narrative_theme: theme, radius_meters: radius }) });
    setLoading(false);
    if (!res.ok) { appToast.error("Не удалось создать квест"); return; }
    const data = (await res.json()) as { quest: { id: string } };
    onQuestCreated(data.quest.id); onClose(); router.push(`/quest/${data.quest.id}`);
  };
  return <div className="fixed inset-0 z-50 bg-black/70 p-4">{loading && <QuestLoader />}<Card className="mx-auto mt-8 max-w-md"><h2 className="mb-3 text-lg font-semibold">Создай квест</h2><p className="mb-2 text-sm">1) Тип квеста</p><div className="grid gap-2">{QUEST_TYPES.map((t) => <Button key={t.value} onClick={() => setQuestType(t.value)} className={`justify-start border p-3 text-left ${questType === t.value ? "border-emerald-400" : "border-slate-600"}`}>{t.emoji} {t.label} · {t.time}</Button>)}</div><p className="mb-2 mt-4 text-sm">2) Тема</p><div className="grid grid-cols-2 gap-2">{NARRATIVE_THEMES.map((t) => <Button key={t.value} onClick={() => setTheme(t.value)} className={`border p-3 ${theme === t.value ? "border-emerald-400" : "border-slate-600"}`}>{t.emoji} {t.label}</Button>)}</div><div className="mt-4 flex gap-2"><Button onClick={onClose} className="flex-1 border border-slate-600">Отмена</Button><Button disabled={!questType || !theme} onClick={create} className="flex-1 bg-emerald-500 font-semibold text-slate-950 disabled:opacity-50">Создать квест!</Button></div></Card></div>;
}
