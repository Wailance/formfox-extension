"use client";
import { ReactNode, useState } from "react";
export function Tabs({ defaultValue, children }: { defaultValue: string; children: (value: string, setValue: (v: string) => void) => ReactNode }) { const [value, setValue] = useState(defaultValue); return <>{children(value, setValue)}</>; }
export function TabsList({ children }: { children: ReactNode }) { return <div className="grid grid-cols-3 gap-2">{children}</div>; }
export function TabsTrigger({ active, onClick, children }: { active?: boolean; onClick: () => void; children: ReactNode }) { return <button onClick={onClick} className={`min-h-12 rounded-lg border ${active ? "border-emerald-400 text-emerald-300" : "border-slate-600"}`}>{children}</button>; }
