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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

const SUMMARY_OUTLINE = [
  "Teach them to master GPT, Claude, Gemini, etc.",
  "Prompt training (choose best prompt, fix weak prompt, etc.)",
  "Real-world challenge (write a marketing plan, debug this code, etc.)",
  "Earn badges (Prompt Engineering, Image Gen, etc.)",
  "So What? Career boosts + income gain",
];

const QuestPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("flashcards");
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
        // Fetch topic by slug from Supabase
        const { data, error } = await supabase
          .from("learn_topics")
          .select("*")
          .eq("slug", slug)
          .single();
        if (error || !data) {
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

  // Parse summary into sections (for demo, just split by newlines or outline)
  const summarySections = topic?.summary
    ? topic.summary.split(/\n|\r|\u2022|\*/).filter(Boolean)
    : [];

  const quest = learningQuests.find((q) => q.id === Number(slug));

  useEffect(() => {
    if (!quest) {
      navigate("/learn");
      return;
    }
    setProgress((prev) => ({
      ...prev,
      totalXp: prev.totalXp + (prev.level - 1) * 100,
      level: prev.level,
    }));
  }, [quest, navigate, progress.level]);

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

  if (!quest) {
    return null;
  }

  // Get flashcards for this quest's category
  const questFlashcards = defaultFlashcards.filter(
    (card) => card.category === quest.category
  );

  // Get quizzes for this quest's category
  const questQuizzes = quizzes.filter(
    (quiz) => quiz.category === quest.category
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
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
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{topic?.title || slug}</h1>
                <p className="text-muted-foreground">
                  {topic?.subtitle || "AI Quest"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Progress value={progress.totalXp % 100} className="w-32" />
            <span className="text-sm font-medium">Level {progress.level}</span>
          </div>
        </motion.div>

        {/* Game Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button variant="outline" onClick={() => setActiveTab("flashcards")}>
            {" "}
            <BookOpen className="w-4 h-4 mr-2" /> Flashcards{" "}
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("quiz")}>
            {" "}
            <Brain className="w-4 h-4 mr-2" /> Quiz{" "}
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("memory")}>
            {" "}
            <Puzzle className="w-4 h-4 mr-2" /> Memory Game{" "}
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("fill")}>
            {" "}
            <ListTodo className="w-4 h-4 mr-2" /> Fill-in-the-Blank{" "}
          </Button>
        </div>

        {/* Summary Breakdown */}
        <div className="bg-card p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2">GPT Summary Breakdown</h2>
          {loading ? (
            <div className="animate-pulse h-6 w-1/2 bg-muted rounded" />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : summarySections.length > 0 ? (
            <ul className="list-disc pl-6 space-y-2">
              {SUMMARY_OUTLINE.map((outline, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span role="img" aria-label="bullet">
                    🔥
                  </span>
                  <span>{summarySections[idx] || outline}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground">
              No summary available for this quest.
            </div>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6 mt-8"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flashcards">
              {" "}
              <BookOpen className="w-4 h-4 mr-2" /> Flashcards{" "}
            </TabsTrigger>
            <TabsTrigger value="quiz">
              {" "}
              <Brain className="w-4 h-4 mr-2" /> Quiz{" "}
            </TabsTrigger>
            <TabsTrigger value="memory">
              {" "}
              <Puzzle className="w-4 h-4 mr-2" /> Memory Game{" "}
            </TabsTrigger>
            <TabsTrigger value="fill">
              {" "}
              <ListTodo className="w-4 h-4 mr-2" /> Fill-in-the-Blank{" "}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="flashcards" className="mt-6">
            <div className="text-center text-muted-foreground">
              Flashcards game coming soon.
            </div>
          </TabsContent>
          <TabsContent value="quiz" className="mt-6">
            <div className="text-center text-muted-foreground">
              Quiz game coming soon.
            </div>
          </TabsContent>
          <TabsContent value="memory" className="mt-6">
            <div className="text-center text-muted-foreground">
              Memory game coming soon.
            </div>
          </TabsContent>
          <TabsContent value="fill" className="mt-6">
            <div className="text-center text-muted-foreground">
              Fill-in-the-Blank game coming soon.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestPage;
