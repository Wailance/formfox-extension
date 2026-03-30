import BottomNav from "@/components/BottomNav";
import LeaderboardTable from "@/components/LeaderboardTable";
import { createServerSupabase } from "@/lib/supabase-server";
import { ProfileRow } from "@/lib/db-types";
export default async function LeaderboardPage() {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  const { data } = await supabase.from("profiles").select("id,username,avatar_url,xp,level,current_streak,total_distance_km,total_quests").order("xp", { ascending: false }).limit(20);
  const rows = ((data ?? []) as ProfileRow[]).map((r) => ({ id: r.id, username: r.username, avatar_url: r.avatar_url ?? undefined, xp: r.xp, level: r.level, current_streak: r.current_streak, total_distance_km: r.total_distance_km }));
  return <main className="mx-auto max-w-3xl p-4 pb-24"><h1 className="mb-4 text-2xl font-bold">🏆 Лидерборд</h1><LeaderboardTable rows={rows} me={auth.user?.id} /><BottomNav /></main>;
}
