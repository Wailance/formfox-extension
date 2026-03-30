import { ReactNode } from "react";
export function Dialog({ open, children }: { open: boolean; children: ReactNode }) { return open ? <div className="fixed inset-0 z-50 bg-black/70">{children}</div> : null; }
export function DialogContent({ children }: { children: ReactNode }) { return <div className="mx-auto mt-16 max-w-md glass-card">{children}</div>; }
export function DialogHeader({ children }: { children: ReactNode }) { return <div className="mb-2">{children}</div>; }
export function DialogTitle({ children }: { children: ReactNode }) { return <h2 className="text-lg font-semibold">{children}</h2>; }
