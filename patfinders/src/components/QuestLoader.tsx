"use client";
import { QUEST_LOADING_MESSAGES } from "@/lib/constants";
import { useEffect, useState } from "react";
export default function QuestLoader() {
  const [idx, setIdx] = useState(0); const [p, setP] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx((i) => (i + 1) % QUEST_LOADING_MESSAGES.length), 2500); const pT = setInterval(() => setP((x) => Math.min(85, x + 2)), 200); return () => { clearInterval(t); clearInterval(pT); }; }, []);
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#0F172A]/95 p-6"><div className="w-full max-w-sm text-center"><div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" /><p className="mb-4">{QUEST_LOADING_MESSAGES[idx]}</p><div className="h-2 w-full rounded-full bg-slate-700"><div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${p}%` }} /></div><p className="mt-2 text-xs text-slate-300">ИИ исследует окрестности...</p></div></div>;
}
