-- Add settings column to preferences table
-- Run this in your Supabase SQL editor

-- Add settings column to preferences table
ALTER TABLE preferences 
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{"darkMode": false, "notifications": true, "emailUpdates": true}'::jsonb;

-- Create index on settings column for better query performance
CREATE INDEX IF NOT EXISTS idx_preferences_settings ON preferences USING GIN(settings);

-- Update the updated_at trigger to include settings column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS update_preferences_updated_at ON preferences;
CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
