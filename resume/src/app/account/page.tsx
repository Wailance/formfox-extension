"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase-browser";

type PricingPack = { key: string; rub: number; credits: number };
type PaymentItem = {
  payment_id: string;
  pack_key: string;
  credits_added: number;
  amount_rub: number;
  created_at: string;
};

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [remaining, setRemaining] = useState<number>(0);
  const [pricing, setPricing] = useState<PricingPack[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authHeader = useMemo(
    () =>
      session?.access_token
        ? ({ Authorization: `Bearer ${session.access_token}` } as Record<string, string>)
        : null,
    [session?.access_token]
  );

  const loadAccount = async (headers: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resume-adapter/account", {
        headers
      });
      const data = (await response.json()) as {
        remaining?: number;
        pricing?: PricingPack[];
        payments?: PaymentItem[];
        error?: string;
      };
      if (!response.ok) throw new Error(data.error ?? "Не удалось загрузить кабинет");
      setRemaining(data.remaining ?? 0);
      setPricing(data.pricing ?? []);
      setPayments(data.payments ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void supabaseBrowser.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });
    const { data } = supabaseBrowser.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authHeader) return;
    void loadAccount(authHeader);
  }, [authHeader]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") !== "1" || !authHeader) return;
    const paymentId = localStorage.getItem("resume-adapter-pending-payment-id");
    if (!paymentId) return;

    const confirmPayment = async () => {
      try {
        const response = await fetch("/api/resume-adapter/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify({ paymentId })
        });
        const data = (await response.json()) as { error?: string };
        if (!response.ok) throw new Error(data.error ?? "Ошибка подтверждения оплаты");
        localStorage.removeItem("resume-adapter-pending-payment-id");
        await loadAccount(authHeader);
        window.history.replaceState({}, "", "/account");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка подтверждения оплаты");
      }
    };

    void confirmPayment();
  }, [authHeader]);

  const sendMagicLink = async () => {
    if (!email.trim()) return;
    setSendingLink(true);
    setError(null);
    const { error: signInError } = await supabaseBrowser.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/account` : undefined
      }
    });
    setSendingLink(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    setError("Ссылка для входа отправлена на email");
  };

  const logout = async () => {
    await supabaseBrowser.auth.signOut();
    setSession(null);
    setRemaining(0);
    setPayments([]);
  };

  const buyPack = async (pack: string) => {
    if (!authHeader) {
      setError("Сначала войдите в аккаунт");
      return;
    }
    setPaying(true);
    setError(null);
    try {
      const response = await fetch("/api/resume-adapter/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ pack })
      });
      const data = (await response.json()) as {
        checkoutUrl?: string;
        paymentId?: string;
        error?: string;
      };
      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Ошибка при создании оплаты");
      }
      if (data.paymentId) localStorage.setItem("resume-adapter-pending-payment-id", data.paymentId);
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка оплаты");
      setPaying(false);
    }
  };

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-center text-3xl font-bold tracking-tight">Личный кабинет</h1>
        <Card className="space-y-3 p-6">
          <h2 className="text-lg font-semibold">Вход по email</h2>
          <p className="text-sm text-muted-foreground">
            Войдите, чтобы видеть баланс адаптаций и историю покупок.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="button" disabled={sendingLink} onClick={sendMagicLink}>
              {sendingLink ? "Отправка..." : "Войти по ссылке"}
            </Button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-center text-3xl font-bold tracking-tight">Личный кабинет</h1>

      <Card className="space-y-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Вы вошли как <span className="font-semibold text-foreground">{session.user.email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Остаток адаптаций: <span className="font-semibold text-foreground">{remaining}</span>
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Выйти
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {pricing.map((pack) => (
            <Button
              key={pack.key}
              type="button"
              variant="outline"
              disabled={paying || loading}
              onClick={() => buyPack(pack.key)}
            >
              Купить {pack.credits} за {pack.rub} ₽
            </Button>
          ))}
        </div>
      </Card>

      <Card className="space-y-3 p-6">
        <h2 className="text-lg font-semibold">История покупок</h2>
        {loading ? (
          <p className="text-sm text-muted-foreground">Загрузка...</p>
        ) : payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Покупок пока нет</p>
        ) : (
          <div className="space-y-2">
            {payments.map((item) => (
              <div
                key={item.payment_id}
                className="flex items-center justify-between rounded-md border border-border p-3 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {item.credits_added} кредит(ов), пакет {item.pack_key}
                  </p>
                  <p className="text-muted-foreground">
                    {new Date(item.created_at).toLocaleString("ru-RU")}
                  </p>
                </div>
                <p className="font-semibold">{item.amount_rub} ₽</p>
              </div>
            ))}
          </div>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </Card>
    </div>
  );
}

