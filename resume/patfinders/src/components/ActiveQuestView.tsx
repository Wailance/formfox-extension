"use client";
import { Quest, QuestTask } from "@/lib/types";
import TaskCard from "./TaskCard";
export default function ActiveQuestView({ quest, currentTask, currentTaskIndex, done, distance, within, onComplete, onPhoto, onQuiz }: { quest: Quest; currentTask: QuestTask | null; currentTaskIndex: number; done: Set<number>; distance: number | null; within: boolean; onComplete: () => void; onPhoto: () => void; onQuiz: (a: string) => void; }) {
  if (!currentTask) return <div className="glass-card">Все задания выполнены!</div>;
  return <div className="space-y-3"><TaskCard task={currentTask} isActive isCompleted={done.has(currentTask.index)} distanceMeters={distance} isWithinRadius={within} onComplete={onComplete} onPhotoCapture={onPhoto} onQuizAnswer={onQuiz} /><div className="text-sm text-slate-300">Прогресс: {currentTaskIndex + 1}/{quest.total_tasks}</div></div>;
}
