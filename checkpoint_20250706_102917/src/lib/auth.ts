import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth utility functions
export const authUtils = {
  // Get current session
  async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        return null;
      }
      return session;
    } catch (error) {
      console.error("Failed to get current session:", error);
      return null;
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error);
        return null;
      }
      return user;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        return { user: null, session: null, error };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error("Failed to sign in:", error);
      return { user: null, session: null, error };
    }
  },

  // Sign up with email and password
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Sign up error:", error);
        return { user: null, session: null, error };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error("Failed to sign up:", error);
      return { user: null, session: null, error };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        return { error };
      }
      return { error: null };
    } catch (error) {
      console.error("Failed to sign out:", error);
      return { error };
    }
  },

  // Check if user ID is valid
  isValidUserId(userId: string | undefined): boolean {
    return Boolean(userId && userId !== "undefined" && userId !== "null");
  },
};
