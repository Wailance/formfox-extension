import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/70 p-6 backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
