"use client";
import Link from "next/link";
import { Quest } from "@/lib/types";
import { QuestRow } from "@/lib/db-types";
import { toast } from "sonner";
type QuestLike = Quest | QuestRow;
export default function ShareButtons({ quest, resultUrl }: { quest: QuestLike; resultUrl: string }) {
  return <div className="grid gap-2"><button className="min-h-12 rounded-lg border border-slate-600" onClick={async () => { await navigator.clipboard.writeText(resultUrl); toast.success("Ссылка скопирована"); }}>📋 Скопировать ссылку</button><button className="min-h-12 rounded-lg border border-slate-600" onClick={async () => { if (navigator.share) await navigator.share({ title: `Pathfinders: ${quest.title}`, url: resultUrl }); }}>📤 Поделиться</button><Link href="/" className="grid min-h-12 place-items-center rounded-lg bg-emerald-500 font-semibold text-slate-950">🔥 Ещё квест</Link></div>;
}
