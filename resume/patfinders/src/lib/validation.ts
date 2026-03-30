import { NarrativeTheme, QuestType } from "./types";

export function isQuestType(value: unknown): value is QuestType {
  return value === "quick" || value === "normal" || value === "epic";
}
export function isNarrativeTheme(value: unknown): value is NarrativeTheme {
  return value === "detective" || value === "history" || value === "fantasy" || value === "humor";
}
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
export function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
