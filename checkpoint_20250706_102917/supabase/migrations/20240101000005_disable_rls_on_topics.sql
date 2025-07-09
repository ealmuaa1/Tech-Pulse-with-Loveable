-- Disable Row Level Security (RLS) on the learn_topics table
-- This allows public read access without a user session, which is suitable for this data.
ALTER TABLE learn_topics DISABLE ROW LEVEL SECURITY;

-- We can also remove the permissive policy now, as it's no longer needed.
-- It's good practice to clean up unused policies.
DROP POLICY IF EXISTS "Allow all operations on learn_topics" ON learn_topics; 