import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GameButton from "../components/quest/GameButton";
import SoWhatCard from "../components/quest/SoWhatCard";
import LessonAccordion, {
  LessonContent,
} from "../components/quest/LessonAccordion";
import ProgressTracker from "../components/quest/ProgressTracker";
import BadgeAward from "../components/quest/BadgeAward";
import FlashcardGame from "../components/games/FlashcardGame";
import QuizGame from "../components/games/QuizGame";
import { Brain, Star, Puzzle, ListTodo, Bot, Gem } from "lucide-react";
import { getTopicBySlug, Topic } from "@/lib/topicService";
import { getQuestContent, QuestContent } from "@/lib/questContentService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

const BadgeUnlocked = () => (
  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg text-center">
    <Gem className="w-12 h-12 mx-auto mb-2" />
    <h3 className="text-2xl font-bold">Quest Mastered!</h3>
    <p>You've unlocked a new badge for completing this topic.</p>
  </div>
);

const QuestNotFound = () => (
  <div className="text-center p-8">
    <h2 className="text-2xl font-bold mb-4">Quest Not Found</h2>
    <p className="text-muted-foreground mb-6">
      It seems the quest you're looking for doesn't exist yet.
    </p>
    <Button asChild>
      <Link to="/learn">Back to Learn Page</Link>
    </Button>
  </div>
);

export default function QuestPage() {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [questContent, setQuestContent] = useState<QuestContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Game state
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameScores, setGameScores] = useState<Record<string, number>>({});

  const [viewedLessons, setViewedLessons] = useState<
    Record<keyof LessonContent, boolean>
  >({
    introduction: false,
    coreConcepts: false,
    useCases: false,
    practicePrompt: false,
    sources: false, // Not a real lesson, but satisfies type
  });

  const [completedGames, setCompletedGames] = useState<Record<string, boolean>>(
    {
      flashcards: false,
      quiz: false,
      memory: false,
      fillInBlank: false,
    }
  );

  // New state for tracking completed lessons from dynamic content
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (slug) {
      const fetchTopicAndContent = async () => {
        try {
          setLoading(true);
          setError(null);

          // Fetch topic data first
          const topicData = await getTopicBySlug(slug);
          setTopic(topicData);

          // Get dynamic quest content based on the topic
          const content = await getQuestContent(slug, topicData);
          setQuestContent(content);
        } catch (err) {
          console.error("Error fetching topic and content:", err);
          setError("Failed to load quest content");

          // Create fallback content even on error
          const fallbackContent = await getQuestContent(slug);
          setQuestContent(fallbackContent);
        } finally {
          setLoading(false);
        }
      };
      fetchTopicAndContent();
    }
  }, [slug]);

  const handleLessonView = (lessonKey: keyof LessonContent) => {
    setViewedLessons((prev) => ({ ...prev, [lessonKey]: true }));
  };

  const handleGame = (type: string) => {
    setActiveGame(type);
  };

  const handleGameComplete = (type: string, score?: number) => {
    setCompletedGames((prev) => ({ ...prev, [type]: true }));
    if (score !== undefined) {
      setGameScores((prev) => ({ ...prev, [type]: score }));
    }
    setActiveGame(null);
  };

  const handleGameClose = () => {
    setActiveGame(null);
  };

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => new Set([...prev, lessonId]));
  };

  const allLessonsViewed = Object.values(viewedLessons)
    .slice(0, 4)
    .every(Boolean);
  const allGamesCompleted = Object.values(completedGames).every(Boolean);
  const isQuestMastered = allLessonsViewed && allGamesCompleted;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
        <div className="max-w-5xl mx-auto p-4 space-y-8">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading Quest...</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Preparing your learning journey
            </p>
          </div>
        </div>
        <BottomNavigation currentPage="quest" />
      </div>
    );
  }

  if (error && !questContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
        <div className="max-w-5xl mx-auto p-4 space-y-8">
          <QuestNotFound />
        </div>
        <BottomNavigation currentPage="quest" />
      </div>
    );
  }

  if (!questContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
        <div className="max-w-5xl mx-auto p-4 space-y-8">
          <QuestNotFound />
        </div>
        <BottomNavigation currentPage="quest" />
      </div>
    );
  }

  // Convert quest content lessons to the format expected by LessonAccordion
  const lessonContent: LessonContent = {
    introduction: questContent.lessons[0]?.content || "No content available.",
    coreConcepts: questContent.lessons[1]?.content || "No content available.",
    useCases: questContent.lessons[2]?.content || "No content available.",
    practicePrompt: questContent.lessons[3]?.content || "No content available.",
    sources: questContent.lessons[0]?.sources || [],
  };

  // Calculate progress based on dynamic content
  const currentProgress = {
    xpPercentage: Math.min(
      100,
      Math.round(
        (completedLessons.size / questContent.lessons.length) * 50 +
          (Object.keys(completedGames).filter((key) => completedGames[key])
            .length /
            4) *
            50
      )
    ),
    completedModules: Object.keys(completedGames).filter(
      (key) => completedGames[key]
    ).length,
    totalModules: 4,
    completedLessons: completedLessons.size,
    totalLessons: questContent.lessons.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
      <div className="max-w-5xl mx-auto p-4 space-y-8">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2">{questContent.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {questContent.summary}
          </p>
        </header>

        {/* Progress Tracker */}
        <ProgressTracker
          xpPercentage={currentProgress.xpPercentage}
          completedModules={currentProgress.completedModules}
          totalModules={currentProgress.totalModules}
          completedLessons={currentProgress.completedLessons}
          totalLessons={currentProgress.totalLessons}
          earnedBadges={questContent.badges.earned}
        />

        {/* Lessons with dynamic content */}
        <LessonAccordion
          lessons={questContent.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            sources: lesson.sources,
            soWhat: lesson.soWhat,
          }))}
          onLessonComplete={handleLessonComplete}
        />

        {/* Games Section */}
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Test Your Knowledge
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <GameButton
              label="Flashcards"
              Icon={Brain}
              gradient="from-purple-500 to-indigo-600"
              onClick={() => handleGame("flashcards")}
            />
            <GameButton
              label="Quiz"
              Icon={Puzzle}
              gradient="from-yellow-500 to-orange-500"
              onClick={() => handleGame("quiz")}
            />
            <GameButton
              label="Memory Game"
              Icon={Star}
              gradient="from-green-500 to-emerald-600"
              onClick={() => handleGame("memory")}
            />
            <GameButton
              label="Fill-in-the-Blank"
              Icon={ListTodo}
              gradient="from-blue-500 to-sky-600"
              onClick={() => handleGame("fillInBlank")}
            />
          </div>
        </div>

        {/* Advanced Challenges */}
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Advanced Challenges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GameButton
              label="Prompt Lab"
              Icon={Bot}
              gradient="from-slate-600 to-gray-800"
              onClick={() => handleGame("prompt-lab")}
              isOptional
            />
            <GameButton
              label="Real-World Drill"
              Icon={Gem}
              gradient="from-rose-600 to-red-700"
              onClick={() => handleGame("real-world-drill")}
              isOptional
            />
          </div>
        </div>

        {/* Badge Awards */}
        <BadgeAward
          earnedBadges={questContent.badges.earned}
          availableBadges={questContent.badges.available}
        />

        {/* Legacy Quest Mastered */}
        {isQuestMastered && <BadgeUnlocked />}
      </div>

      {/* Game Modals */}
      {activeGame === "flashcards" && questContent && (
        <FlashcardGame
          flashcards={questContent.flashcards}
          onComplete={() => handleGameComplete("flashcards")}
          onClose={handleGameClose}
        />
      )}

      {activeGame === "quiz" && questContent && (
        <QuizGame
          questions={questContent.quizQuestions}
          onComplete={(score) => handleGameComplete("quiz", score)}
          onClose={handleGameClose}
        />
      )}

      {/* Placeholder for other games */}
      {(activeGame === "memory" || activeGame === "fillInBlank") && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
            <p className="text-gray-600 mb-6">
              The{" "}
              {activeGame === "memory" ? "Memory Game" : "Fill-in-the-Blank"} is
              under development.
            </p>
            <Button onClick={() => handleGameComplete(activeGame, 85)}>
              Mock Complete (85%)
            </Button>
          </div>
        </div>
      )}

      <BottomNavigation currentPage="quest" />
    </div>
  );
}
