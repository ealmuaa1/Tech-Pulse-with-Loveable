import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import {
  getReliableImageUrl,
  getSafeImageUrl,
  handleImageError,
} from "@/lib/imageService";
import { getMockNewsItem, MockNewsItem } from "@/lib/mockNewsService";
import sanitizeHtml from "sanitize-html";
import NewsCard from "@/components/NewsCard";

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

// Helper function to generate URL when missing
const generateUrl = (title: string, source: string): string => {
  if (!title) return "";

  // Create a Google search URL for the title
  const searchQuery = encodeURIComponent(title);
  return `https://www.google.com/search?q=${searchQuery}`;
};

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
}

const SummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("/placeholder.svg");

  // Debug: Confirm component is rendering
  console.log("SummaryPage rendering with id:", id);

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
        const { data, error: supabaseError } = await supabase
          .from("daily_summaries")
          .select("*")
          .eq("id", id)
          .single();

        if (data) {
          // Ensure takeaways are available
          const processedData = {
            ...data,
            takeaways: data.takeaways || generateTakeaways(data.summary || ""),
            url: data.url || generateUrl(data.title || "", data.source || ""),
          };
          console.log("SummaryPage processed data:", {
            title: processedData.title,
            hasTakeaways: processedData.takeaways.length > 0,
            takeaways: processedData.takeaways,
            hasUrl: !!processedData.url,
            url: processedData.url,
          });
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

          // Try to get from mock data
          const mockItem = getMockNewsItem(id);
          if (mockItem) {
            // Ensure takeaways are available for mock data too
            const processedMockItem = {
              ...mockItem,
              takeaways:
                mockItem.takeaways || generateTakeaways(mockItem.summary || ""),
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const sanitizeSummary = (summary: string): string => {
    if (!summary)
      return "This article is being summarized. Please check back soon.";

    // Check if summary is too short
    if (summary.length < 50) {
      return "This article is being summarized. Please check back soon.";
    }

    // Check for problematic content that indicates raw HTML/script junk
    const problematicPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<table\b[^<]*(?:(?!<\/table>)<[^<]*)*<\/table>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];

    // If problematic content is found, return a fallback message
    for (const pattern of problematicPatterns) {
      if (pattern.test(summary)) {
        return "This article is being summarized. Please check back soon.";
      }
    }

    // Check if summary only contains external links (no meaningful content)
    const linkOnlyPattern = /^[\s\S]*<a[^>]*href[^>]*>[\s\S]*<\/a>[\s\S]*$/i;
    const textContent = summary.replace(/<[^>]*>/g, "").trim();
    if (linkOnlyPattern.test(summary) && textContent.length < 30) {
      return "This article is being summarized. Please check back soon.";
    }

    // Sanitize the HTML, allowing only specified safe tags
    const sanitized = sanitizeHtml(summary, {
      allowedTags: ["p", "ul", "li", "strong", "em"],
      allowedAttributes: {
        p: ["class"],
        ul: ["class"],
        li: ["class"],
        strong: ["class"],
        em: ["class"],
      },
      // Strip all links - keep text but remove href functionality
      transformTags: {
        a: (tagName, attribs) => {
          // Convert links to span tags to keep text but remove clickability
          return {
            tagName: "span",
            attribs: {
              class: "text-blue-600 dark:text-blue-400 font-medium",
            },
          };
        },
      },
    });

    return sanitized;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleReadFullArticle = () => {
    if (newsItem?.url) {
      window.open(newsItem.url, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
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

      {/* Main Content - Matching Digest Page Layout */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Single NewsCard - Always Expanded */}
        <div className="space-y-4">
          <NewsCard
            id={newsItem.id}
            title={newsItem.title}
            topic={newsItem.topic}
            source={newsItem.source}
            summary={newsItem.summary}
            takeaways={newsItem.takeaways}
            url={newsItem.url}
            publishedAt={newsItem.published_at || newsItem.created_at}
            imageUrl={newsItem.image || imageUrl}
            isAlwaysExpanded={true} // New prop to always show content
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
