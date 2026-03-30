"use client";
import { useEffect, useState } from "react";
const slides = [
  { t: "🗺️ Исследуй свой район", d: "Pathfinders создаёт уникальные квесты по реальным местам рядом с тобой" },
  { t: "📸 Выполняй задания", d: "Дойди до точки, сфоткай объект, ответь на вопрос. ИИ проверит!" },
  { t: "⚡ Получай награды", d: "XP, уровни, артефакты, стрики. Соревнуйся с друзьями!" }
];
export default function OnboardingModal() {
  const [open, setOpen] = useState(false); const [i, setI] = useState(0);
  useEffect(() => { setOpen(localStorage.getItem("pf_onboarding_done") !== "1"); }, []);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-black/70 p-4"><div className="mx-auto mt-12 max-w-md glass-card"><h3 className="text-xl font-bold">{slides[i].t}</h3><p className="mt-2 text-slate-300">{slides[i].d}</p><div className="mt-4 flex gap-2">{i > 0 && <button className="min-h-12 flex-1 rounded-lg border border-slate-600" onClick={() => setI((x) => x - 1)}>Назад</button>}{i < slides.length - 1 ? <button className="min-h-12 flex-1 rounded-lg bg-emerald-500 text-slate-950" onClick={() => setI((x) => x + 1)}>Далее</button> : <button className="min-h-12 flex-1 rounded-lg bg-emerald-500 text-slate-950" onClick={() => { localStorage.setItem("pf_onboarding_done", "1"); setOpen(false); }}>Начать приключение!</button>}</div></div></div>;
}
