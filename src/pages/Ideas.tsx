import React, { useState, useEffect } from "react";
import { Shell } from "@/components/layouts/Shell";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchSparkIdeas } from "@/lib/fetchSparkIdeas";
import IdeaCard from "@/components/IdeaCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Ideas = () => {
  const { session, loading: authLoading } = useAuth();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [favoriteTopics, setFavoriteTopics] = useState<string[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const getUserFavoriteTopics = async () => {
      if (!session?.user) {
        setFavoriteTopics([]);
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("favorite_topics")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (data?.favorite_topics) {
          setFavoriteTopics(data.favorite_topics);
        } else {
          setFavoriteTopics([]);
        }
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load your favorite topics");
        setFavoriteTopics([]);
      } finally {
        setProfileLoading(false);
      }
    };

    if (!authLoading) {
      getUserFavoriteTopics();
    }
  }, [session, authLoading]);

  useEffect(() => {
    const getIdeas = async () => {
      if (authLoading || profileLoading) return;

      try {
        setLoading(true);
        setError(null);
        const fetchedIdeas = await fetchSparkIdeas(favoriteTopics);
        setIdeas(fetchedIdeas);
      } catch (err) {
        setError("Failed to fetch ideas. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getIdeas();
  }, [favoriteTopics, authLoading, profileLoading]);

  const currentIdea = ideas[currentIdeaIndex];

  const nextIdea = () => {
    setCurrentIdeaIndex((prev) => (prev + 1) % ideas.length);
  };

  const prevIdea = () => {
    setCurrentIdeaIndex((prev) => (prev - 1 + ideas.length) % ideas.length);
  };

  if (loading || authLoading || profileLoading) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-500 dark:text-gray-400">
            {authLoading
              ? "Checking authentication..."
              : profileLoading
              ? "Loading your interests..."
              : "Fetching inspiring ideas..."}
          </p>
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <div className="text-center min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="text-red-500 dark:text-red-400 text-lg">{error}</div>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </Shell>
    );
  }

  if (!currentIdea) {
    return (
      <Shell>
        <div className="text-center min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No ideas available at the moment.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {favoriteTopics.length > 0
              ? "Try adjusting your interests in your profile settings."
              : "Try setting up your interests in your profile to get personalized ideas."}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Refresh Page
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8 animate-fade-in fade-in-delay-100">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Spark New Ideas
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 text-center max-w-2xl mx-auto">
          {favoriteTopics.length > 0
            ? "Discover innovative concepts tailored to your interests."
            : "Explore trending tech topics and emerging innovations."}
        </p>

        <div className="relative max-w-6xl mx-auto">
          <IdeaCard idea={currentIdea} />

          <div className="flex justify-center mt-8 space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={prevIdea}
              className="rounded-full"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={nextIdea}
              className="rounded-full"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Ideas;
