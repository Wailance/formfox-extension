"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { appToast } from "@/components/ui/toast";
export default function LoginPage() {
  const supabase = createClient(); const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  return <div className="mx-auto max-w-md p-4"><Card><h1 className="mb-2 text-3xl font-black">Pathfinders 🗺️</h1><p className="mb-4 text-slate-300">Войди, чтобы сохранять прогресс</p><form className="space-y-3" onSubmit={async (e) => { e.preventDefault(); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) { setError(error.message); appToast.error(error.message); } else { appToast.success("С возвращением!"); router.push("/"); } }}><div className="space-y-1"><Label htmlFor="email">Email</Label><Input id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div><div className="space-y-1"><Label htmlFor="password">Пароль</Label><Input id="password" placeholder="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div><Button className="w-full bg-emerald-500 font-semibold text-slate-950">Войти</Button></form><Button onClick={async () => { await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } }); }} className="mt-2 w-full border border-slate-600">Войти через Google</Button>{error && <p className="mt-2 text-sm text-red-300">{error}</p>}<p className="mt-4 text-sm"><Link href="/auth/register">Нет аккаунта? Зарегистрируйся</Link></p><p className="mt-1 text-sm"><Link href="/">← На главную</Link></p></Card></div>;
}
