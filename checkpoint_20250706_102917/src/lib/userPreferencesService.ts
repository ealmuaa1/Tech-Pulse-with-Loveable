import { supabase } from "./supabase";

export interface UserPreferences {
  favorite_topics: string[];
  user_id?: string;
}

// Cache for user preferences to avoid repeated API calls
let cachedPreferences: UserPreferences | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for database schema information
let schemaInfo: {
  profilesHasFavoriteTopics: boolean;
  preferencesTableExists: boolean;
  lastChecked: number;
} | null = null;
const SCHEMA_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Clear the cache to force fresh data on next fetch
 */
export const clearPreferencesCache = (): void => {
  console.log("UserPreferencesService: Clearing cache");
  cachedPreferences = null;
  cacheExpiry = 0;
};

/**
 * Clear schema cache to force fresh schema check
 */
export const clearSchemaCache = (): void => {
  console.log("UserPreferencesService: Clearing schema cache");
  schemaInfo = null;
};

/**
 * Check database schema to determine which table/column to use
 */
const checkDatabaseSchema = async (): Promise<{
  profilesHasFavoriteTopics: boolean;
  preferencesTableExists: boolean;
}> => {
  // Return cached schema info if available and not expired
  if (
    schemaInfo &&
    Date.now() < schemaInfo.lastChecked + SCHEMA_CACHE_DURATION
  ) {
    console.log("UserPreferencesService: Using cached schema info");
    return {
      profilesHasFavoriteTopics: schemaInfo.profilesHasFavoriteTopics,
      preferencesTableExists: schemaInfo.preferencesTableExists,
    };
  }

  console.log("UserPreferencesService: Checking database schema...");

  let profilesHasFavoriteTopics = false;
  let preferencesTableExists = false;

  try {
    // Check if preferences table exists by attempting a simple query
    const { error: preferencesError } = await supabase
      .from("preferences")
      .select("user_id")
      .limit(1);

    if (!preferencesError) {
      preferencesTableExists = true;
      console.log("UserPreferencesService: ✅ preferences table exists");
    } else if (preferencesError.code === "42P01") {
      console.log(
        "UserPreferencesService: ❌ preferences table does not exist"
      );
    } else {
      console.log(
        "UserPreferencesService: ⚠️ preferences table check failed:",
        preferencesError.message
      );
    }
  } catch (error) {
    console.log(
      "UserPreferencesService: Exception checking preferences table:",
      error
    );
  }

  try {
    // Check if profiles table has favorite_topics column by attempting to select it
    const { error: profilesError } = await supabase
      .from("profiles")
      .select("favorite_topics")
      .limit(1);

    if (!profilesError) {
      profilesHasFavoriteTopics = true;
      console.log(
        "UserPreferencesService: ✅ profiles.favorite_topics column exists"
      );
    } else if (profilesError.code === "42703") {
      console.log(
        "UserPreferencesService: ❌ profiles.favorite_topics column does not exist"
      );
    } else {
      console.log(
        "UserPreferencesService: ⚠️ profiles.favorite_topics check failed:",
        profilesError.message
      );
    }
  } catch (error) {
    console.log(
      "UserPreferencesService: Exception checking profiles.favorite_topics:",
      error
    );
  }

  // Cache the schema information
  schemaInfo = {
    profilesHasFavoriteTopics,
    preferencesTableExists,
    lastChecked: Date.now(),
  };

  console.log("UserPreferencesService: Schema check complete:", {
    profilesHasFavoriteTopics,
    preferencesTableExists,
  });

  return { profilesHasFavoriteTopics, preferencesTableExists };
};

/**
 * Get user's favorite topics from Supabase
 * Always returns default structure { favorite_topics: [] } even if no record exists
 * Gracefully handles missing tables/columns
 */
export const getUserPreferences = async (): Promise<UserPreferences> => {
  // Check cache first
  if (cachedPreferences && Date.now() < cacheExpiry) {
    console.log("UserPreferencesService: Returning cached preferences");
    return cachedPreferences;
  }

  // Default fallback structure
  const defaultPreferences: UserPreferences = { favorite_topics: [] };

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("UserPreferencesService: Auth error:", userError.message);
      cachedPreferences = defaultPreferences;
      cacheExpiry = Date.now() + CACHE_DURATION;
      return defaultPreferences;
    }

    if (!user) {
      console.log("UserPreferencesService: No authenticated user");
      cachedPreferences = defaultPreferences;
      cacheExpiry = Date.now() + CACHE_DURATION;
      return defaultPreferences;
    }

    // Check database schema to determine what's available
    const schema = await checkDatabaseSchema();

    let data = null;
    let querySuccessful = false;

    // Try preferences table first if it exists
    if (schema.preferencesTableExists) {
      console.log("UserPreferencesService: Querying preferences table");

      try {
        const { data: preferencesData, error: preferencesError } =
          await supabase
            .from("preferences")
            .select("favorite_topics, user_id, updated_at")
            .eq("user_id", user.id)
            .single();

        if (preferencesError) {
          console.log("UserPreferencesService: Preferences query error:", {
            code: preferencesError.code,
            message: preferencesError.message,
            details: preferencesError.details,
          });

          if (preferencesError.code === "PGRST116") {
            console.log(
              "UserPreferencesService: No preferences record found for user:",
              user.id
            );
          }
        } else if (preferencesData) {
          console.log(
            "UserPreferencesService: ✅ Found data in preferences table"
          );
          data = preferencesData;
          querySuccessful = true;
        }
      } catch (error) {
        console.error(
          "UserPreferencesService: Exception querying preferences table:",
          error
        );
      }
    }

    // Fallback to profiles table if preferences failed and profiles has the column
    if (!querySuccessful && schema.profilesHasFavoriteTopics) {
      console.log("UserPreferencesService: Falling back to profiles table");

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("favorite_topics, id, updated_at")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.log("UserPreferencesService: Profiles query error:", {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
          });

          if (profileError.code === "PGRST116") {
            console.log(
              "UserPreferencesService: No profile record found for user:",
              user.id
            );
          }
        } else if (profileData) {
          console.log(
            "UserPreferencesService: ✅ Found data in profiles table"
          );
          // Transform profiles data to match preferences structure
          data = {
            favorite_topics: profileData.favorite_topics,
            user_id: profileData.id,
            updated_at: profileData.updated_at,
          };
          querySuccessful = true;
        }
      } catch (error) {
        console.error(
          "UserPreferencesService: Exception querying profiles table:",
          error
        );
      }
    }

    // If no data found, return default with user_id
    if (!data) {
      console.log(
        "UserPreferencesService: No data found, returning default preferences"
      );
      const userDefaultPrefs = {
        favorite_topics: [],
        user_id: user.id,
      };
      cachedPreferences = userDefaultPrefs;
      cacheExpiry = Date.now() + CACHE_DURATION;
      return userDefaultPrefs;
    }

    // Parse favorite_topics safely
    let favoriteTopics: string[] = [];

    try {
      if (data.favorite_topics) {
        if (Array.isArray(data.favorite_topics)) {
          // Already an array (text[] from Supabase) - expected format
          favoriteTopics = data.favorite_topics.filter(
            (topic) => typeof topic === "string" && topic.trim().length > 0
          );
          console.log(
            "UserPreferencesService: ✅ Parsed array favorite_topics:",
            favoriteTopics
          );
        } else if (typeof data.favorite_topics === "string") {
          // Handle legacy JSON string format
          try {
            const parsed = JSON.parse(data.favorite_topics);
            if (Array.isArray(parsed)) {
              favoriteTopics = parsed.filter(
                (topic) => typeof topic === "string" && topic.trim().length > 0
              );
              console.log(
                "UserPreferencesService: ✅ Parsed JSON string favorite_topics:",
                favoriteTopics
              );
            } else {
              console.warn(
                "UserPreferencesService: Parsed favorite_topics is not an array:",
                parsed
              );
              favoriteTopics = [];
            }
          } catch (parseError) {
            console.warn(
              "UserPreferencesService: Failed to parse JSON, trying comma-split:",
              parseError
            );
            // Try comma-split fallback
            favoriteTopics = data.favorite_topics
              .split(",")
              .map((topic) => topic.trim())
              .filter((topic) => topic.length > 0);
            console.log(
              "UserPreferencesService: ✅ Comma-split fallback result:",
              favoriteTopics
            );
          }
        } else {
          console.warn(
            "UserPreferencesService: Unexpected favorite_topics format:",
            {
              type: typeof data.favorite_topics,
              value: data.favorite_topics,
            }
          );
          favoriteTopics = [];
        }
      } else {
        console.log("UserPreferencesService: No favorite_topics field in data");
        favoriteTopics = [];
      }
    } catch (processingError) {
      console.error(
        "UserPreferencesService: Error processing favorite_topics:",
        processingError
      );
      favoriteTopics = [];
    }

    const preferences: UserPreferences = {
      favorite_topics: favoriteTopics,
      user_id: user.id,
    };

    // Cache the preferences
    cachedPreferences = preferences;
    cacheExpiry = Date.now() + CACHE_DURATION;

    console.log(
      "UserPreferencesService: ✅ Successfully fetched preferences:",
      preferences
    );
    return preferences;
  } catch (error) {
    console.error(
      "UserPreferencesService: Critical error in getUserPreferences:",
      error
    );

    if (error instanceof Error) {
      console.error("UserPreferencesService: Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }

    // Always return default structure even on critical errors
    cachedPreferences = defaultPreferences;
    cacheExpiry = Date.now() + CACHE_DURATION;
    return defaultPreferences;
  }
};

/**
 * Update user preferences and clear cache
 * Targets the correct table and column based on what exists in the database
 */
export const updateUserPreferences = async (
  topics: string[]
): Promise<boolean> => {
  try {
    // Validate input
    if (!Array.isArray(topics)) {
      console.error(
        "UpdateUserPreferences: Topics must be an array, received:",
        typeof topics
      );
      return false;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("UpdateUserPreferences: Auth error:", userError.message);
      return false;
    }

    if (!user) {
      console.error("UpdateUserPreferences: No user logged in");
      return false;
    }

    // Validate and clean topics
    const cleanTopics = topics.filter((topic) => {
      if (typeof topic !== "string") {
        console.warn(
          "UpdateUserPreferences: Non-string topic filtered out:",
          topic
        );
        return false;
      }
      if (topic.trim().length === 0) {
        console.warn("UpdateUserPreferences: Empty topic filtered out");
        return false;
      }
      return true;
    });

    console.log(
      "UpdateUserPreferences: Updating with clean topics:",
      cleanTopics
    );

    // Check database schema to determine target table/column
    const schema = await checkDatabaseSchema();

    let updateSuccessful = false;

    // Try preferences table first if it exists
    if (schema.preferencesTableExists) {
      console.log(
        "UpdateUserPreferences: Attempting update via preferences table"
      );

      try {
        const { data, error } = await supabase
          .from("preferences")
          .upsert({
            user_id: user.id,
            favorite_topics: cleanTopics,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error("UpdateUserPreferences: Preferences table error:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });

          // Log specific error types
          if (error.code === "23503") {
            console.error(
              "UpdateUserPreferences: Foreign key constraint violation - profile may not exist"
            );
          } else if (error.code === "42501") {
            console.error(
              "UpdateUserPreferences: Permission denied - check RLS policies"
            );
          } else if (error.code === "23505") {
            console.error("UpdateUserPreferences: Unique constraint violation");
          }
        } else if (data) {
          console.log(
            "UpdateUserPreferences: ✅ Successfully updated preferences table:",
            data
          );
          updateSuccessful = true;
        }
      } catch (error) {
        console.error(
          "UpdateUserPreferences: Exception updating preferences table:",
          error
        );
      }
    }

    // Fallback to profiles table if preferences failed and profiles has the column
    if (!updateSuccessful && schema.profilesHasFavoriteTopics) {
      console.log("UpdateUserPreferences: Falling back to profiles table");

      try {
        const { data, error } = await supabase
          .from("profiles")
          .update({
            favorite_topics: cleanTopics,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
          .select()
          .single();

        if (error) {
          console.error("UpdateUserPreferences: Profiles table error:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });

          // Log specific error types
          if (error.code === "PGRST116") {
            console.error(
              "UpdateUserPreferences: Profile record not found for user:",
              user.id
            );
          } else if (error.code === "42501") {
            console.error(
              "UpdateUserPreferences: Permission denied - check RLS policies"
            );
          }
        } else if (data) {
          console.log(
            "UpdateUserPreferences: ✅ Successfully updated profiles table:",
            data
          );
          updateSuccessful = true;
        }
      } catch (error) {
        console.error(
          "UpdateUserPreferences: Exception updating profiles table:",
          error
        );
      }
    }

    // Handle case where no suitable table/column exists
    if (!schema.preferencesTableExists && !schema.profilesHasFavoriteTopics) {
      console.error(
        "UpdateUserPreferences: ❌ No suitable table/column found for storing preferences"
      );
      console.error(
        "UpdateUserPreferences: Please run the database schema migration"
      );
      return false;
    }

    if (updateSuccessful) {
      // Clear cache to force fresh data on next fetch
      clearPreferencesCache();
      console.log("UpdateUserPreferences: ✅ Update completed successfully");
      return true;
    } else {
      console.error("UpdateUserPreferences: ❌ All update attempts failed");
      return false;
    }
  } catch (error) {
    console.error("UpdateUserPreferences: Critical error:", error);

    if (error instanceof Error) {
      console.error("UpdateUserPreferences: Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }

    return false;
  }
};

/**
 * Check if a topic matches user's preferences
 */
export const isPreferredTopic = (
  topicCategory: string,
  userPreferences: UserPreferences
): boolean => {
  try {
    // Defensive checks
    if (!userPreferences || typeof userPreferences !== "object") {
      console.warn(
        "isPreferredTopic: Invalid userPreferences:",
        userPreferences
      );
      return false;
    }

    if (!Array.isArray(userPreferences.favorite_topics)) {
      console.warn(
        "isPreferredTopic: favorite_topics is not an array:",
        userPreferences.favorite_topics
      );
      return false;
    }

    if (userPreferences.favorite_topics.length === 0) {
      return false;
    }

    if (
      typeof topicCategory !== "string" ||
      topicCategory.trim().length === 0
    ) {
      console.warn("isPreferredTopic: Invalid topicCategory:", topicCategory);
      return false;
    }

    // Normalize topic matching - case insensitive and partial matches
    const normalizedCategory = topicCategory.toLowerCase().trim();

    return userPreferences.favorite_topics.some((pref) => {
      if (typeof pref !== "string" || pref.trim().length === 0) {
        console.warn("isPreferredTopic: Invalid preference item:", pref);
        return false;
      }

      const normalizedPref = pref.toLowerCase().trim();
      return (
        normalizedCategory.includes(normalizedPref) ||
        normalizedPref.includes(normalizedCategory)
      );
    });
  } catch (error) {
    console.error("isPreferredTopic: Error checking topic preference:", error);
    return false;
  }
};

/**
 * Sort content items by user preferences
 * Preferred items come first, then others
 */
export const sortByPreferences = <
  T extends { category?: string; title?: string }
>(
  items: T[],
  userPreferences: UserPreferences
): T[] => {
  try {
    // Defensive checks
    if (!Array.isArray(items)) {
      console.warn("sortByPreferences: Items is not an array:", items);
      return [];
    }

    if (!userPreferences || !Array.isArray(userPreferences.favorite_topics)) {
      console.warn(
        "sortByPreferences: Invalid userPreferences, returning original items"
      );
      return items;
    }

    if (userPreferences.favorite_topics.length === 0) {
      return items;
    }

    return [...items].sort((a, b) => {
      try {
        const aIsPreferred = isPreferredTopic(
          a?.category || a?.title || "",
          userPreferences
        );
        const bIsPreferred = isPreferredTopic(
          b?.category || b?.title || "",
          userPreferences
        );

        if (aIsPreferred && !bIsPreferred) return -1;
        if (!aIsPreferred && bIsPreferred) return 1;
        return 0;
      } catch (error) {
        console.error("sortByPreferences: Error in sort comparison:", error);
        return 0;
      }
    });
  } catch (error) {
    console.error("sortByPreferences: Error sorting items:", error);
    return Array.isArray(items) ? items : [];
  }
};

/**
 * Filter content items by user preferences
 * Returns preferred items first, then fallback to all items if no matches
 */
export const filterByPreferences = <
  T extends { category?: string; title?: string }
>(
  items: T[],
  userPreferences: UserPreferences,
  fallbackToAll: boolean = true
): T[] => {
  try {
    // Defensive checks
    if (!Array.isArray(items)) {
      console.warn("filterByPreferences: Items is not an array:", items);
      return [];
    }

    if (!userPreferences || !Array.isArray(userPreferences.favorite_topics)) {
      console.warn(
        "filterByPreferences: Invalid userPreferences, returning original items"
      );
      return items;
    }

    if (userPreferences.favorite_topics.length === 0) {
      return items;
    }

    const preferredItems = items.filter((item) => {
      try {
        return isPreferredTopic(
          item?.category || item?.title || "",
          userPreferences
        );
      } catch (error) {
        console.error("filterByPreferences: Error filtering item:", error);
        return false;
      }
    });

    // If we have preferred items, return them first, then others
    if (preferredItems.length > 0) {
      const remainingItems = items.filter(
        (item) => !preferredItems.includes(item)
      );
      return [...preferredItems, ...remainingItems];
    }

    // If no preferred items found and fallback enabled, return all
    return fallbackToAll ? items : [];
  } catch (error) {
    console.error("filterByPreferences: Error filtering items:", error);
    return Array.isArray(items) ? items : [];
  }
};
