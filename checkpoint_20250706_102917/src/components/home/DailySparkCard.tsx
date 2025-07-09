import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Clock,
  TrendingUp,
  PlayCircle,
  ExternalLink,
} from "lucide-react";
import { gradients, cardEffects } from "@/styles/gradients";
import { useNavigate } from "react-router-dom";
import {
  DailyTrend,
  getCategoryIcon,
  getDifficultyColor,
  formatEngagementCount,
} from "@/utils/fetchDailyTrend";

interface DailySparkCardProps {
  trend: DailyTrend;
  isLoading?: boolean;
}

const DailySparkCard: React.FC<DailySparkCardProps> = ({
  trend,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const handleStartQuest = () => {
    if (trend.quest_available) {
      navigate(`/quest/${trend.id}`);
    } else {
      navigate(`/learn/${trend.id}`);
    }
  };

  const handleReadMore = () => {
    navigate(`/learn/${trend.id}`);
  };

  if (isLoading) {
    return (
      <div
        className={`${gradients.sunsetCard} ${cardEffects.soft} rounded-xl p-6 border border-orange-200/50 animate-pulse`}
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const getTrendingScore = () => {
    if (!trend.trending_score) return null;
    if (trend.trending_score >= 90) return "🔥 Hot";
    if (trend.trending_score >= 75) return "📈 Trending";
    return "✨ Popular";
  };

  const getTimeAgo = () => {
    const date = new Date(trend.createdAt);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just posted";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return "This week";
  };

  return (
    <div
      className={`${gradients.sunsetCard} ${cardEffects.coloredGlow.coral} rounded-xl p-6 border border-orange-200/50`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Daily AI Spark
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getTimeAgo()}
            </p>
          </div>
        </div>
        {getTrendingScore() && (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            {getTrendingScore()}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        {/* Category and Difficulty */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-white/50 text-gray-700 border-white/30">
            {getCategoryIcon(trend.category)} {trend.category.toUpperCase()}
          </Badge>
          <Badge
            className={getDifficultyColor(trend.difficulty)}
            variant="outline"
          >
            {trend.difficulty}
          </Badge>
        </div>

        {/* Title and Summary */}
        <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {trend.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
          {trend.summary}
        </p>

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{trend.estimatedTime}m read</span>
          </div>
          {trend.engagement_count && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>
                {formatEngagementCount(trend.engagement_count)} engaged
              </span>
            </div>
          )}
          {trend.source && (
            <div className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <span>{trend.source}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {trend.tags && trend.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {trend.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-white/30 text-gray-700 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {trend.tags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-white/30 text-gray-700 rounded-full">
                +{trend.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {trend.quest_available ? (
          <Button
            onClick={handleStartQuest}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Start Quest
          </Button>
        ) : (
          <Button
            onClick={handleReadMore}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Read More
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleReadMore}
          className="border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {/* Special Call-to-Action */}
      {trend.trending_score && trend.trending_score >= 95 && (
        <div className="mt-4 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              This is trending everywhere! Don't miss out! 🌟
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySparkCard;
