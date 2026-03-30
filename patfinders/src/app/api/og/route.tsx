import { ImageResponse } from "next/og";
import { createServiceSupabase } from "@/lib/supabase-server";
import { QuestRow } from "@/lib/db-types";
export const runtime = "edge";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("quest_id");
  let title = "Pathfinders";
  let stats = "Исследуй город как RPG";

  if (id) {
    const supabase = createServiceSupabase();
    const { data } = await supabase.from("quests").select("*").eq("id", id).single();
    const quest = data as QuestRow | null;
    if (quest) {
      title = quest.title;
      stats = `📏 ${quest.estimated_distance_km ?? 0} км · ⏱️ ${quest.estimated_time_min ?? 0} мин · ⚡ ${quest.total_xp} XP`;
    }
  }
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", background: "#0F172A", color: "white", padding: 48 }}><div style={{ fontSize: 44, fontWeight: 700 }}>PATHFINDERS 🗺️</div><div style={{ marginTop: 24, fontSize: 56, fontWeight: 800 }}>{title}</div><div style={{ marginTop: 20, fontSize: 28, color: "#A7F3D0" }}>{stats}</div><div style={{ marginTop: 24, fontSize: 24 }}>Попробуй сам → pathfinders.app</div></div>, { width: 1200, height: 630 });
}
