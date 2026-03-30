import Link from "next/link";
import { Quest } from "@/lib/types";
import { QuestRow } from "@/lib/db-types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
type QuestLike = Quest | QuestRow;
export default function QuestCard({ quest, compact }: { quest: QuestLike; compact?: boolean }) {
  return <Card><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{quest.title}</h3><p className="text-sm text-slate-300">{quest.description}</p></div><Badge className={quest.status === "active" ? "bg-emerald-500 text-slate-950" : ""}>{quest.status}</Badge></div><div className="mt-3 text-sm text-slate-300">{quest.completed_tasks}/{quest.total_tasks} · {quest.total_xp} XP</div>{quest.status === "active" && <Link href={`/quest/${quest.id}`}><Button className="mt-3 bg-emerald-500 text-slate-950">▶️ Продолжить</Button></Link>}{!compact && quest.status === "completed" && <div className="mt-2 text-sm text-slate-400">{quest.estimated_distance_km} км · {quest.estimated_time_min} мин</div>}</Card>;
}
