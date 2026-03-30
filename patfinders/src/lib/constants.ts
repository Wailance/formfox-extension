import { ArtifactRarity, NarrativeTheme, QuestType } from "./types";

export const LEVEL_BASE_XP = 150;
export const xpForLevel = (level: number) => LEVEL_BASE_XP * level;
export const totalXpForLevel = (level: number) => (LEVEL_BASE_XP * level * (level + 1)) / 2;
export function getLevelFromXp(totalXp: number): number { let l = 1; let acc = 0; while (acc + xpForLevel(l) <= totalXp) { acc += xpForLevel(l); l++; } return l - 1 || 1; }
export function getXpProgress(totalXp: number) { const lvl = getLevelFromXp(totalXp); const curr = totalXpForLevel(lvl); const next = totalXpForLevel(lvl + 1); const needed = next - curr; const inLvl = Math.max(0, totalXp - curr); return { currentLevel: lvl, xpInLevel: inLvl, xpNeeded: needed, percent: Math.min(100, Math.round((inLvl / needed) * 100)) }; }
export const getStreakMultiplier = (streak: number) => (streak <= 7 ? 1 : streak <= 30 ? 1.5 : 2);
export const LEVEL_TITLES: Record<number, string> = { 1: "🥾 Новичок", 5: "🧭 Следопыт", 10: "🗺️ Картограф", 20: "⚔️ Рейнджер", 30: "🏰 Мастер", 50: "👑 Легенда" };
export function getLevelTitle(level: number): string { const keys = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a); return LEVEL_TITLES[keys.find((k) => level >= k) ?? 1]; }
export const NARRATIVE_THEMES: { value: NarrativeTheme; label: string; emoji: string; description: string }[] = [
  { value: "detective", label: "Детектив", emoji: "🔍", description: "Расследуй загадки и ищи улики" },
  { value: "history", label: "История", emoji: "📜", description: "Узнай историю мест вокруг" },
  { value: "fantasy", label: "Фэнтези", emoji: "⚔️", description: "Магия и древние артефакты" },
  { value: "humor", label: "Юмор", emoji: "😂", description: "Мемные и абсурдные задания" }
];
export const QUEST_TYPES: { value: QuestType; label: string; emoji: string; time: string; radius: number; taskCount: [number, number] }[] = [
  { value: "quick", label: "Разведка", emoji: "🟢", time: "10-15 мин", radius: 500, taskCount: [3, 5] },
  { value: "normal", label: "Экспедиция", emoji: "🟡", time: "30-60 мин", radius: 1000, taskCount: [6, 10] },
  { value: "epic", label: "Одиссея", emoji: "🔴", time: "1-2 часа", radius: 2000, taskCount: [10, 15] }
];
export const RARITY_CONFIG: Record<ArtifactRarity, { label: string; color: string; chance: number }> = {
  common: { label: "Обычный", color: "#9CA3AF", chance: 0.5 }, uncommon: { label: "Необычный", color: "#22C55E", chance: 0.3 },
  rare: { label: "Редкий", color: "#3B82F6", chance: 0.12 }, epic: { label: "Эпический", color: "#8B5CF6", chance: 0.06 }, legendary: { label: "Легендарный", color: "#F59E0B", chance: 0.02 }
};
export const QUEST_LOADING_MESSAGES = ["Исследую окрестности...", "Нахожу интересные места рядом...", "Составляю маршрут...", "Придумываю сюжет...", "Почти готово..."];
export const TASK_TYPE_CONFIG = { navigate: { label: "Дойди", emoji: "🚶", color: "#3B82F6" }, photo: { label: "Сфоткай", emoji: "📸", color: "#8B5CF6" }, quiz: { label: "Ответь", emoji: "❓", color: "#F59E0B" } };
export const DAILY_QUEST_LIMIT = 2;
