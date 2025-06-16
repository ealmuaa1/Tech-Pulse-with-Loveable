import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Brain, Trophy, Gamepad2 } from "lucide-react";
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

const QuestPage = () => {
  const { questId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flashcards");
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const quest = learningQuests.find((q) => q.id === Number(questId));

  useEffect(() => {
    if (!quest) {
      navigate("/learn");
      return;
    }
    setIsLoading(false);
  }, [quest, navigate]);

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
                {React.createElement(
                  questIcons[quest.category] || questIcons.default,
                  {
                    className: "w-6 h-6 text-primary",
                  }
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{quest.title}</h1>
                <p className="text-muted-foreground">{quest.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Progress value={progress.totalXp % 100} className="w-32" />
            <span className="text-sm font-medium">Level {progress.level}</span>
          </div>
        </motion.div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flashcards">
              <BookOpen className="w-4 h-4 mr-2" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="quizzes">
              <Brain className="w-4 h-4 mr-2" />
              Quizzes
            </TabsTrigger>
            <TabsTrigger value="game">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Learning Game
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flashcards" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : questFlashcards.length > 0 ? (
              <div className="max-w-2xl mx-auto">
                <Flashcard
                  flashcard={questFlashcards[currentFlashcardIndex]}
                  onComplete={handleFlashcardComplete}
                  onNext={() =>
                    setCurrentFlashcardIndex(
                      (prev) => (prev + 1) % questFlashcards.length
                    )
                  }
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No flashcards available for this quest.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="quizzes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questQuizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedQuiz === quiz.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedQuiz(quiz.id)}
                >
                  <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {quiz.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {quiz.questions.length} questions
                    </span>
                    <span className="text-sm font-medium">
                      {progress.completedQuizzes.includes(quiz.id)
                        ? "Completed"
                        : "Not Started"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {selectedQuiz !== null && (
              <div className="mt-8 max-w-2xl mx-auto">
                <Quiz
                  quiz={quizzes.find((q) => q.id === selectedQuiz)!}
                  onComplete={handleQuizComplete}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="game" className="mt-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">
                Learning Game Coming Soon!
              </h3>
              <p className="text-muted-foreground">
                We're working on an interactive learning game to make your
                learning experience even more engaging.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestPage;
