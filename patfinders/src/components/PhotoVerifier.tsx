"use client";
/* eslint-disable @next/next/no-img-element */
export default function PhotoVerifier({ photoBase64, isVerifying, result }: { photoBase64: string; isVerifying: boolean; result: { verified: boolean; comment: string } | null; }) {
  return <div className="glass-card"><div className={`relative overflow-hidden rounded-lg border ${result?.verified ? "border-emerald-400" : result ? "border-red-400" : "border-slate-600"}`}><img src={`data:image/jpeg;base64,${photoBase64}`} alt="task" className="w-full" />{isVerifying && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent animate-pulse" />}</div><p className="mt-2 text-sm">{isVerifying ? "ИИ проверяет фото..." : result?.comment ?? ""}</p></div>;
}
