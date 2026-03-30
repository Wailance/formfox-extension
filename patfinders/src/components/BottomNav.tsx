"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const items = [{ href: "/", label: "Главная", icon: "🏠" }, { href: "/", label: "Квест", icon: "🗺️" }, { href: "/leaderboard", label: "Рейтинг", icon: "🏆" }, { href: "/profile", label: "Профиль", icon: "👤" }];
export default function BottomNav() {
  const pathname = usePathname();
  return <nav className="fixed bottom-0 left-0 right-0 z-40 glass px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2"><div className="mx-auto grid max-w-3xl grid-cols-4 gap-1">{items.map((i) => <Link key={i.label} href={i.href} className={`grid min-h-12 place-items-center rounded-lg text-xs ${pathname === i.href ? "text-emerald-400" : "text-slate-300"}`}><span>{i.icon}</span><span>{i.label}</span></Link>)}</div></nav>;
}
