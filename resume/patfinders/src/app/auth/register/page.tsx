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
export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="mx-auto max-w-md p-4">
      <Card>
        <h1 className="mb-4 text-3xl font-black">Регистрация</h1>
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const normalizedUsername = username.trim().toLowerCase();
            const normalizedEmail = email.trim().toLowerCase();

            if (normalizedUsername.length < 3) {
              const msg = "Username должен быть не короче 3 символов";
              setError(msg);
              appToast.error(msg);
              return;
            }
            if (!normalizedEmail.includes("@")) {
              const msg = "Введите корректный email";
              setError(msg);
              appToast.error(msg);
              return;
            }
            if (password.length < 6) {
              const msg = "Пароль должен быть не короче 6 символов";
              setError(msg);
              appToast.error(msg);
              return;
            }

            const exists = await supabase
              .from("profiles")
              .select("id")
              .eq("username", normalizedUsername)
              .maybeSingle();
            if (exists.data) {
              const msg = "Username уже занят";
              setError(msg);
              appToast.error(msg);
              return;
            }

            const response = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: normalizedUsername,
                email: normalizedEmail,
                password
              })
            });
            const payload = (await response.json()) as { error?: string };
            if (!response.ok) {
              const message = payload.error ?? "Ошибка регистрации";
              setError(message);
              appToast.error(message);
              return;
            }

            const login = await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password
            });
            if (login.error) {
              appToast.error("Аккаунт создан, но автологин не удался. Войди вручную.");
              router.push("/auth/login");
              return;
            }

            appToast.success("Аккаунт создан");
            router.push("/");
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              placeholder="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button className="w-full bg-emerald-500 font-semibold text-slate-950">Создать аккаунт</Button>
        </form>
        <Button
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: { redirectTo: `${window.location.origin}/auth/callback` }
            });
          }}
          className="mt-2 w-full border border-slate-600"
        >
          Войти через Google
        </Button>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        <p className="mt-4 text-sm">
          <Link href="/auth/login">Уже есть аккаунт? Войди</Link>
        </p>
      </Card>
    </div>
  );
}
