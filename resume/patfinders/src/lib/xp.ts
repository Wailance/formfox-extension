import { getLevelFromXp, getStreakMultiplier } from "./constants";
export const calculateQuestXP = (baseXP: number, streak: number) => Math.round(baseXP * getStreakMultiplier(streak));
export function shouldUpdateStreak(lastActiveDate: string | null): { newStreak: "increment" | "reset" | "same" } {
  if (!lastActiveDate) return { newStreak: "increment" };
  const last = new Date(lastActiveDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - last.getTime()) / 86400000);
  if (diffDays === 0) return { newStreak: "same" };
  if (diffDays === 1) return { newStreak: "increment" };
  return { newStreak: "reset" };
}
export const calculateLevel = (xp: number) => getLevelFromXp(xp);
