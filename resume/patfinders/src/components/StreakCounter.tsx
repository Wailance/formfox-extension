import { getStreakMultiplier } from "@/lib/constants";
export default function StreakCounter({ streak }: { streak: number }) {
  return <div className={`rounded-xl border px-3 py-2 text-sm ${streak >= 30 ? "border-amber-300 text-amber-200" : streak >= 7 ? "border-orange-400 animate-pulse" : "border-slate-600"}`}>🔥 {streak} дней · x{getStreakMultiplier(streak)}</div>;
}
