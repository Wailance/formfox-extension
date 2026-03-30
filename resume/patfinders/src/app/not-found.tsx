import Link from "next/link";
export default function NotFound() {
  return <div className="grid min-h-screen place-items-center p-4 text-center"><div><h1 className="text-3xl font-black">404 — Ты забрёл слишком далеко! 🗺️</h1><p className="mt-2 text-slate-300">Такой страницы не существует</p><Link href="/" className="mt-4 inline-block min-h-12 rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-slate-950">🏠 Вернуться на базу</Link></div></div>;
}
