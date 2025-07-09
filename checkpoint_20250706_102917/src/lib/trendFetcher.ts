import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import * as xml2js from "xml2js";
import * as dotenv from "dotenv";

// Removed dotenv.config() as it is handled globally

// Check for DeepSeek API Key
if (!process.env.DEEPSEEK_API_KEY) {
  console.error(
    "DEEPSEEK_API_KEY not found. Please add it to your .env file to use the trend fetching feature."
  );
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

interface Flashcard {
  term: string;
  definition: string;
}

interface QuizQuestion {
  question: string;
  options?: string[];
  answer: string;
  type: "multiple-choice" | "true-false";
}

interface LessonContent {
  title: string;
  introduction: string;
  importance: string;
  howItWorks: string;
  practicalUse: string;
  flashcards: Flashcard[];
  quizQuestions: QuizQuestion[];
}

interface DailyTrend {
  id: string;
  topic: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  url: string;
  source: string;
  lessonContent?: LessonContent;
}

interface UnsplashResponse {
  results: Array<{
    urls: {
      regular: string;
    };
  }>;
}

interface GPTResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface RedditResponse {
  data: {
    children: Array<{
      data: {
        title: string;
        subreddit_name_prefixed: string;
        selftext: string;
        permalink: string;
        subreddit: string;
        thumbnail: string;
      };
    }>;
  };
}

interface HackerNewsItem {
  title: string;
  url?: string;
  text?: string;
}

let cachedDailyTrends: DailyTrend[] = [];

const GPT_API_KEY = import.meta.env.VITE_GPT_API_KEY || "YOUR_GPT_API_KEY_HERE";
const UNSPLASH_ACCESS_KEY =
  import.meta.env.VITE_UNSPLASH_ACCESS_KEY || "YOUR_UNSPLASH_ACCESS_KEY_HERE";

const GPT_PROMPT_TEMPLATE = `
You are a tech learning coach. Given a trending topic, create the following educational content:

Topic: "{{topic_title}}"

1. Title: (Catchy headline)
2. Quick Introduction (2-3 lines)
3. Why it's important (2-3 lines)
4. How it works (3-4 lines)
5. Practical Use Case (real-world example)
6. Flashcards: (2 cards: term + definition)
7. Quiz Questions:
   a. Multiple choice (1 question, 4 options)
   b. True/False (1 question)

Ensure all sections are clearly delimited and parseable. Provide a concise response without conversational filler.
`;

async function fetchUnsplashImage(query: string): Promise<string> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=1`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
    if (!response.ok) {
      console.error(`Unsplash API HTTP error! status: ${response.status}`);
      return `https://source.unsplash.com/random/400x200/?technology`; // Fallback
    }
    const data = (await response.json()) as UnsplashResponse;
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      return `https://source.unsplash.com/random/400x200/?technology`; // Fallback
    }
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return `https://source.unsplash.com/random/400x200/?technology`; // Fallback
  }
}

async function generateLessonContentWithGPT(
  topicTitle: string
): Promise<LessonContent | null> {
  const prompt = GPT_PROMPT_TEMPLATE.replace("{{topic_title}}", topicTitle);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GPT_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `GPT API HTTP error! status: ${response.status}, body: ${errorBody}`
      );
      return null;
    }

    const data = (await response.json()) as GPTResponse;
    const gptContent = data.choices[0]?.message?.content;

    if (!gptContent) {
      console.error("No content received from GPT API.");
      return null;
    }

    // Simple parsing logic - this will need to be robustified
    const parseSection = (key: string) => {
      const match = gptContent.match(
        new RegExp(
          `${key}:\s*(.*?)(?=\d+\. |Flashcards:|Quiz Questions:|$)`,
          "s"
        )
      );
      return match ? match[1].trim() : `No ${key} available.`;
    };

    const parseFlashcards = () => {
      const flashcardMatch = gptContent.match(/Flashcards:\s*\((.*?)\)/s);
      if (flashcardMatch && flashcardMatch[1]) {
        return flashcardMatch[1]
          .split("), ")
          .map((card: string) => {
            const [term, definition] = card
              .split("s*+s*")
              .map((s) => s.trim().replace(/^\(|\)$/g, ""));
            return { term: term || "", definition: definition || "" };
          })
          .filter(
            (card: { term: string; definition: string }) =>
              card.term && card.definition
          );
      }
      return [];
    };

    const parseQuizQuestions = () => {
      const quizMatch = gptContent.match(/Quiz Questions:\s*((?:.|\n)*)/s);
      if (quizMatch && quizMatch[1]) {
        const questions: QuizQuestion[] = [];
        const lines = quizMatch[1]
          .split("\n")
          .filter((line) => line.trim() !== "");

        let currentQuestion: Partial<QuizQuestion> = {};
        for (const line of lines) {
          if (line.match(/^a\.\s*(.*)/)) {
            // Multiple choice
            if (currentQuestion.question)
              questions.push(currentQuestion as QuizQuestion);
            currentQuestion = {
              question: line.substring(3).trim(),
              type: "multiple-choice",
              options: [],
              answer: "",
            };
          } else if (line.match(/^b\.\s*(True\/False:)?\s*(.*)/)) {
            // True/False
            if (currentQuestion.question)
              questions.push(currentQuestion as QuizQuestion);
            currentQuestion = {
              question: line.replace(/^b\.\s*(True\/False:)?\s*/, "").trim(),
              type: "true-false",
              answer: "",
            };
          } else if (
            currentQuestion.type === "multiple-choice" &&
            line.match(/^\s*[A-D]\.\s*(.*)/)
          ) {
            currentQuestion.options?.push(line.trim());
            if (line.includes("(Correct)")) {
              currentQuestion.answer = line
                .replace("(Correct)", "")
                .trim()
                .substring(3);
            }
          } else if (
            currentQuestion.type === "true-false" &&
            line.match(/^\s*Answer:\s*(True|False)/)
          ) {
            currentQuestion.answer = line.replace("Answer:", "").trim();
          }
        }
        if (currentQuestion.question)
          questions.push(currentQuestion as QuizQuestion);
        return questions.filter((q) => q.question && q.answer);
      }
      return [];
    };

    const lesson: LessonContent = {
      title: parseSection("Title"),
      introduction: parseSection("Quick Introduction"),
      importance: parseSection("Why it's important"),
      howItWorks: parseSection("How it works"),
      practicalUse: parseSection("Practical Use Case"),
      flashcards: parseFlashcards(),
      quizQuestions: parseQuizQuestions(),
    };

    return lesson;
  } catch (error) {
    console.error("Error generating lesson content with GPT:", error);
    return null;
  }
}

async function fetchTrendsFromGoogleTrends(): Promise<DailyTrend[]> {
  const url =
    "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Trends: ${response.statusText}`);
    }
    const text = await response.text();

    return new Promise((resolve, reject) => {
      xml2js.parseString(
        text,
        { explicitArray: false, ignoreAttrs: true },
        (err, result) => {
          if (err) {
            console.error("Error parsing Google Trends XML:", err);
            return reject(err);
          }
          const items = result.rss.channel.item || [];
          const trends: DailyTrend[] = items.slice(0, 5).map((item: any) => {
            const title = item.title || "No Title";
            const topic = title; // For simplicity, use title as topic
            const summary = item.description || "No Summary";
            const link = item["ht:news_item_url"] || "#"; // Accessing namespaced elements

            return {
              id: uuidv4(),
              topic,
              title,
              summary: summary.replace(/<br\/>/g, " ").replace(/<.+?>/g, ""), // Clean HTML tags
              image: `https://source.unsplash.com/400x200/?${encodeURIComponent(
                topic.split(" ")[0]
              )}&sig=${uuidv4()}`,
              category: "Google Trends",
              url: link,
              source: "Google Trends",
            };
          });
          resolve(trends);
        }
      );
    });
  } catch (error) {
    console.error("Error fetching Google Trends:", error);
    return [];
  }
}

async function fetchTrendsFromReddit(): Promise<DailyTrend[]> {
  const url = "https://www.reddit.com/r/technology/hot.json?limit=5";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Reddit trends: ${response.statusText}`);
    }
    const data = (await response.json()) as RedditResponse;
    const trends: DailyTrend[] = data.data.children.map((child) => {
      const post = child.data;
      const title = post.title;
      const topic = post.subreddit_name_prefixed.replace("r/", "");
      const summary = post.selftext.substring(0, 100) + "...";
      const url = `https://www.reddit.com${post.permalink}`;
      const category = post.subreddit;
      const source = "Reddit";
      const image =
        post.thumbnail && post.thumbnail.startsWith("http")
          ? post.thumbnail
          : `https://source.unsplash.com/random/400x200/?${encodeURIComponent(
              topic.split(" ")[0]
            )}&sig=${uuidv4()}`;

      return {
        id: uuidv4(),
        topic,
        title,
        summary,
        image,
        category,
        url,
        source,
      };
    });
    return trends;
  } catch (error) {
    console.error("Error fetching Reddit trends:", error);
    return [];
  }
}

async function fetchTrendsFromHackerNews(): Promise<DailyTrend[]> {
  const topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";
  try {
    const response = await fetch(topStoriesUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch Hacker News top stories IDs: ${response.statusText}`
      );
    }
    const storyIds = (await response.json()) as number[];
    const top5Ids = storyIds.slice(0, 5);

    const trendsPromises = top5Ids.map(async (id) => {
      const itemUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
      const itemResponse = await fetch(itemUrl);
      if (!itemResponse.ok) {
        console.error(
          `Failed to fetch Hacker News item ${id}: ${itemResponse.statusText}`
        );
        return null;
      }
      const item = (await itemResponse.json()) as HackerNewsItem;

      const title = item.title || "No Title";
      const topic = item.title.split(" ")[0] || "technology";
      const summary = item.url
        ? `Read more at: ${item.url}`
        : item.text
        ? item.text.substring(0, 100) + "..."
        : "No summary available.";
      const url = item.url || `https://news.ycombinator.com/item?id=${id}`;

      return {
        id: uuidv4(),
        topic,
        title,
        summary,
        image: `https://source.unsplash.com/random/400x200/?${encodeURIComponent(
          topic
        )}&sig=${uuidv4()}`,
        category: "Hacker News",
        url,
        source: "Hacker News",
      };
    });

    const trends = (await Promise.all(trendsPromises)).filter(
      Boolean
    ) as DailyTrend[];
    return trends;
  } catch (error) {
    console.error("Error fetching Hacker News trends:", error);
    return [];
  }
}

export async function fetchTrendsFromAPI(query: string) {
  if (!DEEPSEEK_API_KEY) {
    console.error("Cannot fetch trends: DEEPSEEK_API_KEY is not configured.");
    return {
      related_topics: [],
      trending_searches: [],
    };
  }
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `DeepSeek API HTTP error! status: ${response.status}, body: ${errorBody}`
    );
    return {
      related_topics: [],
      trending_searches: [],
    };
  }

  const data = (await response.json()) as GPTResponse;
  const gptContent = data.choices[0]?.message?.content;

  if (!gptContent) {
    console.error("No content received from DeepSeek API.");
    return {
      related_topics: [],
      trending_searches: [],
    };
  }

  // Simple parsing logic - this will need to be robustified
  const parseSection = (key: string) => {
    const match = gptContent.match(
      new RegExp(`${key}:\s*(.*?)(?=\d+\. |Flashcards:|Quiz Questions:|$)`, "s")
    );
    return match ? match[1].trim() : `No ${key} available.`;
  };

  const parseFlashcards = () => {
    const flashcardMatch = gptContent.match(/Flashcards:\s*\((.*?)\)/s);
    if (flashcardMatch && flashcardMatch[1]) {
      return flashcardMatch[1]
        .split("), ")
        .map((card: string) => {
          const [term, definition] = card
            .split("s*+s*")
            .map((s) => s.trim().replace(/^\(|\)$/g, ""));
          return { term: term || "", definition: definition || "" };
        })
        .filter(
          (card: { term: string; definition: string }) =>
            card.term && card.definition
        );
    }
    return [];
  };

  const parseQuizQuestions = () => {
    const quizMatch = gptContent.match(/Quiz Questions:\s*((?:.|\n)*)/s);
    if (quizMatch && quizMatch[1]) {
      const questions: QuizQuestion[] = [];
      const lines = quizMatch[1]
        .split("\n")
        .filter((line) => line.trim() !== "");

      let currentQuestion: Partial<QuizQuestion> = {};
      for (const line of lines) {
        if (line.match(/^a\.\s*(.*)/)) {
          // Multiple choice
          if (currentQuestion.question)
            questions.push(currentQuestion as QuizQuestion);
          currentQuestion = {
            question: line.substring(3).trim(),
            type: "multiple-choice",
            options: [],
            answer: "",
          };
        } else if (line.match(/^b\.\s*(True\/False:)?\s*(.*)/)) {
          // True/False
          if (currentQuestion.question)
            questions.push(currentQuestion as QuizQuestion);
          currentQuestion = {
            question: line.replace(/^b\.\s*(True\/False:)?\s*/, "").trim(),
            type: "true-false",
            answer: "",
          };
        } else if (
          currentQuestion.type === "multiple-choice" &&
          line.match(/^\s*[A-D]\.\s*(.*)/)
        ) {
          currentQuestion.options?.push(line.trim());
          if (line.includes("(Correct)")) {
            currentQuestion.answer = line
              .replace("(Correct)", "")
              .trim()
              .substring(3);
          }
        } else if (
          currentQuestion.type === "true-false" &&
          line.match(/^\s*Answer:\s*(True|False)/)
        ) {
          currentQuestion.answer = line.replace("Answer:", "").trim();
        }
      }
      if (currentQuestion.question)
        questions.push(currentQuestion as QuizQuestion);
      return questions.filter((q) => q.question && q.answer);
    }
    return [];
  };

  const lesson: LessonContent = {
    title: parseSection("Title"),
    introduction: parseSection("Quick Introduction"),
    importance: parseSection("Why it's important"),
    howItWorks: parseSection("How it works"),
    practicalUse: parseSection("Practical Use Case"),
    flashcards: parseFlashcards(),
    quizQuestions: parseQuizQuestions(),
  };

  return lesson;
}

export async function updateDailyTrends(): Promise<void> {
  console.log("Updating daily trends...");
  try {
    const [googleTrends, redditTrends, hackerNewsTrends] = await Promise.all([
      fetchTrendsFromGoogleTrends(),
      fetchTrendsFromReddit(),
      fetchTrendsFromHackerNews(),
    ]);

    let allTrends = [...googleTrends, ...redditTrends, ...hackerNewsTrends];

    const uniqueTrends = Array.from(
      new Map(allTrends.map((item) => [item.title, item])).values()
    );

    const trendsWithLessonsPromises = uniqueTrends.map(async (trend) => {
      try {
        const lessonContent = await generateLessonContentWithGPT(trend.title);
        const imageUrl = await fetchUnsplashImage(trend.topic);
        return {
          ...trend,
          image: imageUrl,
          lessonContent: lessonContent || undefined,
        };
      } catch (error) {
        console.error(`Error processing trend ${trend.title}:`, error);
        return {
          ...trend,
          image: `https://source.unsplash.com/random/400x200/?technology`,
          lessonContent: undefined,
        };
      }
    });

    cachedDailyTrends = (await Promise.all(trendsWithLessonsPromises)).filter(
      Boolean
    ) as DailyTrend[];
    console.log(
      `Successfully updated ${cachedDailyTrends.length} daily trends.`
    );
  } catch (error) {
    console.error("Error in updateDailyTrends:", error);
    cachedDailyTrends = [];
  }
}

export function getDailyTrendsWithLessons(): DailyTrend[] {
  return cachedDailyTrends;
}

// Initial update on startup
updateDailyTrends();

// Schedule daily updates
setInterval(updateDailyTrends, 24 * 60 * 60 * 1000);
