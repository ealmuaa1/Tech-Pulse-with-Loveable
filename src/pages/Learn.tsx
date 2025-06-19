import React, { useState, useEffect } from "react";
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
};

/**
 * Normalize topic names for consistent matching
 */
const normalizeTopic = (topic: string): string => {
  const normalized = topicAliases[topic] || topic;
  return normalized.toLowerCase().trim();
};

/**
 * Shuffle array function
 */
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

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
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTrends() {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching trends for Learn page...");
        const res = await fetch(
          "http://localhost:4000/api/trends?source=learn"
        );
        if (!res.ok) throw new Error("Failed to fetch trending topics");
        const data = await res.json();
        console.log("Received trends data:", data);
        setTrends(data);
      } catch (err) {
        console.error("Error fetching trends:", err);
        setError("Failed to load trending topics.");
        setTrends([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, []);

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
        <h2 className="text-lg font-semibold mb-4">Today's Top Digests</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-muted rounded-xl h-64"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold mb-4">
            {error}
          </div>
        ) : trends && trends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trends.map((trend, idx) => (
              <div
                key={trend.id || trend.title + idx}
                className="bg-white dark:bg-muted rounded-xl shadow overflow-hidden border border-border flex flex-col justify-between h-64 hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    trend.image ||
                    "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  alt={trend.title}
                  className="w-full h-40 object-cover rounded-t-md"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x200?text=Image+Not+Available";
                  }}
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4 className="text-xl font-bold mb-2">{trend.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {trend.summary || "No summary available."}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <a
                      href={trend.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
                    >
                      Read More
                    </a>
                    <button className="bg-muted px-3 py-1 rounded hover:bg-muted/80">
                      Discuss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No trending topics available at the moment.
          </div>
        )}

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
