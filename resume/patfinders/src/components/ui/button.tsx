import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("min-h-12 rounded-lg px-4 py-2 font-medium transition-opacity disabled:opacity-50", className)} {...props} />;
}
