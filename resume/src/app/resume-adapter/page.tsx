"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Session } from "@supabase/supabase-js";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase-browser";

type PricingPack = { key: string; rub: number; credits: number };

export default function ResumeAdapterPage() {
  const searchParams = useSearchParams();
  const [vacancyText, setVacancyText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [remaining, setRemaining] = useState<number>(0);
  const [pricing, setPricing] = useState<PricingPack[]>([]);
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [sendingLink, setSendingLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => Boolean(vacancyText.trim() && resumeFile && !loading),
    [vacancyText, resumeFile, loading]
  );

  const authHeader = useMemo(
    () =>
      session?.access_token
        ? ({ Authorization: `Bearer ${session.access_token}` } as Record<string, string>)
        : null,
    [session?.access_token]
  );

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
    const loadBalance = async () => {
      const response = await fetch("/api/resume-adapter/balance", {
        headers: authHeader
      });
      const data = (await response.json()) as {
        remaining?: number;
        pricing?: PricingPack[];
        error?: string;
      };
      if (!response.ok) {
        setError(data.error ?? "Не удалось загрузить баланс");
        return;
      }
      setRemaining(data.remaining ?? 0);
      setPricing(data.pricing ?? []);
    };
    void loadBalance();
  }, [authHeader]);

  useEffect(() => {
    if (!authHeader) return;
    const paid = searchParams.get("paid");
    if (paid !== "1") return;
    const paymentId = localStorage.getItem("resume-adapter-pending-payment-id");
    if (!paymentId) return;

    const confirm = async () => {
      const response = await fetch("/api/resume-adapter/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ paymentId })
      });
      const data = (await response.json()) as { remaining?: number; error?: string };
      if (!response.ok) {
        setError(data.error ?? "Ошибка подтверждения оплаты");
        return;
      }
      localStorage.removeItem("resume-adapter-pending-payment-id");
      setRemaining(data.remaining ?? 0);
      window.history.replaceState({}, "", "/resume-adapter");
    };
    void confirm();
  }, [searchParams, authHeader]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || !resumeFile) return;

    setLoading(true);
    setError(null);
    setResult("");

    try {
      if (!authHeader) throw new Error("Сначала войдите в аккаунт");
      const form = new FormData();
      form.append("vacancyText", vacancyText);
      form.append("resumeFile", resumeFile);

      const response = await fetch("/api/resume-adapter", {
        method: "POST",
        headers: authHeader,
        body: form
      });

      const data = (await response.json()) as {
        adaptedResume?: string;
        remaining?: number;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error ?? "Ошибка адаптации");
      setResult(data.adaptedResume ?? "");
      setRemaining(data.remaining ?? remaining);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  };

  const exportDocx = async () => {
    if (!result) return;
    const response = await fetch("/api/resume-adapter/export-docx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: result })
    });
    if (!response.ok) {
      setError("Не удалось экспортировать docx");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adapted-resume.docx";
    a.click();
    URL.revokeObjectURL(url);
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
      if (data.paymentId) {
        localStorage.setItem("resume-adapter-pending-payment-id", data.paymentId);
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка оплаты");
    } finally {
      setPaying(false);
    }
  };

  const sendMagicLink = async () => {
    if (!email.trim()) return;
    setSendingLink(true);
    setError(null);
    const { error: signInError } = await supabaseBrowser.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/resume-adapter`
            : undefined
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
    setResult("");
    setRemaining(0);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-center text-3xl font-bold tracking-tight">
        Адаптер резюме под вакансию
      </h1>

      {!session ? (
        <Card className="space-y-3 p-6">
          <h2 className="text-lg font-semibold">Вход в личный кабинет</h2>
          <p className="text-sm text-muted-foreground">
            Войдите по email, чтобы баланс и покупки были привязаны к аккаунту.
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
      ) : (
        <>
          <Card className="space-y-3 p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Вы вошли как{" "}
                  <span className="font-semibold text-foreground">{session.user.email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Баланс адаптаций:{" "}
                  <span className="font-semibold text-foreground">{remaining}</span>
                </p>
              </div>
              <Button variant="outline" onClick={logout}>
                Выйти
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              1 адаптация бесплатно. Далее: 19 ₽ за адаптацию или пакеты.
            </p>
            <div className="flex flex-wrap gap-2">
              {pricing.map((pack) => (
                <Button
                  key={pack.key}
                  variant="outline"
                  type="button"
                  disabled={paying}
                  onClick={() => buyPack(pack.key)}
                >
                  Купить {pack.credits} за {pack.rub} ₽
                </Button>
              ))}
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Текст вакансии</label>
                <textarea
                  value={vacancyText}
                  onChange={(e) => setVacancyText(e.target.value)}
                  placeholder="Вставьте описание вакансии..."
                  className="min-h-[220px] w-full rounded-md border border-border bg-background p-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Файл резюме (.txt или .docx)</label>
                <input
                  type="file"
                  accept=".txt,.docx,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm"
                />
              </div>

              <Button type="submit" disabled={!canSubmit}>
                {loading ? "Адаптируем..." : "Адаптировать резюме"}
              </Button>
            </form>

            {error && <p className="text-sm text-red-400">{error}</p>}
          </Card>

          <Card className="space-y-3 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Результат</h2>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={copyResult} disabled={!result}>
                  Копировать
                </Button>
                <Button type="button" onClick={exportDocx} disabled={!result}>
                  Экспорт в DOCX
                </Button>
              </div>
            </div>
            <textarea
              value={result}
              readOnly
              placeholder="Здесь появится адаптированный текст резюме..."
              className="min-h-[320px] w-full rounded-md border border-border bg-background p-3 text-sm outline-none"
            />
          </Card>
        </>
      )}
    </div>
  );
}

