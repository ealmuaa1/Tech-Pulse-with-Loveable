-- Create learn_topics table
CREATE TABLE IF NOT EXISTS learn_topics (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_learn_topics_created_at ON learn_topics(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE learn_topics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations on learn_topics" ON learn_topics
  FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_learn_topics_updated_at
  BEFORE UPDATE ON learn_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 