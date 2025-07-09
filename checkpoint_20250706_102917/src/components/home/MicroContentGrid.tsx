import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Lightbulb,
  Brain,
  Clock,
  PlayCircle,
  CheckCircle,
  Zap,
  Target,
  RefreshCw,
} from "lucide-react";
import { gradients, cardEffects } from "@/styles/gradients";

interface MicroContent {
  id: string;
  type: "tip" | "quiz" | "mythbuster" | "flashfact";
  title: string;
  content: string;
  estimatedTime: number; // in minutes
  difficulty: "easy" | "medium" | "hard";
  category: string;
  isCompleted?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface MicroContentGridProps {
  maxDisplay?: number;
  refreshInterval?: number; // in milliseconds
}

const MicroContentGrid: React.FC<MicroContentGridProps> = ({
  maxDisplay = 4,
  refreshInterval = 30000, // 30 seconds
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock micro content data - in production, this would come from GPT/API
  const mockMicroContent: MicroContent[] = [
    {
      id: "tip-1",
      type: "tip",
      title: "AI Prompt Engineering Tip",
      content:
        'Add "Let\'s think step by step" to your prompts to get more detailed and structured responses from AI models. This technique helps the AI break down complex problems.',
      estimatedTime: 1,
      difficulty: "easy",
      category: "AI",
      action: {
        label: "Try It",
        onClick: () => console.log("Try prompt tip"),
      },
    },
    {
      id: "quiz-1",
      type: "quiz",
      title: "Quick AI Quiz",
      content:
        'What does "GPT" stand for in ChatGPT?\nA) General Purpose Transformer\nB) Generative Pre-trained Transformer\nC) Global Processing Tool',
      estimatedTime: 2,
      difficulty: "medium",
      category: "AI",
      action: {
        label: "Answer",
        onClick: () => console.log("Answer quiz"),
      },
    },
    {
      id: "myth-1",
      type: "mythbuster",
      title: "AI Myth Busted",
      content:
        "Myth: AI will replace all human jobs. Reality: AI is more likely to augment human capabilities rather than completely replace workers. Most AI implementations focus on automating specific tasks, not entire job roles.",
      estimatedTime: 2,
      difficulty: "easy",
      category: "AI Ethics",
      isCompleted: false,
    },
    {
      id: "fact-1",
      type: "flashfact",
      title: "AI Flash Fact",
      content:
        'The term "Artificial Intelligence" was first coined by computer scientist John McCarthy in 1956 at a conference at Dartmouth College, which is considered the founding event of AI as a field.',
      estimatedTime: 1,
      difficulty: "easy",
      category: "AI History",
    },
    {
      id: "tip-2",
      type: "tip",
      title: "Machine Learning Insight",
      content:
        "When training ML models, always split your data into train/validation/test sets (typically 70/15/15). Never use test data for model selection - that's what validation data is for!",
      estimatedTime: 2,
      difficulty: "medium",
      category: "Machine Learning",
    },
    {
      id: "quiz-2",
      type: "quiz",
      title: "Blockchain Basics",
      content:
        "What makes blockchain secure?\nA) Encryption only\nB) Distributed consensus + cryptography\nC) Government regulation",
      estimatedTime: 2,
      difficulty: "medium",
      category: "Blockchain",
    },
  ];

  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  // Rotate content periodically
  const getCurrentContent = () => {
    const shuffled = [...mockMicroContent].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, maxDisplay);
  };

  const [currentContent] = useState(getCurrentContent());

  const handleComplete = (itemId: string) => {
    setCompletedItems((prev) => new Set([...prev, itemId]));
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const getTypeIcon = (type: MicroContent["type"]) => {
    const icons = {
      tip: Lightbulb,
      quiz: Brain,
      mythbuster: Target,
      flashfact: Zap,
    };
    return icons[type];
  };

  const getTypeColor = (type: MicroContent["type"]) => {
    const colors = {
      tip: "bg-blue-100 text-blue-700 border-blue-200",
      quiz: "bg-purple-100 text-purple-700 border-purple-200",
      mythbuster: "bg-red-100 text-red-700 border-red-200",
      flashfact: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colors[type];
  };

  const getTypeGradient = (type: MicroContent["type"]) => {
    const gradients = {
      tip: "from-blue-50 to-blue-100",
      quiz: "from-purple-50 to-purple-100",
      mythbuster: "from-red-50 to-red-100",
      flashfact: "from-yellow-50 to-yellow-100",
    };
    return gradients[type];
  };

  const getDifficultyColor = (difficulty: MicroContent["difficulty"]) => {
    const colors = {
      easy: "text-green-600",
      medium: "text-yellow-600",
      hard: "text-red-600",
    };
    return colors[difficulty];
  };

  const formatType = (type: MicroContent["type"]) => {
    const labels = {
      tip: "AI Tip",
      quiz: "Quick Quiz",
      mythbuster: "Myth Buster",
      flashfact: "Flash Fact",
    };
    return labels[type];
  };

  return (
    <div
      className={`${gradients.slateCard} ${cardEffects.soft} rounded-xl p-6 border border-gray-200/50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Micro Learning
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bite-sized knowledge boosts
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentContent.map((item, index) => {
          const TypeIcon = getTypeIcon(item.type);
          const isCompleted = completedItems.has(item.id) || item.isCompleted;

          return (
            <Card
              key={`${item.id}-${refreshKey}`}
              className={`bg-gradient-to-br ${getTypeGradient(
                item.type
              )} border-white/50 ${
                cardEffects.soft
              } transition-all duration-300 hover:scale-[1.02]`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="w-5 h-5 text-gray-600" />
                    <Badge
                      className={getTypeColor(item.type)}
                      variant="outline"
                    >
                      {formatType(item.type)}
                    </Badge>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-4">
                  {item.content}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.estimatedTime}m</span>
                    </div>
                    <div
                      className={`font-medium ${getDifficultyColor(
                        item.difficulty
                      )}`}
                    >
                      {item.difficulty}
                    </div>
                    <span className="text-gray-400">•</span>
                    <span>{item.category}</span>
                  </div>
                </div>

                {/* Action Button */}
                {item.action && !isCompleted && (
                  <Button
                    size="sm"
                    onClick={() => {
                      item.action?.onClick();
                      handleComplete(item.id);
                    }}
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {item.action.label}
                  </Button>
                )}

                {isCompleted && (
                  <div className="flex items-center justify-center p-2 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-green-700">
                      Completed
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {completedItems.size}
          </div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">
            {currentContent.filter((item) => item.type === "quiz").length}
          </div>
          <div className="text-xs text-gray-500">Quizzes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-600">
            {currentContent.reduce((acc, item) => acc + item.estimatedTime, 0)}
          </div>
          <div className="text-xs text-gray-500">Min Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">
            {Math.round((completedItems.size / currentContent.length) * 100)}%
          </div>
          <div className="text-xs text-gray-500">Progress</div>
        </div>
      </div>

      {/* Motivational Footer */}
      {completedItems.size === currentContent.length &&
        currentContent.length > 0 && (
          <div className="mt-4 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Great job! You've completed all micro-learning items! 🎉
              </span>
            </div>
          </div>
        )}
    </div>
  );
};

export default MicroContentGrid;
