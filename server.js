import "dotenv/config";
console.log("DEEPSEEK_API_KEY at startup:", process.env.DEEPSEEK_API_KEY);
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import cron from "node-cron"; // Import node-cron
import OpenAI from "openai";
import {
  updateDailyTrends,
  getDailyTrendsWithLessons,
} from "./src/lib/trendFetcher";

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory cache for daily trends, updated every 24 hours via cron job
let dailyTrends = [];

// Function to fetch, parse, deduplicate, and store trends
const fetchAndStoreTrendingTopics = async () => {
  console.log("Fetching and storing daily trends...");
  try {
    await updateDailyTrends();
    dailyTrends = getDailyTrendsWithLessons();
    console.log(`Fetched and stored ${dailyTrends.length} trending topics.`);
  } catch (error) {
    console.error("Error in fetchAndStoreTrendingTopics:", error);
    dailyTrends = [];
  }
};

// Schedule the function to run daily at 2 AM New York time
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

app.get("/api/trends", (req, res) => {
  res.json(dailyTrends);
});

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
    const lessonData = JSON.parse(response.choices[0].message.content);
    res.json(lessonData);
  } catch (error) {
    console.error("Error generating lesson content:", error);
    res.status(500).json({ error: "Failed to generate lesson content" });
  }
});

app.get("/api/lesson/:topicSlug/:lessonId", async (req, res) => {
  const { topicSlug, lessonId } = req.params;
  // In a real application, you would fetch this from a database.
  // For this example, we'll try to find it in the in-memory dailyTrends.

  const trend = dailyTrends.find(
    (t) => t.topic.toLowerCase().replace(/ /g, "-") === topicSlug
  );

  if (trend && trend.lessonContent) {
    // Assuming lessonContent can be broken down into sub-lessons, or just return the whole thing
    // For now, returning the whole lessonContent as a single lesson for the topic.
    // A more complex implementation would involve generating multiple lessonIds within one topic.
    if (lessonId === "overview") {
      // A simple way to access the main lesson content
      return res.json({
        id: lessonId,
        title: trend.lessonContent.title,
        summary: trend.lessonContent.introduction,
        content: trend.lessonContent, // Send the full content
      });
    }
  }
  res.status(404).json({ error: "Lesson not found" });
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
