import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quiz as QuizType, QuizQuestion } from "@/data/quizzes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";

interface QuizProps {
  quiz: QuizType;
  onComplete: (score: number, total: number) => void;
}

export function Quiz({ quiz, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      onComplete(score, quiz.questions.length);
    }
  };

  const getAnswerStyle = (index: number) => {
    if (!isAnswered) return "";
    if (index === question.correctAnswer)
      return "bg-green-500/20 border-green-500";
    if (index === selectedAnswer && index !== question.correctAnswer)
      return "bg-red-500/20 border-red-500";
    return "";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h3>
          <span className="text-sm text-muted-foreground">
            Score: {score}/{currentQuestion + 1}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-6">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border transition-all ${getAnswerStyle(
                  index
                )} ${isAnswered ? "cursor-default" : "hover:bg-accent"}`}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-medium mb-2">Explanation:</h4>
                <p>{question.explanation}</p>
              </div>

              <Button onClick={handleNext} className="w-full">
                {currentQuestion < quiz.questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </Card>
    </div>
  );
}
