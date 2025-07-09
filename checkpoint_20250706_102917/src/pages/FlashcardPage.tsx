import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { defaultFlashcards } from "@/data/flashcards";
import { learningQuests } from "@/data/quests";
import { toast } from "sonner";

const FlashcardPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedCards, setCompletedCards] = useState<string[]>([]);

  // Find the quest that matches the slug
  const quest = learningQuests.find(
    (q) => q.title.toLowerCase().replace(/\s+/g, "-") === slug
  );

  // Get flashcards for this topic
  const flashcards = defaultFlashcards.filter(
    (card) => card.category === quest?.category
  );

  useEffect(() => {
    if (flashcards.length > 0) {
      setProgress((completedCards.length / flashcards.length) * 100);
    }
  }, [completedCards, flashcards.length]);

  if (!quest || flashcards.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">No flashcards available</h1>
        <Button onClick={() => navigate(`/learn/${slug}`)}>
          Back to Topic
        </Button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  const handleNext = (correct: boolean) => {
    if (correct) {
      setCompletedCards((prev) => [...prev, currentCard.id.toString()]);
      toast.success("Correct! +10 XP");
    } else {
      toast.error("Try again!");
    }

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      toast.success("You've completed all flashcards!");
      setTimeout(() => navigate(`/learn/${slug}`), 1500);
    }
  };

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
              {completedCards.length} / {flashcards.length}
            </span>
          </div>
        </div>

        {/* Flashcard */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="relative h-[400px] perspective-1000"
          >
            <div
              className={`w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front of card */}
              <div className="absolute w-full h-full backface-hidden">
                <div className="w-full h-full p-8 bg-card rounded-xl shadow-lg flex items-center justify-center">
                  <h2 className="text-2xl font-semibold text-center">
                    {currentCard.front}
                  </h2>
                </div>
              </div>

              {/* Back of card */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180">
                <div className="w-full h-full p-8 bg-card rounded-xl shadow-lg flex items-center justify-center">
                  <h2 className="text-2xl font-semibold text-center">
                    {currentCard.back}
                  </h2>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="lg"
              className="w-24"
              onClick={() => handleNext(false)}
            >
              <X className="w-6 h-6 mr-2" />
              Incorrect
            </Button>
            <Button size="lg" className="w-24" onClick={() => handleNext(true)}>
              <Check className="w-6 h-6 mr-2" />
              Correct
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;
