import express from "express";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";

// Ensure Supabase variables are loaded
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error(
    "Supabase environment variables not found. Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file."
  );
  // Exit or handle the error appropriately
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const router = express.Router();

// Check for GPT_API_KEY
if (!process.env.GPT_API_KEY) {
  console.error(
    "GPT_API_KEY not found. Please add it to your .env file to use the briefs feature."
  );
}

const openai = process.env.GPT_API_KEY
  ? new OpenAI({ apiKey: process.env.GPT_API_KEY })
  : null;

// GET /api/briefs - return latest 10 daily briefs
router.get("/briefs", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("daily_briefs")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(10);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/briefs/generate", async (req, res) => {
  if (!openai) {
    return res
      .status(503)
      .json({ error: "Service unavailable: OpenAI API key not configured." });
  }
  const { trends } = req.body;
  // ... existing code ...
});

export default router;
