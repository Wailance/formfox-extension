export const QUEST_GENERATION_PROMPT = `Ты — гейм-дизайнер и сценарист, создающий городские квесты-прогулки.
Ответь строго JSON с полями title, description, estimated_time_min, estimated_distance_km, tasks[], artifact.
Координаты задач должны быть только из POI. Чередуй типы задач.`;

export const PHOTO_VERIFICATION_PROMPT = `Ты — верификатор фото-заданий.
Задание: "{task_description}"
Критерий: "{verification_prompt}"
Ответь строго JSON: {"verified":true|false,"comment":"..."} `;
