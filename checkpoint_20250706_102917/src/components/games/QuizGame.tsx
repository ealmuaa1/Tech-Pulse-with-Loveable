import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Trophy, RotateCw } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizGameProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onClose: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({
  questions,
  onComplete,
  onClose,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResult(false);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      const score = calculateScore();
      onComplete(score);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowResult(false);
    }
  };

  const handleSubmitAnswer = () => {
    setShowResult(true);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setQuizCompleted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getCurrentAnswer = () => selectedAnswers[currentQuestion];
  const isAnswerCorrect = () =>
    getCurrentAnswer() === questions[currentQuestion].correctAnswer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (quizCompleted) {
    const score = calculateScore();
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl text-center">
          <div className="mb-6">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-gray-600">Here's how you performed</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score}%</div>
              <div className="text-sm text-blue-600">Score</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {correctAnswers}
              </div>
              <div className="text-sm text-green-600">Correct</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {questions.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>

          <div className="mb-6">
            {score >= 80 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  🎉 Excellent work! You've mastered this topic.
                </p>
              </div>
            )}
            {score >= 60 && score < 80 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  👍 Good job! You're on the right track.
                </p>
              </div>
            )}
            {score < 60 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  📚 Consider reviewing the material and trying again.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const selectedAnswer = getCurrentAnswer();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Quiz Challenge</h2>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQ.correctAnswer
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-blue-500 bg-blue-50"
                      : showResult && index === currentQ.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                    {showResult &&
                      selectedAnswer === index &&
                      (index === currentQ.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                      ))}
                    {showResult &&
                      selectedAnswer !== index &&
                      index === currentQ.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                      )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
        {showResult && currentQ.explanation && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div
                className={`p-4 rounded-lg ${
                  isAnswerCorrect()
                    ? "bg-green-50 border border-green-200"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <p className="text-sm font-medium mb-2">
                  {isAnswerCorrect() ? "✅ Correct!" : "💡 Explanation:"}
                </p>
                <p className="text-sm">{currentQ.explanation}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {!showResult && selectedAnswer !== undefined && (
              <Button onClick={handleSubmitAnswer}>Submit Answer</Button>
            )}
            {showResult && (
              <Button onClick={handleNext}>
                {currentQuestion === questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
