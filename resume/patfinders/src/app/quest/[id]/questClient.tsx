"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Map from "@/components/Map";
import TaskCard from "@/components/TaskCard";
import ActiveQuestView from "@/components/ActiveQuestView";
import PhotoCapture from "@/components/PhotoCapture";
import { useActiveQuest } from "@/lib/hooks/useActiveQuest";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { appToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function QuestClient({ questId }: { questId: string }) {
  const router = useRouter();
  const { position, startWatching, stopWatching } = useGeolocation();
  const [showPhoto, setShowPhoto] = useState(false);
  const [tries, setTries] = useState(0);
  const aq = useActiveQuest(questId, position);

  useEffect(() => {
    startWatching();
    return () => stopWatching();
  }, [startWatching, stopWatching]);

  useEffect(() => {
    if (!(aq.isQuestComplete && aq.quest)) return;
    fetch("/api/quest/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quest_id: questId,
        completion_time_sec: Math.floor((Date.now() - aq.startTime) / 1000),
        completion_distance_km: +(aq.totalDistanceWalked / 1000).toFixed(2)
      })
    }).finally(() => router.push(`/quest/${questId}/complete`));
  }, [aq.isQuestComplete, aq.quest, aq.startTime, aq.totalDistanceWalked, questId, router]);

  if (!aq.quest) return <div className="p-4">Загрузка квеста...</div>;

  const cur = aq.currentTask;

  const markers = aq.quest.tasks.map((t) => ({
    lat: t.target_lat,
    lng: t.target_lng,
    type: aq.completedTaskIndices.has(t.index) ? ("task-done" as const) : ("task" as const),
    label: String(t.index + 1)
  }));

  return (
    <div className="p-4 pb-24">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Button className="border border-slate-600 px-3 py-2" onClick={() => router.push("/")}>
          ✕ Выйти
        </Button>
        <h1 className="line-clamp-1 font-semibold">{aq.quest.title}</h1>
        <span>
          {aq.quest.completed_tasks}/{aq.quest.total_tasks}
        </span>
      </div>

      <div className="h-[45vh] overflow-hidden rounded-xl">
        {position && (
          <Map
            center={[position.lat, position.lng]}
            userPosition={[position.lat, position.lng]}
            markers={markers}
            routePoints={cur ? [[position.lat, position.lng], [cur.target_lat, cur.target_lng]] : undefined}
            currentRadiusMeters={cur?.radius_meters}
          />
        )}
      </div>

      {cur && (
        <div className="mt-3">
          <TaskCard
            task={cur}
            isActive
            isCompleted={aq.completedTaskIndices.has(cur.index)}
            distanceMeters={aq.distanceToCurrentTask}
            isWithinRadius={aq.isWithinTaskRadius}
            onComplete={() => aq.completeTask(cur.index)}
            onPhotoCapture={() => setShowPhoto(true)}
            onQuizAnswer={async (answer) => {
              const r = await fetch("/api/quest/complete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  quest_id: questId,
                  task_index: cur.index,
                  answer_text: answer
                })
              });
              if (r.ok) {
                setTries(0);
                await aq.completeTask(cur.index, { answer_text: answer });
                return;
              }
              setTries((x) => x + 1);
              if (tries >= 2) appToast.error(`Правильный ответ: ${cur.correct_answer ?? "-"}`);
              else appToast.error("Неверно! Попробуй ещё");
            }}
          />
        </div>
      )}

      <ActiveQuestView
        quest={aq.quest}
        currentTask={aq.currentTask}
        currentTaskIndex={aq.currentTaskIndex}
        done={aq.completedTaskIndices}
        distance={aq.distanceToCurrentTask}
        within={aq.isWithinTaskRadius}
        onComplete={() => {
          if (cur) void aq.completeTask(cur.index);
        }}
        onPhoto={() => setShowPhoto(true)}
        onQuiz={() => {
          // This callback is handled in TaskCard for the current task.
        }}
      />

      {showPhoto && cur?.type === "photo" && (
        <PhotoCapture
          onCancel={() => setShowPhoto(false)}
          onCapture={async (b64) => {
            const ver = await fetch("/api/quest/verify-photo", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                quest_id: questId,
                task_index: cur.index,
                photo_base64: b64,
                verification_prompt: cur.verification_prompt
              })
            });
            const data = (await ver.json()) as { verified: boolean; comment: string; photo_url?: string };
            if (!data.verified) {
              appToast.error(data.comment);
              return;
            }
            await aq.completeTask(cur.index, { photo_url: data.photo_url });
            setShowPhoto(false);
            appToast.success("+XP");
          }}
        />
      )}
    </div>
  );
}
