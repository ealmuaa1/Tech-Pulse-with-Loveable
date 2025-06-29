-- Disable realtime for profiles table to prevent 404 WebSocket errors
-- This fixes the "Failed to load resource: the server responded with a status of 404" error

-- Remove profiles table from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.profiles;

-- Verify the change
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename = 'profiles';

-- Success message
SELECT 'Realtime disabled for profiles table - 404 errors should be resolved!' as status; 