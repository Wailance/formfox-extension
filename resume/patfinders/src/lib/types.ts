export interface Coordinates { lat: number; lng: number; }
export interface POI { id: number; lat: number; lng: number; name: string; type: string; subtype: string; tags: Record<string, string>; }
export type NarrativeTheme = "detective" | "history" | "fantasy" | "humor";
export type QuestType = "quick" | "normal" | "epic";
export type QuestStatus = "active" | "completed" | "abandoned";
export type TaskType = "navigate" | "photo" | "quiz";
export type ArtifactRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export interface QuestTask {
  index: number; type: TaskType; title: string; description: string; narrative: string;
  target_lat: number; target_lng: number; radius_meters: number; xp_reward: number;
  verification_prompt?: string; question?: string; correct_answer?: string; answer_hint?: string;
}
export interface QuestArtifact { name: string; description: string; rarity: ArtifactRarity; emoji: string; }
export interface Quest {
  id: string; user_id: string; title: string; description: string; narrative_theme: NarrativeTheme; quest_type: QuestType; status: QuestStatus;
  tasks: QuestTask[]; total_tasks: number; completed_tasks: number; total_xp: number; estimated_time_min: number; estimated_distance_km: number;
  center_lat: number; center_lng: number; radius_meters: number; created_at: string; completed_at?: string; completion_time_sec?: number;
  completion_distance_km?: number; artifact?: QuestArtifact;
}
export interface TaskCompletion { id: number; quest_id: string; user_id: string; task_index: number; photo_url?: string; answer_text?: string; xp_earned: number; verified: boolean; completed_at: string; }
export interface UserProfile {
  id: string; username: string; avatar_url?: string; xp: number; level: number; current_streak: number; longest_streak: number; last_active_date?: string;
  total_distance_km: number; total_quests: number; total_tasks: number; total_steps: number; created_at: string;
}
export interface UserArtifact { id: number; user_id: string; quest_id: string; name: string; description: string; rarity: ArtifactRarity; emoji: string; earned_at: string; }
export interface GenerateQuestRequest { lat: number; lng: number; quest_type: QuestType; narrative_theme: NarrativeTheme; radius_meters: number; }
export interface VerifyPhotoRequest { quest_id: string; task_index: number; photo_base64: string; verification_prompt: string; }
export interface CompleteTaskRequest { quest_id: string; task_index: number; answer_text?: string; photo_url?: string; }
