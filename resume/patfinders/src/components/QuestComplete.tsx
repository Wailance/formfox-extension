"use client";
import confetti from "canvas-confetti";
import { useEffect } from "react";
export default function QuestComplete({ title }: { title: string }) {
  useEffect(() => { confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } }); }, []);
  return <div className="glass-card text-center"><h1 className="text-3xl font-black gradient-text-gold">🎉 КВЕСТ ЗАВЕРШЁН!</h1><p className="mt-2 text-xl">{title}</p></div>;
}
