-- Run this in Supabase SQL Editor to fix:
-- "Database error saving new user"

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
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

  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, requested_username);

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    INSERT INTO public.profiles (id, username)
    VALUES (NEW.id, fallback_username)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  WHEN OTHERS THEN
    INSERT INTO public.profiles (id, username)
    VALUES (NEW.id, fallback_username)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
