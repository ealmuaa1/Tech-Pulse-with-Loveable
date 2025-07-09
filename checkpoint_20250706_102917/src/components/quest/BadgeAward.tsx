import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Lock, CheckCircle, Target } from "lucide-react";

interface BadgeInfo {
  name: string;
  requirement: string;
  description: string;
  icon: string;
}

interface BadgeAwardProps {
  earnedBadges: string[];
  availableBadges: BadgeInfo[];
  onBadgeEarned?: (badgeName: string) => void;
}

const BadgeCard: React.FC<{
  badge: BadgeInfo;
  isEarned: boolean;
  isUnlocked?: boolean;
}> = ({ badge, isEarned, isUnlocked = false }) => {
  return (
    <Card
      className={`transition-all duration-300 ${
        isEarned
          ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-lg"
          : isUnlocked
          ? "bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-md"
          : "bg-gray-50 border-gray-200 opacity-75"
      }`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="text-2xl">{badge.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={
                  isEarned
                    ? "text-yellow-800"
                    : isUnlocked
                    ? "text-green-800"
                    : "text-gray-600"
                }
              >
                {badge.name}
              </span>
              {isEarned && <CheckCircle className="w-4 h-4 text-yellow-600" />}
              {!isEarned && !isUnlocked && (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
              {!isEarned && isUnlocked && (
                <Target className="w-4 h-4 text-green-600" />
              )}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-sm mb-2 ${
            isEarned
              ? "text-yellow-700"
              : isUnlocked
              ? "text-green-700"
              : "text-gray-500"
          }`}
        >
          {badge.description}
        </p>
        <div className="flex items-center gap-2">
          <Target className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600">{badge.requirement}</span>
        </div>
        {isEarned && (
          <Badge className="mt-2 bg-yellow-500 hover:bg-yellow-600">
            Earned!
          </Badge>
        )}
        {!isEarned && isUnlocked && (
          <Badge
            variant="outline"
            className="mt-2 border-green-500 text-green-700"
          >
            Almost there!
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

const BadgeAward: React.FC<BadgeAwardProps> = ({
  earnedBadges,
  availableBadges,
  onBadgeEarned,
}) => {
  const [showAll, setShowAll] = useState(false);

  const earnedBadgeObjects = availableBadges.filter((badge) =>
    earnedBadges.includes(badge.name)
  );

  const unearnedBadges = availableBadges.filter(
    (badge) => !earnedBadges.includes(badge.name)
  );

  // Mock logic to determine if a badge is "unlocked" (close to being earned)
  const isUnlocked = (badge: BadgeInfo): boolean => {
    // This would typically check actual progress against requirements
    // For demo purposes, we'll mark some as unlocked
    if (badge.name === "Prompt Explorer" && earnedBadges.length >= 1)
      return true;
    if (badge.name === "Game Master" && earnedBadges.length >= 2) return true;
    return false;
  };

  const displayedBadges = showAll
    ? availableBadges
    : availableBadges.slice(0, 4);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Award className="w-6 h-6 text-purple-500" />
          Badge Collection
        </h3>
        <p className="text-gray-600">
          Earn badges by completing challenges and milestones
        </p>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">
            {earnedBadges.length}
          </div>
          <div className="text-sm text-purple-600 font-medium">Earned</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">
            {availableBadges.length}
          </div>
          <div className="text-sm text-blue-600 font-medium">Total</div>
        </div>
      </div>

      {/* Recently Earned Badges */}
      {earnedBadgeObjects.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Recently Earned
          </h4>
          <div className="flex flex-wrap gap-2">
            {earnedBadgeObjects.map((badge, index) => (
              <Badge
                key={index}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1"
              >
                {badge.icon} {badge.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Badge Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">All Badges</h4>
          {availableBadges.length > 4 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "Show All"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedBadges.map((badge, index) => (
            <BadgeCard
              key={index}
              badge={badge}
              isEarned={earnedBadges.includes(badge.name)}
              isUnlocked={isUnlocked(badge)}
            />
          ))}
        </div>
      </div>

      {/* Motivation Section */}
      <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <h4 className="font-semibold text-indigo-800 mb-1">Keep Learning!</h4>
        <p className="text-sm text-indigo-600">
          Complete more lessons and games to unlock new badges and achievements.
        </p>
      </div>
    </div>
  );
};

export default BadgeAward;
