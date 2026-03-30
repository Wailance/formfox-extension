export default function NavigateTask({ distance, canComplete, onComplete }: { distance: string; canComplete: boolean; onComplete: () => void }) {
  return <div className="space-y-2"><p>📏 {distance}</p><button disabled={!canComplete} onClick={onComplete} className="min-h-12 w-full rounded-lg bg-emerald-500 font-semibold text-slate-950 disabled:opacity-50">✅ Я на месте</button></div>;
}
