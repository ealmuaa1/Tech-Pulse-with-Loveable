import { supabase } from "./supabase";

export interface UserSettings {
  darkMode: boolean;
  notifications: boolean;
  emailUpdates: boolean;
}

const SETTINGS_KEY = "user_settings";

export const getStoredSettings = (): UserSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored
    ? JSON.parse(stored)
    : {
        darkMode: false,
        notifications: true,
        emailUpdates: true,
      };
};

export const saveSettings = async (userId: string, settings: UserSettings) => {
  try {
    // Save to localStorage for immediate access
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

    // Save to Supabase if user is logged in
    if (userId) {
      const { error } = await supabase
        .from("preferences")
        .upsert({
          user_id: userId,
          settings: settings,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error("Error saving settings to Supabase:", error);
      }
    }
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

export const loadUserSettings = async (
  userId: string
): Promise<UserSettings> => {
  try {
    if (!userId) return getStoredSettings();

    const { data, error } = await supabase
      .from("preferences")
      .select("settings")
      .eq("user_id", userId)
      .single();

    if (!error && data && data.settings) {
      const settings = data.settings as UserSettings;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return settings;
    }

    return getStoredSettings();
  } catch (error) {
    console.error("Error loading settings:", error);
    return getStoredSettings();
  }
};
