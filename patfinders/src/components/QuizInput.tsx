"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
export default function QuizInput({ hint, onSubmit }: { hint?: string; onSubmit: (answer: string) => void }) {
  const [v, setV] = useState(""); const [showHint, setShowHint] = useState(false);
  return <div className="space-y-2"><Input value={v} onChange={(e) => setV(e.target.value)} placeholder="Твой ответ" /><div className="flex gap-2"><Button className="bg-emerald-500 px-4 font-semibold text-slate-950" onClick={() => onSubmit(v)}>Ответить</Button>{hint && <Button className="border border-slate-600 px-3" onClick={() => setShowHint((s) => !s)}>Подсказка</Button>}</div>{showHint && hint && <p className="text-sm text-amber-300">{hint}</p>}</div>;
}
