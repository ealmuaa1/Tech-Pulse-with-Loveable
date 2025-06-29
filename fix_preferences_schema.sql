-- Fix preferences schema for proper favorite_topics handling
-- This script ensures both 'profiles' and 'preferences' tables are properly configured

-- Step 1: Fix missing column in 'profiles' table
-- Add favorite_topics column to profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'favorite_topics'
    ) THEN
        ALTER TABLE profiles ADD COLUMN favorite_topics text[] DEFAULT '{}';
        RAISE NOTICE 'Added favorite_topics column to profiles table';
    ELSE
        RAISE NOTICE 'favorite_topics column already exists in profiles table';
    END IF;
END $$;

-- Step 2: Ensure 'preferences' table exists with proper structure
CREATE TABLE IF NOT EXISTS preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  favorite_topics text[] DEFAULT '{}',
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id) -- Ensure one preferences record per user
);

-- Step 3: Enable RLS on preferences table if not already enabled
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for preferences table
DROP POLICY IF EXISTS "User can access own preferences" ON preferences;
CREATE POLICY "User can access own preferences"
  ON preferences FOR ALL USING (auth.uid() = user_id);

-- Step 5: Create updated_at trigger for preferences if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS update_preferences_updated_at ON preferences;
CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Migrate any existing favorite_topics from profiles to preferences
-- This ensures data consistency if some data exists in profiles table
INSERT INTO preferences (user_id, favorite_topics, updated_at)
SELECT 
  id as user_id, 
  COALESCE(favorite_topics, '{}') as favorite_topics,
  updated_at
FROM profiles 
WHERE id NOT IN (SELECT user_id FROM preferences WHERE user_id IS NOT NULL)
AND favorite_topics IS NOT NULL 
AND array_length(favorite_topics, 1) > 0;

-- Step 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_preferences_user_id ON preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_favorite_topics ON profiles USING GIN(favorite_topics);
CREATE INDEX IF NOT EXISTS idx_preferences_favorite_topics ON preferences USING GIN(favorite_topics);

-- Step 8: Verify the schema
DO $$
DECLARE
    profiles_has_column boolean;
    preferences_exists boolean;
    preferences_has_rls boolean;
BEGIN
    -- Check if profiles has favorite_topics
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'favorite_topics'
    ) INTO profiles_has_column;
    
    -- Check if preferences table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'preferences'
    ) INTO preferences_exists;
    
    -- Check if RLS is enabled on preferences
    SELECT row_security FROM pg_tables 
    WHERE tablename = 'preferences' INTO preferences_has_rls;
    
    RAISE NOTICE 'Schema verification:';
    RAISE NOTICE '- profiles.favorite_topics exists: %', profiles_has_column;
    RAISE NOTICE '- preferences table exists: %', preferences_exists;
    RAISE NOTICE '- preferences RLS enabled: %', COALESCE(preferences_has_rls, false);
END $$;

-- Success message
SELECT 'Preferences schema fix completed successfully!' as status; 