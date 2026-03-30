"use client";
import { useUser } from "@/lib/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useUser();
  const router = useRouter();
  useEffect(() => { if (!isLoading && !isAuthenticated) router.replace("/auth/login"); }, [isLoading, isAuthenticated, router]);
  if (isLoading) return <div className="p-4"><div className="h-24 animate-pulse rounded-xl bg-slate-800" /></div>;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
