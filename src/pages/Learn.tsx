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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 bg-clip-text text-transparent mb-1">
                Learning Quests
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Master tech skills through interactive quests
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Achievements section */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl text-center transform transition-all duration-200 hover:scale-105 ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-300 dark:border-yellow-700 shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 opacity-60"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  {achievement.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Quests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLearningQuests.map((quest) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card
                className={`overflow-hidden cursor-pointer transition-all duration-300 ${
                  quest.locked ? "opacity-75" : ""
                }`}
                onClick={() => !quest.locked && handleQuestClick(quest)}
              >
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={quest.image}
                      alt={quest.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className={`bg-gradient-to-r ${getDifficultyColor(
                          quest.difficulty
                        )} text-white backdrop-blur-sm shadow-md`}
                      >
                        {quest.difficulty}
                      </Badge>
                    </div>
                    {quest.locked && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-white text-center">
                          <Target className="w-8 h-8 mx-auto mb-2" />
                          <div className="font-semibold">Locked</div>
                          <div className="text-sm">
                            Complete previous quests to unlock
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                      {quest.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {quest.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{quest.progress}%</span>
                      </div>
                      <Progress value={quest.progress} className="h-2" />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {quest.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {quest.lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {quest.xp} XP
                      </div>
                    </div>

                    <Button
                      className={`w-full rounded-2xl font-semibold ${
                        quest.completed
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      } shadow-lg transform transition-all duration-200 hover:scale-105`}
                      onClick={() => handleQuestClick(quest)}
                    >
                      {quest.completed ? (
                        "Completed"
                      ) : quest.locked ? (
                        "Locked"
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Quest
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="learn" />
    </div>
  );
};

export default Learn;
