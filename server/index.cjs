const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const googleTrends = require("google-trends-api");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = 4000;

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  process.env.VITE_CLIENT_URL || "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));
app.use(express.json());

// Import checkout routes
const checkoutRoutes = require("./api/checkout");
app.use("/api", checkoutRoutes);

// Helper: Deduplicate by title
function dedupeByTitle(arr) {
  const seen = new Set();
  return arr.filter((item) => {
    if (seen.has(item.title)) return false;
    seen.add(item.title);
    return true;
  });
}

// GET /api/trends
// app.get("/api/trends", async (req, res) => {
//   let googleTopics = [];
//   try {
//     // Google Trends
//     try {
//       const trends = await googleTrends.dailyTrends({ geo: "US" });
//       const trendsData = JSON.parse(trends);
//       googleTopics = (
//         trendsData.default.trendingSearchesDays[0].trendingSearches || []
//       ).map((t) => ({
//         title: t.title.query,
//         source: "Google Trends",
//         url: t.articles[0]?.url || "",
//         image:
//           t.articles[0]?.image?.imageUrl ||
//           `https://source.unsplash.com/400x200/?${encodeURIComponent(
//             t.title.query
//           )}`,
//         summary: t.articles[0]?.title || "",
//       }));
//     } catch (err) {
//       console.error("Google Trends fetch error:", err);
//       googleTopics = [];
//     }
//
//     // Reddit
//     let redditTopics = [];
//     try {
//       const redditRes = await fetch(
//         "https://www.reddit.com/r/technology/top.json?limit=10",
//         {
//           headers: { "User-Agent": "TechPulseBot/1.0" },
//         }
//       );
//       const redditJson = await redditRes.json();
//       redditTopics = redditJson.data.children.map((child) => ({
//         title: child.data.title,
//         source: "Reddit",
//         url: `https://www.reddit.com${child.data.permalink}`,
//         image:
//           child.data.thumbnail && child.data.thumbnail.startsWith("http")
//             ? child.data.thumbnail
//             : `https://source.unsplash.com/400x200/?${encodeURIComponent(
//                 child.data.title.split(" ")[0]
//               )}`,
//         summary: child.data.selftext
//           ? child.data.selftext.substring(0, 100) + "..."
//           : "",
//       }));
//     } catch (err) {
//       console.error("Reddit fetch error:", err);
//       redditTopics = [];
//     }
//
//     // Merge and dedupe
//     const merged = dedupeByTitle([...googleTopics, ...redditTopics]).slice(
//       0,
//       5
//     );
//     if (merged.length === 0) {
//       return res.status(200).json([]); // Return empty array if no topics
//     }
//     res.json(merged);
//   } catch (err) {
//     console.error("Error in /api/trends:", err);
//     res.status(500).json({ error: "Failed to fetch trends" });
//   }
// });

// POST /api/lessons
app.post("/api/lessons", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Missing topic" });

    // GPT-4
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = `