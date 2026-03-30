import OpenAI from "openai";
import { getDistanceMeters } from "./geo";
import { QUEST_TYPES } from "./constants";
import { PHOTO_VERIFICATION_PROMPT, QUEST_GENERATION_PROMPT } from "./prompts";
import { NarrativeTheme, POI, QuestArtifact, QuestTask, QuestType } from "./types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function fallbackQuest(pois: POI[]) {
  const tasks: QuestTask[] = pois.slice(0, 3).map((p, i) => ({
    index: i, type: "navigate", title: `Точка ${i + 1}`, description: `Дойди до ${p.name}.`,
    narrative: "Путь зовет исследователя вперед.", target_lat: p.lat, target_lng: p.lng, radius_meters: 50, xp_reward: 30
  }));
  return {
    title: "Быстрая разведка района",
    description: "Небольшой квест по ближайшим местам.",
    tasks,
    artifact: { name: "Компас Следопыта", description: "Светится при приближении к тайнам.", rarity: "common", emoji: "🧭" } as QuestArtifact,
    estimated_time_min: 20,
    estimated_distance_km: 1.2
  };
}

export async function generateQuest(params: {
  lat: number; lng: number; pois: POI[]; questType: QuestType; narrativeTheme: NarrativeTheme; playerLevel: number; radiusMeters: number;
}): Promise<{ title: string; description: string; tasks: QuestTask[]; artifact: QuestArtifact; estimated_time_min: number; estimated_distance_km: number }> {
  const countCfg = QUEST_TYPES.find((q) => q.value === params.questType)?.taskCount ?? [3, 5];
  const msg = `Центр прогулки: ${params.lat}, ${params.lng}\nРадиус: ${params.radiusMeters}м\nТип квеста: ${params.questType} (${countCfg[0]}-${countCfg[1]} заданий)\nТема: ${params.narrativeTheme}\nУровень игрока: ${params.playerLevel}\n\nТочки интереса рядом:\n${params.pois.map((poi) => `- [${poi.lat}, ${poi.lng}] ${poi.name} (${poi.type}: ${poi.subtype}) ${JSON.stringify(poi.tags)}`).join("\n")}`;
  const run = async () => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: QUEST_GENERATION_PROMPT }, { role: "user", content: msg }],
      max_tokens: 2000,
      temperature: 0.9,
      response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0]?.message?.content ?? "{}") as {
      title: string; description: string; tasks: QuestTask[]; artifact: QuestArtifact; estimated_time_min: number; estimated_distance_km: number;
    };
  };
  let parsed: ReturnType<typeof fallbackQuest>;
  try { parsed = await run(); } catch { try { parsed = await run(); } catch { return fallbackQuest(params.pois); } }
  const tasks = (parsed.tasks ?? []).map((t, i) => {
    const within = getDistanceMeters({ lat: params.lat, lng: params.lng }, { lat: t.target_lat, lng: t.target_lng }) <= params.radiusMeters;
    if (within) return { ...t, index: i };
    const nearest = params.pois.reduce((a, b) => (getDistanceMeters({ lat: params.lat, lng: params.lng }, { lat: a.lat, lng: a.lng }) < getDistanceMeters({ lat: params.lat, lng: params.lng }, { lat: b.lat, lng: b.lng }) ? a : b));
    return { ...t, index: i, target_lat: nearest.lat, target_lng: nearest.lng };
  });
  return { ...parsed, tasks };
}

export async function verifyPhoto(params: { photoBase64: string; taskDescription: string; verificationPrompt: string }): Promise<{ verified: boolean; comment: string }> {
  const prompt = PHOTO_VERIFICATION_PROMPT.replace("{task_description}", params.taskDescription).replace("{verification_prompt}", params.verificationPrompt);
  try {
    const c = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: [{ type: "image_url", image_url: { url: `data:image/jpeg;base64,${params.photoBase64}` } }] as never }
      ],
      max_tokens: 200,
      temperature: 0.3,
      response_format: { type: "json_object" }
    });
    const parsed = JSON.parse(c.choices[0]?.message?.content ?? "{}") as { verified?: boolean; comment?: string };
    return { verified: Boolean(parsed.verified), comment: parsed.comment ?? "Проверка завершена." };
  } catch {
    return { verified: true, comment: "ИИ не смог проверить, но верим тебе! 🤝" };
  }
}
