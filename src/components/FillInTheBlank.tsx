import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Question {
  id: string;
  text: string;
  answer: string;
  hint?: string;
}

interface FillInTheBlankProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export function FillInTheBlank({ questions, onComplete }: FillInTheBlankProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null
  );

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    const isCorrect =
      userAnswer.toLowerCase().trim() ===
      currentQuestion.answer.toLowerCase().trim();
    setFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setUserAnswer("");
        setFeedback(null);
        setShowHint(false);
      } else {
        setIsComplete(true);
        onComplete(score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setScore(0);
    setShowHint(false);
    setIsComplete(false);
    setFeedback(null);
  };

  return (
    <div className="space-y-6">
      {!isComplete ? (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="text-sm font-medium">
                Score: {score}/{currentQuestionIndex + 1}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-lg">
                {currentQuestion.text
                  .split("_____")
                  .map((part, index, array) => (
                    <React.Fragment key={index}>
                      {part}
                      {index < array.length - 1 && (
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="mx-2 px-2 py-1 border rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Type your answer"
                        />
                      )}
                    </React.Fragment>
                  ))}
              </p>

              {currentQuestion.hint && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
              )}

              <AnimatePresence>
                {showHint && currentQuestion.hint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Hint: {currentQuestion.hint}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={resetGame} className="text-sm">
                Reset Game
              </Button>
              <Button onClick={handleSubmit} disabled={!userAnswer.trim()}>
                Submit
              </Button>
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-center space-x-2 ${
                    feedback === "correct"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {feedback === "correct" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                  <span>
                    {feedback === "correct"
                      ? "Correct!"
                      : `Incorrect. The answer is: ${currentQuestion.answer}`}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <Card className="p-6 max-w-md mx-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Great job!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                You've completed all questions with a score of {score}/
                {questions.length}
              </p>
              <Button onClick={resetGame}>Play Again</Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
