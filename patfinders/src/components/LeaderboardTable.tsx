import UserAvatar from "./UserAvatar";
import { Card } from "./ui/card";
export default function LeaderboardTable({ rows, me }: { rows: Array<{ id: string; username: string; avatar_url?: string; xp: number; level: number; current_streak: number; total_distance_km: number }>; me?: string; }) {
  return <div className="space-y-2">{rows.map((r, i) => <Card key={r.id} className={`flex items-center justify-between ${me === r.id ? "border border-emerald-400" : ""}`}><div className="flex items-center gap-3"><span className="w-6 text-slate-300">{i + 1}.</span><UserAvatar username={r.username} avatar_url={r.avatar_url} level={r.level} size="sm" /><div><div className="font-medium">@{r.username}</div><div className="text-xs text-slate-300">Ур.{r.level}</div></div></div><div className="text-sm">{r.xp} XP</div></Card>)}</div>;
}
