/* eslint-disable @next/next/no-img-element */
export default function UserAvatar({ username, avatar_url, level, size = "md" }: { username: string; avatar_url?: string; level: number; size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "h-9 w-9 text-sm" : size === "lg" ? "h-20 w-20 text-2xl" : "h-12 w-12 text-base";
  const c = level <= 5 ? "border-slate-400" : level <= 15 ? "border-emerald-400" : level <= 30 ? "border-blue-400" : "border-violet-400";
  return <div className={`${s} ${c} overflow-hidden rounded-full border-2 grid place-items-center bg-slate-700`}>{avatar_url ? <img src={avatar_url} alt={username} className="h-full w-full object-cover" /> : username[0]?.toUpperCase()}</div>;
}
