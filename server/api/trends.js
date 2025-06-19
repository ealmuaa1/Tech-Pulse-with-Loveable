import express from "express";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Initialize Supabase client with error handling
let supabase = null;
try {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase client initialized successfully");
  } else {
    console.warn(
      "Supabase environment variables not found, skipping Supabase operations"
    );
  }
} catch (err) {
  console.error("Failed to initialize Supabase client:", err);
}

// Initialize OpenAI with error handling
let openai = null;
try {
  if (process.env.GPT_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.GPT_API_KEY,
    });
    console.log("OpenAI client initialized successfully");
  } else {
    console.warn("GPT_API_KEY not found, skipping GPT operations");
  }
} catch (err) {
  console.error("Failed to initialize OpenAI client:", err);
}

// Helper function to fetch image with fallback
async function fetchImageForTopic(title) {
  try {
    // Try Unsplash first if API key is available
    if (process.env.VITE_UNSPLASH_API_KEY) {
      const unsplashRes = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
          title
        )}`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.VITE_UNSPLASH_API_KEY}`,
          },
        }
      );
      const unsplashData = await unsplashRes.json();
      if (unsplashData?.urls?.regular) {
        return unsplashData.urls.regular;
      }
    }
    throw new Error("Unsplash failed or not configured");
  } catch (err) {
    // Fallback to Pixabay if API key is available
    if (process.env.VITE_PIXABAY_API_KEY) {
      try {
        const pixabayRes = await fetch(
          `https://pixabay.com/api/?key=${
            process.env.VITE_PIXABAY_API_KEY
          }&q=${encodeURIComponent(title)}&image_type=photo`
        );

        if (!pixabayRes.ok) {
          throw new Error(`Pixabay API error: ${pixabayRes.status}`);
        }

        const pixabayData = await pixabayRes.json();
        if (pixabayData?.hits?.length) {
          return pixabayData.hits[0].webformatURL;
        }
      } catch (pixabayErr) {
        console.error("Pixabay fallback failed:", pixabayErr.message);
      }
    } else {
      console.warn("Pixabay API key not found, skipping Pixabay fallback");
    }
    // Final fallback
    return "https://via.placeholder.com/400x200?text=No+Image";
  }
}

// Helper function to generate GPT summary
async function generateSummary(title) {
  if (!openai) {
    console.warn("OpenAI not configured, returning default summary");
    return "No summary available (GPT not configured).";
  }

  try {
    const prompt = `Summarize this tech trend in 2-3 lines: ${title}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });
    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error("GPT summary generation failed:", err);
    return "No summary available.";
  }
}

// Helper function to save topic to Supabase
async function saveTopicToSupabase(topic) {
  if (!supabase) {
    console.warn("Supabase not configured, skipping save operation");
    return false;
  }

  try {
    const { data, error } = await supabase
      .from("learn_topics")
      .insert([topic])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase save failed:", err);
    return false;
  }
}

// Helper function to fetch Hacker News top stories
async function fetchHackerNewsTopics() {
  try {
    // Get top story IDs
    const topIdsRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const topIds = await topIdsRes.json();

    // Fetch details for first 5 stories
    const storyPromises = topIds.slice(0, 5).map(async (id) => {
      const storyRes = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return storyRes.json();
    });

    const stories = await Promise.all(storyPromises);
    return stories.filter((story) => story && story.title);
  } catch (err) {
    console.error("Hacker News fetch failed:", err);
    return [];
  }
}

// Helper function to fetch Reddit topics
async function fetchRedditTopics(limit = 5) {
  try {
    const redditRes = await fetch(
      `https://www.reddit.com/r/technology/top.json?limit=${limit}`,
      {
        headers: { "User-Agent": "TechPulseBot/1.0" },
      }
    );
    const redditData = await redditRes.json();

    if (!redditData.data?.children) {
      throw new Error("Failed to fetch Reddit data");
    }

    return redditData.data.children.map((post) => ({
      title: post.data.title,
      url: `https://reddit.com${post.data.permalink}`,
      source: "Reddit",
    }));
  } catch (err) {
    console.error("Reddit fetch failed:", err);
    return [];
  }
}

router.get("/trends", async (req, res) => {
  try {
    const { source } = req.query;
    console.log(`Fetching trends for source: ${source || "default"}`);

    if (source === "learn") {
      // Fetch from Hacker News for Learn page
      console.log("Fetching Hacker News topics for Learn page...");
      const hnStories = await fetchHackerNewsTopics();

      if (hnStories.length === 0) {
        console.log("Hacker News fetch failed, falling back to Reddit...");
        const redditTopics = await fetchRedditTopics(5);
        const topics = redditTopics.map((topic) => ({
          title: topic.title,
          summary: "No summary available.",
          image: "https://via.placeholder.com/400x200?text=No+Image",
          url: topic.url,
          id: `reddit-${Date.now()}-${Math.random()}`,
        }));
        return res.json(topics);
      }

      // Process each Hacker News story
      const topics = [];
      for (const story of hnStories) {
        const title = story.title;

        // Generate summary and fetch image in parallel
        const [summary, image] = await Promise.all([
          generateSummary(title),
          fetchImageForTopic(title),
        ]);

        const topic = {
          title,
          summary,
          image,
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          id: `hn-${story.id}`,
          created_at: new Date().toISOString(),
        };

        // Save to Supabase (if configured)
        if (supabase) {
          await saveTopicToSupabase(topic);
        }
        topics.push(topic);
      }

      // Return the latest 5 learn_topics from Supabase (if configured)
      if (supabase) {
        const { data: latestTopics, error } = await supabase
          .from("learn_topics")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) {
          console.error("Supabase fetch error:", error);
          res.json(topics); // Return the topics we just processed
        } else {
          res.json(latestTopics);
        }
      } else {
        res.json(topics); // Return the topics we just processed
      }
    } else {
      // Default behavior for homepage - fetch from Reddit
      console.log("Fetching Reddit topics for Homepage...");
      const redditTopics = await fetchRedditTopics(5);

      if (redditTopics.length === 0) {
        console.log("Reddit fetch failed, returning fallback data...");
        return res.json([
          {
            title: "AI Revolution in Healthcare",
            summary: "No summary available.",
            image: "https://via.placeholder.com/400x200?text=No+Image",
            id: "fallback-1",
          },
          {
            title: "Quantum Computing Breakthrough",
            summary: "No summary available.",
            image: "https://via.placeholder.com/400x200?text=No+Image",
            id: "fallback-2",
          },
          {
            title: "Sustainable Tech Innovations",
            summary: "No summary available.",
            image: "https://via.placeholder.com/400x200?text=No+Image",
            id: "fallback-3",
          },
        ]);
      }

      const topics = redditTopics.map((topic) => ({
        title: topic.title,
        summary: "No summary available.",
        image: "https://via.placeholder.com/400x200?text=No+Image",
        url: topic.url,
        id: `reddit-${Date.now()}-${Math.random()}`,
      }));

      res.json(topics);
    }
  } catch (err) {
    console.error("Error in /api/trends:", err);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

export default router;
