import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

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

    // Save to Firebase if user is logged in
    if (userId) {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { settings }, { merge: true });
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

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists() && userDoc.data().settings) {
      const settings = userDoc.data().settings as UserSettings;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return settings;
    }

    return getStoredSettings();
  } catch (error) {
    console.error("Error loading settings:", error);
    return getStoredSettings();
  }
};
