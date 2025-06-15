require("dotenv").config();
console.log("DEEPSEEK_API_KEY at startup:", process.env.DEEPSEEK_API_KEY);
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from the frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add your frontend URLs
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
    const OpenAI = require("openai"); // Import OpenAI here to ensure it's server-side
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

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
