import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
}

interface FlashcardGameProps {
  flashcards: FlashcardData[];
  onComplete: () => void;
  onClose: () => void;
}

const FlashcardGame: React.FC<FlashcardGameProps> = ({
  flashcards,
  onComplete,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set());

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      // Mark as viewed when flipped to see the answer
      setCompletedCards((prev) => new Set([...prev, currentCard.id]));
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const isLastCard = currentIndex === flashcards.length - 1;
  const allCardsViewed = completedCards.size === flashcards.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Flashcard Review</h2>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <span className="text-sm text-gray-600">
              {completedCards.size} viewed
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Flashcard */}
        <div className="relative h-80 mb-6">
          <div
            className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={handleFlip}
          >
            {/* Front of card */}
            <Card className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                  <p className="text-lg font-medium text-blue-900 mb-4">
                    {currentCard.front}
                  </p>
                  <p className="text-sm text-blue-600">
                    Click to reveal answer
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Back of card */}
            <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="flex items-center justify-center h-full p-8">
                <div className="text-center">
                  <p className="text-lg font-medium text-purple-900 mb-4">
                    {currentCard.back}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-purple-600">
                      Got it? Move to next card
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Flip
            </Button>
          </div>

          {!isLastCard ? (
            <Button onClick={handleNext} className="flex items-center gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!allCardsViewed}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" />
              Complete
            </Button>
          )}
        </div>

        {/* Completion Message */}
        {allCardsViewed && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-800 font-medium">
              🎉 Great job! You've reviewed all flashcards.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardGame;
