import { EnhancedUserPreferences } from "./enhancedPreferences";
import { TopicMatcher } from "./topicExtraction";

/**
 * Enhanced Topic Filter
 * Provides advanced content filtering while maintaining backward compatibility
 */
export class EnhancedTopicFilter {
  /**
   * Filter content by user preferences with enhanced features
   * Always provides fallback to original content if filtering fails
   */
  static filterContentByPreferences<
    T extends {
      title?: string;
      category?: string;
      tags?: string[];
      difficulty?: string;
      source?: string;
      summary?: string;
      description?: string;
    }
  >(content: T[], preferences: EnhancedUserPreferences | null): T[] {
    try {
      // Safety check - if no preferences, return original content
      if (
        !preferences ||
        !preferences.favorite_topics ||
        preferences.favorite_topics.length === 0
      ) {
        return content;
      }

      // Use enhanced topic matching with extraction
      const filtered = TopicMatcher.filterContent(
        content,
        preferences.favorite_topics
      );

      // Apply additional exclusion filters
      const finalFiltered = filtered.filter((item) => {
        return !this.shouldExcludeItem(item, preferences);
      });

      // Return filtered results - if no matches, return empty array (don't show all content)
      console.log("EnhancedTopicFilter filtering:", {
        originalCount: content.length,
        filteredCount: finalFiltered.length,
        preferences: preferences?.favorite_topics,
        filteredTitles: finalFiltered.map((item) => item.title),
      });
      return finalFiltered;
    } catch (error) {
      console.error(
        "EnhancedTopicFilter: Filtering failed, using original content:",
        error
      );
      return content; // Always fallback to original content
    }
  }

  /**
   * Score content relevance based on user preferences (0-1)
   * Higher score = more relevant to user preferences
   */
  static scoreContentRelevance<
    T extends {
      title?: string;
      category?: string;
      tags?: string[];
      difficulty?: string;
      source?: string;
      summary?: string;
      description?: string;
    }
  >(content: T, preferences: EnhancedUserPreferences | null): number {
    try {
      if (!preferences) return 0.5; // Neutral score for no preferences

      let score = 0;
      let totalFactors = 0;

      // Topic matching using enhanced extraction (highest weight)
      if (
        preferences.favorite_topics &&
        preferences.favorite_topics.length > 0
      ) {
        const topicMatch = TopicMatcher.matchContent(
          content,
          preferences.favorite_topics
        );
        score += topicMatch.confidence * 0.4; // 40% weight
        totalFactors += 0.4;
      }

      // Category matching
      if (preferences.categories && preferences.categories.length > 0) {
        const categoryScore = this.calculateCategoryMatch(
          content,
          preferences.categories
        );
        score += categoryScore * 0.2; // 20% weight
        totalFactors += 0.2;
      }

      // Difficulty matching
      if (preferences.difficulty && preferences.difficulty !== "mixed") {
        const difficultyScore = this.calculateDifficultyMatch(
          content,
          preferences.difficulty
        );
        score += difficultyScore * 0.2; // 20% weight
        totalFactors += 0.2;
      }

      // Source preference matching
      if (preferences.sources && preferences.sources.length > 0) {
        const sourceScore = this.calculateSourceMatch(
          content,
          preferences.sources
        );
        score += sourceScore * 0.1; // 10% weight
        totalFactors += 0.1;
      }

      // Content type matching
      if (preferences.contentTypes && preferences.contentTypes.length > 0) {
        const contentTypeScore = this.calculateContentTypeMatch(
          content,
          preferences.contentTypes
        );
        score += contentTypeScore * 0.1; // 10% weight
        totalFactors += 0.1;
      }

      // Normalize score
      return totalFactors > 0 ? score / totalFactors : 0.5;
    } catch (error) {
      console.error("EnhancedTopicFilter: Scoring failed:", error);
      return 0.5; // Neutral score on error
    }
  }

  /**
   * Sort content by relevance score
   * Maintains original array structure
   */
  static sortByRelevance<
    T extends {
      title?: string;
      category?: string;
      tags?: string[];
      difficulty?: string;
      source?: string;
      summary?: string;
      description?: string;
    }
  >(content: T[], preferences: EnhancedUserPreferences | null): T[] {
    try {
      if (!preferences) return content; // No sorting if no preferences

      // Use enhanced topic matcher for sorting
      if (
        preferences.favorite_topics &&
        preferences.favorite_topics.length > 0
      ) {
        return TopicMatcher.sortByRelevance(
          content,
          preferences.favorite_topics
        );
      }

      return [...content].sort((a, b) => {
        const scoreA = this.scoreContentRelevance(a, preferences);
        const scoreB = this.scoreContentRelevance(b, preferences);
        return scoreB - scoreA; // Higher scores first
      });
    } catch (error) {
      console.error(
        "EnhancedTopicFilter: Sorting failed, returning original order:",
        error
      );
      return content; // Fallback to original order
    }
  }

  /**
   * Get personalized content with filtering and sorting
   * This is the main method to use for content personalization
   */
  static getPersonalizedContent<
    T extends {
      title?: string;
      category?: string;
      tags?: string[];
      difficulty?: string;
      source?: string;
      summary?: string;
      description?: string;
    }
  >(
    content: T[],
    preferences: EnhancedUserPreferences | null,
    options: {
      maxItems?: number;
      sortByRelevance?: boolean;
      includeFallback?: boolean;
    } = {}
  ): T[] {
    try {
      const {
        maxItems,
        sortByRelevance = true,
        includeFallback = true,
      } = options;

      // Filter content
      let filtered = this.filterContentByPreferences(content, preferences);

      // Sort by relevance if requested
      if (sortByRelevance) {
        filtered = this.sortByRelevance(filtered, preferences);
      }

      // Apply max items limit
      if (maxItems && filtered.length > maxItems) {
        filtered = filtered.slice(0, maxItems);
      }

      // Don't include fallback content - let the UI handle empty states
      console.log("EnhancedTopicFilter getPersonalizedContent:", {
        originalCount: content.length,
        filteredCount: filtered.length,
        maxItems,
        includeFallback,
        preferences: preferences?.favorite_topics,
      });

      return filtered;
    } catch (error) {
      console.error(
        "EnhancedTopicFilter: Personalization failed, using original content:",
        error
      );
      return content; // Always fallback to original content
    }
  }

  // Private helper methods

  private static shouldExcludeItem<
    T extends { title?: string; category?: string; tags?: string[] }
  >(item: T, preferences: EnhancedUserPreferences): boolean {
    if (!preferences.excludeTopics || preferences.excludeTopics.length === 0) {
      return false;
    }

    const itemText = [
      item.title || "",
      item.category || "",
      ...(item.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    return preferences.excludeTopics.some((excludeTopic) =>
      itemText.includes(excludeTopic.toLowerCase())
    );
  }

  private static calculateCategoryMatch<T extends { category?: string }>(
    content: T,
    categories: string[]
  ): number {
    if (!content.category) return 0.5;

    const contentCategory = content.category.toLowerCase();
    return categories.some((cat) => contentCategory.includes(cat.toLowerCase()))
      ? 1.0
      : 0.0;
  }

  private static calculateDifficultyMatch<T extends { difficulty?: string }>(
    content: T,
    preferredDifficulty: string
  ): number {
    if (!content.difficulty) return 0.5;

    const contentDifficulty = content.difficulty.toLowerCase();
    const preferred = preferredDifficulty.toLowerCase();

    if (contentDifficulty === preferred) return 1.0;
    if (preferred === "mixed") return 0.5;
    return 0.0;
  }

  private static calculateSourceMatch<T extends { source?: string }>(
    content: T,
    preferredSources: string[]
  ): number {
    if (!content.source) return 0.5;

    const contentSource = content.source.toLowerCase();
    return preferredSources.some((source) =>
      contentSource.includes(source.toLowerCase())
    )
      ? 1.0
      : 0.0;
  }

  private static calculateContentTypeMatch<
    T extends { title?: string; category?: string }
  >(content: T, preferredTypes: string[]): number {
    // This is a simplified implementation
    // In a real system, content would have a type field
    return 0.5; // Neutral score for now
  }
}
