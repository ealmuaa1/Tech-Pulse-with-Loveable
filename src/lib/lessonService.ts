import OpenAI from "openai";

interface Lesson {
  id: string;
  title: string;
  summary: string;
  quizLink?: string;
  flashcardLink?: string;
}

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
});

export async function fetchDynamicLessons(
  topicSlug: string
): Promise<Lesson[]> {
  console.log("Attempting to fetch lessons from backend for topic:", topicSlug);
  try {
    const response = await fetch("/api/deepseek/lessons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topicSlug }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to fetch lessons from backend"
      );
    }

    const data = await response.json();
    if (!data.lessons || !Array.isArray(data.lessons)) {
      throw new Error("Invalid lesson structure received from backend.");
    }
    console.log("Lessons received from backend:", data.lessons);
    return data.lessons;
  } catch (error) {
    console.error("Error loading dynamic lessons via backend:", error);
    return [
      {
        id: "error-lesson",
        title: "Error Loading Lessons",
        summary:
          "There was an issue loading dynamic lessons. Please try again later.",
      },
    ];
  }
}
