-- Safe migration: Add array column alongside existing text column
-- This allows gradual migration without data loss

-- Add new array column
ALTER TABLE public.profiles 
ADD COLUMN favorite_topics_array text[] DEFAULT ARRAY[]::text[];

-- Populate array column from existing text data
UPDATE public.profiles 
SET favorite_topics_array = CASE 
  WHEN favorite_topics = '[]' OR favorite_topics IS NULL OR favorite_topics = '' THEN ARRAY[]::text[]
  ELSE (
    SELECT ARRAY(
      SELECT json_array_elements_text(favorite_topics::json)
    )
  )
END
WHERE favorite_topics_array IS NULL OR favorite_topics_array = ARRAY[]::text[];

-- Update trigger function to handle both columns during transition
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, favorite_topics, favorite_topics_array)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    '[]',
    ARRAY[]::text[]
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 