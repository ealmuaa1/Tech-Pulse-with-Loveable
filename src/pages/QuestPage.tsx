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
import {
  Brain,
  Star,
  Puzzle,
  ListTodo,
  Bot,
  Gem,
  BookOpen,
  ChevronDown,
  ExternalLink,
  Video,
  GraduationCap,
  Wrench,
  Link as LinkIcon,
} from "lucide-react";
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

          // Fetch topic data with graceful error handling
          let topicData = null;
          try {
            topicData = await getTopicBySlug(slug);

            // If topic exists, ensure all required fields have fallbacks
            if (topicData) {
              // Ensure topic has required fields with defaults
              topicData = {
                slug: topicData.slug || slug,
                title: topicData.title || `Topic: ${slug}`,
                summary:
                  topicData.summary || "Topic description coming soon...",
                learningResources: topicData.learningResources || [],
                flashcards: topicData.flashcards || [],
                quizQuestions: topicData.quizQuestions || [],
                ...topicData, // Keep any other fields that exist
              };

              console.log(
                `[QuestPage] Fetched topic for slug '${slug}':`,
                topicData
              );
            }
          } catch (topicErr) {
            // Don't log errors for missing topics - just continue silently
            console.log(`[QuestPage] Topic '${slug}' not found in database`);
          }
          setTopic(topicData);

          // Get dynamic quest content based on the topic
          try {
            const content = await getQuestContent(slug, topicData);

            // Ensure quest content has required fields with defaults
            const safeContent = {
              title: content?.title || topicData?.title || `Topic: ${slug}`,
              summary:
                content?.summary ||
                topicData?.summary ||
                "Topic description coming soon...",
              lessons: content?.lessons || [],
              flashcards: content?.flashcards || topicData?.flashcards || [],
              quizQuestions:
                content?.quizQuestions || topicData?.quizQuestions || [],
              badges: content?.badges || { earned: [], available: [] },
              microProject: content?.microProject || null,
              miniBuilderTools: content?.miniBuilderTools || null,
              resourceTrail: content?.resourceTrail || null,
              toolkits: content?.toolkits || null,
              ...content, // Keep any other fields that exist
            };

            setQuestContent(safeContent);
          } catch (contentErr) {
            console.error("Error fetching quest content:", contentErr);

            // Create minimal fallback content
            const fallbackContent = {
              title: topicData?.title || `Topic: ${slug}`,
              summary: topicData?.summary || "Topic description coming soon...",
              lessons: [],
              flashcards: topicData?.flashcards || [],
              quizQuestions: topicData?.quizQuestions || [],
              badges: { earned: [], available: [] },
              microProject: null,
              miniBuilderTools: null,
              resourceTrail: null,
              toolkits: null,
            };

            setQuestContent(fallbackContent);
          }
        } catch (err) {
          console.error("Unexpected error in fetchTopicAndContent:", err);
          setError("Failed to load quest content");
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

  // Check if topic is null (getTopicBySlug returned null or error)
  // But we still want to show the full layout with fallbacks
  // Only show "coming soon" if there's no questContent at all
  if (!questContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
        <div className="max-w-5xl mx-auto p-4 space-y-8">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold mb-4">
              This topic is coming soon. Check back later!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're working hard to bring you amazing content for this topic.
            </p>
            <Button asChild>
              <Link to="/learn">Go Back</Link>
            </Button>
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
            {questContent.summary || "Summary coming soon."}
          </p>
        </header>

        {/* Progress Tracker */}
        <ProgressTracker
          xpPercentage={currentProgress.xpPercentage}
          completedModules={currentProgress.completedModules}
          totalModules={currentProgress.totalModules}
          completedLessons={currentProgress.completedLessons}
          totalLessons={questContent.lessons.length}
          earnedBadges={
            questContent.badges && questContent.badges.earned
              ? questContent.badges.earned
              : []
          }
        />

        {/* Lessons Section - Always render */}
        <div className="p-6 bg-white rounded-xl shadow">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Lessons & Content
          </h3>
          {questContent.lessons && questContent.lessons.length > 0 ? (
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
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                No lessons yet — stay tuned!
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                We're preparing comprehensive lessons for this topic. Check back
                later!
              </p>
            </div>
          )}
        </div>

        {/* Games Section - Always render */}
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

          {/* Show fallback message if no game content available */}
          {!questContent.flashcards?.length &&
            !questContent.quizQuestions?.length && (
              <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Puzzle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Coming soon
                </p>
              </div>
            )}
        </div>

        {/* Advanced Challenges Section - Always render */}
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

        {/* Learning Resources Section - Only render if learningResources exist and are not empty */}
        {topic?.learningResources && topic.learningResources.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-500" />
                Learning Resources
              </h3>
              <p className="text-gray-600">
                Curated resources to help you master this topic
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                const resources = Array.isArray(topic.learningResources)
                  ? topic.learningResources
                  : JSON.parse(topic.learningResources || "[]");

                const getResourceIcon = (type) => {
                  switch (type) {
                    case "video":
                      return "🎥";
                    case "article":
                      return "📄";
                    case "course":
                      return "🎓";
                    default:
                      return "📘";
                  }
                };

                return resources.map((resource, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="text-3xl mb-2 cursor-pointer hover:scale-110 transition-transform">
                        {resource.icon || getResourceIcon(resource.type)}
                      </div>
                    </a>
                    <h3 className="text-lg font-semibold">{resource.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {resource.description || "Learn more about this topic"}
                    </p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-auto text-sm text-blue-500 hover:underline"
                    >
                      Visit Resource
                    </a>
                    <div className="text-xs text-gray-400 mt-1">{resource.type}</div>
                  </div>
                ));
              })()}
            </div>
          </section>
        )}

        {/* Fallback when no learning resources available */}
        {(!topic?.learningResources ||
          topic.learningResources.length === 0) && (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No learning resources available for this topic yet.
            </h4>
            <p className="text-gray-500 dark:text-gray-400">
              We're curating the best resources for this topic. Check back
              later!
            </p>
          </div>
        )}

        {/* Legacy Quest Mastered */}
        {isQuestMastered && <BadgeUnlocked />}
      </div>

      {/* Game Modals */}
      {activeGame === "flashcards" &&
        (questContent.flashcards?.length > 0 ? (
          <FlashcardGame
            flashcards={questContent.flashcards}
            onComplete={() => handleGameComplete("flashcards")}
            onClose={handleGameClose}
          />
        ) : (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Flashcards Coming Soon
              </h2>
              <p className="text-gray-600 mb-6">
                We're creating flashcards for this topic. Check back later!
              </p>
              <Button onClick={handleGameClose}>Close</Button>
            </div>
          </div>
        ))}

      {activeGame === "quiz" &&
        (questContent.quizQuestions?.length > 0 ? (
          <QuizGame
            questions={questContent.quizQuestions}
            onComplete={(score) => handleGameComplete("quiz", score)}
            onClose={handleGameClose}
          />
        ) : (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
              <Puzzle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Quiz Coming Soon</h2>
              <p className="text-gray-600 mb-6">
                We're creating quiz questions for this topic. Check back later!
              </p>
              <Button onClick={handleGameClose}>Close</Button>
            </div>
          </div>
        ))}

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
