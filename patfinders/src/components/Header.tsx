import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import UserAvatar from "./UserAvatar";
export default async function Header() {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  let profile: { username: string; avatar_url?: string; level: number } | null = null;
  if (auth.user) { const { data } = await supabase.from("profiles").select("username,avatar_url,level").eq("id", auth.user.id).single(); profile = (data as { username: string; avatar_url?: string; level: number } | null); }
  return <header className="sticky top-0 z-40 glass px-4 py-3"><div className="mx-auto flex max-w-3xl items-center justify-between"><Link href="/" className="font-bold gradient-text-green">Pathfinders 🗺️</Link>{profile ? <Link href="/profile"><UserAvatar username={profile.username} avatar_url={profile.avatar_url} level={profile.level} size="sm" /></Link> : <Link href="/auth/login" className="rounded-lg border border-emerald-400 px-3 py-2 text-sm">Войти</Link>}</div></header>;
}
