-- Профили пользователей (расширяет auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  total_distance_km DECIMAL(10,2) DEFAULT 0,
  total_quests INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE quests (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  narrative_theme TEXT NOT NULL DEFAULT 'detective',
  quest_type TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  tasks JSONB NOT NULL DEFAULT '[]',
  total_tasks INTEGER NOT NULL DEFAULT 0,
  completed_tasks INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  estimated_time_min INTEGER,
  estimated_distance_km DECIMAL(5,2),
  center_lat DECIMAL(10,7),
  center_lng DECIMAL(10,7),
  radius_meters INTEGER DEFAULT 1000,
  artifact JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_time_sec INTEGER,
  completion_distance_km DECIMAL(5,2)
);
CREATE TABLE task_completions (
  id SERIAL PRIMARY KEY,
  quest_id TEXT REFERENCES quests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  task_index INTEGER NOT NULL,
  photo_url TEXT,
  answer_text TEXT,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  verified BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(quest_id, task_index)
);
CREATE TABLE user_artifacts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id TEXT REFERENCES quests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  emoji TEXT DEFAULT '🔮',
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_quests_user ON quests(user_id);
CREATE INDEX idx_quests_status ON quests(status);
CREATE INDEX idx_task_completions_quest ON task_completions(quest_id);
CREATE INDEX idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX idx_profiles_streak ON profiles(current_streak DESC);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quests_own_read" ON quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quests_own_insert" ON quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quests_own_update" ON quests FOR UPDATE USING (auth.uid() = user_id);
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tc_own" ON task_completions FOR ALL USING (auth.uid() = user_id);
ALTER TABLE user_artifacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "artifacts_own_read" ON user_artifacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "artifacts_insert" ON user_artifacts FOR INSERT WITH CHECK (auth.uid() = user_id);
INSERT INTO storage.buckets (id, name, public) VALUES ('task-photos', 'task-photos', true);
CREATE POLICY "upload_task_photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'task-photos');
CREATE POLICY "read_task_photos" ON storage.objects FOR SELECT USING (bucket_id = 'task-photos');
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  requested_username TEXT;
  fallback_username TEXT;
BEGIN
  requested_username := COALESCE(
    NULLIF(LOWER(TRIM(NEW.raw_user_meta_data->>'username')), ''),
    'explorer_' || LEFT(NEW.id::text, 8)
  );
  fallback_username := 'explorer_' || LEFT(NEW.id::text, 8);

  INSERT INTO profiles (id, username)
  VALUES (NEW.id, requested_username);
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    INSERT INTO profiles (id, username)
    VALUES (NEW.id, fallback_username)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  WHEN OTHERS THEN
    INSERT INTO profiles (id, username)
    VALUES (NEW.id, fallback_username)
    ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
