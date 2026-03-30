import { getLevelTitle } from "@/lib/constants";
export default function LevelBadge({ level }: { level: number }) {
  const c = level <= 5 ? "border-slate-400" : level <= 15 ? "border-emerald-400" : level <= 30 ? "border-blue-400" : "border-violet-400";
  return <div className="text-center"><div className={`mx-auto grid h-14 w-14 place-items-center rounded-full border-2 ${c}`}>{level}</div><p className="mt-1 text-xs text-slate-300">{getLevelTitle(level)}</p></div>;
}
