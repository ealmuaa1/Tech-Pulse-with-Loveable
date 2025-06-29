-- Fix: Update favorite_topics column to be an array type instead of text
-- This approach avoids subquery limitations in ALTER COLUMN

-- Step 1: Add a temporary array column
ALTER TABLE public.profiles 
ADD COLUMN favorite_topics_temp text[];

-- Step 2: Update the temporary column with converted data
UPDATE public.profiles 
SET favorite_topics_temp = CASE 
  WHEN favorite_topics = '[]' OR favorite_topics IS NULL OR favorite_topics = '' THEN ARRAY[]::text[]
  ELSE (
    SELECT ARRAY(
      SELECT json_array_elements_text(favorite_topics::json)
    )
  )
END;

-- Step 3: Drop the old column
ALTER TABLE public.profiles 
DROP COLUMN favorite_topics;

-- Step 4: Rename the temporary column
ALTER TABLE public.profiles 
RENAME COLUMN favorite_topics_temp TO favorite_topics;

-- Step 5: Set default value for new users
ALTER TABLE public.profiles 
ALTER COLUMN favorite_topics 
SET DEFAULT ARRAY[]::text[];

-- Step 6: Update the trigger function to use array type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, favorite_topics)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    ARRAY[]::text[]
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 