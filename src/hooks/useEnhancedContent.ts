import { useState, useEffect } from "react";
import {
  EnhancedPreferencesService,
  EnhancedUserPreferences,
} from "@/lib/enhancedPreferences";
import { EnhancedTopicFilter } from "@/lib/enhancedTopicFilter";
import { useUser } from "@supabase/auth-helpers-react";

/**
 * Hook for filtering learning content based on user preferences
 * Provides fallback to original content if preferences are not available
 */
export const useFilteredLearningContent = <
  T extends {
    title?: string;
    category?: string;
    tags?: string[];
    difficulty?: string;
    source?: string;
  }
>(
  originalContent: T[],
  options: {
    maxItems?: number;
    sortByRelevance?: boolean;
    includeFallback?: boolean;
    enablePersonalization?: boolean;
  } = {}
) => {
  const [filteredContent, setFilteredContent] = useState<T[]>(originalContent);
  const [userPreferences, setUserPreferences] =
    useState<EnhancedUserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const user = useUser();

  const {
    maxItems,
    sortByRelevance = true,
    includeFallback = true,
    enablePersonalization = true,
  } = options;

  useEffect(() => {
    const fetchAndFilterContent = async () => {
      if (!enablePersonalization || !user) {
        setFilteredContent(originalContent);
        setIsPersonalized(false);
        return;
      }

      setIsLoading(true);

      try {
        // Fetch user preferences
        const preferences = await EnhancedPreferencesService.getUserPreferences(
          user?.id
        );
        setUserPreferences(preferences);

        // Check if user has meaningful preferences
        const hasPreferences =
          preferences &&
          preferences.favorite_topics &&
          preferences.favorite_topics.length > 0;

        if (hasPreferences) {
          // Apply enhanced filtering
          const personalized = EnhancedTopicFilter.getPersonalizedContent(
            originalContent,
            preferences,
            { maxItems, sortByRelevance, includeFallback }
          );
          setFilteredContent(personalized);
          setIsPersonalized(true);
        } else {
          // No preferences, use original content
          setFilteredContent(originalContent);
          setIsPersonalized(false);
        }
      } catch (error) {
        console.error(
          "useFilteredLearningContent: Error applying personalization:",
          error
        );
        // Fallback to original content on error
        setFilteredContent(originalContent);
        setIsPersonalized(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterContent();
  }, [
    originalContent,
    user,
    enablePersonalization,
    maxItems,
    sortByRelevance,
    includeFallback,
  ]);

  return {
    filteredContent,
    userPreferences,
    isLoading,
    isPersonalized,
    refreshPreferences: () => {
      EnhancedPreferencesService.clearCache();
      // Trigger re-fetch by updating a dependency
      setFilteredContent([...originalContent]);
    },
  };
};

/**
 * Hook for personalized home feed content
 * Enhances existing home page components with personalization
 */
export const usePersonalizedHomeFeed = <
  T extends {
    title?: string;
    category?: string;
    tags?: string[];
    difficulty?: string;
    source?: string;
  }
>(
  originalFeed: T[],
  options: {
    maxItems?: number;
    sortByRelevance?: boolean;
    includeFallback?: boolean;
  } = {}
) => {
  const [personalizedFeed, setPersonalizedFeed] = useState<T[]>(originalFeed);
  const [userPreferences, setUserPreferences] =
    useState<EnhancedUserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const user = useUser();

  const {
    maxItems = 4,
    sortByRelevance = true,
    includeFallback = true,
  } = options;

  useEffect(() => {
    const personalizeFeed = async () => {
      if (!user) {
        setPersonalizedFeed(originalFeed);
        setIsPersonalized(false);
        return;
      }

      setIsLoading(true);

      try {
        // Fetch user preferences
        const preferences = await EnhancedPreferencesService.getUserPreferences(
          user?.id
        );
        setUserPreferences(preferences);

        // Check if user has meaningful preferences
        const hasPreferences =
          preferences &&
          preferences.favorite_topics &&
          preferences.favorite_topics.length > 0;

        if (hasPreferences) {
          // Apply personalized filtering for home feed
          const personalized = EnhancedTopicFilter.getPersonalizedContent(
            originalFeed,
            preferences,
            { maxItems, sortByRelevance, includeFallback }
          );
          setPersonalizedFeed(personalized);
          setIsPersonalized(true);
        } else {
          // No preferences, use original feed
          setPersonalizedFeed(originalFeed);
          setIsPersonalized(false);
        }
      } catch (error) {
        console.error(
          "usePersonalizedHomeFeed: Error applying personalization:",
          error
        );
        // Fallback to original feed on error
        setPersonalizedFeed(originalFeed);
        setIsPersonalized(false);
      } finally {
        setIsLoading(false);
      }
    };

    personalizeFeed();
  }, [originalFeed, user, maxItems, sortByRelevance, includeFallback]);

  return {
    personalizedFeed,
    userPreferences,
    isLoading,
    isPersonalized,
    refreshPreferences: () => {
      EnhancedPreferencesService.clearCache();
      setPersonalizedFeed([...originalFeed]);
    },
  };
};

/**
 * Hook for personalized news content
 * Filters news updates based on user preferences
 */
export const usePersonalizedNews = <
  T extends {
    title?: string;
    category?: string;
    tags?: string[];
    difficulty?: string;
    source?: string;
  }
>(
  originalNews: T[],
  options: {
    maxItems?: number;
    sortByRelevance?: boolean;
    includeFallback?: boolean;
    filterBySource?: boolean;
  } = {}
) => {
  const [personalizedNews, setPersonalizedNews] = useState<T[]>(originalNews);
  const [userPreferences, setUserPreferences] =
    useState<EnhancedUserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const user = useUser();

  const {
    maxItems = 12,
    sortByRelevance = true,
    includeFallback = true,
    filterBySource = true,
  } = options;

  useEffect(() => {
    const personalizeNews = async () => {
      if (!user) {
        setPersonalizedNews(originalNews);
        setIsPersonalized(false);
        return;
      }

      setIsLoading(true);

      try {
        // Fetch user preferences
        const preferences = await EnhancedPreferencesService.getUserPreferences(
          user?.id
        );
        setUserPreferences(preferences);

        // Check if user has meaningful preferences
        const hasPreferences =
          preferences &&
          preferences.favorite_topics &&
          preferences.favorite_topics.length > 0;

        if (hasPreferences) {
          // Apply news-specific filtering
          let filtered = originalNews;

          // Filter by topic preferences
          if (
            preferences.favorite_topics &&
            preferences.favorite_topics.length > 0
          ) {
            filtered = EnhancedTopicFilter.filterContentByPreferences(
              originalNews,
              preferences
            );
          }

          // Filter by source preferences if enabled
          if (
            filterBySource &&
            preferences.sources &&
            preferences.sources.length > 0
          ) {
            filtered = filtered.filter((item) =>
              preferences.sources!.some((source) =>
                (item.source || "").toLowerCase().includes(source.toLowerCase())
              )
            );
          }

          // Sort by relevance if requested
          if (sortByRelevance) {
            filtered = EnhancedTopicFilter.sortByRelevance(
              filtered,
              preferences
            );
          }

          // Apply max items limit
          if (maxItems && filtered.length > maxItems) {
            filtered = filtered.slice(0, maxItems);
          }

          // Include fallback content if requested
          if (includeFallback && filtered.length < Math.min(maxItems, 4)) {
            const remainingSlots = maxItems - filtered.length;
            const fallbackContent = originalNews
              .filter((item) => !filtered.includes(item))
              .slice(0, remainingSlots);
            filtered = [...filtered, ...fallbackContent];
          }

          setPersonalizedNews(filtered);
          setIsPersonalized(true);
        } else {
          // No preferences, use original news
          setPersonalizedNews(originalNews);
          setIsPersonalized(false);
        }
      } catch (error) {
        console.error(
          "usePersonalizedNews: Error applying personalization:",
          error
        );
        // Fallback to original news on error
        setPersonalizedNews(originalNews);
        setIsPersonalized(false);
      } finally {
        setIsLoading(false);
      }
    };

    personalizeNews();
  }, [
    originalNews,
    user,
    maxItems,
    sortByRelevance,
    includeFallback,
    filterBySource,
  ]);

  return {
    personalizedNews,
    userPreferences,
    isLoading,
    isPersonalized,
    refreshPreferences: () => {
      EnhancedPreferencesService.clearCache();
      setPersonalizedNews([...originalNews]);
    },
  };
};

/**
 * Hook for feature flag management
 * Allows safe rollout of personalization features
 */
export const useFeatureFlag = (
  flagName: string,
  defaultValue: boolean = false
): boolean => {
  const [isEnabled, setIsEnabled] = useState(defaultValue);

  useEffect(() => {
    // In a real implementation, this would check against a feature flag service
    // For now, we'll use localStorage for development/testing
    const storedValue = localStorage.getItem(`feature_flag_${flagName}`);
    if (storedValue !== null) {
      setIsEnabled(storedValue === "true");
    } else {
      setIsEnabled(defaultValue);
    }
  }, [flagName, defaultValue]);

  const setFlag = (enabled: boolean) => {
    localStorage.setItem(`feature_flag_${flagName}`, enabled.toString());
    setIsEnabled(enabled);
  };

  return isEnabled;
};
