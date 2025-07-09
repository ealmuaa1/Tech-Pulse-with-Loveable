import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TopicMatcher, TopicExtractor } from "@/lib/topicExtraction";
import { supabase } from "@/lib/supabase";
import { getTrendingTopics } from "@/lib/trendingTopicsService";
import { Topic } from "@/lib/topicService";
import { useUser } from '@supabase/auth-helpers-react';

interface DebugTopicFilteringProps {
  isVisible?: boolean;
}

export const DebugTopicFiltering: React.FC<DebugTopicFilteringProps> = ({
  isVisible = false,
}) => {
  const user = useUser();
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [extractionResults, setExtractionResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('preferences')
        .select('favorite_topics')
        .eq('user_id', user?.id)
        .single();
      if (data?.favorite_topics) {
        setUserPreferences(data.favorite_topics);
        console.log('DebugPanel: fetched preferences:', data.favorite_topics);
      } else {
        setUserPreferences([]);
        console.log('DebugPanel: no preferences found or error:', error);
      }
    } catch (err) {
      setUserPreferences([]);
      console.log('DebugPanel: error fetching preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user preferences from the correct table with real-time updates
  useEffect(() => {
    if (!user?.id) return;
    fetchPreferences();
    let subscription;
    const setupRealtime = async () => {
      subscription = supabase
        .channel('debug-preferences-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'preferences',
            filter: `user_id=eq.${user.id}`
          },
          fetchPreferences
        )
        .subscribe();
    };
    setupRealtime();
    return () => { if (subscription) subscription.unsubscribe(); };
  }, [user?.id]);

  // Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const fetchedTopics = await getTrendingTopics(8);
        setTopics(fetchedTopics);
      } catch (err) {
        console.error("Error fetching topics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Test filtering
  useEffect(() => {
    if (topics.length > 0 && userPreferences.length > 0) {
      const filtered = TopicMatcher.filterContent(topics, userPreferences);
      const sorted = TopicMatcher.sortByRelevance(filtered, userPreferences);
      setFilteredTopics(sorted);

      // Test extraction on each topic
      const extractions = topics.map((topic) => {
        const extracted = TopicExtractor.extractTopics(topic);
        const match = TopicMatcher.matchContent(topic, userPreferences);
        return {
          topic: topic.title,
          extracted,
          match,
        };
      });
      setExtractionResults(extractions);
    }
  }, [topics, userPreferences]);

  if (!isVisible) return null;

  // Show loading state if loading
  if (loading) return <div className="p-4">Loading preferences...</div>;

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 overflow-y-auto z-50">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        🔍 Topic Filtering Debug
      </h3>

      {/* User Preferences */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          User Preferences:
        </h4>
        <div className="flex flex-wrap gap-1">
          {userPreferences.map((pref, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {pref}
            </Badge>
          ))}
          {userPreferences.length === 0 && (
            <span className="text-xs text-gray-500">No preferences set</span>
          )}
        </div>
      </div>

      {/* Filtering Results */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filtering Results:
        </h4>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div>Total Topics: {topics.length}</div>
          <div>Filtered Topics: {filteredTopics.length}</div>
          <div>
            Match Rate:{" "}
            {topics.length > 0
              ? ((filteredTopics.length / topics.length) * 100).toFixed(1)
              : 0}
            %
          </div>
        </div>
      </div>

      {/* Topic Extraction Results */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Topic Extraction:
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {extractionResults.map((result, index) => (
            <div
              key={index}
              className="text-xs border-l-2 border-gray-200 dark:border-gray-600 pl-2"
            >
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {result.topic}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                Match: {result.match.isMatch ? "✅" : "❌"} (Confidence:{" "}
                {result.match.confidence.toFixed(2)})
              </div>
              <div className="text-gray-500 dark:text-gray-500">
                Extracted:{" "}
                {result.extracted.map((e) => e.topic).join(", ") || "None"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtered Topics List */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filtered Topics:
        </h4>
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {filteredTopics.map((topic, index) => (
            <div
              key={index}
              className="text-xs text-gray-600 dark:text-gray-400 truncate"
            >
              {index + 1}. {topic.title}
            </div>
          ))}
          {filteredTopics.length === 0 && (
            <span className="text-xs text-gray-500">
              No topics match preferences
            </span>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <Button
        size="sm"
        variant="outline"
        className="mt-4 w-full"
        onClick={() => window.location.reload()}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Refresh"}
      </Button>
    </div>
  );
};
