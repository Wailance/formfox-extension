import { getLevelFromXp, getStreakMultiplier } from "@/lib/constants";
import { createServerSupabase } from "@/lib/supabase-server";
import { CompleteTaskRequest } from "@/lib/types";
import { isFiniteNumber, nonEmptyString } from "@/lib/validation";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = (await req.json()) as Partial<CompleteTaskRequest>;
  if (!nonEmptyString(body.quest_id) || !isFiniteNumber(body.task_index)) {
    return NextResponse.json({ error: "Некорректный payload" }, { status: 400 });
  }
  const supabase = createServerSupabase(); const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: quest } = await supabase.from("quests").select("*").eq("id", body.quest_id).eq("user_id", auth.user.id).eq("status", "active").single();
  if (!quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  const task = quest.tasks?.[body.task_index];
  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 400 });
  if (task.type === "quiz") {
    const ok = (body.answer_text ?? "").trim().toLowerCase() === String(task.correct_answer ?? "").trim().toLowerCase();
    if (!ok) return NextResponse.json({ error: "Неверный ответ" }, { status: 400 });
  }
  const profile = await supabase.from("profiles").select("*").eq("id", auth.user.id).single();
  const mult = getStreakMultiplier(profile.data?.current_streak ?? 0);
  const xpEarned = Math.round((task.xp_reward ?? 0) * mult);
  await supabase.from("task_completions").insert({ quest_id: body.quest_id, user_id: auth.user.id, task_index: body.task_index, photo_url: body.photo_url, answer_text: body.answer_text, xp_earned: xpEarned, verified: true });
  await supabase.from("quests").update({ completed_tasks: quest.completed_tasks + 1 }).eq("id", body.quest_id);
  const newXP = (profile.data?.xp ?? 0) + xpEarned; const level = getLevelFromXp(newXP);
  await supabase.from("profiles").update({ xp: newXP, level, total_tasks: (profile.data?.total_tasks ?? 0) + 1 }).eq("id", auth.user.id);
  return NextResponse.json({ success: true, xp_earned: xpEarned, new_total_xp: newXP, new_level: level, streak_multiplier: mult });
}
