import googleTrends from "google-trends-api";
import { mockTrendingSearches } from "@/data/mockTrends";

/**
 * Interface for cached data
 */
interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Interface for trending search result
 */
export interface TrendingSearch {
  title: string;
  traffic: string;
  relatedQueries: string[];
  imageUrl: string;
  summary: string;
  category: string;
}

/**
 * Cache configuration
 */
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const cache: Map<string, CachedData<any>> = new Map();

/**
 * Error class for Google Trends API errors
 */
export class GoogleTrendsError extends Error {
  constructor(message: string, public readonly originalError?: any) {
    super(message);
    this.name = "GoogleTrendsError";
  }
}

/**
 * Sleep function for retry mechanism
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a summary for a trending topic
 */
function generateSummary(title: string, category: string): string {
  const summaries: Record<string, string> = {
    AI: "Latest developments in artificial intelligence and machine learning.",
    Blockchain:
      "Innovations in blockchain technology and decentralized systems.",
    Cloud: "Advances in cloud computing and distributed systems.",
    Cybersecurity: "Latest trends in digital security and threat prevention.",
    IoT: "Developments in Internet of Things and connected devices.",
    "Machine Learning":
      "Progress in machine learning algorithms and applications.",
    Quantum: "Breakthroughs in quantum computing and quantum technologies.",
    Web3: "Evolution of decentralized web and blockchain applications.",
    VR: "Advances in virtual reality and immersive technologies.",
    AR: "Innovations in augmented reality and mixed reality.",
    Tech: "Latest technology trends and innovations.",
  };

  return (
    summaries[category] ||
    "Explore the latest developments in this technology field."
  );
}

/**
 * Generate an image URL for a trending topic
 */
function generateImageUrl(title: string, category: string): string {
  const searchTerms = title.toLowerCase().split(" ").join(",");
  const categoryTerm = category.toLowerCase();
  return `https://source.unsplash.com/featured/800x600/?${searchTerms},${categoryTerm}`;
}

/**
 * Get trending searches for a specific region with retry mechanism and fallback
 * @param geo - Region code (e.g., 'US', 'GB', 'IN')
 * @param category - Optional category filter
 * @returns Promise with trending search results
 */
export async function getTrendingSearches(
  geo: string = "US",
  category?: string
): Promise<TrendingSearch[]> {
  const cacheKey = `trends_${geo}_${category || "all"}`;
  const cachedData = cache.get(cacheKey);

  // Return cached data if it's still valid
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      // Fetch trending searches
      const trendingSearches = await googleTrends.dailyTrends({
        geo,
        hl: "en-US",
        timezone: -240, // EST timezone
        category: category || "all",
      });

      // Parse the response
      const parsedData = JSON.parse(trendingSearches);
      const trendingResults =
        parsedData.default.trendingSearchesDays[0].trendingSearches;

      // Transform the data into our interface
      const formattedResults: TrendingSearch[] = trendingResults.map(
        (item: any) => {
          const title = item.title.query;
          const detectedCategory = detectTechCategory(title);
          return {
            title,
            traffic: item.formattedTraffic,
            relatedQueries: item.relatedQueries.map((q: any) => q.query),
            imageUrl: generateImageUrl(title, detectedCategory),
            summary: generateSummary(title, detectedCategory),
            category: detectedCategory,
          };
        }
      );

      // Cache the results
      cache.set(cacheKey, {
        data: formattedResults,
        timestamp: Date.now(),
      });

      return formattedResults;
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) {
        console.warn(
          "Failed to fetch trending searches, using mock data",
          error
        );
        return mockTrendingSearches;
      }
      await sleep(RETRY_DELAY * retries); // Exponential backoff
    }
  }

  return mockTrendingSearches;
}

/**
 * Get real-time trending searches with retry mechanism and fallback
 * @param geo - Region code (e.g., 'US', 'GB', 'IN')
 * @returns Promise with real-time trending search results
 */
export async function getRealTimeTrends(
  geo: string = "US"
): Promise<TrendingSearch[]> {
  const cacheKey = `realtime_${geo}`;
  const cachedData = cache.get(cacheKey);

  // Return cached data if it's still valid
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      // Fetch real-time trending searches
      const realTimeTrends = await googleTrends.realTimeTrends({
        geo,
        hl: "en-US",
        timezone: -240, // EST timezone
        category: "all",
      });

      // Parse the response
      const parsedData = JSON.parse(realTimeTrends);
      const trendingResults = parsedData.storySummaries.trendingStories;

      // Transform the data into our interface
      const formattedResults: TrendingSearch[] = trendingResults.map(
        (item: any) => {
          const title = item.title;
          const detectedCategory = detectTechCategory(title);
          return {
            title,
            traffic: item.articles[0]?.snippet || "No traffic data",
            relatedQueries: item.articles.map((a: any) => a.title),
            imageUrl: generateImageUrl(title, detectedCategory),
            summary: generateSummary(title, detectedCategory),
            category: detectedCategory,
          };
        }
      );

      // Cache the results
      cache.set(cacheKey, {
        data: formattedResults,
        timestamp: Date.now(),
      });

      return formattedResults;
    } catch (error) {
      retries++;
      if (retries === MAX_RETRIES) {
        console.warn(
          "Failed to fetch real-time trends, using mock data",
          error
        );
        return mockTrendingSearches;
      }
      await sleep(RETRY_DELAY * retries); // Exponential backoff
    }
  }

  return mockTrendingSearches;
}

/**
 * Clear the cache for a specific key or all cache
 * @param key - Optional cache key to clear specific data
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Get cache statistics
 * @returns Object containing cache statistics
 */
export function getCacheStats(): {
  size: number;
  keys: string[];
  oldestEntry: number;
  newestEntry: number;
} {
  const timestamps = Array.from(cache.values()).map((entry) => entry.timestamp);
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
    oldestEntry: Math.min(...timestamps),
    newestEntry: Math.max(...timestamps),
  };
}

/**
 * Helper function to detect tech category from title
 */
function detectTechCategory(title: string): string {
  const categories = [
    "AI",
    "Blockchain",
    "Cloud",
    "Cybersecurity",
    "IoT",
    "Machine Learning",
    "Quantum",
    "Web3",
    "VR",
    "AR",
  ];

  const matchedCategory = categories.find((category) =>
    title.toLowerCase().includes(category.toLowerCase())
  );
  return matchedCategory || "Tech";
}
