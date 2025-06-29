-- Fix profiles table to support favorite_topics for Learn page functionality
-- This addresses the 42703 error (column does not exist)

-- Step 1: Add favorite_topics column to profiles table if it doesn't exist
DO $$ 
BEGIN
    -- Check if the column already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'profiles' 
        AND column_name = 'favorite_topics'
    ) THEN
        -- Add the column as text[] array with empty array default
        ALTER TABLE public.profiles 
        ADD COLUMN favorite_topics text[] DEFAULT '{}';
        
        RAISE NOTICE '✅ Added favorite_topics column to profiles table';
    ELSE
        RAISE NOTICE 'ℹ️ favorite_topics column already exists in profiles table';
    END IF;
END $$;

-- Step 2: Ensure the column has proper default and constraints
ALTER TABLE public.profiles 
ALTER COLUMN favorite_topics SET DEFAULT '{}';

-- Step 3: Update any existing NULL values to empty arrays
UPDATE public.profiles 
SET favorite_topics = '{}' 
WHERE favorite_topics IS NULL;

-- Step 4: Create index for better performance on topic filtering
CREATE INDEX IF NOT EXISTS idx_profiles_favorite_topics 
ON public.profiles USING GIN(favorite_topics);

-- Step 5: Verify the column exists and show sample data
DO $$
DECLARE
    column_exists boolean;
    sample_count integer;
BEGIN
    -- Check if column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'profiles' 
        AND column_name = 'favorite_topics'
        AND data_type = 'ARRAY'
    ) INTO column_exists;
    
    -- Count profiles with the column
    SELECT COUNT(*) INTO sample_count
    FROM public.profiles 
    WHERE favorite_topics IS NOT NULL;
    
    RAISE NOTICE '=== Verification Results ===';
    RAISE NOTICE 'favorite_topics column exists: %', column_exists;
    RAISE NOTICE 'Profiles with favorite_topics: %', sample_count;
    
    IF column_exists THEN
        RAISE NOTICE '✅ SUCCESS: profiles.favorite_topics is ready for Learn page';
    ELSE
        RAISE NOTICE '❌ ERROR: Column creation failed';
    END IF;
END $$;

-- Step 6: Show column information
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'profiles' 
AND column_name = 'favorite_topics';

-- Success message
SELECT '🎉 profiles.favorite_topics setup complete! Learn page should now work.' as status; 