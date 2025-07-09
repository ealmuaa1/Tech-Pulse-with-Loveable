import { v4 as uuidv4 } from \'uuid\';
import fetch from \'node-fetch\';
import * as xml2js from \'xml2js\'; // Import xml2js

interface Flashcard {
  term: string;
  definition: string;
}

interface QuizQuestion {
  question: string;
  options?: string[];
  answer: string;
  type: \'multiple-choice\' | \'true-false\';
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

let cachedDailyTrends: DailyTrend[] = [];

const GPT_API_KEY = process.env.VITE_GPT_API_KEY || \'YOUR_GPT_API_KEY_HERE\';
const UNSPLASH_ACCESS_KEY = process.env.VITE_UNSPLASH_ACCESS_KEY || \'YOUR_UNSPLASH_ACCESS_KEY_HERE\';

const GPT_PROMPT_TEMPLATE = `
You are a tech learning coach. Given a trending topic, create the following educational content:

Topic: \"{{topic_title}}\"

1. Title: (Catchy headline)
2. Quick Introduction (2-3 lines)
3. Why it\'s important (2-3 lines)
4. How it works (3-4 lines)
5. Practical Use Case (real-world example)
6. Flashcards: (2 cards: term + definition)
7. Quiz Questions:
   a. Multiple choice (1 question, 4 options)
   b. True/False (1 question)

Ensure all sections are clearly delimited and parseable. Provide a concise response without conversational filler.
`;

async function fetchUnsplashImage(query: string): Promise<string> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
    if (!response.ok) {
      console.error(`Unsplash API HTTP error! status: ${response.status}`);
      return `https://source.unsplash.com/random/400x200/?technology`;
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      return `https://source.unsplash.com/random/400x200/?technology`;
    }
  } catch (error) {
    console.error(\"Error fetching image from Unsplash:\", error);
    return `https://source.unsplash.com/random/400x200/?technology`;
  }
}

async function generateLessonContentWithGPT(topicTitle: string): Promise<LessonContent | null> {
  const prompt = GPT_PROMPT_TEMPLATE.replace(\"{{topic_title}}\", topicTitle);

  try {
    const response = await fetch(\'https://api.openai.com/v1/chat/completions\', {
      method: \'POST\',
      headers: {
        \'Content-Type\': \'application/json\',
        \'Authorization\': `Bearer ${GPT_API_KEY}`,
      },
      body: JSON.stringify({
        model: \"gpt-3.5-turbo\",
        messages: [{
          role: \"user\",
          content: prompt,
        }],
      }),
    });
    if (!response.ok) {
      console.error(\"Error generating lesson content with GPT:\", response.statusText);
      return null;
    }
    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      const lessonContent = xml2js.parseStringPromise(data.choices[0].message.content);
      if (lessonContent.lessonContent) {
        return lessonContent.lessonContent as LessonContent;
      }
    }
  } catch (error) {
    console.error(\"Error generating lesson content with GPT:\", error);
  }
  return null;
} 