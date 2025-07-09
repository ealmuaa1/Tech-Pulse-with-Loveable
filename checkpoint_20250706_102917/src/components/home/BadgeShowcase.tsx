import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ChevronRight, Calendar, Star } from "lucide-react";
import { gradients, cardEffects } from "@/styles/gradients";
import { useNavigate } from "react-router-dom";
import type { Badge as BadgeType } from "@/utils/fetchUserProgress";

interface BadgeShowcaseProps {
  badges: BadgeType[];
  maxDisplay?: number;
  showViewAll?: boolean;
}

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({
  badges,
  maxDisplay = 3,
  showViewAll = true,
}) => {
  const navigate = useNavigate();

  const handleViewAllBadges = () => {
    navigate("/profile/badges");
  };

  const recentBadges = badges
    .sort(
      (a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
    )
    .slice(0, maxDisplay);

  const getRarityColor = (rarity: BadgeType["rarity"]) => {
    const colors = {
      common: "bg-gray-100 text-gray-700 border-gray-200",
      rare: "bg-blue-100 text-blue-700 border-blue-200",
      epic: "bg-purple-100 text-purple-700 border-purple-200",
      legendary: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colors[rarity];
  };

  const getRarityGlow = (rarity: BadgeType["rarity"]) => {
    const glows = {
      common: "",
      rare: "shadow-blue-500/25",
      epic: "shadow-purple-500/25",
      legendary: "shadow-yellow-500/25",
    };
    return glows[rarity];
  };

  const getCategoryIcon = (category: BadgeType["category"]) => {
    const icons = {
      learning: "📚",
      achievement: "🏆",
      streak: "🔥",
      special: "⭐",
    };
    return icons[category];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  if (badges.length === 0) {
    return (
      <div
        className={`${gradients.goldCard} ${cardEffects.soft} rounded-xl p-6 border border-yellow-200/50`}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center opacity-50">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Start Earning Badges
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete quests and challenges to unlock your first achievement
            badges.
          </p>
          <Button
            onClick={() => navigate("/learn")}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
          >
            Start Learning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${gradients.goldCard} ${cardEffects.coloredGlow.purple} rounded-xl p-6 border border-yellow-200/50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Achievements
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {badges.length} badge{badges.length !== 1 ? "s" : ""} earned
            </p>
          </div>
        </div>
        {showViewAll && badges.length > maxDisplay && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllBadges}
            className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Recent Badges */}
      <div className="space-y-3">
        {recentBadges.map((badge, index) => (
          <div
            key={badge.id}
            className={`p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/70 transition-all duration-200 ${getRarityGlow(
              badge.rarity
            )}`}
          >
            <div className="flex items-start gap-3">
              {/* Badge Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-xl border-2 border-white shadow-sm">
                {badge.icon}
              </div>

              {/* Badge Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {badge.name}
                  </h4>
                  <Badge
                    className={getRarityColor(badge.rarity)}
                    variant="outline"
                  >
                    {badge.rarity}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {badge.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(badge.earnedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getCategoryIcon(badge.category)}
                    <span className="capitalize">{badge.category}</span>
                  </div>
                </div>
              </div>

              {/* Rarity Indicator */}
              {badge.rarity === "legendary" && (
                <div className="flex flex-col items-center">
                  <Star className="w-5 h-5 text-yellow-500 animate-pulse" />
                  <span className="text-xs text-yellow-600 font-medium">
                    Rare!
                  </span>
                </div>
              )}
              {badge.rarity === "epic" && (
                <div className="flex flex-col items-center">
                  <Star className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-purple-600 font-medium">
                    Epic
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Motivational Footer */}
      {badges.length >= 3 && (
        <div className="mt-4 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Great progress! Keep learning to unlock more achievements! 🌟
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeShowcase;
