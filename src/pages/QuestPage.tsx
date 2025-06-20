import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Trophy,
  Gamepad2,
  Sparkles,
  ListTodo,
  Puzzle,
  Target,
  Zap,
  Clock,
  Star,
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
  CheckCircle2,
  Lock,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Flashcard } from "@/components/Flashcard";
import { Quiz } from "@/components/Quiz";
import { defaultFlashcards } from "@/data/flashcards";
import { quizzes } from "@/data/quizzes";
import { learningQuests } from "@/data/quests";
import { questIcons } from "@/lib/questIcons";
import type { FlashcardType, LearningProgress } from "@/types";
import React from "react";
import { supabase } from "@/lib/supabase";
import { getTopicBySlug as getMockTopicBySlug } from "@/lib/mockTopicService";

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

const QuestPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [progress, setProgress] = useState<LearningProgress>({
    userId: "user123",
    totalXp: 0,
    level: 1,
    completedQuizzes: [],
    completedFlashcards: [],
    achievements: [],
    streak: 0,
    lastActive: new Date(),
  });

  useEffect(() => {
    async function fetchTopic() {
      setLoading(true);
      setError("");
      try {
        // Try to fetch from Supabase first
        let data = null;
        let supabaseError = null;

        try {
          const { data: supabaseData, error } = await supabase
            .from("learn_topics")
            .select("*")
            .eq("slug", slug)
            .single();

          if (!error && supabaseData) {
            data = supabaseData;
          } else {
            supabaseError = error;
          }
        } catch (err) {
          supabaseError = err;
        }

        // If Supabase fails, try mock service
        if (!data) {
          try {
            const mockData = await getMockTopicBySlug(slug);
            if (mockData) {
              data = mockData;
            }
          } catch (mockErr) {
            console.log("Mock service also failed:", mockErr);
          }
        }

        if (!data) {
          setError("Topic not found. Please try another quest.");
          setTopic(null);
        } else {
          setTopic(data);
        }
      } catch (err) {
        setError("Failed to load topic.");
        setTopic(null);
      } finally {
        setLoading(false);
      }
    }
    fetchTopic();
  }, [slug]);

  const handleFlashcardComplete = (correct: boolean) => {
    const currentFlashcard = questFlashcards[currentFlashcardIndex];
    setProgress((prev) => ({
      ...prev,
      completedFlashcards: [...prev.completedFlashcards, currentFlashcard.id],
      totalXp: prev.totalXp + (correct ? currentFlashcard.xp : 0),
    }));
    toast.success(
      correct ? `Correct! +${currentFlashcard.xp} XP` : "Keep practicing!"
    );
  };

  const handleQuizComplete = (quizId: number, score: number) => {
    setProgress((prev) => ({
      ...prev,
      completedQuizzes: [...prev.completedQuizzes, quizId],
      totalXp: prev.totalXp + score * 10,
    }));
    toast.success(`Quiz completed! +${score * 10} XP`);
  };

  // Get flashcards for this quest's category
  const questFlashcards = defaultFlashcards.filter(
    (card) => card.category === topic?.category
  );

  // Get quizzes for this quest's category
  const questQuizzes = quizzes.filter(
    (quiz) => quiz.category === topic?.category
  );

  // Parse JSON data from Supabase
  const gptLessons = topic?.gpt_lessons ? JSON.parse(topic.gpt_lessons) : null;
  const dailyBriefing = topic?.daily_briefing
    ? JSON.parse(topic.daily_briefing)
    : null;
  const trendingToolkits = topic?.trending_toolkits
    ? JSON.parse(topic.trending_toolkits)
    : null;
  const aiSkillCoach = topic?.ai_skill_coach
    ? JSON.parse(topic.ai_skill_coach)
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quest...</p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Quest Not Found</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate("/learn")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learn
          </Button>
        </div>
      </div>
    );
  }

  const QuestIcon = questIcons[topic.category] || questIcons.default;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/learn")}
              className="rounded-full hover:bg-accent/50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <QuestIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{topic.title}</h1>
                <p className="text-muted-foreground">
                  {topic.subtitle || `${topic.category} Quest`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Progress value={progress.totalXp % 100} className="w-32" />
            <span className="text-sm font-medium">Level {progress.level}</span>
          </div>
        </motion.div>

        {/* Quest Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{topic.duration || "45 min"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-sm text-muted-foreground">Lessons</p>
              <p className="font-semibold">{topic.lessons_count || 8}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-sm text-muted-foreground">Difficulty</p>
              <p className="font-semibold">{topic.difficulty || "Beginner"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm text-muted-foreground">XP Reward</p>
              <p className="font-semibold">{topic.xp_reward || 150}</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button variant="outline" onClick={() => setActiveTab("flashcards")}>
            <BookOpen className="w-4 h-4 mr-2" /> Flashcards
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("quiz")}>
            <Brain className="w-4 h-4 mr-2" /> Quiz
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("memory")}>
            <Puzzle className="w-4 h-4 mr-2" /> Memory Game
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("fill")}>
            <ListTodo className="w-4 h-4 mr-2" /> Fill-in-the-Blank
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flashcards">
              <BookOpen className="w-4 h-4 mr-2" /> Flashcards
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <Brain className="w-4 h-4 mr-2" /> Quiz
            </TabsTrigger>
            <TabsTrigger value="memory">
              <Puzzle className="w-4 h-4 mr-2" /> Memory
            </TabsTrigger>
            <TabsTrigger value="fill">
              <ListTodo className="w-4 h-4 mr-2" /> Fill
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Full GPT Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Complete GPT Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {topic.full_summary || topic.summary || "Summary loading..."}
                </p>
              </CardContent>
            </Card>

            {/* GPT Skill Lessons */}
            {gptLessons && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    GPT Skill Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {gptLessons.skill_lessons?.map((lesson, idx) => (
                    <div key={idx} className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold mb-2">{lesson.title}</h3>
                      <p className="text-muted-foreground mb-3">
                        {lesson.description}
                      </p>
                      {lesson.exercises && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Exercises:</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {lesson.exercises.map((exercise, exIdx) => (
                              <li key={exIdx}>{exercise}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {lesson.challenges && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Challenges:</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {lesson.challenges.map((challenge, chIdx) => (
                              <li key={chIdx}>{challenge}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {lesson.badges && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {lesson.badges.map((badge, badgeIdx) => (
                            <Badge key={badgeIdx} variant="secondary">
                              <Medal className="w-3 h-3 mr-1" />
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Career Value */}
                  {gptLessons.career_value && (
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        {gptLessons.career_value.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-green-600">
                            Salary Boost
                          </p>
                          <p className="text-muted-foreground">
                            {gptLessons.career_value.salary_boost}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-600">
                            Job Demand
                          </p>
                          <p className="text-muted-foreground">
                            {gptLessons.career_value.job_demand}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-purple-600">
                            Growth Rate
                          </p>
                          <p className="text-muted-foreground">
                            {gptLessons.career_value.growth_rate}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Daily Briefing */}
            {dailyBriefing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Daily Briefing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {dailyBriefing.summary}
                  </p>

                  {dailyBriefing.key_takeaways && (
                    <div>
                      <h4 className="font-medium mb-2">Key Takeaways:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {dailyBriefing.key_takeaways.map((takeaway, idx) => (
                          <li key={idx}>{takeaway}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                        Career Impact
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        {dailyBriefing.career_impact}
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                      <h4 className="font-medium text-green-700 dark:text-green-300 mb-1">
                        Tool Implications
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {dailyBriefing.tool_implications}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Flashcards
                    </Button>
                    <Button variant="outline" size="sm">
                      <Brain className="w-4 h-4 mr-2" />
                      Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trending Toolkits & App Recipes */}
            {trendingToolkits && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    Trending Toolkits & App Recipes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {trendingToolkits.featured_tools?.map((tool, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{tool.name}</h3>
                      <p className="text-muted-foreground mb-3">
                        {tool.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 text-sm">
                            Pro Tips:
                          </h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {tool.pro_tips?.map((tip, tipIdx) => (
                              <li key={tipIdx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-sm">
                            Workflow Examples:
                          </h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {tool.workflow_examples?.map((example, exIdx) => (
                              <li key={exIdx}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}

                  {trendingToolkits.game_blocks && (
                    <div>
                      <h4 className="font-medium mb-3">Game-Style Blocks:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trendingToolkits.game_blocks.map((block, idx) => (
                          <Card
                            key={idx}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-4">
                              <h5 className="font-semibold mb-1">
                                {block.title}
                              </h5>
                              <p className="text-sm text-muted-foreground mb-2">
                                {block.description}
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="outline">
                                  {block.difficulty}
                                </Badge>
                                <span className="text-sm font-medium text-primary">
                                  +{block.xp_reward} XP
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* AI Skill Coach */}
            {aiSkillCoach && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-primary" />
                    AI Skill Coach
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {aiSkillCoach.resume_analysis && (
                    <div>
                      <h3 className="font-semibold mb-3">Resume Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">
                            Missing Skills:
                          </h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {aiSkillCoach.resume_analysis.missing_skills?.map(
                              (skill, idx) => (
                                <li key={idx}>{skill}</li>
                              )
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-green-600">
                            Recommendations:
                          </h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {aiSkillCoach.resume_analysis.recommendations?.map(
                              (rec, idx) => (
                                <li key={idx}>{rec}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {aiSkillCoach.learning_tracker && (
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Learning Tracker</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Current Level</p>
                          <p className="text-2xl font-bold text-primary">
                            {aiSkillCoach.learning_tracker.current_level}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Progress</p>
                          <Progress
                            value={
                              aiSkillCoach.learning_tracker.progress_percentage
                            }
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {aiSkillCoach.learning_tracker.progress_percentage}%
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Next Milestone</p>
                          <p className="text-muted-foreground">
                            {aiSkillCoach.learning_tracker.next_milestone}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Est. Completion</p>
                          <p className="text-muted-foreground">
                            {aiSkillCoach.learning_tracker.estimated_completion}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="mt-6">
            {questFlashcards.length > 0 ? (
              <div className="space-y-4">
                <Flashcard
                  flashcard={questFlashcards[currentFlashcardIndex]}
                  onComplete={handleFlashcardComplete}
                  onNext={() =>
                    setCurrentFlashcardIndex(
                      (prev) => (prev + 1) % questFlashcards.length
                    )
                  }
                />
                <div className="text-center text-sm text-muted-foreground">
                  Card {currentFlashcardIndex + 1} of {questFlashcards.length}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No flashcards available for this topic yet.</p>
              </div>
            )}
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="mt-6">
            {questQuizzes.length > 0 ? (
              <div className="space-y-4">
                {selectedQuiz !== null ? (
                  <Quiz
                    quiz={questQuizzes[selectedQuiz]}
                    onComplete={(score, total) => {
                      handleQuizComplete(questQuizzes[selectedQuiz].id, score);
                      setSelectedQuiz(null);
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Select a Quiz:</h3>
                    {questQuizzes.map((quiz, idx) => (
                      <Card
                        key={quiz.id}
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedQuiz(idx)}
                      >
                        <h4 className="font-medium">{quiz.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {quiz.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {quiz.questions.length} questions
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No quizzes available for this topic yet.</p>
              </div>
            )}
          </TabsContent>

          {/* Memory Game Tab */}
          <TabsContent value="memory" className="mt-6">
            <div className="text-center text-muted-foreground">
              <Puzzle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Memory game coming soon.</p>
            </div>
          </TabsContent>

          {/* Fill-in-the-Blank Tab */}
          <TabsContent value="fill" className="mt-6">
            <div className="text-center text-muted-foreground">
              <ListTodo className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Fill-in-the-Blank game coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestPage;
