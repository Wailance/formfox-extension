import { getLevelFromXp, RARITY_CONFIG } from "@/lib/constants";
import { createServerSupabase } from "@/lib/supabase-server";
import { shouldUpdateStreak } from "@/lib/xp";
import { isFiniteNumber, nonEmptyString } from "@/lib/validation";
import { NextResponse } from "next/server";
function rollRarity() { const r = Math.random(); let acc = 0; const entries = Object.entries(RARITY_CONFIG) as Array<[keyof typeof RARITY_CONFIG, { chance: number }]>; for (const [k, v] of entries) { acc += v.chance; if (r <= acc) return k; } return "common"; }
export async function POST(req: Request) {
  const body = (await req.json()) as Partial<{ quest_id: string; completion_time_sec: number; completion_distance_km: number }>;
  if (!nonEmptyString(body.quest_id) || !isFiniteNumber(body.completion_time_sec) || !isFiniteNumber(body.completion_distance_km)) {
    return NextResponse.json({ error: "Некорректный payload" }, { status: 400 });
  }
  const supabase = createServerSupabase(); const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const questR = await supabase.from("quests").select("*").eq("id", body.quest_id).eq("user_id", auth.user.id).eq("status", "active").single();
  const quest = questR.data; if (!quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  if (quest.completed_tasks !== quest.total_tasks) return NextResponse.json({ error: "Не все задания выполнены" }, { status: 400 });
  await supabase.from("quests").update({ status: "completed", completed_at: new Date().toISOString(), completion_time_sec: body.completion_time_sec, completion_distance_km: body.completion_distance_km }).eq("id", body.quest_id);
  const profileR = await supabase.from("profiles").select("*").eq("id", auth.user.id).single(); const profile = profileR.data!;
  const bonus = Math.round(quest.total_xp * 0.3); const streakAction = shouldUpdateStreak(profile.last_active_date ?? null);
  const newStreak = streakAction.newStreak === "same" ? profile.current_streak : streakAction.newStreak === "increment" ? profile.current_streak + 1 : 1;
  const newXP = profile.xp + bonus; const newLevel = getLevelFromXp(newXP); const levelUp = newLevel > profile.level;
  await supabase.from("profiles").update({ xp: newXP, level: newLevel, total_quests: profile.total_quests + 1, total_distance_km: Number(profile.total_distance_km) + Number(body.completion_distance_km), current_streak: newStreak, longest_streak: Math.max(profile.longest_streak, newStreak), last_active_date: new Date().toISOString().slice(0, 10) }).eq("id", auth.user.id);
  const artifact = quest.artifact ?? { name: "Осколок Пути", emoji: "🔮", description: "Память о дороге.", rarity: "common" };
  const rarity = rollRarity();
  await supabase.from("user_artifacts").insert({ user_id: auth.user.id, quest_id: quest.id, name: artifact.name, description: artifact.description, emoji: artifact.emoji, rarity });
  return NextResponse.json({ success: true, bonus_xp: bonus, new_xp: newXP, new_level: newLevel, level_up: levelUp, artifact: { ...artifact, rarity }, new_streak: newStreak });
}
