import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("min-h-12 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 text-white", className)} {...props} />;
}
