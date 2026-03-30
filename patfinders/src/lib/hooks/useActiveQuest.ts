"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "../supabase-browser";
import { getDistanceMeters, isWithinRadius } from "../geo";
import { Coordinates, Quest, QuestTask } from "../types";

interface UseActiveQuestReturn {
  quest: Quest | null; currentTaskIndex: number; currentTask: QuestTask | null; completedTaskIndices: Set<number>; isQuestComplete: boolean;
  distanceToCurrentTask: number | null; isWithinTaskRadius: boolean; completeTask: (taskIndex: number, data?: { photo_url?: string; answer_text?: string }) => Promise<void>;
  abandonQuest: () => Promise<void>; startTime: number; totalDistanceWalked: number;
}
export function useActiveQuest(questId: string, userPosition: Coordinates | null): UseActiveQuestReturn {
  const supabase = useMemo(() => createClient(), []);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [distanceWalked, setDistanceWalked] = useState(0);
  const startTime = useMemo(() => Date.now(), []);
  const prevPos = useRef<Coordinates | null>(null);
  useEffect(() => { (async () => { const { data: q } = await supabase.from("quests").select("*").eq("id", questId).single(); setQuest((q ?? null) as Quest | null); const { data: tc } = await supabase.from("task_completions").select("task_index").eq("quest_id", questId); setDone(new Set((tc ?? []).map((x) => x.task_index as number))); })(); }, [questId, supabase]);
  useEffect(() => { if (userPosition && prevPos.current) setDistanceWalked((v) => v + getDistanceMeters(prevPos.current!, userPosition)); prevPos.current = userPosition; }, [userPosition]);
  const currentTaskIndex = useMemo(() => quest?.tasks.find((t) => !done.has(t.index))?.index ?? 0, [quest, done]);
  const currentTask = quest?.tasks.find((t) => t.index === currentTaskIndex) ?? null;
  const distanceToCurrentTask = !userPosition || !currentTask ? null : getDistanceMeters(userPosition, { lat: currentTask.target_lat, lng: currentTask.target_lng });
  const isWithinTaskRadius = !!userPosition && !!currentTask && isWithinRadius(userPosition, { lat: currentTask.target_lat, lng: currentTask.target_lng }, currentTask.radius_meters);
  const completeTask = async (taskIndex: number, data?: { photo_url?: string; answer_text?: string }) => { await fetch("/api/quest/complete-task", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quest_id: questId, task_index: taskIndex, ...data }) }); setDone((s) => new Set(s).add(taskIndex)); setQuest((q) => (q ? { ...q, completed_tasks: q.completed_tasks + 1 } : q)); };
  const abandonQuest = async () => { await supabase.from("quests").update({ status: "abandoned" }).eq("id", questId); };
  return { quest, currentTaskIndex, currentTask, completedTaskIndices: done, isQuestComplete: !!quest && done.size >= quest.total_tasks, distanceToCurrentTask, isWithinTaskRadius, completeTask, abandonQuest, startTime, totalDistanceWalked: distanceWalked };
}
