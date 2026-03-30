import { Database } from "./supabase-types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type QuestRow = Database["public"]["Tables"]["quests"]["Row"];
export type ArtifactRow = Database["public"]["Tables"]["user_artifacts"]["Row"];
