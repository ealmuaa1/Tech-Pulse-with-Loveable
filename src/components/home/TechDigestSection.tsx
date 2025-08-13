import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { usePersonalizedNews } from "@/hooks/useEnhancedContent";
import { useFeatureFlag } from "@/hooks/useEnhancedContent";
import { TopicMatcher } from "@/lib/topicExtraction";
import { Heart, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NewsCard from "@/components/NewsCard";

// TODO: Replace with real profile context or Supabase fetch
const MOCK_FAVORITE_TOPICS = ["ai", "cybersecurity", "machine learning"];

// Helper function to generate takeaways from summary
const generateTakeaways = (summary: string): string[] => {
  if (!summary) return [];

  // Split summary into sentences
  const sentences = summary.split(/[.!?]+/).filter((s) => s.trim().length > 10);

  // Extract key points (first 3 meaningful sentences)
  const takeaways = sentences
    .slice(0, 3)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 20)
    .map((sentence) => {
      // Clean up the sentence
      return sentence
        .replace(/^[^a-zA-Z]*/, "") // Remove leading non-letters
        .replace(/[^a-zA-Z0-9\s.,!?-]*$/, "") // Remove trailing non-letters
        .trim();
    });

  return takeaways.slice(0, 3);
};

// Helper function to extract URL from source or generate one
const extractUrl = (source: string, title: string): string => {
  if (source && source.startsWith("http")) {
    return source;
  }

  // Generate a search URL based on title
  const searchQuery = encodeURIComponent(title);
  return `https://www.google.com/search?q=${searchQuery}`;
};

// Utility: clean source name
const getCleanSourceName = (source) => {
  const sourceMapping = {
    "https://techcrunch.com": "TechCrunch",
    "techcrunch.com": "TechCrunch",
    techcrunch: "TechCrunch",
    "wired.com": "Wired",
    "theverge.com": "The Verge",
    "arstechnica.com": "Ars Technica",
    "engadget.com": "Engadget",
    "venturebeat.com": "VentureBeat",
  };
  if (!source) return "";
  if (source.includes("http")) {
    try {
      const domain = new URL(source).hostname.replace("www.", "");
      return sourceMapping[domain] || domain;
    } catch {
      return source;
    }
  }
  return sourceMapping[source.toLowerCase()] || source;
};

// TechDigestSection: fetch user preferences and filter news
export default function TechDigestSection() {
  const [loading, setLoading] = React.useState(true);
  const [originalData, setOriginalData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [userPreferences, setUserPreferences] = React.useState([]);
  const navigate = useNavigate();

  // Enhanced personalization features
  const shouldUsePersonalization = useFeatureFlag(
    "enhanced-personalization",
    true
  );
  const {
    personalizedNews: data,
    isPersonalized,
    isLoading: isPersonalizing,
  } = usePersonalizedNews(originalData, {
    maxItems: 24,
    sortByRelevance: true,
    includeFallback: true,
    filterBySource: true,
  });

  // Define fetchData function outside useEffect for reuse
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Session check
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.warn("No user session, redirecting to login.");
        navigate("/login");
        return;
      }
      // Fetch user preferences from the correct table
      let preferences = [];
      const { data: preferencesData, error: preferencesError } = await supabase
        .from("preferences")
        .select("favorite_topics")
        .eq("user_id", user.id)
        .single();
      if (preferencesData?.favorite_topics) {
        preferences = preferencesData.favorite_topics;
        setUserPreferences(preferences);
      }
      // Fetch news
      const { data: newsData, error: newsError } = await supabase
        .from("daily_summaries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(24);
      console.info("Supabase fetch:", { newsData, newsError });
      if (newsError) throw newsError;

      // For now, always use mock data to ensure diverse images
      console.log("Using mock data for diverse images");
      
      // Import mock data
      const { getAllMockNewsIds, getMockNewsItem } = await import(
        "@/lib/mockNewsService"
      );
      const mockIds = getAllMockNewsIds();
      
      // Use all available mock items (up to 24)
      const mockItems = mockIds
        .slice(0, 24)
        .map((id) => {
          const mockItem = getMockNewsItem(id);
          if (mockItem) {
            return {
              ...mockItem,
              id: `mock-${mockItem.id}`, // Ensure unique ID
            };
          }
          return null;
        })
        .filter(Boolean); // Remove any null items

      console.log("Mock items created:", mockItems.length);
      console.log("Mock topics:", mockItems.map(item => item.topic));
      
      const finalData = mockItems;

      // Step 1: Add console logs
      console.log("User preferences:", preferences);
      console.log(
        "Available topics:",
        finalData.map((item) => item.topic)
      );
      // Enhanced filtering using topic extraction and matching
      let filtered = finalData;
      if (preferences.length > 0) {
        // Use enhanced topic matcher for better filtering
        filtered = TopicMatcher.filterContent(finalData, preferences);

        // Sort by relevance
        filtered = TopicMatcher.sortByRelevance(filtered, preferences);

        // Don't show all if no matches - let the UI handle empty state
        console.log("TechDigestSection filtering:", {
          originalCount: finalData.length,
          filteredCount: filtered.length,
          preferences,
          filteredTopics: filtered.map((item) => item.topic),
        });
      }
      setOriginalData(filtered);
    } catch (err) {
      setError(err.message || "Failed to load news.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // One-time fetch on component mount - no real-time subscriptions
  React.useEffect(() => {
    fetchData();
  }, []); // Empty dependency array for single fetch on mount

  // Step 3: Show fallback if nothing matches
  if (!loading && !error && data.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            What's Happening in Tech Today
          </h2>
        </div>
        <div className="text-gray-400 text-center py-10">
          No news matched your selected topics today.
        </div>
      </div>
    );
  }

  if (loading || isPersonalizing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            What's Happening in Tech Today
          </h2>
          <Badge variant="secondary" className="animate-pulse">
            {isPersonalizing ? "Personalizing..." : "Loading..."}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 rounded-xl aspect-square animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            What's Happening in Tech Today
          </h2>
        </div>
        <div className="text-red-500 text-center py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-600" />
          What's Happening in Tech Today
        </h2>
        <div className="flex items-center gap-2">
          {isPersonalized && shouldUsePersonalization && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300"
            >
              <Heart className="w-3 h-3" />
              Personalized
            </Badge>
          )}
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Live
          </Badge>
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item, index) => {
          // Ensure all cards have summary and takeaways for consistent hover functionality
          const summary =
            item.summary ||
            item.description ||
            `Learn more about ${item.topic || "this technology"}.`;
          const takeaways = item.takeaways || generateTakeaways(summary);
          const url = item.url || extractUrl(item.source, item.title);

          return (
            <NewsCard
              key={item.id || index}
              id={item.id || `news-${index}`}
              title={item.title || "No Title"}
              topic={item.topic || item.category || "Tech"}
              source={getCleanSourceName(item.source) || "Tech Source"}
              summary={summary}
              takeaways={takeaways}
              url={url}
              publishedAt={item.published_at || item.created_at}
            />
          );
        })}
      </div>

      {/* Tags Preview */}
      <div className="flex flex-wrap gap-2 pt-2">
        {data
          .slice(0, 2)
          .flatMap((item) => {
            const tags = [];
            if (item.topic) tags.push(item.topic);
            if (item.category) tags.push(item.category);
            if (item.tags && Array.isArray(item.tags)) tags.push(...item.tags);
            return tags;
          })
          .slice(0, 6)
          .map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
            >
              #{tag}
            </Badge>
          ))}
      </div>
    </div>
  );
}
