import React, { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import TopicCard from "@/components/TopicCard";
import { Badge } from "@/components/ui/badge";
import {
  getTrendingTopics,
  getFallbackTopics,
  isTrendingTopicsServiceAvailable,
} from "@/lib/trendingTopicsService";
import { Topic } from "@/lib/topicService";
import { useProductHuntTools } from "@/hooks/useProductHuntTools";
import type { ProductHuntTool } from "@/lib/productHunt";
import {
  Brain,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Zap,
  ExternalLink,
} from "lucide-react";

/**
 * Learn page component - Revamped with dynamic trending topics
 * Features:
 * - 4 dynamic trending topic cards in 2x2 grid (desktop) / stacked (mobile)
 * - Real-time trending data from various sources
 * - Shimmer loading states
 * - Auto-generated lesson/game counts
 * - Smooth hover animations with "Start Quest" buttons
 * - Responsive design with Tailwind CSS
 */
const Learn = () => {
  const [trendingTopics, setTrendingTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // AI Toolkits
  const {
    tools,
    isLoading: isLoadingTools,
    error: toolError,
  } = useProductHuntTools();

  const fetchTrendingTopics = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isTrendingTopicsServiceAvailable()) {
        const topics = await getTrendingTopics(4);
        setTrendingTopics(topics);
      } else {
        // Use fallback topics if service is unavailable
        const fallbackTopics = getFallbackTopics();
        setTrendingTopics(fallbackTopics);
      }
    } catch (err) {
      console.error("Error fetching trending topics:", err);
      setError("Failed to load trending topics");
      // Use fallback topics on error
      const fallbackTopics = getFallbackTopics();
      setTrendingTopics(fallbackTopics);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  // Shimmer loading component
  const ShimmerCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />

      {/* Content placeholder */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />

        {/* Summary lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>

        {/* Stats row */}
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>

        {/* Participants */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
              Trending Learning Topics
            </h1>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Discover the hottest tech topics and start your learning journey
            with interactive quests, hands-on projects, and gamified
            experiences.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Live Data
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Updated Hourly
            </Badge>
            {!loading && (
              <button
                onClick={fetchTrendingTopics}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && !loading && trendingTopics.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Unable to Load Topics
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchTrendingTopics}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Content - 4 Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {loading
            ? // Show shimmer loading cards
              Array.from({ length: 4 }).map((_, index) => (
                <ShimmerCard key={index} />
              ))
            : // Show actual topic cards
              trendingTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  title={topic.title}
                  summary={topic.summary}
                  imageUrl={topic.image_url || topic.image || ""}
                  slug={topic.slug}
                  source={topic.source}
                  category={topic.category}
                  difficulty={topic.difficulty}
                  lessonCount={topic.lessons}
                  estimatedTime={
                    topic.duration
                      ? `${Math.round(topic.duration / 60)}h`
                      : undefined
                  }
                  fallbackImage="/placeholder.svg"
                />
              ))}
        </div>

        {/* Trending AI Toolkits Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-orange-700 dark:from-white dark:to-orange-400 bg-clip-text text-transparent">
                🔥 Trending AI Toolkits
              </h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the latest AI-powered tools and applications trending on
              Product Hunt
            </p>
          </div>

          {toolError ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Unable to Load AI Toolkits
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {toolError.message}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingTools
                ? // Loading skeletons
                  Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                          <div className="flex-1">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  ))
                : // Actual toolkit cards
                  tools.slice(0, 6).map((tool: ProductHuntTool) => (
                    <div
                      key={tool.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-80"
                    >
                      <div className="p-6 flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={
                              tool.image ||
                              "https://source.unsplash.com/featured/?startup,tech"
                            }
                            alt={tool.name}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://source.unsplash.com/featured/?startup,tech";
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                              {tool.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <TrendingUp className="w-4 h-4" />
                              <span>{tool.votes} votes</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                          {tool.tagline}
                        </p>

                        {/* Tags */}
                        {tool.tags && tool.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {tool.tags.slice(0, 3).map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="p-6 pt-0">
                        <div className="flex gap-3">
                          <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors text-sm font-medium">
                            Learn More
                          </button>
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Visit Site
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </section>

        {/* Footer Note */}
        {!loading && trendingTopics.length > 0 && (
          <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Topics are updated based on trending discussions from GitHub,
              Reddit, Hacker News, and industry reports.
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="learn" />
    </div>
  );
};

export default Learn;
