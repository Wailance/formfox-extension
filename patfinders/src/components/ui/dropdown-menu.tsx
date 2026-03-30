"use client";
import { ReactNode, useState } from "react";
export function DropdownMenu({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="relative inline-block"><button onClick={() => setOpen((x) => !x)}>{trigger}</button>{open && <div className="absolute right-0 z-50 mt-2 min-w-40 rounded-lg border border-slate-700 bg-slate-900 p-1">{children}</div>}</div>;
}
export function DropdownMenuItem({ onClick, children }: { onClick?: () => void; children: ReactNode }) { return <button onClick={onClick} className="min-h-10 w-full rounded-md px-3 text-left hover:bg-slate-800">{children}</button>; }
