/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UNSPLASH_API_KEY: string;
  readonly VITE_PIXABAY_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface TrendingTopic {
  id: string;
  topic: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  url: string;
  source: string;
}

// Fetch trending topics from the server-side API route
export async function generateTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    const res = await fetch("http://localhost:4000/api/trends");
    if (!res.ok) throw new Error("Failed to fetch trending topics");
    return await res.json();
  } catch (error) {
    console.error("Error fetching trending topics from API:", error);
    return [];
  }
}

export async function getImageForTopic(topic: string): Promise<string> {
  // Try Unsplash
  const unsplashUrl = `https://source.unsplash.com/400x200/?${encodeURIComponent(
    topic
  )}`;
  try {
    // Try to fetch the Unsplash image (HEAD request to check if available)
    const res = await fetch(unsplashUrl, { method: "HEAD" });
    if (res.ok) return unsplashUrl;
  } catch {}

  // Fallback: Pixabay
  const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY;
  if (pixabayKey) {
    const pixabayRes = await fetch(
      `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(
        topic
      )}&image_type=photo`
    );
    const data = await pixabayRes.json();
    if (data.hits && data.hits.length > 0) {
      return data.hits[0].webformatURL;
    }
  }

  // Final fallback
  return "/fallback.png";
}
