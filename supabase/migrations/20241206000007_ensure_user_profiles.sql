-- Migration: Ensure user_profiles table exists and refresh schema cache
-- Description: Recreates the user_profiles table when missing and refreshes PostgREST schema cache

-- Create user_profiles table if it was never provisioned
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  language_preference TEXT DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "push": true,
    "sms": false,
    "eventReminders": true,
    "safetyAlerts": true,
    "communityUpdates": true
  }'::jsonb,
  location_sharing_enabled BOOLEAN DEFAULT false,
  emergency_contacts JSONB DEFAULT '[]'::jsonb,
  preferences JSONB DEFAULT '{
    "favoriteCategories": [],
    "accessibilityNeeds": []
  }'::jsonb,
  gamification_stats JSONB DEFAULT '{
    "badges": [],
    "points": 0,
    "level": 1
  }'::jsonb,
  is_verified BOOLEAN DEFAULT false,
  is_vendor BOOLEAN DEFAULT false,
  is_organizer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all expected columns exist (covers partially created tables)
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS language_preference TEXT DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
    "email": true,
    "push": true,
    "sms": false,
    "eventReminders": true,
    "safetyAlerts": true,
    "communityUpdates": true
  }'::jsonb,
  ADD COLUMN IF NOT EXISTS location_sharing_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS emergency_contacts JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{
    "favoriteCategories": [],
    "accessibilityNeeds": []
  }'::jsonb,
  ADD COLUMN IF NOT EXISTS gamification_stats JSONB DEFAULT '{
    "badges": [],
    "points": 0,
    "level": 1
  }'::jsonb,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_vendor BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_organizer BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Make sure timestamps retain defaults if table already existed
ALTER TABLE public.user_profiles
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();

-- Re-create supporting index when missing
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);

-- Document table purpose
COMMENT ON TABLE public.user_profiles IS 'User profile information extending Supabase auth.users';

-- Force PostgREST schema cache refresh so the table becomes queryable immediately
NOTIFY pgrst, 'reload schema';
