import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Clock, Target, Zap } from "lucide-react";
import { gradients, cardEffects } from "@/styles/gradients";
import { useNavigate } from "react-router-dom";

interface ContinueQuestCardProps {
  questId?: string;
  questTitle?: string;
  questProgress?: number;
  estimatedTimeRemaining?: number;
  questCategory?: string;
  questDifficulty?: "beginner" | "intermediate" | "advanced";
  lastActivity?: string;
  hasActiveQuest?: boolean;
}

const ContinueQuestCard: React.FC<ContinueQuestCardProps> = ({
  questId,
  questTitle = "AI Fundamentals",
  questProgress = 75,
  estimatedTimeRemaining = 15,
  questCategory = "AI",
  questDifficulty = "intermediate",
  lastActivity,
  hasActiveQuest = true,
}) => {
  const navigate = useNavigate();

  const handleContinueQuest = () => {
    if (questId) {
      navigate(`/quest/${questId}`);
    } else {
      navigate("/learn");
    }
  };

  const handleStartNewQuest = () => {
    navigate("/learn");
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-700 border-green-200",
      intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
      advanced: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[difficulty as keyof typeof colors] || colors.intermediate;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      AI: "🤖",
      Blockchain: "🔗",
      Cybersecurity: "🔒",
      "Web Development": "💻",
      "Data Science": "📊",
      "Machine Learning": "🧠",
    };
    return icons[category as keyof typeof icons] || "📚";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 50) return "text-yellow-600";
    return "text-blue-600";
  };

  const getProgressMessage = (progress: number) => {
    if (progress >= 90) return "Almost done! 🎯";
    if (progress >= 75) return "Great progress! 🚀";
    if (progress >= 50) return "Halfway there! 💪";
    if (progress >= 25) return "Getting started! ⭐";
    return "Just beginning! 🌱";
  };

  const formatLastActivity = (lastActivity?: string) => {
    if (!lastActivity) return "Start your journey";

    const date = new Date(lastActivity);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return "A while ago";
  };

  if (!hasActiveQuest) {
    return (
      <div
        className={`${gradients.skyCard} ${cardEffects.soft} rounded-xl p-6 border border-blue-200/50`}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Start Your Learning Journey
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Discover exciting topics and begin your first quest to unlock new
            skills and knowledge.
          </p>
          <Button
            onClick={handleStartNewQuest}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Explore Quests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${gradients.skyCard} ${cardEffects.coloredGlow.sky} rounded-xl p-6 border border-blue-200/50`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-xl">
            {getCategoryIcon(questCategory)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Continue Quest
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last active: {formatLastActivity(lastActivity)}
            </p>
          </div>
        </div>
        <Badge
          className={getDifficultyColor(questDifficulty)}
          variant="outline"
        >
          {questDifficulty}
        </Badge>
      </div>

      {/* Quest Details */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          {questTitle}
        </h4>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedTimeRemaining}m remaining</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={getProgressColor(questProgress)}>
              {getProgressMessage(questProgress)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-bold text-blue-600">
            {questProgress}%
          </span>
        </div>
        <Progress value={questProgress} className="h-2 bg-white/50" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleContinueQuest}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          Continue Quest
        </Button>
        <Button
          variant="outline"
          onClick={handleStartNewQuest}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          <Target className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Indicator */}
      {questProgress >= 80 && (
        <div className="mt-4 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              You're almost done with this quest! Finish strong! 🏆
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContinueQuestCard;
