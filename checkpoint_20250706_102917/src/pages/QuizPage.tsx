import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { quizzes } from "@/data/quizzes";
import { learningQuests } from "@/data/quests";
import { toast } from "sonner";

const QuizPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Find the quest that matches the slug
  const quest = learningQuests.find(
    (q) => q.title.toLowerCase().replace(/\s+/g, "-") === slug
  );

  // Get quiz for this topic
  const quiz = quizzes.find((q) => q.category === quest?.category);

  useEffect(() => {
    if (quiz && currentQuestionIndex >= quiz.questions.length) {
      setShowResults(true);
    }
  }, [currentQuestionIndex, quiz]);

  if (!quest || !quiz) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">No quiz available</h1>
        <Button onClick={() => navigate(`/learn/${slug}`)}>
          Back to Topic
        </Button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / quiz.questions.length) * 100;

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      toast.success("Correct! +10 XP");
    } else {
      toast.error("Incorrect!");
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
            <p className="text-xl mb-6">
              Your score: {score} / {quiz.questions.length}
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate(`/learn/${slug}`)}>
                Back to Topic
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setScore(0);
                  setShowResults(false);
                  setSelectedAnswer(null);
                }}
              >
                Retry Quiz
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/learn/${slug}`)}
            className="rounded-full hover:bg-accent/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-4">
            <Progress value={progress} className="w-32" />
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">
              {currentQuestion.text}
            </h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className="w-full justify-start h-auto py-4 px-6"
                  onClick={() => handleAnswer(index)}
                >
                  <span className="mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-end mt-6">
            <Button
              size="lg"
              onClick={handleNext}
              disabled={selectedAnswer === null}
            >
              {currentQuestionIndex === quiz.questions.length - 1
                ? "Finish"
                : "Next"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizPage;
