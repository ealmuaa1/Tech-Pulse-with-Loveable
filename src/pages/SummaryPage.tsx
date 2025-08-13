import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  getReliableImageUrl,
  getSafeImageUrl,
  handleImageError,
} from "@/lib/imageService";
import { getMockNewsItem, MockNewsItem } from "@/lib/mockNewsService";
import { sentencesToBullets, ensureExcerpt } from "@/utils/text";

// Section component for consistent styling
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 md:mt-10">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="mt-3 text-[15px] md:text-base leading-7 md:leading-8 text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </section>
  );
}

interface NewsItem {
  id: string;
  title: string;
  topic: string;
  source: string;
  summary: string;
  takeaways: string[];
  url?: string;
  published_at?: string;
  created_at?: string;
  image?: string;
  why_matters?: string;
  whats_new?: string;
  impact?: string;
}

const SummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("/placeholder.svg");

  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!id) {
        setError("No news ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Try to fetch from Supabase first
        let { data, error: supabaseError } = await supabase
          .from("daily_summaries")
          .select("*")
          .eq("id", id)
          .single();

        // If the specific ID doesn't exist, try with a fallback ID
        if (!data && supabaseError) {
          console.warn("News item not found with ID:", id, supabaseError);

          // Try with a known existing topic ID as fallback
          const fallbackIds = [
            "ai-fundamentals",
            "tech-trends-core",
            "blockchain-basics",
          ];

          for (const fallbackId of fallbackIds) {
            try {
              const { data: fallbackData, error: fallbackError } =
                await supabase
                  .from("daily_summaries")
                  .select("*")
                  .eq("id", fallbackId)
                  .single();

              if (fallbackData && !fallbackError) {
                console.log("Using fallback data for ID:", fallbackId);
                data = fallbackData;
                supabaseError = null;
                break;
              }
            } catch (fallbackErr) {
              console.warn("Fallback ID also failed:", fallbackId, fallbackErr);
            }
          }
        }

        if (data) {
          // Ensure takeaways are available
          const processedData = {
            ...data,
            takeaways:
              data.takeaways || sentencesToBullets(data.summary || "", 3),
            url: data.url || generateUrl(data.title || "", data.source || ""),
          };
          setNewsItem(processedData);
          // Fetch image for the topic
          try {
            const reliableUrl = await getReliableImageUrl(
              data.topic || data.title
            );
            setImageUrl(reliableUrl);
          } catch (imageError) {
            console.warn("Failed to fetch image:", imageError);
          }
        } else if (supabaseError) {
          // If not found in Supabase, check if it's a mock topic ID
          console.warn("News item not found in database:", supabaseError);

          // Check if this is a mock ID (starts with "mock-")
          let mockId = id;
          if (id && id.startsWith("mock-")) {
            mockId = id.substring(5); // Remove "mock-" prefix
          }

          // Try to get from mock data
          const mockItem = getMockNewsItem(mockId);

          if (mockItem) {
            // Ensure takeaways are available for mock data too
            const processedMockItem = {
              ...mockItem,
              takeaways:
                mockItem.takeaways ||
                sentencesToBullets(mockItem.summary || "", 3),
              url:
                mockItem.url ||
                generateUrl(mockItem.title || "", mockItem.source || ""),
            };
            setNewsItem(processedMockItem);
            if (mockItem.image) {
              setImageUrl(mockItem.image);
            } else {
              try {
                const reliableUrl = await getReliableImageUrl(
                  mockItem.topic || mockItem.title
                );
                setImageUrl(reliableUrl);
              } catch (imageError) {
                console.warn(
                  "Failed to fetch image for mock item:",
                  imageError
                );
              }
            }
          } else {
            setError("News summary not found");
          }
        }
      } catch (err) {
        console.error("Error fetching news item:", err);
        setError("Failed to load news summary");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  // Helper function to generate URL when missing
  const generateUrl = (title: string, source: string): string => {
    if (!title) return "";
    const searchQuery = encodeURIComponent(title);
    return `https://www.google.com/search?q=${searchQuery}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-8"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Summary Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The news summary you're looking for doesn't exist."}
          </p>
          <Button onClick={handleBack} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const summary =
    newsItem.summary ||
    ensureExcerpt(
      "",
      "This article is being summarized. Please check back soon."
    );
  const takeaways: string[] =
    Array.isArray(newsItem.takeaways) && newsItem.takeaways.length > 0
      ? newsItem.takeaways
      : sentencesToBullets(summary, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                {newsItem.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-3xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {newsItem.source && (
                <span className="inline-block rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 mr-2">
                  {newsItem.source}
                </span>
              )}
              {newsItem.published_at && (
                <span>
                  {new Date(newsItem.published_at).toLocaleDateString()}
                </span>
              )}
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              {newsItem.title}
            </h1>
          </div>
        </div>

        {/* Hero Image */}
        {(newsItem.image || imageUrl) && (
          <img
            src={getSafeImageUrl(
              newsItem.image || imageUrl,
              "/placeholder.svg"
            )}
            alt={newsItem.title}
            className="mt-6 rounded-xl w-full object-cover aspect-[16/9]"
            onError={(e) => handleImageError(e, "/placeholder.svg")}
          />
        )}

        {/* Sections in requested order */}
        <Section title="Summary">
          <p>{summary}</p>
        </Section>

        {newsItem.whats_new && (
          <Section title="What's new">
            <p>{newsItem.whats_new}</p>
          </Section>
        )}

        {newsItem.impact && (
          <Section title="Impact">
            <p>{newsItem.impact}</p>
          </Section>
        )}

        {takeaways.length > 0 && (
          <Section title="Key takeaways">
            <ul className="list-disc pl-5 space-y-2">
              {takeaways.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </Section>
        )}

        {newsItem.url && (
          <Section title="Source">
            <a
              href={newsItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
            >
              Read the full article <ExternalLink className="w-4 h-4" />
            </a>
          </Section>
        )}
      </div>
    </div>
  );
};

export default SummaryPage;
