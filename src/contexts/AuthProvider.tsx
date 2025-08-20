import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase, authUtils } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State - always declared at top level
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    console.log("AuthProvider: Initializing auth state...");

    try {
      // Get initial session
      const initialSession = await authUtils.getCurrentSession();

      if (initialSession?.user) {
        console.log(
          "AuthProvider: Found existing session for user:",
          initialSession.user.id
        );
        setSession(initialSession);
        setUser(initialSession.user);
      } else {
        console.log("AuthProvider: No existing session found");
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error("AuthProvider: Error initializing auth:", error);
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh session
  const refreshSession = useCallback(async () => {
    console.log("AuthProvider: Refreshing session...");

    try {
      const {
        data: { session: newSession },
        error,
      } = await supabase.auth.refreshSession();

      if (error) {
        console.error("AuthProvider: Error refreshing session:", error);
        setSession(null);
        setUser(null);
        return;
      }

      if (newSession?.user) {
        console.log(
          "AuthProvider: Session refreshed for user:",
          newSession.user.id
        );
        setSession(newSession);
        setUser(newSession.user);
      } else {
        console.log("AuthProvider: No session after refresh");
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error("AuthProvider: Failed to refresh session:", error);
      setSession(null);
      setUser(null);
    }
  }, []);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    console.log("AuthProvider: Signing in user...");
    setLoading(true);

    try {
      const {
        user: signedInUser,
        session: newSession,
        error,
      } = await authUtils.signIn(email, password);

      if (error) {
        console.error("AuthProvider: Sign in failed:", error);
        return { error };
      }

      if (signedInUser && newSession) {
        console.log(
          "AuthProvider: Sign in successful for user:",
          signedInUser.id
        );
        setUser(signedInUser);
        setSession(newSession);
      }

      return { error: null };
    } catch (error) {
      console.error("AuthProvider: Sign in error:", error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign up function
  const signUp = useCallback(async (email: string, password: string) => {
    console.log("AuthProvider: Signing up user...");
    setLoading(true);

    try {
      const {
        user: signedUpUser,
        session: newSession,
        error,
      } = await authUtils.signUp(email, password);

      if (error) {
        console.error("AuthProvider: Sign up failed:", error);
        return { error };
      }

      if (signedUpUser && newSession) {
        console.log(
          "AuthProvider: Sign up successful for user:",
          signedUpUser.id
        );
        setUser(signedUpUser);
        setSession(newSession);
      }

      return { error: null };
    } catch (error) {
      console.error("AuthProvider: Sign up error:", error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    console.log("AuthProvider: Signing out user...");

    try {
      const { error } = await authUtils.signOut();

      if (error) {
        console.error("AuthProvider: Sign out failed:", error);
        return;
      }

      console.log("AuthProvider: Sign out successful");
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("AuthProvider: Sign out error:", error);
    }
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Listen to auth state changes
  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener...");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log(
        "AuthProvider: Auth state changed:",
        event,
        newSession?.user?.id || "no user"
      );

      switch (event) {
        case "SIGNED_IN":
          if (newSession?.user) {
            setUser(newSession.user);
            setSession(newSession);
          }
          setLoading(false);
          break;

        case "SIGNED_OUT":
          setUser(null);
          setSession(null);
          setLoading(false);
          break;

        case "TOKEN_REFRESHED":
          if (newSession?.user) {
            setUser(newSession.user);
            setSession(newSession);
          }
          break;

        case "USER_UPDATED":
          if (newSession?.user) {
            setUser(newSession.user);
            setSession(newSession);
          }
          break;

        default:
          // Handle other events if needed
          break;
      }
    });

    return () => {
      console.log("AuthProvider: Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, []);

  // Context value
  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Custom hook for protected routes
export const useRequireAuth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return { user: null, loading: true };
  }

  if (!user) {
    return { user: null, loading: false };
  }

  return { user, loading: false };
};
