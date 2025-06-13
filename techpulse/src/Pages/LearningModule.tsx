import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Book, Brain, Code, Database } from "lucide-react";
import { titleToSlug } from "../lib/utils";

// Helper function to convert title to slug
const titleToSlug = (title: string): string => {
  return title.toLowerCase().replace(/[&]/g, "and").replace(/\s+/g, "-");
};

// Sample quest data
const learningQuests = [
  {
    id: 1,
    title: "AI & Machine Learning",
    description:
      "Learn the fundamentals of artificial intelligence and machine learning, including key concepts, algorithms, and real-world applications.",
    category: "ai",
    icon: Brain,
  },
  {
    id: 2,
    title: "Web Development",
    description:
      "Master modern web development with our comprehensive learning resources.",
    category: "web",
    icon: Code,
  },
  {
    id: 3,
    title: "Blockchain Technology",
    description:
      "Explore blockchain technology, cryptocurrencies, and decentralized applications.",
    category: "blockchain",
    icon: Database,
  },
];

const LearningModule = () => {
  const navigate = useNavigate();

  const handleStartQuest = (title: string) => {
    const slug = titleToSlug(title);
    console.log(`Navigating to quest: ${slug}`);
    navigate(`/quest/${slug}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Learning Quests</h1>
        <p className="text-muted-foreground mb-8">
          Choose a quest to start your learning journey. Each quest includes
          interactive flashcards, quizzes, and resources.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {learningQuests.map((quest) => {
            const Icon = quest.icon;
            return (
              <Card
                key={quest.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{quest.title}</h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  {quest.description}
                </p>
                <Button
                  className="w-full"
                  onClick={() => handleStartQuest(quest.title)}
                >
                  Start Quest
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningModule;
