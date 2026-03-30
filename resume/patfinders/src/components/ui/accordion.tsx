"use client";
import { ReactNode, useState } from "react";
export function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="rounded-lg border border-slate-700"><button onClick={() => setOpen((x) => !x)} className="min-h-12 w-full px-3 text-left">{title}</button>{open && <div className="px-3 pb-3 text-sm text-slate-300">{children}</div>}</div>;
}
