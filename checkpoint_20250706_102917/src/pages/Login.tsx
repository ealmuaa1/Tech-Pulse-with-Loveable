import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Check if profile exists and create if needed
  const checkAndCreateProfile = async (userId: string, email: string) => {
    try {
      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        console.error("Error checking profile:", fetchError);
        throw fetchError;
      }

      if (!existingProfile) {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: userId,
            email: email,
            username: email.split("@")[0],
            full_name: email.split("@")[0],
            favorite_topics: JSON.stringify([]),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }

        console.log("Profile created successfully");
        return true;
      }

      console.log("Profile already exists");
      return true;
    } catch (error) {
      console.error("Error in checkAndCreateProfile:", error);
      throw error;
    }
  };

  // Handle auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);

      if (event === "SIGNED_IN" && session?.user) {
        setIsLoading(true);
        try {
          const { data, error: userError } = await supabase.auth.getUser();

          if (userError) {
            console.error("Error getting user:", userError);
            throw userError;
          }

          if (!data || !data.user) {
            console.error("No user found after sign in");
            throw new Error("No user found");
          }

          const user = data.user;

          console.log("User authenticated:", user);

          // Check and create profile
          await checkAndCreateProfile(user.id, user.email || "");

          toast({
            title: "Success",
            description: "Welcome back!",
          });

          // Navigate to profile page
          navigate("/profile");
        } catch (error) {
          console.error("Error in auth state change:", error);
          toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // If user is already logged in, redirect to profile
  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/profile");
      }
    };
    checkSessionAndRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Setting up your account...
            </p>
          </div>
        ) : (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#7c3aed",
                    brandAccent: "#6d28d9",
                  },
                },
              },
              className: {
                container: "w-full",
                button: "w-full bg-primary hover:bg-primary/90 text-white",
                input: "w-full",
              },
            }}
            providers={["google", "github"]}
            redirectTo={`${window.location.origin}/profile`}
            view="sign_in"
            showLinks={true}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email address",
                  password_label: "Password",
                },
                sign_up: {
                  email_label: "Email address",
                  password_label: "Password",
                  link_text: "Don't have an account? Sign up",
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
