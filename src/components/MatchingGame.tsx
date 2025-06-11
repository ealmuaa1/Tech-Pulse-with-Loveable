import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Term {
  id: string;
  term: string;
  definition: string;
}

interface MatchingGameProps {
  terms: Term[];
  onComplete: (score: number) => void;
}

export function MatchingGame({ terms, onComplete }: MatchingGameProps) {
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(
    null
  );
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleTermClick = (term: Term) => {
    if (matchedPairs.has(term.id)) return;
    setSelectedTerm(term);
  };

  const handleDefinitionClick = (definition: string) => {
    if (!selectedTerm) return;
    if (selectedTerm.definition === definition) {
      setMatchedPairs((prev) => new Set([...prev, selectedTerm.id]));
      setScore((prev) => prev + 1);
      if (score + 1 === terms.length) {
        setIsComplete(true);
        onComplete(score + 1);
      }
    }
    setSelectedTerm(null);
  };

  const resetGame = () => {
    setSelectedTerm(null);
    setSelectedDefinition(null);
    setMatchedPairs(new Set());
    setScore(0);
    setIsComplete(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Terms */}
        <div className="space-y-2">
          <h3 className="font-medium">Terms</h3>
          <div className="space-y-2">
            {terms.map((term) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    selectedTerm?.id === term.id
                      ? "bg-purple-100 dark:bg-purple-900"
                      : matchedPairs.has(term.id)
                      ? "bg-green-100 dark:bg-green-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleTermClick(term)}
                >
                  {term.term}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Definitions */}
        <div className="space-y-2">
          <h3 className="font-medium">Definitions</h3>
          <div className="space-y-2">
            {terms.map((term) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    selectedTerm?.definition === term.definition
                      ? "bg-purple-100 dark:bg-purple-900"
                      : matchedPairs.has(term.id)
                      ? "bg-green-100 dark:bg-green-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleDefinitionClick(term.definition)}
                >
                  {term.definition}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Score and Reset */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Score: {score}/{terms.length}
        </div>
        <Button variant="outline" onClick={resetGame} className="text-sm">
          Reset Game
        </Button>
      </div>

      {/* Completion Message */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <Card className="p-6 max-w-md mx-4">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Great job!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You've matched all the terms correctly.
                </p>
                <Button onClick={resetGame}>Play Again</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
