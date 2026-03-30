# Pathfinders

MVP PWA для городских RPG-квестов на Next.js 14 + Supabase + OpenAI.

## Быстрый запуск

1. Установите Node.js 20+.
2. Вставьте ключи в `.env.local`.
3. Установите зависимости:
   - `npm install`
4. Запустите локально:
   - `npm run dev`

## Важные переменные

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## База данных

Выполните SQL из `supabase/schema.sql` в SQL Editor Supabase.

## Что реализовано

- Аутентификация (email/password + Google OAuth callback)
- Генерация квестов через GPT-4o на основе POI (Overpass/OSM)
- Активный квест: navigate/photo/quiz задания
- Верификация фото через GPT-4o vision
- XP, уровни, стрики, артефакты, лидерборд
- PWA manifest + middleware refresh сессии
