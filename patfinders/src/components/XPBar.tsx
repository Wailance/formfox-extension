"use client";
import { motion } from "framer-motion";
import { getXpProgress } from "@/lib/constants";
export default function XPBar({ currentXP, level }: { currentXP: number; level: number; animated?: boolean }) {
  const { xpInLevel, xpNeeded, percent } = getXpProgress(currentXP);
  return <div className="glass-card"><div className="mb-2 flex justify-between text-sm"><span>Ур. {level}</span><span>{xpInLevel}/{xpNeeded} XP</span></div><div className="h-3 w-full rounded-full bg-slate-700"><motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" /></div></div>;
}
