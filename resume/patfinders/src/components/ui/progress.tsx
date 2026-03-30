export function Progress({ value }: { value: number }) {
  return <div className="h-2 w-full rounded-full bg-slate-700"><div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}
