"use client";
export default function LocationPermission({ requestPermission, error }: { requestPermission: () => Promise<boolean>; error?: string | null }) {
  return <div className="glass-card text-center"><div className="mb-2 text-5xl">📍</div><h2 className="mb-2 text-lg font-semibold">Разреши доступ к геолокации</h2><p className="mb-4 text-sm text-slate-300">Pathfinders нужно знать, где ты находишься, чтобы создавать квесты рядом.</p><button onClick={requestPermission} className="min-h-12 w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950">📍 Разрешить геолокацию</button>{error && <p className="mt-3 text-sm text-red-300">{error}</p>}</div>;
}
