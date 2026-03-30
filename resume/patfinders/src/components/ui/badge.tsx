import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full bg-slate-700 px-2 py-1 text-xs", className)} {...props} />;
}
