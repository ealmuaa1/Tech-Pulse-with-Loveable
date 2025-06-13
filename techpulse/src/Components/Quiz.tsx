import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMemoryToolProgress } from "@/lib/progress";

interface QuizProps {
  category: string;
  onComplete: (score: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export function Quiz({ category, onComplete }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    // Load initial progress
    const progress = getMemoryToolProgress("quiz", parseInt(category));
    setScore(progress);

    // Generate questions based on category
    const quizQuestions = generateQuestions(category);
    setQuestions(quizQuestions);
  }, [category]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      const newScore = score + 10;
      setScore(newScore);
      onComplete(newScore);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    const quizQuestions = generateQuestions(category);
    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizComplete(false);
  };

  if (questions.length === 0) {
    return (
      <Card className="p-4">
        <p>No questions available for this category.</p>
      </Card>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Quiz</h3>
      {!quizComplete ? (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p className="font-medium">{currentQuestion.question}</p>
          </div>
          <div className="space-y-2 mb-4">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Score: {score}</span>
            <Button onClick={handleSubmit} disabled={!selectedAnswer} size="sm">
              {currentIndex < questions.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Quiz Complete!</p>
          <p className="text-sm text-muted-foreground mb-4">
            Your final score: {score}
          </p>
          <Button onClick={resetQuiz}>Try Again</Button>
        </div>
      )}
    </Card>
  );
}

function generateQuestions(category: string): Question[] {
  // This would typically come from your content database
  const questionsByCategory: Record<string, Question[]> = {
    AI: [
      {
        id: 1,
        question: "What is Machine Learning?",
        options: [
          "AI systems that learn from data",
          "A type of computer hardware",
          "A programming language",
          "A database system",
        ],
        correctAnswer: "AI systems that learn from data",
      },
      {
        id: 2,
        question: "What is a Neural Network?",
        options: [
          "A type of computer hardware",
          "AI model inspired by human brain",
          "A database system",
          "A programming language",
        ],
        correctAnswer: "AI model inspired by human brain",
      },
    ],
    Blockchain: [
      {
        id: 1,
        question: "What is a Smart Contract?",
        options: [
          "A type of cryptocurrency",
          "A database system",
          "Self-executing digital contract",
          "A programming language",
        ],
        correctAnswer: "Self-executing digital contract",
      },
      {
        id: 2,
        question: "What is Mining in blockchain?",
        options: [
          "A type of cryptocurrency",
          "Process of validating transactions",
          "A database system",
          "A programming language",
        ],
        correctAnswer: "Process of validating transactions",
      },
    ],
    // Add more categories as needed
  };

  return questionsByCategory[category] || [];
}
