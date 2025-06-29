-- Critical Fix: Add favorite_topics column to profiles table
-- This fixes the "favorite_topics column missing from profiles table" error

-- Step 1: Check and add the missing column
DO $$ 
BEGIN
    -- Check if the column exists
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

-- Step 2: Ensure proper defaults and data integrity
ALTER TABLE public.profiles 
ALTER COLUMN favorite_topics SET DEFAULT '{}';

-- Update any NULL values to empty arrays
UPDATE public.profiles 
SET favorite_topics = '{}' 
WHERE favorite_topics IS NULL;

-- Step 3: Create performance index
CREATE INDEX IF NOT EXISTS idx_profiles_favorite_topics 
ON public.profiles USING GIN(favorite_topics);

-- Step 4: Verification and status
DO $$
DECLARE
    column_exists boolean;
    profile_count integer;
BEGIN
    -- Verify column exists with correct type
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'profiles' 
        AND column_name = 'favorite_topics'
        AND data_type = 'ARRAY'
    ) INTO column_exists;
    
    -- Count total profiles
    SELECT COUNT(*) INTO profile_count FROM public.profiles;
    
    RAISE NOTICE '=== Migration Results ===';
    RAISE NOTICE 'favorite_topics column exists: %', column_exists;
    RAISE NOTICE 'Total profiles in table: %', profile_count;
    
    IF column_exists THEN
        RAISE NOTICE '🎉 SUCCESS: Learn page should now work without 42703 errors!';
    ELSE
        RAISE NOTICE '❌ FAILED: Column creation unsuccessful';
    END IF;
END $$;

-- Step 5: Display final schema info
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name = 'profiles' 
AND column_name = 'favorite_topics';

-- Final success message
SELECT '🚀 Migration complete! Run your app to test the Learn page.' as status; 