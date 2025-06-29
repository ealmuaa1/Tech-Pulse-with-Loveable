-- MANUAL SQL SCRIPT TO FIX DATABASE CONSTRAINTS
-- Run this script in your Supabase SQL Editor to fix the foreign key constraint issue

-- Step 1: Drop the foreign key constraint first (if it exists)
ALTER TABLE IF EXISTS preferences 
DROP CONSTRAINT IF EXISTS preferences_user_id_fkey CASCADE;

-- Step 2: Drop tables in correct order (child first, then parent)
DROP TABLE IF EXISTS preferences CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Step 3: Recreate profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Step 4: Recreate preferences table with proper foreign key
CREATE TABLE preferences (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  favorite_topics text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Step 5: Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Step 7: Create RLS policies for preferences
CREATE POLICY "Users can view own preferences"
  ON preferences FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON preferences FOR UPDATE USING (auth.uid() = user_id);

-- Step 8: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Add triggers to update timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 10: Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    coalesce(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Also create default preferences
  INSERT INTO public.preferences (user_id, favorite_topics)
  VALUES (NEW.id, '{}');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 12: Verify the schema
-- You can run these queries to verify everything is working:
-- SELECT * FROM profiles LIMIT 1;
-- SELECT * FROM preferences LIMIT 1;
-- \d profiles;
-- \d preferences; 