import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Flashcard {
  id: string;
  term: string;
  definition: string;
  lastReviewed: Date | null;
  nextReview: Date | null;
  reviewCount: number;
  confidence: number; // 0-5 scale
}

interface SpacedRepetitionTrackerProps {
  flashcards: Flashcard[];
  onReview: (flashcardId: string, confidence: number) => void;
}

export function SpacedRepetitionTracker({
  flashcards,
  onReview,
}: SpacedRepetitionTrackerProps) {
  const [selectedFlashcard, setSelectedFlashcard] =
    React.useState<Flashcard | null>(null);
  const [showDefinition, setShowDefinition] = React.useState(false);

  const dueCards = flashcards.filter(
    (card) => !card.nextReview || new Date(card.nextReview) <= new Date()
  );

  const handleCardClick = (card: Flashcard) => {
    setSelectedFlashcard(card);
    setShowDefinition(false);
  };

  const handleConfidenceSelect = (confidence: number) => {
    if (selectedFlashcard) {
      onReview(selectedFlashcard.id, confidence);
      setSelectedFlashcard(null);
      setShowDefinition(false);
    }
  };

  const getNextReviewDate = (card: Flashcard) => {
    if (!card.nextReview) return "Not scheduled";
    const date = new Date(card.nextReview);
    return date.toLocaleDateString();
  };

  const getConfidenceLevel = (confidence: number) => {
    switch (confidence) {
      case 0:
        return "Not confident";
      case 1:
        return "Slightly confident";
      case 2:
        return "Somewhat confident";
      case 3:
        return "Confident";
      case 4:
        return "Very confident";
      case 5:
        return "Mastered";
      default:
        return "Not reviewed";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Cards */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Due Cards</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {dueCards.length} cards due
              </span>
            </div>

            <div className="space-y-2">
              {dueCards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all ${
                      selectedFlashcard?.id === card.id
                        ? "bg-purple-100 dark:bg-purple-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => handleCardClick(card)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{card.term}</span>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{getNextReviewDate(card)}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Selected Card */}
        {selectedFlashcard && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Review Card</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDefinition(!showDefinition)}
                >
                  {showDefinition ? "Hide Definition" : "Show Definition"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="text-xl font-medium">
                  {selectedFlashcard.term}
                </div>
                {showDefinition && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-gray-600 dark:text-gray-400"
                  >
                    {selectedFlashcard.definition}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    How well do you know this?
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5].map((confidence) => (
                      <Button
                        key={confidence}
                        variant="outline"
                        onClick={() => handleConfidenceSelect(confidence)}
                        className="text-sm"
                      >
                        {confidence}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Review Progress</span>
                    <span>{selectedFlashcard.reviewCount} reviews</span>
                  </div>
                  <Progress
                    value={(selectedFlashcard.reviewCount / 10) * 100}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Stats */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Next Review</span>
            </div>
            <div className="text-lg font-medium">
              {flashcards.length > 0
                ? new Date(
                    Math.min(
                      ...flashcards
                        .filter((card) => card.nextReview)
                        .map((card) => new Date(card.nextReview!).getTime())
                    )
                  ).toLocaleDateString()
                : "No cards"}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Mastered</span>
            </div>
            <div className="text-lg font-medium">
              {flashcards.filter((card) => card.confidence === 5).length} cards
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Needs Review</span>
            </div>
            <div className="text-lg font-medium">
              {flashcards.filter((card) => card.confidence < 3).length} cards
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
