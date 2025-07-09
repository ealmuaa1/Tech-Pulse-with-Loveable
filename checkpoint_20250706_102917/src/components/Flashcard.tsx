import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { FlashcardType } from "@/types";

interface FlashcardProps {
  flashcard: FlashcardType;
  onComplete: (correct: boolean) => void;
  onNext: () => void;
}

export const Flashcard = ({
  flashcard,
  onComplete,
  onNext,
}: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleFlip = () => {
    if (!isAnswered) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (correct: boolean) => {
    setIsAnswered(true);
    onComplete(correct);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setIsAnswered(false);
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative perspective-1000"
    >
      <div
        className={`relative w-full h-64 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full backface-hidden p-6 rounded-lg bg-card shadow-lg ${
            isFlipped ? "hidden" : "block"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">{flashcard.front}</h3>
            </div>
            <div className="text-sm text-muted-foreground">Click to flip</div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute w-full h-full backface-hidden p-6 rounded-lg bg-card shadow-lg rotate-y-180 ${
            isFlipped ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">{flashcard.back}</h3>
            </div>
            {!isAnswered ? (
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnswer(false)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Incorrect
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnswer(true)}
                  className="text-green-500 hover:text-green-600"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Correct
                </Button>
              </div>
            ) : (
              <Button onClick={handleNext} className="w-full">
                Next Card
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
