"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../supabase-browser";
import { UserProfile } from "../types";

interface UseUserReturn {
  user: UserProfile | null; isLoading: boolean; isAuthenticated: boolean; refreshProfile: () => Promise<void>; signOut: () => Promise<void>;
}
export function useUser(): UseUserReturn {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setLoading] = useState(true);
  const refreshProfile = useCallback(async () => {
    const { data: session } = await supabase.auth.getSession();
    const uid = session.session?.user.id;
    if (!uid) { setUser(null); setLoading(false); return; }
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    setUser((data ?? null) as UserProfile | null);
    setLoading(false);
  }, [supabase]);
  useEffect(() => {
    refreshProfile();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { refreshProfile(); });
    return () => sub.subscription.unsubscribe();
  }, [refreshProfile, supabase.auth]);
  const signOut = async () => { await supabase.auth.signOut(); router.push("/"); };
  return { user, isLoading, isAuthenticated: Boolean(user), refreshProfile, signOut };
}
