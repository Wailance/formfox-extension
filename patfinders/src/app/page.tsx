import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import OnboardingModal from "@/components/OnboardingModal";
import QuestCard from "@/components/QuestCard";
import XPBar from "@/components/XPBar";
import { createServerSupabase } from "@/lib/supabase-server";
import { ProfileRow, QuestRow } from "@/lib/db-types";
import HomeClient from "./pageClient";
export default async function Page() {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  let profile: ProfileRow | null = null;
  let quests: QuestRow[] = [];
  if (auth.user) {
    const p = await supabase.from("profiles").select("*").eq("id", auth.user.id).single(); profile = p.data;
    const q = await supabase.from("quests").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(5); quests = q.data ?? [];
  }
  return <main className="pb-24"><Header /><HomeClient isAuthenticated={Boolean(auth.user)} profile={profile} recentQuests={quests} /><OnboardingModal />{auth.user && profile && <div className="mx-auto mt-4 max-w-3xl px-4"><XPBar currentXP={profile.xp} level={profile.level} /></div>}{auth.user && quests.length > 0 && <div className="mx-auto mt-4 max-w-3xl space-y-2 px-4">{quests.map((q) => <QuestCard key={q.id} quest={q} compact />)}</div>}<BottomNav /></main>;
}
