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
import { supabase } from "@/lib/supabase";
import { DebugTopicFiltering } from "@/components/DebugTopicFiltering";
import { useUser } from "@supabase/auth-helpers-react";
import { getSafeImageUrl, handleImageError } from "@/lib/imageService";
import {
  Brain,
  TrendingUp,
  Sparkles,
  Heart,
  Zap,
  ExternalLink,
} from "lucide-react";

const Learn = () => {
  const user = useUser();
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingPreferences, setLoadingPreferences] = useState(true);

  // AI Toolkits
  const {
    tools,
    isLoading: isLoadingTools,
    error: toolError,
  } = useProductHuntTools();

  // Fetch user preferences (static, no real-time)
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) {
        setUserPreferences([]);
        setLoadingPreferences(false);
        return;
      }

      setLoadingPreferences(true);
      try {
        const { data, error } = await supabase
          .from("preferences")
          .select("favorite_topics")
          .eq("user_id", user.id)
          .single();

        if (data?.favorite_topics) {
          setUserPreferences(data.favorite_topics);
        } else {
          setUserPreferences([]);
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
        setUserPreferences([]);
      } finally {
        setLoadingPreferences(false);
      }
    };

    loadPreferences();
  }, [user?.id]);

  // Fetch all topics (static, no real-time)
  useEffect(() => {
    const loadTopics = async () => {
      setLoadingTopics(true);
      try {
        let topics: Topic[];
        if (isTrendingTopicsServiceAvailable()) {
          topics = await getTrendingTopics(8);
        } else {
          topics = getFallbackTopics();
        }
        setAllTopics(topics);
      } catch (error) {
        console.error("Error loading topics:", error);
        setAllTopics([]);
      } finally {
        setLoadingTopics(false);
      }
    };

    loadTopics();
  }, []);

  // Simple filtering logic - sync filteredTopics when allTopics or userPreferences change
  useEffect(() => {
    if (!loadingTopics && !loadingPreferences) {
      if (!userPreferences || userPreferences.length === 0) {
        // If no preferences, show all topics
        setFilteredTopics(allTopics);
      } else {
        // Filter topics by matching any tag with a preference
        const filtered = allTopics.filter((topic) => {
          const topicText = [
            topic.title?.toLowerCase() || "",
            topic.category?.toLowerCase() || "",
            topic.summary?.toLowerCase() || "",
          ].join(" ");

          return userPreferences.some((pref) =>
            topicText.includes(pref.toLowerCase())
          );
        });
        setFilteredTopics(filtered);
      }
    }
  }, [allTopics, userPreferences, loadingTopics, loadingPreferences]);

  if (loadingTopics || loadingPreferences) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading topics...</p>
        </div>
      </div>
    );
  }

  const isPersonalized = userPreferences && userPreferences.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
              {isPersonalized
                ? "Your Personalized Topics"
                : "Trending Learning Topics"}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            {isPersonalized
              ? "Discover topics tailored to your interests and start your learning journey with interactive quests and hands-on projects."
              : "Discover the hottest tech topics and start your learning journey with interactive quests, hands-on projects, and gamified experiences."}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {isPersonalized && (
              <Badge
                variant="secondary"
                className="flex items-center gap-2 bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300"
              >
                <Heart className="w-4 h-4" />✨ Personalized
              </Badge>
            )}
            <Badge variant="secondary" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Live Data
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Updated Hourly
            </Badge>
          </div>
          {isPersonalized && userPreferences && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                <strong>Your interests:</strong> {userPreferences.join(", ")}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Topics are filtered based on your saved preferences. Update your
                profile to change your interests.
              </p>
            </div>
          )}
        </div>

        {/* Topics Grid - Always render filteredTopics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredTopics.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {isPersonalized
                  ? "No Topics Match Your Preferences"
                  : "No Topics Available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                {isPersonalized
                  ? `We couldn't find any topics matching your selected interests: ${userPreferences.join(
                      ", "
                    )}`
                  : "No learning topics are currently available. Please check back later."}
              </p>
            </div>
          ) : (
            filteredTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                title={topic.title}
                summary={topic.summary}
                imageUrl={getSafeImageUrl(
                  topic.image_url || topic.image,
                  "/placeholder.svg"
                )}
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
            ))
          )}
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
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-80 animate-pulse"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
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
                            src={getSafeImageUrl(
                              tool.image,
                              "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=64&h=64&fit=crop&auto=format&q=80"
                            )}
                            alt={tool.name}
                            className="w-16 h-16 rounded-lg object-cover"
                            onError={(e) =>
                              handleImageError(
                                e,
                                "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=64&h=64&fit=crop&auto=format&q=80"
                              )
                            }
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
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tool.tags?.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Try Tool
                        </a>
                      </div>
                    </div>
                  ))}
            </div>
          )}
        </section>
      </main>
      <BottomNavigation currentPage="learn" />
      <DebugTopicFiltering isVisible={true} />
    </div>
  );
};

export default Learn;
