import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import QuestComplete from "@/components/QuestComplete";
import StatsGrid from "@/components/StatsGrid";
import XPBar from "@/components/XPBar";
import ShareButtons from "@/components/ShareButtons";
import BottomNav from "@/components/BottomNav";
import { ProfileRow, QuestRow } from "@/lib/db-types";
export default async function QuestCompletePage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/auth/login");
  const { data: quest } = await supabase.from("quests").select("*").eq("id", params.id).eq("user_id", auth.user.id).single();
  if (!quest || quest.status !== "completed") redirect(`/quest/${params.id}`);
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", auth.user.id).single();
  const typedQuest = quest as QuestRow;
  const typedProfile = profile as ProfileRow | null;
  return <main className="mx-auto max-w-3xl space-y-4 p-4 pb-24"><QuestComplete title={typedQuest.title} /><StatsGrid stats={[{ emoji: "📏", value: `${typedQuest.completion_distance_km ?? 0} км`, label: "Пройдено" }, { emoji: "⏱️", value: `${Math.round((typedQuest.completion_time_sec ?? 0) / 60)} мин`, label: "Время" }, { emoji: "✅", value: `${typedQuest.total_tasks}/${typedQuest.total_tasks}`, label: "Заданий" }, { emoji: "⚡", value: `${typedQuest.total_xp}`, label: "XP" }]} />{typedProfile && <XPBar currentXP={typedProfile.xp} level={typedProfile.level} />}<ShareButtons quest={typedQuest} resultUrl={`${process.env.NEXT_PUBLIC_APP_URL}/quest/${typedQuest.id}/complete`} /><BottomNav /></main>;
}
