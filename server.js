import "dotenv/config";
console.log("DEEPSEEK_API_KEY at startup:", process.env.DEEPSEEK_API_KEY);
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import cron from "node-cron"; // Import node-cron
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory cache for daily trends, updated every 24 hours via cron job
let dailyTrends = [];

// Utility to generate a simple unique ID for mock data
const generateUniqueId = () => Math.random().toString(36).substring(2, 15);

/**
 * Placeholder for fetching from Glimpse API.
 * Replace with your actual Glimpse API integration.
 * Expected data format from Glimpse API (example):
 * [{
 *   name: string,
 *   category: string,
 *   summary: string,
 *   url: string,
 *   score: number // Add a score for sorting/ranking
 * }]
 */
const fetchFromGlimpse = async () => {
  console.log("Simulating fetch from Glimpse API...");
  // IMPORTANT: Replace this mock data with actual API calls to Glimpse.
  return [
    {
      id: generateUniqueId(),
      name: "Generative AI Ethics",
      category: "AI",
      summary: "Debates around responsible AI development and deployment.",
      url: "https://example.com/generative-ai-ethics",
      score: 85,
    },
    {
      id: generateUniqueId(),
      name: "Web3 Gaming Innovations",
      category: "Blockchain",
      summary: "The rise of play-to-earn models and NFT integration in games.",
      url: "https://example.com/web3-gaming",
      score: 78,
    },
  ];
};

/**
 * Placeholder for fetching from Exploding Topics API.
 * Replace with your actual Exploding Topics API integration.
 * Expected data format from Exploding Topics API (example):
 * [{
 *   name: string,
 *   category: string,
 *   summary: string,
 *   url: string,
 *   score: number // Add a score for sorting/ranking
 * }]
 */
const fetchFromExplodingTopics = async () => {
  console.log("Simulating fetch from Exploding Topics API...");
  // IMPORTANT: Replace this mock data with actual API calls to Exploding Topics.
  return [
    {
      id: generateUniqueId(),
      name: "AI in Drug Discovery",
      category: "Healthcare AI",
      summary: "Accelerating pharmaceutical development with AI algorithms.",
      url: "https://example.com/ai-drug-discovery",
      score: 92,
    },
    {
      id: generateUniqueId(),
      name: "Sustainable Tech Solutions",
      category: "Environment",
      summary:
        "Innovations focusing on eco-friendly technology and circular economy.",
      url: "https://example.com/sustainable-tech",
      score: 88,
    },
  ];
};

// Function to fetch, parse, deduplicate, and store trends
const fetchAndStoreTrendingTopics = async () => {
  console.log("Fetching and storing daily trends...");
  let fetchedTopics = [];

  try {
    const glimpseData = await fetchFromGlimpse();
    fetchedTopics = fetchedTopics.concat(glimpseData);
  } catch (error) {
    console.error("Error fetching from Glimpse API:", error);
  }

  try {
    const explodingTopicsData = await fetchFromExplodingTopics();
    fetchedTopics = fetchedTopics.concat(explodingTopicsData);
  } catch (error) {
    console.error("Error fetching from Exploding Topics API:", error);
  }

  // Transform to desired output format { topic, source, score }
  const transformedTopics = fetchedTopics.map((t) => ({
    topic: t.name, // Using 'name' as 'topic'
    source: t.source || "Unknown",
    score: t.score || 0,
  }));

  // Deduplicate topics by name (which is now 'topic') and keep only top 10-20, sorted by score
  const uniqueAndSortedTopics = Array.from(
    new Map(transformedTopics.map((topic) => [topic.topic, topic])).values()
  ).sort((a, b) => b.score - a.score); // Sort by score descending

  // Limit to top 20 (or fewer if less available)
  dailyTrends = uniqueAndSortedTopics.slice(0, 20);
  console.log(`Fetched and stored ${dailyTrends.length} trending topics.`);
  // console.log("Current dailyTrends:", dailyTrends); // For debugging
};

// Schedule the function to run daily at 2 AM New York time
// This effectively acts as a 24-hour cache.
cron.schedule(
  "0 2 * * *",
  () => {
    fetchAndStoreTrendingTopics();
  },
  {
    scheduled: true,
    timezone: "America/New_York", // Set your desired timezone
  }
);

// Run the function immediately on server start to populate initial data
fetchAndStoreTrendingTopics();

// Configure CORS to allow requests from the frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow frontend from localhost:3000 and 5173
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

app.post("/api/deepseek/lessons", async (req, res) => {
  const { topicSlug } = req.body;

  if (!topicSlug) {
    return res.status(400).json({ error: "Topic slug is required" });
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    console.error("DEEPSEEK_API_KEY is not set in .env for backend");
    return res
      .status(500)
      .json({ error: "Server configuration error: Deepseek API key missing." });
  }

  // Log a confirmation that the key is being used inside the route
  console.log(
    "DEEPSEEK_API_KEY is accessible inside the route handler (first 5 chars):",
    process.env.DEEPSEEK_API_KEY.substring(0, 5)
  );

  try {
    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY, // Directly access process.env here
    });

    const topicName = topicSlug
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert educator tasked with creating engaging and informative lesson plans for various tech topics. For the topic "${topicName}", generate a structured lesson plan suitable for a single web page. Provide at least 3-4 distinct lessons. Each lesson should have a title and a summary. Optionally, include a quizLink and/or flashcardLink if applicable to that lesson (use "/quest/${topicSlug}/quiz" and "/quest/${topicSlug}/flashcards" respectively). The response should be a JSON object with a single key "lessons" which contains an array of lesson objects. Each object in the array must strictly adhere to the Lesson interface: { id: string; title: string; summary: string; quizLink?: string; flashcardLink?: string; }. Ensure the JSON is valid. If you cannot generate the full number of lessons, generate as many as you can.`,
        },
        {
          role: "user",
          content: `Generate lessons for: ${topicName}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from Deepseek API.");
    }

    const parsedContent = JSON.parse(content);
    if (!parsedContent.lessons || !Array.isArray(parsedContent.lessons)) {
      throw new Error(
        "Invalid JSON structure received from Deepseek API. Expected an object with a 'lessons' array."
      );
    }

    res.json({ lessons: parsedContent.lessons });
  } catch (error) {
    console.error(
      "Error fetching dynamic lessons from Deepseek backend:",
      error
    );
    res
      .status(500)
      .json({ error: "Failed to generate lessons from Deepseek." });
  }
});

app.get("/api/images/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  if (!UNSPLASH_ACCESS_KEY) {
    console.error("UNSPLASH_ACCESS_KEY is not set in .env");
    return res
      .status(500)
      .json({ error: "Server configuration error: Unsplash API key missing." });
  }

  try {
    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!unsplashResponse.ok) {
      const errorText = await unsplashResponse.text();
      console.error(
        `Unsplash API error: ${unsplashResponse.status} - ${unsplashResponse.statusText}. Response: ${errorText}`
      );
      return res
        .status(unsplashResponse.status)
        .json({ error: `Unsplash API error: ${unsplashResponse.statusText}` });
    }

    const data = await unsplashResponse.json();

    if (data.results && data.results.length > 0) {
      return res.json({ imageUrl: data.results[0].urls.regular });
    } else {
      return res.status(404).json({ error: "No images found for the query." });
    }
  } catch (error) {
    console.error("Error fetching from Unsplash API:", error);
    return res
      .status(500)
      .json({ error: "Internal server error while fetching image." });
  }
});

// New API endpoint to serve daily trends in the requested format
app.get("/api/daily-trends", (req, res) => {
  res.json(dailyTrends);
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
