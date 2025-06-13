import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchingGame } from "@/components/MatchingGame";
import { Flashcard } from "@/components/Flashcard";
import { Quiz } from "@/components/Quiz";
import { updateMemoryToolProgress } from "@/lib/progress";

interface MemoryToolsProps {
  category: string;
}

export function MemoryTools({ category }: MemoryToolsProps) {
  const [activeTab, setActiveTab] = useState("matching");

  const handleComplete = (tool: string, score: number) => {
    updateMemoryToolProgress(tool, parseInt(category), score);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="matching">Matching Game</TabsTrigger>
        <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
      </TabsList>
      <TabsContent value="matching">
        <MatchingGame
          category={category}
          onComplete={(score) => handleComplete("matching", score)}
        />
      </TabsContent>
      <TabsContent value="flashcards">
        <Flashcard
          category={category}
          onComplete={(score) => handleComplete("flashcards", score)}
        />
      </TabsContent>
      <TabsContent value="quiz">
        <Quiz
          category={category}
          onComplete={(score) => handleComplete("quiz", score)}
        />
      </TabsContent>
    </Tabs>
  );
}
