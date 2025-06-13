import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMemoryToolProgress } from "@/lib/progress";

interface FlashcardProps {
  category: string;
  onComplete: (score: number) => void;
}

interface Flashcard {
  id: number;
  term: string;
  definition: string;
  mastered: boolean;
}

export function Flashcard({ category, onComplete }: FlashcardProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Load initial progress
    const progress = getMemoryToolProgress("flashcards", parseInt(category));
    setScore(progress);

    // Generate cards based on category
    const terms = generateTerms(category);
    setCards(terms);
  }, [category]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMastered = () => {
    const newCards = cards.map((card, index) =>
      index === currentIndex ? { ...card, mastered: true } : card
    );
    setCards(newCards);
    const newScore = score + 10;
    setScore(newScore);
    onComplete(newScore);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const resetCards = () => {
    const terms = generateTerms(category);
    setCards(terms);
    setCurrentIndex(0);
    setIsFlipped(false);
    setScore(0);
  };

  if (cards.length === 0) {
    return (
      <Card className="p-4">
        <p>No flashcards available for this category.</p>
      </Card>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Flashcards</h3>
      <div className="aspect-[3/2] cursor-pointer mb-4" onClick={handleFlip}>
        <div className="w-full h-full bg-primary/10 rounded-lg p-4 flex items-center justify-center text-center">
          {isFlipped ? currentCard.definition : currentCard.term}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm">Score: {score}</span>
        <div className="space-x-2">
          {isFlipped && (
            <>
              <Button onClick={handleMastered} size="sm" variant="outline">
                Mastered
              </Button>
              <Button onClick={handleNext} size="sm">
                Next
              </Button>
            </>
          )}
          {currentIndex === cards.length - 1 && (
            <Button onClick={resetCards} size="sm">
              Start Over
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function generateTerms(category: string): Flashcard[] {
  // This would typically come from your content database
  const termsByCategory: Record<
    string,
    { term: string; definition: string }[]
  > = {
    AI: [
      {
        term: "Machine Learning",
        definition: "AI systems that learn from data",
      },
      {
        term: "Neural Network",
        definition: "AI model inspired by human brain",
      },
      { term: "Deep Learning", definition: "ML using multiple neural layers" },
      {
        term: "Natural Language Processing",
        definition: "AI for understanding human language",
      },
    ],
    Blockchain: [
      { term: "Smart Contract", definition: "Self-executing digital contract" },
      { term: "Consensus", definition: "Agreement mechanism in blockchain" },
      { term: "Mining", definition: "Process of validating transactions" },
      { term: "Wallet", definition: "Digital storage for cryptocurrencies" },
    ],
    // Add more categories as needed
  };

  const terms = termsByCategory[category] || [];
  return terms.map((term, index) => ({
    id: index,
    term: term.term,
    definition: term.definition,
    mastered: false,
  }));
}
