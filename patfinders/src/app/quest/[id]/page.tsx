import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import QuestClient from "./questClient";
export default async function QuestPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/auth/login");
  const { data: quest } = await supabase.from("quests").select("*").eq("id", params.id).eq("user_id", auth.user.id).single();
  if (!quest) notFound();
  if (quest.status === "completed") redirect(`/quest/${params.id}/complete`);
  return <QuestClient questId={params.id} />;
}
