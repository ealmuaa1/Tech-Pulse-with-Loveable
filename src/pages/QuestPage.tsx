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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { mockQuest, mockFlashcards, mockQuizQuestions } from "@/data/mockQuest";

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

  // New state for tracking completed lessons from mock data
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (slug) {
      const fetchTopic = async () => {
        try {
          setLoading(true);
          const data = await getTopicBySlug(slug);
          if (data) {
            setTopic(data);
            // Mock lesson content if not present in data
            if (!data.lessons) {
              // @ts-ignore
              data.lessons = {
                introduction:
                  "Welcome! This is a dynamic introduction to the topic.",
                coreConcepts:
                  "Here are the core concepts you need to understand.",
                useCases: "Discover the real-world applications.",
                practicePrompt:
                  "Now, it's your turn. Complete this practice prompt.",
                sources: ["Source 1", "Source 2", "Source 3"],
              };
            }
          } else {
            // Create a fallback topic based on the slug
            const fallbackTopic: Topic = {
              id: slug,
              created_at: new Date().toISOString(),
              title: slug
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              summary: `Learn about ${slug.replace(
                /-/g,
                " "
              )} with interactive lessons and hands-on projects.`,
              image_url: `https://source.unsplash.com/800x600/?${encodeURIComponent(
                slug.replace(/-/g, " ")
              )}`,
              source: "Dynamic Quest",
              slug: slug,
              category: "Technology",
              difficulty: "Beginner",
              duration: 20 * 60, // 20 hours
              xp: 800,
              lessons: 6,
            };
            setTopic(fallbackTopic);
            console.warn(
              `Topic not found for slug: ${slug}, using fallback topic`
            );
          }
        } catch (err) {
          // Even on error, create a fallback topic
          const fallbackTopic: Topic = {
            id: slug,
            created_at: new Date().toISOString(),
            title: slug
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            summary: `Learn about ${slug.replace(
              /-/g,
              " "
            )} with interactive lessons and hands-on projects.`,
            image_url: `https://source.unsplash.com/800x600/?${encodeURIComponent(
              slug.replace(/-/g, " ")
            )}`,
            source: "Dynamic Quest",
            slug: slug,
            category: "Technology",
            difficulty: "Beginner",
            duration: 20 * 60, // 20 hours
            xp: 800,
            lessons: 6,
          };
          setTopic(fallbackTopic);
          console.error("Error fetching topic, using fallback:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchTopic();
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

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <QuestNotFound />;
  if (!topic) return <QuestNotFound />;

  const lessonContent: LessonContent =
    (topic.lessons as unknown as LessonContent) || {
      introduction: "No content available.",
      coreConcepts: "No content available.",
      useCases: "No content available.",
      practicePrompt: "No content available.",
      sources: [],
    };

  // Use mock data for enhanced experience
  const questData = mockQuest;
  const currentProgress = {
    xpPercentage: Math.min(
      100,
      Math.round(
        (completedLessons.size / questData.lessons.length) * 50 +
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
    totalLessons: questData.lessons.length,
  };

  return (
    <>
      <div className="max-w-5xl mx-auto p-4 space-y-8 pb-16">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2">{questData.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {questData.summary}
          </p>
        </header>

        {/* Progress Tracker */}
        <ProgressTracker
          xpPercentage={currentProgress.xpPercentage}
          completedModules={currentProgress.completedModules}
          totalModules={currentProgress.totalModules}
          completedLessons={currentProgress.completedLessons}
          totalLessons={currentProgress.totalLessons}
          earnedBadges={questData.badges.earned}
        />

        {/* Lessons with new structure */}
        <LessonAccordion
          lessons={questData.lessons}
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
          earnedBadges={questData.badges.earned}
          availableBadges={questData.badges.available}
        />

        {/* Legacy Quest Mastered */}
        {isQuestMastered && <BadgeUnlocked />}
      </div>

      {/* Game Modals */}
      {activeGame === "flashcards" && (
        <FlashcardGame
          flashcards={mockFlashcards}
          onComplete={() => handleGameComplete("flashcards")}
          onClose={handleGameClose}
        />
      )}

      {activeGame === "quiz" && (
        <QuizGame
          questions={mockQuizQuestions}
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
    </>
  );
}
