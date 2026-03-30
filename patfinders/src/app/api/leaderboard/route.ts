import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? "xp";
  const limit = Number(url.searchParams.get("limit") ?? 20);
  const supabase = createServerSupabase();
  const orderBy = type === "streak" ? "current_streak" : type === "distance" ? "total_distance_km" : "xp";
  const { data, error } = await supabase.from("profiles").select("id,username,avatar_url,xp,level,current_streak,total_distance_km,total_quests").order(orderBy, { ascending: false }).limit(limit);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
