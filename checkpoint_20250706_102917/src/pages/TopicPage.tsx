import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Gamepad2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { questIcons } from "@/lib/questIcons";
import { learningQuests } from "@/data/quests";
import { defaultFlashcards } from "@/data/flashcards";

// Mock data for learning resources
const learningResources = {
  blockchain: [
    {
      title: "Blockchain Basics - FreeCodeCamp",
      url: "https://www.freecodecamp.org/news/blockchain-basics/",
      description: "Free interactive course on blockchain fundamentals",
    },
    {
      title: "Blockchain Specialization - Coursera",
      url: "https://www.coursera.org/specializations/blockchain",
      description: "Comprehensive blockchain development course",
    },
    {
      title: "Ethereum Documentation",
      url: "https://ethereum.org/developers/",
      description: "Official Ethereum development documentation",
    },
  ],
  ai: [
    {
      title: "Machine Learning - Google",
      url: "https://developers.google.com/machine-learning",
      description: "Google's machine learning crash course",
    },
    {
      title: "Deep Learning Specialization - Coursera",
      url: "https://www.coursera.org/specializations/deep-learning",
      description: "Andrew Ng's famous deep learning course",
    },
    {
      title: "Fast.ai",
      url: "https://www.fast.ai/",
      description: "Practical deep learning for coders",
    },
  ],
  cybersecurity: [
    {
      title: "Cybersecurity Fundamentals - IBM",
      url: "https://www.ibm.com/training/cybersecurity",
      description: "IBM's cybersecurity learning path",
    },
    {
      title: "TryHackMe",
      url: "https://tryhackme.com/",
      description: "Hands-on cybersecurity training platform",
    },
    {
      title: "OWASP Web Security",
      url: "https://owasp.org/www-project-web-security-testing-guide/",
      description: "Web security testing guide",
    },
  ],
};

const TopicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find the quest that matches the slug
  const quest = learningQuests.find(
    (q) => q.title.toLowerCase().replace(/\s+/g, "-") === slug
  );

  // Get flashcards for this topic
  const topicFlashcards = defaultFlashcards.filter(
    (card) => card.category === quest?.category
  );

  if (!quest) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Topic not found</h1>
        <Button onClick={() => navigate("/learn")}>Back to Learning</Button>
      </div>
    );
  }

  // Get learning resources for this topic
  const resources =
    learningResources[
      quest.category.toLowerCase() as keyof typeof learningResources
    ] || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/learn")}
            className="rounded-full hover:bg-accent/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {React.createElement(
                questIcons[quest.category] || questIcons.default,
                {
                  className: "w-6 h-6 text-primary",
                }
              )}
            </div>
            <h1 className="text-3xl font-bold">{quest.title}</h1>
          </div>
        </motion.div>

        {/* Topic Summary */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">What is {quest.title}?</h2>
          <p className="text-muted-foreground">{quest.description}</p>

          <h3 className="text-lg font-semibold mt-6">Practical Applications</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {quest.tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </Card>

        {/* Learning Resources */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Learning Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium">{resource.title}</h3>
                  <ExternalLink className="w-4 h-4" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>
              </a>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            className="h-24 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate(`/learn/${slug}/flashcards`)}
          >
            <BookOpen className="w-6 h-6" />
            <span>Practice with Flashcards</span>
            <span className="text-sm text-muted-foreground">
              {topicFlashcards.length} cards available
            </span>
          </Button>

          <Button
            className="h-24 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate(`/learn/${slug}/quiz`)}
          >
            <Brain className="w-6 h-6" />
            <span>Take the Quiz</span>
            <span className="text-sm text-muted-foreground">
              Test your knowledge
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
            disabled
          >
            <Gamepad2 className="w-6 h-6" />
            <span>Mini Game</span>
            <span className="text-sm text-muted-foreground">Coming soon</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
