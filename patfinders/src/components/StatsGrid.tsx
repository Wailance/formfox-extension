"use client";
export default function StatsGrid({ stats }: { stats: { label: string; value: string; emoji: string }[] }) {
  return <div className="grid grid-cols-2 gap-2 md:grid-cols-4">{stats.map((s) => <div key={s.label} className="glass-card text-center"><div className="text-2xl">{s.emoji}</div><div className="text-xl font-bold">{s.value}</div><div className="text-xs text-slate-300">{s.label}</div></div>)}</div>;
}
