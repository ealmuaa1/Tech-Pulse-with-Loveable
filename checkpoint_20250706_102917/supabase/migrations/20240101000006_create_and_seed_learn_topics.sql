-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the learn_topics table with the specified schema
CREATE TABLE IF NOT EXISTS learn_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  image_url TEXT,
  source TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for clarity
COMMENT ON COLUMN learn_topics.slug IS 'URL-friendly slug for linking to the quest page.';

-- Insert realistic test data into the learn_topics table
INSERT INTO learn_topics (title, summary, image_url, source, slug, category) VALUES
(
  'The Rise of GPT-4o',
  'A deep dive into OpenAI''s latest multimodal model, exploring its capabilities in text, audio, and vision, and what it means for the future of AI interaction.',
  'https://source.unsplash.com/400x200/?AI,GPT',
  'OpenAI',
  'gpt-4o-rise',
  'AI'
),
(
  'Devin: The First AI Software Engineer?',
  'Analyzing the capabilities and controversies surrounding Devin, the AI agent aiming to automate software development tasks. Is it hype or the real deal?',
  'https://source.unsplash.com/400x200/?AI,software,developer',
  'Product Hunt',
  'devin-ai-software-engineer',
  'AI'
),
(
  'The Future of Decentralized Social Media',
  'Exploring protocols like Farcaster and Lens that are challenging centralized platforms like Twitter and Facebook by giving users control over their data.',
  'https://source.unsplash.com/400x200/?social,media,decentralized',
  'Quora',
  'decentralized-social-media',
  'Web3'
);

-- Since this is public data, we will disable RLS for simplicity.
-- For sensitive data, you would define row-level security policies instead.
ALTER TABLE learn_topics DISABLE ROW LEVEL SECURITY; 