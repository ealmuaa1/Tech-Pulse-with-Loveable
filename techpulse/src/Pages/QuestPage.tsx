import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ArrowLeft, Book, HelpCircle, AlertCircle } from "lucide-react";
import { titleToSlug } from "../lib/utils";
import { Quiz } from "../components/Quiz";
import { Flashcard } from "../components/Flashcard";

// Define interfaces for our data structures
interface Quest {
  id: number;
  title: string;
  description: string;
  category: string;
  resources: {
    title: string;
    description: string;
    url: string;
  }[];
}

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface Quiz {
  id: number;
  title: string;
  category: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

// Sample quest data
const learningQuests: Quest[] = [
  {
    id: 1,
    title: "AI & Machine Learning",
    description:
      "Learn the fundamentals of artificial intelligence and machine learning, including key concepts, algorithms, and real-world applications.",
    category: "ai",
    resources: [
      {
        title: "Introduction to AI",
        description: "A beginner-friendly guide to artificial intelligence",
        url: "https://example.com/ai-intro",
      },
      {
        title: "Machine Learning Basics",
        description: "Understanding the core concepts of machine learning",
        url: "https://example.com/ml-basics",
      },
    ],
  },
  {
    id: 2,
    title: "Web Development",
    description:
      "Master modern web development with our comprehensive learning resources.",
    category: "web",
    resources: [
      {
        title: "React Fundamentals",
        description: "Learn React from the ground up",
        url: "https://example.com/react-fundamentals",
      },
      {
        title: "TypeScript for Web Dev",
        description: "Type-safe web development with TypeScript",
        url: "https://example.com/typescript-web",
      },
    ],
  },
  {
    id: 3,
    title: "Blockchain Technology",
    description:
      "Explore blockchain technology, cryptocurrencies, and decentralized applications.",
    category: "blockchain",
    resources: [
      {
        title: "Blockchain Basics",
        description: "Understanding blockchain technology and its applications",
        url: "https://example.com/blockchain-basics",
      },
      {
        title: "Smart Contracts",
        description: "Building and deploying smart contracts",
        url: "https://example.com/smart-contracts",
      },
    ],
  },
];

// Default flashcards for all categories
const defaultFlashcards: Flashcard[] = [
  // AI Flashcards
  {
    id: 1,
    question: "What is Machine Learning?",
    answer:
      "A subset of AI that enables systems to learn from data without explicit programming.",
    category: "ai",
  },
  {
    id: 2,
    question: "What is Deep Learning?",
    answer: "A type of machine learning based on artificial neural networks.",
    category: "ai",
  },
  // Web Development Flashcards
  {
    id: 3,
    question: "What is React?",
    answer: "A JavaScript library for building user interfaces.",
    category: "web",
  },
  {
    id: 4,
    question: "What is TypeScript?",
    answer: "A typed superset of JavaScript that compiles to plain JavaScript.",
    category: "web",
  },
  // Blockchain Flashcards
  {
    id: 5,
    question: "What is a blockchain?",
    answer:
      "A distributed ledger technology that records transactions across multiple computers.",
    category: "blockchain",
  },
  {
    id: 6,
    question: "What is a smart contract?",
    answer:
      "Self-executing contracts with the terms directly written into code.",
    category: "blockchain",
  },
];

// Default quizzes for all categories
const defaultQuizzes: Quiz[] = [
  // AI Quiz
  {
    id: 1,
    title: "AI Fundamentals Quiz",
    category: "ai",
    questions: [
      {
        question: "What is the difference between AI and ML?",
        options: [
          "AI is broader than ML",
          "ML is broader than AI",
          "They are the same thing",
          "None of the above",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // Web Development Quiz
  {
    id: 2,
    title: "Web Development Basics",
    category: "web",
    questions: [
      {
        question: "What is JSX?",
        options: [
          "A JavaScript extension",
          "A CSS framework",
          "A database",
          "A server",
        ],
        correctAnswer: 0,
      },
    ],
  },
  // Blockchain Quiz
  {
    id: 3,
    title: "Blockchain Basics",
    category: "blockchain",
    questions: [
      {
        question: "What is the main feature of blockchain?",
        options: ["Decentralization", "Centralization", "Speed", "Cost"],
        correctAnswer: 0,
      },
    ],
  },
];

// Helper function to convert title to slug
const titleToSlug = (title: string): string => {
  return title.toLowerCase().replace(/[&]/g, "and").replace(/\s+/g, "-");
};

// Default content for missing categories
const defaultContent = {
  flashcards: [
    {
      id: 999,
      question: "Coming Soon",
      answer: "More flashcards are being added for this topic.",
      category: "default",
    },
  ],
  quizzes: [
    {
      id: 999,
      title: "Coming Soon Quiz",
      category: "default",
      questions: [
        {
          question: "More content is being added",
          options: [
            "Stay tuned!",
            "Check back later",
            "Coming soon",
            "In development",
          ],
          correctAnswer: 0,
        },
      ],
    },
  ],
};

export default function QuestPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("learn");
  const [progress, setProgress] = useState(0);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    // Debug logging
    console.log("QuestPage mounted");
    console.log("Slug from URL:", slug);

    // Find quest by matching slug
    const foundQuest = learningQuests.find((q) => {
      const questSlug = titleToSlug(q.title);
      console.log(`Comparing slugs - URL: ${slug}, Quest: ${questSlug}`);
      return questSlug === slug;
    });

    console.log("Quest found:", foundQuest);
    setQuest(foundQuest || null);

    if (foundQuest) {
      // Find matching flashcards and quizzes
      const matchingFlashcards = defaultFlashcards.filter(
        (f) => f.category === foundQuest.category
      );
      const matchingQuizzes = defaultQuizzes.filter(
        (q) => q.category === foundQuest.category
      );

      console.log("Matching flashcards:", matchingFlashcards);
      console.log("Matching quizzes:", matchingQuizzes);

      // Use default content if no matches found
      setFlashcards(
        matchingFlashcards.length > 0
          ? matchingFlashcards
          : defaultContent.flashcards
      );
      setQuizzes(
        matchingQuizzes.length > 0 ? matchingQuizzes : defaultContent.quizzes
      );
    }
  }, [slug]);

  // If no quest found, show error message
  if (!quest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Quest Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The quest you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/learn")}>Return to Learning</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/learn")}
            className="rounded-full hover:bg-accent/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{quest.title}</h1>
        </div>

        {/* Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="learn">Learn</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-muted-foreground">{quest.description}</p>
            </Card>
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Flashcards</h2>
              <div className="space-y-4">
                {flashcards.map((flashcard) => (
                  <Card key={flashcard.id} className="p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Book className="w-5 h-5 text-primary" />
                      <h3 className="font-medium">{flashcard.question}</h3>
                    </div>
                    <p className="text-muted-foreground">{flashcard.answer}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quiz</h2>
              <div className="space-y-6">
                {quizzes.map((quiz) => (
                  <Card key={quiz.id} className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <h3 className="font-medium">{quiz.title}</h3>
                    </div>
                    <Quiz
                      category={quiz.category}
                      onComplete={(score) => {
                        console.log(`Quiz completed with score: ${score}`);
                        setProgress((prev) => Math.min(prev + 10, 100));
                      }}
                    />
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Learning Resources</h2>
              <div className="space-y-4">
                {quest.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <h3 className="font-medium mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  </a>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
