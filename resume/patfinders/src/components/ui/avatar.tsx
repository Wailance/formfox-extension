/* eslint-disable @next/next/no-img-element */
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
export function Avatar({ className, children }: { className?: string; children: ReactNode }) { return <div className={cn("overflow-hidden rounded-full", className)}>{children}</div>; }
export function AvatarImage({ src, alt }: { src: string; alt: string }) { return <img src={src} alt={alt} className="h-full w-full object-cover" />; }
export function AvatarFallback({ children }: { children: ReactNode }) { return <div className="grid h-full w-full place-items-center bg-slate-700">{children}</div>; }
