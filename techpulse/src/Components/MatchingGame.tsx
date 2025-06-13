import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMemoryToolProgress } from "@/lib/progress";

interface MatchingGameProps {
  category: string;
  onComplete: (score: number) => void;
}

interface Card {
  id: number;
  term: string;
  definition: string;
  matched: boolean;
  flipped: boolean;
}

export function MatchingGame({ category, onComplete }: MatchingGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    // Load initial progress
    const progress = getMemoryToolProgress("matching", parseInt(category));
    setScore(progress);

    // Generate cards based on category
    const terms = generateTerms(category);
    const shuffledCards = shuffleCards(terms);
    setCards(shuffledCards);
  }, [category]);

  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2 || cards[index].matched) return;

    const newSelectedCards = [...selectedCards, index];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      const [first, second] = newSelectedCards;
      const isMatch = cards[first].term === cards[second].definition;

      if (isMatch) {
        const newCards = cards.map((card, i) =>
          i === first || i === second ? { ...card, matched: true } : card
        );
        setCards(newCards);
        const newScore = score + 10;
        setScore(newScore);
        onComplete(newScore);

        if (newCards.every((card) => card.matched)) {
          setGameComplete(true);
        }
      }

      setTimeout(() => {
        setSelectedCards([]);
      }, 1000);
    }
  };

  const resetGame = () => {
    const terms = generateTerms(category);
    const shuffledCards = shuffleCards(terms);
    setCards(shuffledCards);
    setSelectedCards([]);
    setScore(0);
    setGameComplete(false);
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Matching Game</h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`aspect-[3/2] cursor-pointer transition-transform ${
              selectedCards.includes(index) || card.matched
                ? "transform rotate-y-180"
                : ""
            }`}
            onClick={() => handleCardClick(index)}
          >
            <div className="w-full h-full bg-primary/10 rounded-lg p-2 flex items-center justify-center text-center">
              {selectedCards.includes(index) || card.matched ? card.term : "?"}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm">Score: {score}</span>
        {gameComplete && (
          <Button onClick={resetGame} size="sm">
            Play Again
          </Button>
        )}
      </div>
    </Card>
  );
}

function generateTerms(
  category: string
): { term: string; definition: string }[] {
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

  return termsByCategory[category] || [];
}

function shuffleCards(terms: { term: string; definition: string }[]): Card[] {
  const cards: Card[] = [];
  terms.forEach((term, index) => {
    cards.push({
      id: index * 2,
      term: term.term,
      definition: term.definition,
      matched: false,
      flipped: false,
    });
    cards.push({
      id: index * 2 + 1,
      term: term.definition,
      definition: term.term,
      matched: false,
      flipped: false,
    });
  });
  return cards.sort(() => Math.random() - 0.5);
}
