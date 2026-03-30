import { DAILY_QUEST_LIMIT } from "@/lib/constants";
import { generateQuest } from "@/lib/openai";
import { fetchPOIs } from "@/lib/overpass";
import { createServerSupabase } from "@/lib/supabase-server";
import { GenerateQuestRequest } from "@/lib/types";
import { isFiniteNumber, isNarrativeTheme, isQuestType } from "@/lib/validation";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = (await req.json()) as Partial<GenerateQuestRequest>;
  if (
    !isFiniteNumber(body.lat) ||
    !isFiniteNumber(body.lng) ||
    !isFiniteNumber(body.radius_meters) ||
    !isQuestType(body.quest_type) ||
    !isNarrativeTheme(body.narrative_theme)
  ) {
    return NextResponse.json({ error: "Некорректные параметры квеста" }, { status: 400 });
  }
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const today = await supabase.from("quests").select("id", { count: "exact", head: true }).eq("user_id", auth.user.id).gte("created_at", todayStart.toISOString());
  if ((today.count ?? 0) >= DAILY_QUEST_LIMIT) return NextResponse.json({ error: "Лимит квестов на сегодня исчерпан" }, { status: 429 });
  const active = await supabase.from("quests").select("id").eq("user_id", auth.user.id).eq("status", "active").maybeSingle();
  if (active.data) return NextResponse.json({ error: "Сначала заверши или отмени текущий квест" }, { status: 409 });
  const profile = await supabase.from("profiles").select("level").eq("id", auth.user.id).single();
  const pois = await fetchPOIs(body.lat, body.lng, body.radius_meters);
  if (pois.length < 3) return NextResponse.json({ error: "В этом районе недостаточно интересных мест. Попробуй увеличить радиус." }, { status: 400 });
  const questData = await generateQuest({ lat: body.lat, lng: body.lng, pois, questType: body.quest_type, narrativeTheme: body.narrative_theme, playerLevel: profile.data?.level ?? 1, radiusMeters: body.radius_meters });
  const id = nanoid(10); const totalXP = Math.round(questData.tasks.reduce((s, t) => s + t.xp_reward, 0) * 1.3);
  const insert = await supabase.from("quests").insert({ id, user_id: auth.user.id, title: questData.title, description: questData.description, narrative_theme: body.narrative_theme, quest_type: body.quest_type, status: "active", tasks: questData.tasks, total_tasks: questData.tasks.length, completed_tasks: 0, total_xp: totalXP, estimated_time_min: questData.estimated_time_min, estimated_distance_km: questData.estimated_distance_km, center_lat: body.lat, center_lng: body.lng, radius_meters: body.radius_meters, artifact: questData.artifact }).select("*").single();
  if (insert.error) return NextResponse.json({ error: insert.error.message }, { status: 500 });
  return NextResponse.json({ success: true, quest: insert.data });
}
