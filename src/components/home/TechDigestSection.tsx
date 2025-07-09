import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { usePersonalizedNews } from "@/hooks/useEnhancedContent";
import { useFeatureFlag } from "@/hooks/useEnhancedContent";
import { TopicMatcher } from "@/lib/topicExtraction";
import { Heart } from "lucide-react";

// TODO: Replace with real profile context or Supabase fetch
const MOCK_FAVORITE_TOPICS = ["ai", "cybersecurity", "machine learning"];

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

function getReadTime(text) {
  if (!text) return "1 min read";
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

// Helper to get a dynamic image based on topic or title
const getCardImage = (item) => {
  if (item.topic) {
    return `https://source.unsplash.com/featured/?${encodeURIComponent(
      item.topic
    )}`;
  }
  if (item.title) {
    return `https://source.unsplash.com/featured/?${encodeURIComponent(
      item.title.split(" ")[0]
    )}`;
  }
  return "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";

const topicImageMap = {
  ai: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  blockchain:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  cybersecurity:
    "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80",
  "machine learning":
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
  "data science":
    "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80",
  healthtech:
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
  // ...add more as needed
};
const fallbackImage = "/fallback.jpg";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_KEY;
const PIXABAY_KEY = import.meta.env.VITE_PIXABAY_KEY;

// Utility to fetch topic image
const fetchTopicImage = async (topic) => {
  try {
    const unsplashRes = await axios.get(
      `https://api.unsplash.com/photos/random`,
      {
        params: {
          query: topic,
          orientation: "landscape",
          client_id: UNSPLASH_ACCESS_KEY,
        },
      }
    );
    return unsplashRes.data.urls.regular;
  } catch (err) {
    try {
      const pixabayRes = await axios.get(`https://pixabay.com/api/`, {
        params: {
          key: PIXABAY_KEY,
          q: topic,
          image_type: "photo",
          per_page: 3,
        },
      });
      return pixabayRes.data.hits?.[0]?.webformatURL || fallbackImage;
    } catch (err2) {
      return fallbackImage;
    }
  }
};

// Utility: topic-based Unsplash image
const getTopicImage = (topic, title) => {
  return `https://source.unsplash.com/featured/?${encodeURIComponent(
    topic || title || "technology"
  )}`;
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

type DigestCardProps = {
  title: string;
  topic: string;
  source: string;
};

const DigestCard = ({ title, topic, source }: DigestCardProps) => {
  const [imageUrl, setImageUrl] = useState(fallbackImage);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
            topic || title
          )}&orientation=landscape&client_id=${
            import.meta.env.VITE_UNSPLASH_KEY
          }`
        );
        const data = await res.json();
        if (data.urls?.regular) {
          setImageUrl(data.urls.regular);
        }
      } catch {
        // fallback already set
      }
    };
    fetchImage();
  }, [topic, title]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-md bg-white dark:bg-zinc-900 transform transition-transform duration-300 hover:scale-105 group h-[250px] w-[300px] hover:shadow-lg hover:ring-2 ring-white/20">
      <img
        src={imageUrl}
        alt={title}
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg";
        }}
        className="absolute inset-0 w-full h-full object-cover group-hover:brightness-90 transition duration-300"
      />
      {/* Source Tag Top-Left */}
      <div className="absolute top-3 left-3 bg-zinc-800 text-white text-xs px-2 py-1 rounded-md opacity-80">
        {source}
      </div>
      {/* Title and Read More Button */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white p-4">
        <div className="font-semibold text-sm line-clamp-2">{title}</div>
        {/* Read More (on hover) */}
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white text-black text-xs font-medium px-3 py-1 rounded-md hover:bg-zinc-200">
            Read More →
          </button>
        </div>
      </div>
    </div>
  );
};

// TechDigestSection: fetch user preferences and filter news
export default function TechDigestSection() {
  const [loading, setLoading] = React.useState(true);
  const [originalData, setOriginalData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [userPreferences, setUserPreferences] = React.useState([]);
  const [cardImages, setCardImages] = React.useState({});
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
    maxItems: 12,
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
        .limit(12);
      console.info("Supabase fetch:", { newsData, newsError });
      if (newsError) throw newsError;
      // Step 1: Add console logs
      console.log("User preferences:", preferences);
      console.log(
        "Available topics:",
        newsData.map((item) => item.topic)
      );
      // Enhanced filtering using topic extraction and matching
      let filtered = newsData;
      if (preferences.length > 0) {
        // Use enhanced topic matcher for better filtering
        filtered = TopicMatcher.filterContent(newsData, preferences);

        // Sort by relevance
        filtered = TopicMatcher.sortByRelevance(filtered, preferences);

        // Don't show all if no matches - let the UI handle empty state
        console.log("TechDigestSection filtering:", {
          originalCount: newsData.length,
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

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Supabase subscription fix
  React.useEffect(() => {
    let subscription;
    const setupRealtimeUpdates = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          return;
        }
        subscription = supabase
          .channel("techdigest-preferences-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "preferences",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              fetchData();
            }
          )
          .subscribe();
      } catch (err) {
        console.error("Error setting up real-time updates:", err);
      }
    };
    setupRealtimeUpdates();
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [fetchData]);

  // After filtering news, fetch images for all topics
  React.useEffect(() => {
    const loadImages = async () => {
      const imgMap = {};
      for (const news of data) {
        const topic = news.topic || news.category || "technology";
        if (!imgMap[topic]) {
          imgMap[topic] = await fetchTopicImage(topic);
        }
      }
      setCardImages(imgMap);
    };
    if (data.length > 0) loadImages();
  }, [data]);

  // Step 3: Show fallback if nothing matches
  if (!loading && !error && data.length === 0) {
    return (
      <div className="text-gray-400 text-center py-10">
        No news matched your selected topics today.
      </div>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        📰 What’s Happening in Tech Today
      </h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 animate-pulse h-48"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, index) => (
            <DigestCard
              key={index}
              title={item.title || "No Title"}
              topic={item.topic || item.category || "Tech"}
              source={getCleanSourceName(item.source) || "Tech Source"}
            />
          ))}
        </div>
      )}
    </section>
  );
}
