import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import {
  Play,
  Clock,
  Trophy,
  Star,
  BookOpen,
  Target,
  Zap,
  Brain,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Sparkles,
  Rocket,
  Code2,
  Cpu,
  Database,
  Globe,
  Shield,
  Smartphone,
  Network,
  Wallet,
  Gauge,
  Medal,
  Crown,
  Flame,
  Timer,
  Bookmark,
  ChevronRight,
  X,
  Cloud,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flashcard } from "@/components/Flashcard";
import { Quiz } from "@/components/Quiz";
import { ProgressTracker } from "@/components/ProgressTracker";
import { flashcards as defaultFlashcards } from "@/data/flashcards";
import { quizzes } from "@/data/quizzes";
import { LearningProgress, achievements } from "@/data/progress";
import { Flashcard as FlashcardType } from "@/data/flashcards";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { useTrends } from "@/contexts/TrendContext";
import Toolkits from "@/pages/Toolkits";

/**
 * Learning quests data
 * Each quest represents a learning path with progress tracking
 */
const learningQuests = [
  {
    id: 1,
    title: "AI Fundamentals",
    description:
      "Master the basics of artificial intelligence and machine learning",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
    progress: 75,
    duration: "45 min",
    lessons: 8,
    difficulty: "Beginner",
    xp: 150,
    completed: false,
    locked: false,
    category: "AI",
  },
  {
    id: 2,
    title: "Blockchain Basics",
    description:
      "Understand blockchain technology and its applications beyond cryptocurrency",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop",
    progress: 30,
    duration: "60 min",
    lessons: 10,
    difficulty: "Beginner",
    xp: 200,
    completed: false,
    locked: false,
    category: "Blockchain",
  },
  {
    id: 3,
    title: "Quantum Computing Intro",
    description:
      "Explore the fascinating world of quantum computing and its potential",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop",
    progress: 0,
    duration: "90 min",
    lessons: 12,
    difficulty: "Intermediate",
    xp: 300,
    completed: false,
    locked: false,
    category: "Quantum",
  },
  {
    id: 4,
    title: "Cybersecurity Essentials",
    description: "Learn essential cybersecurity concepts and best practices",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=300&fit=crop",
    progress: 100,
    duration: "75 min",
    lessons: 9,
    difficulty: "Beginner",
    xp: 250,
    completed: true,
    locked: false,
    category: "Security",
  },
  {
    id: 5,
    title: "IoT Revolution",
    description: "Discover how Internet of Things is transforming our world",
    image:
      "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=600&h=300&fit=crop",
    progress: 0,
    duration: "50 min",
    lessons: 7,
    difficulty: "Beginner",
    xp: 180,
    completed: false,
    locked: true,
    category: "IoT",
  },
  {
    id: 6,
    title: "Advanced AI Ethics",
    description: "Navigate the ethical implications of artificial intelligence",
    image:
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=300&fit=crop",
    progress: 0,
    duration: "120 min",
    lessons: 15,
    difficulty: "Advanced",
    xp: 400,
    completed: false,
    locked: true,
    category: "AI",
  },
];

// Map quest categories to icons
const questIcons: Record<string, any> = {
  AI: Brain,
  Web: Globe,
  Mobile: Smartphone,
  Cloud: Cloud,
  Security: Shield,
  Data: Database,
  Blockchain: Wallet,
  IoT: Network,
  Quantum: Cpu,
  default: Rocket,
};

// Map achievement types to icons
const achievementIcons: Record<string, any> = {
  first_quest: Star,
  streak_3: Flame,
  streak_7: Crown,
  perfect_quiz: Target,
  flashcard_master: Bookmark,
  quick_learner: Timer,
  default: Medal,
};

// Topic normalization mapping
const topicAliases: Record<string, string> = {
  AI: "Artificial Intelligence",
  "Artificial Intelligence": "Artificial Intelligence",
  "Machine Learning": "Machine Learning",
  ML: "Machine Learning",
  "Cyber Security": "Cybersecurity",
  Cyber: "Cybersecurity",
  ARVR: "AR/VR",
  "Augmented Reality": "AR/VR",
  "Virtual Reality": "AR/VR",
  Cloud: "Cloud Computing",
  "Dev Ops": "DevOps",
  Data: "Data Science",
  "Big Data": "Data Science",
  Quantum: "Quantum Computing",
  "Image Generation": "Image and Video Generation",
  "Video Generation": "Image and Video Generation",
  GenAI: "Image and Video Generation",
  "Generative AI": "Image and Video Generation",
};

// Normalize topic name using aliases
const normalizeTopic = (topic: string): string => {
  const normalized = topicAliases[topic.trim()] || topic.trim();
  return normalized.toLowerCase();
};

/**
 * Learn page component
 * Features:
 * - Learning quests with progress tracking
 * - Achievement system
 * - XP and leveling system
 * - Interactive quest cards
 * - Difficulty indicators
 */
const Learn = () => {
  const { trend } = useParams();
  const navigate = useNavigate();
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [trendFlashcards, setTrendFlashcards] = useState<FlashcardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteTopics, setFavoriteTopics] = useState<string[]>([]);
  const user = useUser();
  const [progress, setProgress] = useState<LearningProgress>({
    userId: "user123",
    totalXp: 0,
    level: 1,
    completedQuizzes: [],
    completedFlashcards: [],
    achievements: achievements,
    streak: 0,
    lastActive: new Date(),
  });
  const { dailyTrends, loadingTrends, errorTrends } = useTrends();

  // Fetch user's favorite topics
  useEffect(() => {
    const fetchFavoriteTopics = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("favorite_topics")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          try {
            const parsed = JSON.parse(data.favorite_topics);
            setFavoriteTopics(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            setFavoriteTopics([]);
          }
        }
      } catch (error) {
        console.error("Error fetching favorite topics:", error);
        toast.error("Failed to load your favorite topics");
      }
    };

    fetchFavoriteTopics();
  }, [user]);

  // Filter learning quests based on favorite topics with normalization
  const filteredLearningQuests = learningQuests.filter((quest) => {
    if (favoriteTopics.length === 0) return true; // Show all quests if no topics selected

    const normalizedQuestCategory = normalizeTopic(quest.category);
    const normalizedQuestTitle = normalizeTopic(quest.title);

    return favoriteTopics.some((topic) => {
      const normalizedTopic = normalizeTopic(topic);
      return (
        normalizedQuestCategory.includes(normalizedTopic) ||
        normalizedQuestTitle.includes(normalizedTopic)
      );
    });
  });

  useEffect(() => {
    const loadFlashcards = async () => {
      setIsLoading(true);
      try {
        if (trend) {
          const storedFlashcards = localStorage.getItem(`flashcards_${trend}`);
          if (storedFlashcards) {
            setTrendFlashcards(JSON.parse(storedFlashcards));
          } else {
            const category = trend.toLowerCase().includes("security")
              ? "Cybersecurity"
              : "Tech";
            const categoryFlashcards = defaultFlashcards.filter(
              (card) => card.category === category
            );
            setTrendFlashcards(categoryFlashcards);
          }
        }
      } catch (error) {
        console.error("Error loading flashcards:", error);
        toast.error("Failed to load flashcards");
      } finally {
        setIsLoading(false);
      }
    };

    loadFlashcards();
  }, [trend]);

  // Get color gradient based on difficulty level
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "from-green-400 to-emerald-500";
      case "Intermediate":
        return "from-yellow-400 to-orange-500";
      case "Advanced":
        return "from-red-400 to-pink-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  // Handle quest click
  const handleQuestClick = (quest: (typeof learningQuests)[0]) => {
    if (quest.locked) {
      toast.info("Complete previous quests to unlock this one!", {
        duration: 2000,
      });
      return;
    }
    navigate(`/quest/${quest.id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container space-y-6 p-6 mx-auto">
        {/* Learning Progress Section */}
        <div className="bg-card p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Learning Progress</h2>
          <p className="text-muted-foreground mb-1 text-sm">
            3 more digests to complete your weekly goal! 🚀
          </p>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-4 bg-primary rounded-full"
              style={{ width: "67%" }}
            />
          </div>
          <p className="text-right mt-1 text-sm text-primary font-medium">
            67%
          </p>
        </div>

        {/* Today's Idea Spark Card */}
        <div className="bg-green-100 p-4 rounded-2xl mb-6">
          <h3 className="text-md font-semibold text-green-800">
            Today's Idea Spark
          </h3>
          <p className="text-sm text-green-900">
            Smart City Infrastructure: What if streetlights adjusted traffic by
            air quality?
          </p>
          <button className="mt-2 bg-green-700 text-white px-4 py-1 rounded-md hover:bg-green-800">
            Explore More
          </button>
        </div>

        {/* Today's Top Digests */}
        <div className="bg-card p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Today's Top Digests</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {dailyTrends.map((digest) => (
              <div
                key={digest.id}
                className="bg-white dark:bg-muted rounded-xl shadow overflow-hidden border border-border"
              >
                <img
                  src={digest.image_url || "https://picsum.photos/800/600"}
                  alt={digest.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    console.log("Image failed to load:", digest.title);
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFMEUwRTAiLz48dGV4dCB4PSI1MCIgeT0iMTAwIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2NjYyI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
                  }}
                  onLoad={() =>
                    console.log("Image loaded successfully:", digest.title)
                  }
                />
                <div className="p-4">
                  <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                    {digest.source}
                  </span>
                  <h4 className="text-xl font-bold mt-2">{digest.title}</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    {digest.summary}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Link
                      to={digest.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
                    >
                      Read More
                    </Link>
                    <button className="bg-muted px-3 py-1 rounded">
                      Discuss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending AI Toolkits Section */}
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold mb-6">
            🔥 Trending AI Toolkits
          </h2>
          <Toolkits />
        </div>
      </div>
      <BottomNavigation currentPage="learn" />
    </div>
  );
};

export default Learn;
