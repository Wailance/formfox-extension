import { redirect } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import BottomNav from "@/components/BottomNav";
import QuestCard from "@/components/QuestCard";
import StreakCounter from "@/components/StreakCounter";
import UserAvatar from "@/components/UserAvatar";
import XPBar from "@/components/XPBar";
import { createServerSupabase } from "@/lib/supabase-server";
import { ArtifactRow, ProfileRow, QuestRow } from "@/lib/db-types";
export default async function ProfilePage() {
  const supabase = createServerSupabase(); const { data: auth } = await supabase.auth.getUser(); if (!auth.user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", auth.user.id).single();
  const { data: artifacts } = await supabase.from("user_artifacts").select("*").eq("user_id", auth.user.id).order("earned_at", { ascending: false }).limit(20);
  const { data: quests } = await supabase.from("quests").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(5);
  const typedProfile = profile as ProfileRow | null;
  const typedArtifacts = (artifacts ?? []) as ArtifactRow[];
  const typedQuests = (quests ?? []) as QuestRow[];
  if (!typedProfile) return null;
  return <AuthGuard><main className="mx-auto max-w-3xl space-y-4 p-4 pb-24"><div className="glass-card text-center"><div className="mx-auto w-fit"><UserAvatar username={typedProfile.username} avatar_url={typedProfile.avatar_url ?? undefined} level={typedProfile.level} size="lg" /></div><h1 className="mt-2 text-xl font-bold">@{typedProfile.username}</h1><p className="text-slate-300">Ур.{typedProfile.level}</p><div className="mt-3"><XPBar currentXP={typedProfile.xp} level={typedProfile.level} /></div><div className="mt-2"><StreakCounter streak={typedProfile.current_streak} /></div></div><div className="glass-card"><h2 className="mb-2 font-semibold">Артефакты</h2><div className="flex gap-2 overflow-x-auto">{typedArtifacts.map((a) => <div key={a.id} className={`min-w-[160px] rounded-lg border p-3 rarity-${a.rarity}`}><div className="text-2xl">{a.emoji}</div><p className="font-medium">{a.name}</p><p className="text-xs text-slate-300">{a.description}</p></div>)}</div></div><div className="space-y-2">{typedQuests.map((q) => <QuestCard key={q.id} quest={q} />)}</div></main><BottomNav /></AuthGuard>;
}
