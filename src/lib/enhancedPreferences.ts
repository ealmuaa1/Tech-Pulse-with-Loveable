import { supabase } from "./supabase";

/**
 * Enhanced User Preferences Interface
 * Extends the existing system with additional preference types
 */
export interface EnhancedUserPreferences {
  // Existing fields (preserved for compatibility)
  favorite_topics: string[];
  user_id: string;
  updated_at?: string;

  // New enhanced fields
  categories?: string[]; // ["beginner", "intermediate", "advanced"]
  contentTypes?: string[]; // ["article", "video", "tutorial", "news"]
  languages?: string[]; // ["en", "es", "fr"]
  sources?: string[]; // preferred news sources
  excludeTopics?: string[]; // topics to exclude
  difficulty?: "beginner" | "intermediate" | "advanced" | "mixed";
  learningStyle?: "visual" | "auditory" | "kinesthetic" | "mixed";
  dailyGoal?: number; // minutes per day
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    digest: boolean;
  };
}

/**
 * Enhanced Preferences Service
 * Provides advanced preference management while maintaining backward compatibility
 */
export class EnhancedPreferencesService {
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static cachedPreferences: EnhancedUserPreferences | null = null;
  private static cacheExpiry: number = 0;

  /**
   * Get user preferences with enhanced features
   * Falls back to existing system if enhanced features are not available
   */
  static async getUserPreferences(
    userId: string
  ): Promise<EnhancedUserPreferences | null> {
    try {
      // Check cache first
      if (this.cachedPreferences && Date.now() < this.cacheExpiry) {
        return this.cachedPreferences;
      }

      // Try to get enhanced preferences first
      const enhancedPrefs = await this.getEnhancedPreferences(userId);
      if (enhancedPrefs) {
        this.cachedPreferences = enhancedPrefs;
        this.cacheExpiry = Date.now() + this.CACHE_DURATION;
        return enhancedPrefs;
      }

      // Fallback to existing preferences system
      const { data: preferences, error } = await supabase
        .from("preferences")
        .select("favorite_topics, user_id, updated_at")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.log(
          "EnhancedPreferencesService: No enhanced preferences found, using fallback"
        );
        return null;
      }

      const basicPrefs: EnhancedUserPreferences = {
        favorite_topics: preferences.favorite_topics || [],
        user_id: preferences.user_id,
        updated_at: preferences.updated_at,
        // Set sensible defaults for enhanced fields
        categories: ["beginner", "intermediate", "advanced"],
        contentTypes: ["article", "video", "tutorial", "news"],
        languages: ["en"],
        sources: [],
        excludeTopics: [],
        difficulty: "mixed",
        learningStyle: "mixed",
        dailyGoal: 30,
        notificationPreferences: {
          email: true,
          push: true,
          digest: true,
        },
      };

      this.cachedPreferences = basicPrefs;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      return basicPrefs;
    } catch (error) {
      console.error(
        "EnhancedPreferencesService: Error fetching preferences:",
        error
      );
      return null;
    }
  }

  /**
   * Update user preferences with enhanced features
   * Maintains backward compatibility with existing system
   */
  static async updateUserPreferences(
    userId: string,
    preferences: Partial<EnhancedUserPreferences>
  ): Promise<boolean> {
    try {
      // Always update the basic preferences table for compatibility
      const basicUpdate = await supabase
        .from("preferences")
        .upsert({
          user_id: userId,
          favorite_topics: preferences.favorite_topics || [],
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (basicUpdate.error) {
        console.error(
          "EnhancedPreferencesService: Basic preferences update failed:",
          basicUpdate.error
        );
        return false;
      }

      // Try to update enhanced preferences if available
      await this.updateEnhancedPreferences(userId, preferences);

      // Clear cache to force refresh
      this.clearCache();

      return true;
    } catch (error) {
      console.error(
        "EnhancedPreferencesService: Error updating preferences:",
        error
      );
      return false;
    }
  }

  /**
   * Get default preferences for new users
   */
  static getDefaultPreferences(): EnhancedUserPreferences {
    return {
      favorite_topics: [],
      user_id: "",
      categories: ["beginner", "intermediate", "advanced"],
      contentTypes: ["article", "video", "tutorial", "news"],
      languages: ["en"],
      sources: [],
      excludeTopics: [],
      difficulty: "mixed",
      learningStyle: "mixed",
      dailyGoal: 30,
      notificationPreferences: {
        email: true,
        push: true,
        digest: true,
      },
    };
  }

  /**
   * Clear the preferences cache
   */
  static clearCache(): void {
    this.cachedPreferences = null;
    this.cacheExpiry = 0;
  }

  /**
   * Private method to get enhanced preferences from extended schema
   */
  private static async getEnhancedPreferences(
    userId: string
  ): Promise<EnhancedUserPreferences | null> {
    try {
      // This would query an enhanced preferences table if it exists
      // For now, we'll return null to use the fallback system
      return null;
    } catch (error) {
      console.log(
        "EnhancedPreferencesService: Enhanced preferences not available, using fallback"
      );
      return null;
    }
  }

  /**
   * Private method to update enhanced preferences
   */
  private static async updateEnhancedPreferences(
    userId: string,
    preferences: Partial<EnhancedUserPreferences>
  ): Promise<void> {
    try {
      // This would update an enhanced preferences table if it exists
      // For now, we'll just log that we're using the basic system
      console.log("EnhancedPreferencesService: Using basic preferences system");
    } catch (error) {
      console.log(
        "EnhancedPreferencesService: Enhanced preferences update not available"
      );
    }
  }
}
